const assert = require("assert");
const {
  pipe,
  tap,
  map,
  flatMap,
  filter,
  tryCatch,
  switchCase,
  get,
  assign,
  any,
  reduce,
  fork,
  eq,
  not,
  and,
  or,
  transform,
  omit,
} = require("rubico");

const {
  first,
  isEmpty,
  isString,
  flatten,
  pluck,
  forEach,
  find,
  defaultsDeep,
  isDeepEqual,
  includes,
  groupBy,
  values,
} = require("rubico/x");

const { retryCall } = require("./Retry");
const { Planner, mapToGraph } = require("./Planner");
const { Lister } = require("./Lister");
const logger = require("../logger")({ prefix: "ProviderGru" });
const { tos } = require("../tos");
const {
  mapPoolSize,
  convertError,
  HookType,
  TitleListing,
  TitleQuery,
  TitleDeploying,
  TitleDestroying,
  typeFromResources,
  planToResourcesPerType,
} = require("./Common");

const {
  nextStateOnError,
  hasResultError,
  PlanDirection,
  isTypesMatch,
  isValidPlan,
  filterReadClient,
  filterReadWriteClient,
  contextFromClient,
  contextFromProvider,
  contextFromProviderInit,
  contextFromResourceType,
  contextFromPlanner,
  contextFromResource,
  contextFromHook,
  contextFromHookAction,
  clientByType,
  liveToUri,
} = require("./ProviderCommon");

const { displayLive } = require("../cli/displayUtils");

const noop = ({}) => {};
const identity = (x) => x;

exports.ProviderGru = ({ providers, resources, commandOptions }) => {
  assert(Array.isArray(providers));

  if (resources && providers[0]) {
    providers[0].register({ resources });
  }

  const getClients = () =>
    reduce(
      (acc, provider) => [...acc, ...provider.getClients()],
      []
    )(providers);

  const getResourcesByType = ({ type }) =>
    reduce(
      (acc, provider) => [...acc, ...provider.getResourcesByType({ type })],
      []
    )(providers);

  const getProvider = ({ providerName }) =>
    pipe([
      find(eq(get("name"), providerName)),
      tap.if(isEmpty, () => {
        assert(`no provider with name: '${providerName}'`);
      }),
    ])(providers);

  const getTargetResources = () =>
    reduce(
      (acc, provider) => [...acc, ...provider.getTargetResources()],
      []
    )(providers);

  const getSpecs = () =>
    reduce((acc, provider) => [...acc, ...provider.specs], [])(providers);

  const getMapNameToResource = () =>
    reduce(
      (acc, provider) => new Map([...acc, ...provider.mapNameToResource]),
      new Map()
    )(providers);

  const getResource = pipe([
    get("uri"),
    tap((uri) => {
      assert(uri, "getResource no uri");
    }),
    (uri) => getMapNameToResource().get(uri),
  ]);

  const hookMap = new Map();
  const hookAdd = (name, hook) => {
    assert(name);
    const defaultHook = {
      name,
      onDeployed: {
        init: () => {},
        actions: [],
      },
      onDestroyed: {
        init: () => {},
        actions: [],
      },
    };
    const newHook = defaultsDeep(defaultHook)(hook);
    hookMap.set(name, newHook);
  };

  const hookFilenameDefault = ({ dirname = process.cwd() }) =>
    path.resolve(dirname, "hooks.js");

  const getHookFactory = tryCatch(require, (error) => {
    logger.error(`getHookFactory ${tos(error)}`);
    throw error;
  });

  const registerHook = ({ resources, dirname }) =>
    pipe([
      hookFilenameDefault,
      tap((filename) => {
        logger.debug(`register hook '${filename}'`);
      }),
      switchCase([
        (fileName) => fs.existsSync(fileName),
        pipe([
          getHookFactory,
          (hookFactory) => {
            const hooks = hookFactory({
              resources,
              config: providerConfig,
              provider,
            });
            hookAdd("default", hooks);
          },
        ]),
        tap((filename) => {
          logger.error(`hook '${filename}' does not exist`);
        }),
      ]),
    ])({
      dirname,
    });

  const filterClient = async ({
    result,
    client,
    options: { our, name, id, canBeDeleted, provider: providerName },
    lives,
  }) =>
    switchCase([
      get("error"),
      () => result,
      pipe([
        tap((result) => {
          logger.info(
            `filterClient ${tos({
              our,
              name,
              id,
              canBeDeleted,
              providerName,
              type: client.spec.type,
            })}`
          );
        }),
        get("items"),
        filter(not(get("error"))),
        map((live) => ({
          uri: liveToUri({ client, live }),
          name: client.findName(live),
          displayName: client.displayName({
            name: client.findName(live),
            meta: client.findMeta(live),
          }),
          meta: client.findMeta(live),
          id: client.findId(live),
          managedByUs: client.spec.isOurMinion({
            resource: live,
            lives,
            resourceNames: getProvider(client).resourceNames(),
            config: getProvider(client).config(),
          }),
          providerName: client.spec.providerName,
          type: client.spec.type,
          live,
          cannotBeDeleted: client.cannotBeDeleted({
            resource: live,
            name: client.findName(live),
            resourceNames: getProvider(client).resourceNames(),
            config: getProvider(client).config(),
          }),
        })),
        filter((item) => (our ? item.managedByUs : true)),
        filter((item) => (name ? item.name === name : true)),
        filter((item) => (id ? item.id === id : true)),
        filter((item) =>
          providerName ? item.providerName === providerName : true
        ),
        filter((item) => (canBeDeleted ? !item.cannotBeDeleted : true)),
        (resources) => ({
          type: client.spec.type,
          resources,
          providerName: client.providerName,
        }),
        tap((x) => {
          assert(x);
        }),
      ]),
    ])(result);

  const start = ({ onStateChange }) =>
    pipe([
      tap(() => {
        logger.info(`start`);
      }),
      () => providers,
      map(
        tryCatch(
          (provider) => provider.start({ onStateChange }),
          (error) => {
            logger.error(`start ${tos(error)}`);
            return { error };
          }
        )
      ),
      assign({ error: any(get("error")) }),
      tap((result) => {
        logger.info(`started`);
      }),
    ])();

  const listLives = async ({
    onStateChange = identity,
    options = {},
    title = TitleListing,
    readWrite = false,
  } = {}) =>
    pipe([
      () => getClients(),
      tap((clients) => {
        logger.info(
          `listLives #clients: ${clients.length}, ${JSON.stringify({
            title,
            readWrite,
            options,
          })}`
        );
      }),
      switchCase([
        () => readWrite,
        filterReadWriteClient(options),
        filterReadClient(options),
      ]),
      tap((clients) => {
        logger.info(`listLives ${clients.length}`);
      }),
      map((client) => ({
        type: client.spec.type,
        providerName: client.spec.providerName,
        executor: ({ lives }) =>
          pipe([
            () =>
              client.getList({
                lives,
                deep: true,
                resources: getResourcesByType({ type: client.spec.type }),
              }),
            (result) =>
              filterClient({
                result,
                client,
                onStateChange,
                options,
                lives,
              }),
          ])(),
        dependsOn: client.spec.listDependsOn,
      })),
      (inputs) =>
        Lister({
          inputs,
          onStateChange: ({ type, error, ...other }) => {
            assert(type);
            onStateChange({
              context: contextFromClient({
                client: clientByType({ type })(getClients()),
                title,
              }),
              error,
              ...other,
            });
          },
        }),
      (lister) => lister.run(),
      tap((result) => {
        logger.info(`listLives result: ${tos(result)}`);
      }),
      assign({
        results: pipe([
          get("results"),
          filter(
            or([
              and([
                pipe([
                  get("type"),
                  (type) => isTypesMatch({ typeToMatch: type })(options.types),
                ]),
                pipe([get("resources"), not(isEmpty)]),
              ]),
              pipe([get("error"), not(isEmpty)]),
            ])
          ),
        ]),
      }),
      tap((result) => {
        logger.info(`listLives result: ${tos(result)}`);
      }),
    ])();

  const filterDestroyResources = ({
    client,
    resource,
    options: {
      all = false,
      name: nameToDelete = "",
      id: idToDelete = "",
      types = [],
    } = {},
    direction,
  }) => {
    const { spec } = client;
    const { type } = spec;
    const { name, id, cannotBeDeleted, managedByUs } = resource;

    assert(direction);
    logger.debug(
      `filterDestroyResources ${tos({
        name,
        all,
        types,
        id,
        resource,
        managedByUs,
      })}`
    );
    return switchCase([
      // Resource that cannot be deleted
      () => cannotBeDeleted,
      () => {
        logger.debug(
          `planFindDestroy ${type}/${name}, default resource cannot be deleted`
        );
        return false;
      },
      // Delete all resources
      () => all,
      () => {
        logger.debug(`planFindDestroy ${type}/${name}, delete all`);
        return true;
      },
      // Delete by id
      () => !isEmpty(idToDelete),
      () => id === idToDelete,
      // Delete by name
      () => !isEmpty(nameToDelete),
      () => name === nameToDelete,
      // Not our minion
      () => !managedByUs,
      () => {
        logger.debug(`planFindDestroy ${type}/${name}, not our minion`);
        return false;
      },
      // Delete by type
      () => !isEmpty(types),
      () => any((type) => isTypeMatch({ type, typeToMatch: spec.type }))(types),
      // PlanDirection
      () => direction == PlanDirection.UP,
      () => false,
      () => true,
    ])();
  };

  const planFindDestroy = async ({
    options = {},
    direction = PlanDirection.DOWN,
    onStateChange = identity,
    lives,
  }) =>
    pipe([
      () => lives.results,
      tap((results) => {
        logger.info(`planFindDestroy ${tos({ options, direction })}`);
        assert(onStateChange);
        assert(options);
        assert(lives);
        assert(lives.results);
      }),
      filter(not(get("error"))),
      map(
        assign({
          plans: ({ type, resources }) =>
            pipe([
              tap(() => {
                assert(type);
                assert(resources);
              }),
              () => clientByType({ type })(getClients()),
              (client) =>
                pipe([
                  filter((resource) =>
                    filterDestroyResources({
                      client,
                      resource,
                      options,
                      direction,
                    })
                  ),
                  map((resource) => ({
                    resource: omit(["live"])(resource),
                    action: "DESTROY",
                    live: resource.live,
                    providerName: resource.providerName,
                  })),
                ])(resources),
            ])(),
        })
      ),
      filter(pipe([get("plans"), not(isEmpty)])),
      tap((results) => {
        logger.debug(`planFindDestroy`);
      }),
      (results) => ({
        plans: pipe([pluck("plans"), flatten])(results),
      }),
      assign({
        resultProviders: ({ plans }) =>
          map((provider) => ({
            providerName: provider.name,
            plans: filter(eq(get("providerName"), provider.name))(plans),
          }))(providers),
      }),
      tap((results) => {
        logger.debug(`planFindDestroy`);
      }),
    ])();

  const providersRunning = ({ providers, onStateChange }) =>
    forEach((provider) =>
      onStateChange({
        context: contextFromProvider({ providerName: provider.name }),
        nextState: "RUNNING",
      })
    )(providers);

  const planQuery = async ({
    onStateChange = identity,
    commandOptions = {},
  } = {}) =>
    pipe([
      tap(() => {
        logger.info(`planQuery begins`);
      }),
      tap(() => providersRunning({ providers, onStateChange })),
      assign({
        lives: () =>
          listLives({
            onStateChange,
            options: commandOptions,
          }),
      }),
      assign({
        resultDestroy: ({ lives }) =>
          planFindDestroy({
            onStateChange,
            direction: PlanDirection.UP,
            options: commandOptions,
            lives,
          }),
      }),
      assign({
        resultCreate: ({ lives }) =>
          planUpsert({
            onStateChange,
            lives,
          }),
      }),
      tap((result) => {
        logger.info(`planQuery result: ${tos(result)}`);
      }),
      assign({ error: any(get("error")) }),
      assign({
        mapProvider: pipe([
          ({ resultCreate, resultDestroy }) => [
            ...resultCreate.plans,
            ...resultDestroy.plans,
          ],
          groupBy("providerName"),
          (mapProvider) =>
            pipe([
              () => [...mapProvider.keys()],
              tap((result) => {
                logger.info(`planQuery result: ${tos(result)}`);
              }),
              map((providerName) => ({
                providerName,
                plans: mapProvider.get(providerName),
                resultCreate: filter(
                  pipe([
                    get("action"),
                    (action) => includes(action)(["CREATE", "UPDATE"]),
                  ])
                )(mapProvider.get(providerName)),
                resultDestroy: filter(
                  pipe([
                    get("action"),
                    (action) => includes(action)(["DESTROY"]),
                  ])
                )(mapProvider.get(providerName)),
              })),
            ])(),
        ]),
      }),
      tap((result) => {
        logger.info(`planQuery result: ${tos(result)}`);
      }),
      tap(({ mapProvider }) =>
        forEach(({ plans, providerName }) =>
          onStateChange({
            context: contextFromProvider({ providerName }),
            nextState: nextStateOnError(hasResultError(plans)),
          })
        )(mapProvider)
      ),
      tap((result) => {
        logger.info(`planQuery result: ${tos(result)}`);
      }),
    ])({});

  const planApply = async ({ plan, onStateChange = identity }) =>
    pipe([
      tap(() => {
        assert(plan);
        logger.info(`Apply Plan ${tos(plan)}`);
      }),
      tap(() => providersRunning({ providers, onStateChange })),
      assign({
        resultDestroy: switchCase([
          () => isValidPlan(plan.resultDestroy),
          () =>
            planDestroy({
              plans: plan.resultDestroy.plans,
              onStateChange,
              direction: PlanDirection.UP,
              title: TitleDestroying,
            }),
          () => ({ error: false, results: [] }),
        ]),
      }),
      assign({
        resultCreate: switchCase([
          () => isValidPlan(plan.resultCreate),
          pipe([
            () =>
              upsertResources({
                plans: plan.resultCreate.plans,
                onStateChange,
                title: TitleDeploying,
              }),
          ]),
          () => ({ error: false, newOrUpdate: { plans: [] } }),
        ]),
      }),
      tap((result) => {
        logger.info(`Apply result: ${tos(result)}`);
      }),
      (result) => ({
        lives: plan.lives,
        error: result.resultCreate.error || result.resultDestroy.error,
        resultCreate: result.resultCreate,
        resultDestroy: result.resultDestroy,
      }),
      //TODO
      /*) =>
        forEach((client) => {
          client.onDeployed && client.onDeployed(result);
        })(clients)
      ),*/
      tap((result) => {
        logger.info(`Apply result: ${tos(result)}`);
      }),
    ])();

  const planUpsert = async ({ onStateChange = noop, lives }) =>
    pipe([
      tap(() => {
        logger.info(`planUpsert`);
        assert(lives);
      }),
      () => providers,
      forEach((provider) =>
        onStateChange({
          context: contextFromPlanner({
            providerName: provider.name,
            title: TitleQuery,
          }),
          nextState: "RUNNING",
        })
      ),
      () => getTargetResources(),
      filter(not(get("spec.listOnly"))),
      tap(
        map((resource) =>
          onStateChange({
            context: contextFromResource({
              operation: TitleQuery,
              resource: resource.toJSON(),
            }),
            nextState: "RUNNING",
          })
        )
      ),
      map.pool(
        mapPoolSize,
        tryCatch(
          async (resource) => {
            onStateChange({
              context: contextFromResource({
                operation: TitleQuery,
                resource: resource.toJSON(),
              }),
              nextState: "RUNNING",
            });
            const actions = await resource.planUpsert({ resource, lives });
            onStateChange({
              context: contextFromResource({
                operation: TitleQuery,
                resource: resource.toJSON(),
              }),
              nextState: "DONE",
            });
            return actions;
          },
          (error, resource) => {
            logger.error(`error query resource ${resource.toString()}`);
            logger.error(JSON.stringify(error, null, 4));
            logger.error(error.toString());
            error.stack && logger.error(error.stack);

            onStateChange({
              context: contextFromResource({
                operation: TitleQuery,
                resource: resource.toJSON(),
              }),
              nextState: "ERROR",
              error,
            });
            return [{ error, resource: resource.toJSON() }];
          }
        )
      ),
      filter(not(isEmpty)),
      flatten,
      tap((result) => {
        logger.info(`planUpsert: result: ${tos(result)}`);
      }),
      tap(
        pipe([
          groupBy("providerName"),
          tap((result) => {
            logger.info(`planUpsert: result: ${tos(result)}`);
          }),
          forEach((plans, providerName) => {
            onStateChange({
              context: contextFromPlanner({ providerName, title: TitleQuery }),
              nextState: nextStateOnError(hasResultError(plans)),
            });
          }),
        ])
      ),

      (plans) => ({ error: hasResultError(plans), plans }),
      tap((result) => {
        logger.info(`planUpsert: result: ${tos(result)}`);
      }),
    ])();

  const onStateChangeResource = ({ operation, onStateChange }) => {
    return ({ resource, error, ...other }) => {
      logger.debug(
        `onStateChangeResource resource:${tos(resource)}, ${tos(other)}`
      );

      assert(resource, "no resource");
      assert(resource.type, "no resource.type");

      onStateChange({
        context: contextFromResource({ operation, resource }),
        error,
        ...other,
      });
    };
  };
  const upsertResources = async ({ plans = [], onStateChange, title }) => {
    assert(onStateChange);
    assert(title);

    const executor = async ({ item }) => {
      const { resource, live, action, diff } = item;
      const engine = getResource(resource);
      assert(engine, `Cannot find resource ${tos(resource)}`);
      const resolvedDependencies = await engine.resolveDependencies({
        dependenciesMustBeUp: true,
      });
      const input = await engine.resolveConfig({
        live,
        resolvedDependencies,
      });
      return switchCase([
        () => action === "UPDATE",
        async () => ({
          input,
          output: await engine.update({
            payload: input,
            live,
            diff,
            resolvedDependencies,
          }),
        }),
        () => action === "CREATE",
        async () => ({
          input,
          output: await engine.create({
            payload: input,
            resolvedDependencies,
          }),
        }),
        () => assert("action is not handled"),
      ])();
    };

    return switchCase([
      () => !isEmpty(plans),
      pipe([
        () =>
          Planner({
            plans,
            dependsOnType: getSpecs(),
            dependsOnInstance: mapToGraph(getMapNameToResource()),
            executor,
            onStateChange: onStateChangeResource({
              operation: TitleDeploying,
              onStateChange,
            }),
          }),
        (planner) => planner.run(),
        /*tap((result) =>
          onStateChange({
            context: contextFromPlanner({ title }),
            nextState: nextStateOnError(result.error),
          })
        ),*/
      ]),
      () => ({ error: false, plans }),
    ])();
  };

  const destroyByClient = async ({
    client,
    name,
    meta,
    resourcesPerType = [],
    live,
    lives,
  }) =>
    pipe([
      tap((x) => {
        logger.debug(
          `destroyByClient: ${tos({
            type: client.spec.type,
            name,
            meta,
            live,
            resourcesPerType,
          })}`
        );
        assert(client);
        assert(live);
        assert(lives);
        assert(name);
      }),
      () => client.findId(live),
      tap((id) => {
        assert(id, `destroyByClient missing id in live: ${tos(live)}`);
      }),
      (id) =>
        pipe([
          find(eq(get("name"), name)),
          tap((resource) => {
            //assert(resource, `no resource for id ${id}`);
          }),
          tap((resource) =>
            retryCall({
              name: `destroy ${client.spec.type}/${id}/${name}`,
              fn: () =>
                client.destroy({
                  live,
                  id, // TODO remove id, only use live
                  name,
                  meta,
                  resource,
                  lives,
                }),
              isExpectedResult: () => true,
              //TODO isExpectedException: client.isExpectedExceptionDelete
              shouldRetryOnException: client.shouldRetryOnExceptionDelete,
              //config: provider.config(), // TODO
            })
          ),
        ])(resourcesPerType),
      tap(() => {
        logger.info(
          `destroyByClient: DONE ${JSON.stringify({
            type: client.spec.type,
            name,
          })}`
        );
      }),
    ])();

  const destroyById = async ({ type, live, lives, name, meta }) => {
    logger.debug(`destroyById: ${tos({ type, live })}`);
    const client = clientByType({ type })(getClients());
    assert(client.spec);
    assert(client, `Cannot find endpoint type ${type}}`);
    assert(live);
    assert(lives);

    return destroyByClient({
      client,
      name,
      meta,
      live,
      lives,
      resourcesPerType: getResourcesByType({ type }), //TODO add providerName as key ?
    });
  };

  const planDestroy = async ({
    plans,
    onStateChange = identity,
    direction = PlanDirection.DOWN,
    lives,
    resultProviders,
  }) => {
    pipe([
      tap(() => {
        assert(Array.isArray(plans), "plans must be an array");
        assert(
          Array.isArray(resultProviders),
          "resultProviders must be an array"
        );

        logger.info(`planDestroy ${tos({ plans, direction })}`);
        assert(lives);
        assert(lives.results);
      }),
      tap(() => providersRunning({ providers, onStateChange })),
      tap(() =>
        forEach(({ providerName }) =>
          onStateChange({
            context: contextFromPlanner({
              providerName,
              title: TitleDestroying,
            }),
            nextState: "RUNNING",
          })
        )(resultProviders)
      ),
    ])();

    const planner = Planner({
      plans: plans,
      dependsOnType: getSpecs(),
      dependsOnInstance: mapToGraph(getMapNameToResource()),
      executor: ({ item }) =>
        destroyById({
          name: item.resource.name,
          meta: item.resource.meta, //TODO remove
          type: item.resource.type,
          live: item.live,
          lives,
        }),
      down: true,
      onStateChange: onStateChangeResource({
        operation: TitleDestroying,
        onStateChange,
      }),
    });

    const plannerResult = await planner.run();

    pipe([
      /*tap(() =>
        onStateChange({
          context: contextFromPlanner({ title: TitleDestroying }),
          nextState: nextStateOnError(plannerResult.error),
        })
      ),*/
      tap(() => logger.info(`planDestroy result: ${tos(plannerResult)}`)),
    ])();

    return plannerResult;
  };

  const destroyAll = ({ options } = {}) =>
    pipe([
      tap(({ options }) => {
        logger.info(`destroyAll ${JSON.stringify(options)}`);
      }),
      assign({
        lives: ({ options }) =>
          listLives({
            options,
            readWrite: true,
          }),
      }),
      ({ options, lives }) =>
        pipe([
          () => planFindDestroy({ options, lives }),
          ({ plans }) =>
            planDestroy({ plans, direction: PlanDirection.DOWN, lives }),
          tap(({ error, results, plans }) => {
            logger.info(
              `destroyAll DONE, ${error && `error: ${error}`}, #results ${
                results.length
              }`
            );
            assert(plans);
          }),
        ])(),
    ])({ options });

  const displayLives = ({ error, results }) =>
    pipe([
      tap(() => {
        assert(Array.isArray(results));
        logger.info(`displayLive ${results.length}`);
      }),
      () => results,
      //filter(not(get("error"))),
      groupBy("providerName"),
      tap((byProviders) => {
        logger.info(`displayLive ${tos(byProviders)}`);
      }),
      forEach((resources, providerName) => {
        displayLive({ providerName, resources });
      }),
    ])();

  const planQueryAndApply = async ({ onStateChange = identity } = {}) => {
    const plan = await planQuery({ onStateChange });
    if (plan.error) return { error: true, plan };
    return await planApply({ plan, onStateChange });
  };

  return {
    start,
    listLives,
    planQuery,
    planApply,
    planFindDestroy,
    planDestroy,
    destroyAll,
    planQueryAndApply,
    displayLives,
    getProvider,
    getProviders: () => providers,
    registerHook,
  };
};
