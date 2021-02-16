const assert = require("assert");
const fs = require("fs");
const path = require("path");
const memoize = require("promise-memoize");

const {
  isEmpty,
  isString,
  flatten,
  pluck,
  forEach,
  find,
  defaultsDeep,
  isDeepEqual,
  includes,
} = require("rubico/x");
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
} = require("rubico");
const logger = require("../logger")({ prefix: "Core" });
const { tos } = require("../tos");
const { checkConfig, checkEnv } = require("../Utils");
const { fromTagName } = require("./TagName");
const { SpecDefault } = require("./SpecDefault");
const { retryCall } = require("./Retry");
const {
  mapPoolSize,
  convertError,
  HookType,
  TitleQuery,
  TitleDeploying,
  TitleDestroying,
  typeFromResources,
  planToResourcesPerType,
  TitleListing,
} = require("./Common");
const { Planner, mapToGraph } = require("./Planner");
const { Lister } = require("./Lister");

const configProviderDefault = {
  tag: "ManagedByGru",
  managedByKey: "ManagedBy",
  managedByValue: "GruCloud",
  managedByDescription: "Managed By GruCloud",
  createdByProviderKey: "CreatedByProvider",
  stageTagKey: "stage",
  stage: "dev",
  retryCount: 30,
  retryDelay: 10e3,
};

const PlanDirection = {
  UP: 1,
  DOWN: -1,
};

exports.PlanDirection;

const identity = (x) => x;
const noop = ({}) => {};

const isValidPlan = (plan) => !isEmpty(plan.plans) && !plan.error;

const hasResultError = any(get("error"));

const nextStateOnError = (error) => (error ? "ERROR" : "DONE");

const createClient = ({ spec, provider, config, mapTypeToResources }) =>
  pipe([
    () => spec.Client({ provider, spec, config, mapTypeToResources }),
    tap((client) => {
      assert(client.spec);
      assert(client.findName);
      assert(client.getByName);
    }),
    defaultsDeep({
      resourceKey: pipe([
        tap((resource) => {
          assert(resource.provider);
          assert(resource.type);
          assert(resource.name || resource.id);
        }),
        ({ provider, type, name, id }) => `${provider}::${type}::${name || id}`,
      ]),
      displayName: get("name"),
      displayNameResource: get("name"),
      findMeta: () => undefined,
      cannotBeDeleted: () => false,
      configDefault: () => ({}),
    }),
  ])();

const ResourceMaker = ({
  name: resourceName,
  meta = {},
  dependencies = {},
  transformConfig,
  properties = () => ({}),
  spec,
  provider,
  config,
}) => {
  const { type } = spec;
  assert(resourceName, "missing 'name' property");
  logger.debug(`ResourceMaker: ${tos({ type, resourceName, meta })}`);

  const client = createClient({ provider, spec, config });
  const usedBySet = new Set();

  const getLive = async ({ deep = true } = {}) => {
    logger.info(`getLive ${toString()}, deep: ${deep}`);
    const live = await client.getByName({
      provider,
      meta,
      name: resourceName,
      dependencies,
      resolveConfig,
      deep,
      resources: provider.getResourcesByType(type),
    });
    logger.debug(`getLive ${toString()} result: ${tos(live)}`); //TODO KEY
    return live;
  };

  const findLive = ({ lives }) =>
    pipe([
      tap((results) => {
        logger.debug(`findLive ${results}`);
      }),
      filter(not(get("error"))),
      find(eq(get("type"), type)),
      switchCase([
        (result) => result,
        pipe([
          tap(({ type, results }) => {
            assert(type);
          }),
          ({ type, results }) =>
            find((item) =>
              isDeepEqual(
                resourceName,
                provider.clientByType(type).findName(item)
              )
            )(results.items),
        ]),
        (result) => {
          logger.debug(`findLive cannot find type ${type}`);
        },
      ]),

      tap((live) => {
        logger.debug(`findLive ${tos(live)}`);
      }),
    ])(lives.results);

  const planUpdate = async ({ resource, target, live }) => {
    logger.debug(
      `planUpdate resource: ${tos(resource.toJSON())}, target: ${tos(
        target
      )}, live: ${tos(live)}`
    );

    if (isEmpty(target)) {
      //TODO do we need this ?
      return;
    }
    const diff = await spec.compare({
      usedBySet,
      target,
      live,
      dependencies: resource.dependencies,
    });
    logger.info(`planUpdate diff ${tos(diff)}`);
    // TODO unify
    if (diff.needUpdate || !isEmpty(diff.added) || !isEmpty(diff.updated)) {
      return [
        {
          action: "UPDATE",
          resource: resource.toJSON(),
          config: target,
          live,
          diff,
        },
      ];
    }
  };
  const getDependencyList = () =>
    pipe([
      filter(not(isString)),
      transform(
        map((dep) => dep),
        () => []
      ),
      tap((result) => {
        //logger.info(`getDependencyList `);
      }),
    ])(dependencies);

  const resolveDependencies = ({ lives, dependencies, dependenciesMustBeUp }) =>
    pipe([
      tap(() => {
        logger.info(
          `resolveDependencies for ${toString()}: ${Object.keys(
            //TODO KEY
            dependencies
          )}, dependenciesMustBeUp: ${dependenciesMustBeUp}, has lives: ${!!lives}`
        );
      }),
      map(async (dependency) => {
        if (isString(dependency)) {
          return dependency;
        }
        //TODO isArray
        if (!dependency.getLive) {
          return tryCatch(
            () =>
              resolveDependencies({
                lives,
                dependencies: dependency,
                dependenciesMustBeUp,
              }),
            (error) => {
              logger.error(
                `resolveDependencies: ${toString()}, error: ${tos(
                  //TODO KEY
                  error
                )}`
              );
              return {
                error,
              };
            }
          )();
        }
        return tryCatch(
          (dependency) =>
            pipe([
              switchCase([
                not(isEmpty),
                (lives) => dependency.findLive({ lives }),
                () => dependency.getLive({ deep: false }),
              ]),
              tap.if(
                (live) => dependenciesMustBeUp && !live,
                () => {
                  throw {
                    message: `${toString()} dependency ${
                      dependency.name
                    } is not up`,
                  };
                }
              ),
              async (live) => ({
                resource: dependency,
                config: await dependency.resolveConfig({ deep: true, live }),
                live,
              }),
            ])(lives),
          (error, dependency) => {
            logger.error(`resolveDependencies: ${tos(error)}`);
            return {
              item: { resource: dependency.toString() },
              error,
            };
          }
        )(dependency);
      }),
      tap((result) => {
        logger.debug(
          `resolveDependencies for ${toString()}, result: ${tos(result)}`
        );
      }),
      tap.if(any(get("error")), (resolvedDependencies) => {
        logger.error(
          `resolveDependencies ${toString()} error in resolveDependencies`
        );

        throw {
          message: "error resolving dependencies",
          results: filter(get("error"))(resolvedDependencies),
        };
      }),
      tap((result) => {
        logger.debug(
          `resolveDependencies for ${toString()}, result: ${tos(result)}`
        );
      }),
    ])(dependencies);

  const resolveConfig = async ({
    live,
    lives,
    resolvedDependencies,
    deep = true,
  } = {}) =>
    pipe([
      tap(() => {
        logger.debug(
          `resolveConfig ${toString()}, ${tos({
            deep,
            live,
          })}`
        );
        assert(client.configDefault);
        assert(spec.propertiesDefault);
      }),
      switchCase([
        () => !deep,
        () => ({}),
        () => !isEmpty(resolvedDependencies),
        () => resolvedDependencies,
        () =>
          resolveDependencies({
            resourceName,
            dependencies,
            lives,
          }),
      ]),
      async (resolvedDependencies) => {
        const config = await client.configDefault({
          name: resourceName,
          meta,
          properties: defaultsDeep(spec.propertiesDefault)(
            properties({ dependencies: resolvedDependencies })
          ),
          dependencies: resolvedDependencies,
          live,
        });

        const finalConfig = await switchCase([
          () => transformConfig,
          pipe([
            () =>
              client.getList({
                resources: provider.getResourcesByType(client.spec.type),
              }),
            ({ items }) =>
              transformConfig({
                dependencies: resolvedDependencies,
                items,
                config,
                configProvider: provider.config(),
                live,
              }),
          ]),
          () => config,
        ])();

        logger.info(`resolveConfig: final: ${tos(finalConfig)}`);
        return finalConfig;
      },
    ])();

  const create = async ({ payload, resolvedDependencies }) => {
    logger.info(`create ${tos({ resourceName, type, payload })}`);
    // Is the resource already created ?
    if (await getLive({ deep: false })) {
      throw Error(`Resource ${toString()} already exists`);
    }

    const instance = await client.create({
      meta,
      name: resourceName,
      payload,
      dependencies,
      resolvedDependencies,
    });

    logger.info(`created: ${toString()}`);
    return instance;
  };

  const update = async ({ payload, diff, live, resolvedDependencies }) => {
    logger.info(`update ${tos({ resourceName, type, payload })}`);
    if (!(await getLive())) {
      throw Error(`Resource ${toString()} does not exist`);
    }

    // Create now
    const instance = await retryCall({
      name: `update ${toString()}`,
      fn: () =>
        client.update({
          name: resourceName,
          payload,
          dependencies,
          resolvedDependencies,
          diff,
          live,
          id: client.findId(live),
        }),
      shouldRetryOnException: client.shouldRetryOnException,
      config: provider.config(),
    });

    logger.info(`updated: ${toString()}`);
    return instance;
  };

  const planUpsert = async ({ resource, lives }) =>
    pipe([
      tap(() => {
        logger.info(`planUpsert resource: ${resource.toString()}`);
        assert(lives);
      }),
      fork({
        live: () => resource.findLive({ lives }),
        target: pipe([() => resource.resolveConfig({ lives })]),
      }),
      switchCase([
        pipe([get("live"), isEmpty]),
        ({ target }) => [
          {
            action: "CREATE",
            resource: resource.toJSON(),
            config: target,
          },
        ],
        ({ live, target }) => planUpdate({ live, target, resource }),
      ]),
    ])();

  const toString = () =>
    client.resourceKey({
      provider: provider.name,
      type,
      name: resourceName,
      meta,
      dependencies,
    });

  const toJSON = () => ({
    provider: provider.name,
    type,
    name: resourceName,
    meta,
    displayName: client.displayNameResource({
      name: resourceName,
      meta,
      dependencies,
    }),
    uri: toString(),
  });

  const addUsedBy = (usedBy) => {
    usedBySet.add(usedBy);
  };

  const resourceMaker = {
    type,
    provider,
    name: resourceName,
    meta,
    dependencies,
    addUsedBy,
    usedBy: () => usedBySet,
    spec,
    client,
    toJSON,
    toString,
    resolveConfig,
    create,
    update,
    planUpsert,
    getLive,
    findLive,
    getDependencyList,
    resolveDependencies: ({ lives, dependenciesMustBeUp }) =>
      resolveDependencies({
        resourceName,
        dependencies,
        lives,
        dependenciesMustBeUp,
      }),
  };
  forEach((dependency) => {
    if (isString(dependency)) {
      return;
    }
    if (!dependency) {
      throw { code: 422, message: "missing dependency" };
    }
    if (!dependency.addUsedBy) {
      forEach((item) => {
        if (item.addUsedBy) {
          item.addUsedBy(resourceMaker);
        }
      })(dependency);
    } else {
      dependency.addUsedBy(resourceMaker);
    }
  })(dependencies);
  return resourceMaker;
};

const factoryName = (spec) => `${spec.listOnly ? "use" : "make"}${spec.type}`;

const createResourceMakers = ({ specs, config, provider }) =>
  specs.reduce((acc, spec) => {
    assert(spec.type);
    acc[factoryName(spec)] = async ({
      name,
      meta = {},
      dependencies,
      properties,
      transformConfig,
    }) => {
      const resource = ResourceMaker({
        meta,
        name,
        transformConfig,
        properties,
        dependencies,
        spec: defaultsDeep(SpecDefault({ config }))(spec),
        provider,
        config,
      });
      provider.targetResourcesAdd(resource);

      //TODO move it somewhere else to remove async.

      if (resource.client.validate) {
        await resource.client.validate({ name });
      }

      return resource;
    };
    return acc;
  }, {});

function CoreProvider({
  name: providerName,
  type,
  mandatoryEnvs = [],
  mandatoryConfigKeys = [],
  fnSpecs,
  config,
  info = () => ({}),
  init = () => {},
  unInit = () => {},
  start = () => {},
}) {
  const providerConfig = pipe([
    defaultsDeep({ providerName }),
    defaultsDeep(configProviderDefault),
  ])(config);
  logger.debug(
    `CoreProvider name: ${providerName}, type ${type}, config: ${tos(
      providerConfig
    )}`
  );

  const liveToUri = ({ client, live }) =>
    client.resourceKey({
      provider: providerName,
      type: client.spec.type,
      name: client.findName(live),
      meta: client.findMeta(live),
      id: client.findId(live),
    });

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

  const contextFromProvider = () => ({
    uri: providerName,
    displayText: () => providerName,
  });

  const contextFromProviderInit = () => ({
    uri: `${providerName}::start`,
    displayText: () => "Initialising",
  });

  const contextFromResource = ({ operation, resource }) => {
    assert(operation);
    assert(resource);
    const { type, id } = resource;
    assert(type);
    const uri = `${providerName}::${operation}::${type}`;
    const displayText = (state) => {
      if (!state) {
        assert(state, `no state for ${uri}`);
      }
      return `${type} ${state.completed}/${state.total}`;
    };

    return {
      uri,
      displayText,
      onErrorDefault: ({ spinnerMap, spinnies }) => {},
      onDone: ({ state, spinnerMap, spinnies }) => {
        if (!state) {
          assert(state, `no state for ${uri}`);
        }
        const completed = state.completed + 1;
        const newState = { ...state, completed };
        spinnies.update(uri, {
          text: displayText(newState),
          color: "greenBright",
          status: "spinning",
        });

        spinnerMap.set(uri, { state: newState });

        if (completed === state.total) {
          spinnies.succeed(uri);
          spinnerMap.delete(uri);
        }
      },
    };
  };

  const contextFromResourceType = ({ operation, resourcesPerType }) => {
    assert(operation);
    const { provider, type, resources } = resourcesPerType;
    assert(Array.isArray(resources), "Array.isArray(resources)");
    return {
      uri: `${provider}::${operation}::${type}`,
      displayText: (state) => `${type} ${state.completed}/${state.total}`,
      state: { completed: 0, total: resources.length },
    };
  };

  const contextFromPlanner = ({ title, total = 0 }) => {
    const uri = `${providerName}::${title}`;

    return {
      uri,
      state: { completed: 0, total },

      displayText: (state) => {
        assert(state, `no state for ${uri}`);
        return total
          ? `${title} ${state.completed}/${state.total}`
          : `${title}`;
      },
    };
  };

  const contextFromClient = ({ client, title }) => {
    assert(client, "client");
    const { type } = client.spec;
    assert(type, "client.spec.type");
    assert(title, "title");
    const uri = `${providerName}::${title}`;

    const displayText = (state) => {
      assert(state, `no state for ${uri}`);
      const text = `${title} ${state.completed}/${state.total}`;
      logger.debug(`contextFromClient ${text}`);
      return text;
    };

    return {
      hide: true,
      uri: `${providerName}::${title}::${type}`,
      displayText: () => type,
      onDone: ({ spinnerMap, spinnies }) => {
        const context = spinnerMap.get(uri);
        if (!context) {
          assert(context, `no context for ${uri}`);
        }
        const { state } = context;
        assert(state);
        const completed = state.completed + 1;
        const newState = { ...state, completed };
        spinnies.update(uri, {
          text: displayText(newState),
          color: "greenBright",
          status: "spinning",
        });

        spinnerMap.set(uri, { state: newState });

        if (completed === state.total) {
          spinnies.succeed(uri);
          spinnerMap.delete(uri);
        }
      },
    };
  };

  const contextFromHook = ({ hookType, hookName }) => ({
    uri: `${providerName}::${hookName}::${hookType}`,
    displayText: () => `${hookName}::${hookType}`,
  });

  const contextFromHookAction = ({ hookType, hookName, name }) => ({
    uri: `${providerName}::${hookName}::${hookType}::${name}`,
    displayText: () => name,
  });

  // Target Resources
  const mapNameToResource = new Map();
  const mapTypeToResources = new Map();

  const targetResourcesAdd = (resource) => {
    assert(resource.name);
    assert(resource.type);
    assert(resource.spec.providerName);

    const resourceKey = resource.toString();
    if (mapNameToResource.has(resourceKey)) {
      throw {
        code: 400,
        message: `resource '${resourceKey}' already exists`,
      };
    }
    mapNameToResource.set(resourceKey, resource);

    mapTypeToResources.set(resource.type, [
      ...getResourcesByType(resource.type),
      resource,
    ]);

    tap.if(get("hook"), (client) =>
      hookAdd(client.spec.type, client.hook({ resource }))
    )(resource.client);
  };

  const getTargetResources = () => [...mapNameToResource.values()];
  const resourceNames = () => pluck(["name"])([...mapNameToResource.values()]);

  const getResource = pipe([
    get("uri"),
    tap((uri) => {
      assert(uri, "getResource no uri");
    }),
    (uri) => mapNameToResource.get(uri),
  ]);

  const specs = fnSpecs(providerConfig).map((spec) =>
    defaultsDeep(SpecDefault({ config: providerConfig, providerName }))(spec)
  );

  const clients = specs.map((spec) =>
    createClient({ mapTypeToResources, spec, config: providerConfig })
  );

  const clientByType = (type) => find(eq(get("spec.type"), type))(clients);

  const isTypeMatch = ({ type, typeToMatch }) =>
    new RegExp(`^${type}`, "i").test(typeToMatch);

  const findDependentType = pipe([
    tap((types) => {
      //logger.debug(`findDependentType ${types}`);
    }),
    flatMap(
      pipe([
        (type) =>
          filter((client) =>
            isTypeMatch({ type, typeToMatch: client.spec.type })
          )(clients),
        pluck("spec.listDependsOn"),
        flatten,
      ])
    ),
    tap((types) => {
      //logger.debug(`findDependentType ${types}`);
    }),
  ]);

  const isTypesMatch = ({ typeToMatch }) =>
    switchCase([
      isEmpty,
      () => true,
      any((type) => isTypeMatch({ type, typeToMatch })),
    ]);

  const filterByType = ({ types }) =>
    filter((client) =>
      switchCase([
        or([isEmpty, pipe([findDependentType, includes(client.spec.type)])]),
        () => true,
        isTypesMatch({ typeToMatch: client.spec.type }),
      ])(types)
    );

  const filterReadClient = ({ types, all } = {}) =>
    pipe([
      tap((clients) => {
        logger.debug(
          `filterReadClient types: ${types}, #clients ${clients.length}`
        );
      }),
      filterByType({ types }),
      filter((client) => all || !client.spec.listHide),
      tap((clients) => {
        logger.debug(`filterReadClient #clients ${clients.length}`);
      }),
    ]);

  const filterReadWriteClient = ({ types } = {}) =>
    pipe([
      tap((clients) => {
        logger.debug(
          `filterReadWriteClient types: ${types}, #clients ${clients.length}`
        );
      }),
      filterByType({ types }),
      filter((client) => !client.spec.singleton),
      filter((client) => !client.spec.listOnly),
      tap((clients) => {
        logger.debug(`filterReadWriteClient result #clients ${clients.length}`);
      }),
    ]);

  const filterClient = async ({
    result,
    client,
    options: { our, name, id, canBeDeleted, provider: c },
  }) =>
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
        assert(result.items);
      }),
      get("items"),
      map((item) => ({
        name: client.findName(item),
        displayName: client.displayName({
          name: client.findName(item),
          meta: client.findMeta(item),
        }),
        meta: client.findMeta(item),
        id: client.findId(item),
        managedByUs: client.spec.isOurMinion({
          resource: item,
          resourceNames: resourceNames(),
          config: provider.config(),
        }),
        providerName: client.spec.providerName,
        type: client.spec.type,
        data: item,
        cannotBeDeleted: client.cannotBeDeleted({
          resource: item,
          name: client.findName(item),
          resourceNames: resourceNames(),
          config: provider.config(),
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
      }),
      tap((x) => {
        assert(x);
      }),
    ])(result);

  const listLives = async ({
    onStateChange = identity,
    options = {},
    title = TitleQuery,
  } = {}) =>
    pipe([
      tap((clients) =>
        logger.info(`listLives filters: ${JSON.stringify({ options, title })}`)
      ),
      filterReadClient(options),
      map((client) => ({
        type: client.spec.type,
        executor: pipe([
          ({ lives }) =>
            client.getList({
              lives,
              deep: true,
              resources: provider.getResourcesByType(client.spec.type),
            }),
          (result) =>
            filterClient({
              result,
              client,
              onStateChange,
              options,
              providerName,
            }),
        ]),
        dependsOn: client.spec.listDependsOn,
      })),
      (inputs) =>
        Lister({
          inputs,
          onStateChange: ({ type, error, ...other }) => {
            assert(type);
            onStateChange({
              context: contextFromClient({ client: clientByType(type), title }),
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
    ])(clients);

  const listTargets = () =>
    pipe([
      map(async (resource) => ({
        ...resource.toJSON(),
        data: await resource.getLive(),
      })),
      filter((x) => x.data),
      tap((list) => {
        logger.debug(`listTargets ${tos(list)}`);
      }),
    ])(getTargetResources());

  const listConfig = () =>
    pipe([
      map(async (resource) => ({
        resource: resource.toJSON(),
      })),
      tap((list) => {
        logger.debug(`listConfig ${tos(list)}`);
      }),
    ])(getTargetResources());

  const planQuery = async ({
    onStateChange = identity,
    commandOptions = {},
  } = {}) =>
    pipe([
      tap(() => {
        logger.info(`planQuery begins`);
      }),
      tap(() =>
        onStateChange({
          context: contextFromProvider(),
          nextState: "RUNNING",
        })
      ),
      assign({
        lives: () =>
          findLives({
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
      (result) => ({
        providerName,
        error: result.resultCreate.error || result.resultDestroy.error,
        ...result,
      }),
      tap((result) =>
        onStateChange({
          context: contextFromProvider(),
          nextState: nextStateOnError(result.error),
        })
      ),
      tap((result) => {
        logger.info(`planQuery result: ${tos(result)}`);
      }),
    ])();

  const runScriptCommands = ({ onStateChange, hookType, hookName }) =>
    pipe([
      tap((x) => {
        assert(hookType, "hookType");
        assert(hookName, "hookName");
        logger.info(
          `runScriptCommands hookName: ${hookName}, type: ${hookType}`
        );
      }),
      tap((x) =>
        onStateChange({
          context: contextFromHook({ hookName, hookType }),
          nextState: "RUNNING",
        })
      ),
      tryCatch(
        pipe([
          assign({ payload: (script) => script.init() }),
          ({ actions, payload }) =>
            map.pool(
              mapPoolSize,
              tryCatch(
                pipe([
                  tap((action) => {
                    onStateChange({
                      context: contextFromHookAction({
                        hookType,
                        hookName,
                        name: action.name,
                      }),
                      nextState: "RUNNING",
                    });
                  }),
                  tap(async (action) => {
                    if (action.command) {
                      await action.command(payload);
                    } else {
                      throw `${action} does not have a command function`;
                    }
                  }),
                  tap((action) => {
                    onStateChange({
                      context: contextFromHookAction({
                        hookType,
                        hookName,
                        name: action.name,
                      }),
                      nextState: "DONE",
                    });
                  }),
                ]),
                (error, action) => {
                  logger.error(
                    `runScriptCommands ${hookType}, error for ${action.name}`
                  );
                  logger.error(tos(error));
                  error.stack && logger.error(error.stack);

                  onStateChange({
                    context: contextFromHookAction({
                      hookType,
                      hookName,
                      name: action.name,
                    }),
                    nextState: "ERROR",
                    error: convertError({ error }),
                  });

                  return {
                    error,
                    action: action.name,
                    hookType,
                    hookName,
                    providerName,
                  };
                }
              )
            )(actions),
          tap((xx) => {
            logger.debug(
              `runScriptCommands ${tos({ hookName, hookType })} ${tos(xx)}`
            );
          }),
          (results) =>
            assign({
              error: ({ results }) => any(({ error }) => error)(results),
            })({
              results,
            }),
          tap((xx) => {
            logger.debug(
              `runScriptCommands ${tos({ hookName, hookType })} ${tos(xx)}`
            );
          }),
          tap(({ error }) =>
            onStateChange({
              context: contextFromHook({ hookName, hookType }),
              nextState: nextStateOnError(error),
            })
          ),
          tap((xx) => {
            logger.info(`runScriptCommands DONE ${tos(xx)}`);
          }),
        ]),
        (error, script) => {
          logger.debug(
            `runScriptCommands error: ${hookName}, type: ${hookType}, script ${tos(
              script
            )}`
          );
          onStateChange({
            context: contextFromHook({ hookName, hookType }),
            nextState: "ERROR",
            error: error,
          });
          return {
            results: [{ error, hookType, hookName, providerName, script }],
            error: true,
          };
        }
      ),
    ]);
  const runHook = ({ onStateChange, hookType, onHook, skip }) =>
    switchCase([
      () => !skip,
      () =>
        pipe([
          tap((hooks) => {
            logger.info(
              `runHook hookType: ${hookType}, #hooks ${hooks.length}`
            );
          }),
          map((hook) =>
            pipe([
              tap(() => {
                assert(hook.name, "name");
                assert(hook[onHook], `hook[onHook]: ${onHook}`);
                logger.info(`runHook start ${hook.name}`);
              }),
              () => hook[onHook],
              runScriptCommands({
                onStateChange,
                hookType,
                hookName: hook.name,
              }),
              tap((obj) => {
                logger.info(`runHook ${hookType} stop`);
              }),
            ])()
          ),
          (results) =>
            assign({
              error: ({ results }) => any(({ error }) => error)(results),
            })({
              results,
            }),
          tap((result) => {
            logger.info(`runHook DONE`);
          }),
        ])([...hookMap.values()]),
      () => {
        logger.debug(`runHook skipped`);
      },
    ])();

  const runOnDeployed = ({ onStateChange, skip }) =>
    runHook({
      onStateChange,
      skip,
      onHook: "onDeployed",
      hookType: HookType.ON_DEPLOYED,
    });

  const runOnDestroyed = ({ onStateChange, skip }) =>
    runHook({
      onStateChange,
      skip,
      onHook: "onDestroyed",
      hookType: HookType.ON_DESTROYED,
    });

  const setHookWaitingState = ({ onStateChange, hookType, hookName }) =>
    pipe([
      tap(({ actions }) => {
        logger.debug(
          `setHookWaitingState ${hookName}::${hookType}, #actions ${actions.length}`
        );
        assert(hookName, "hookName");
        assert(hookType, "hookType");
      }),
      tap(() => {
        onStateChange({
          context: contextFromHook({ hookType, hookName }),
          nextState: "WAITING",
          indent: 2,
        });
      }),
      ({ actions }) =>
        map((action) =>
          onStateChange({
            context: contextFromHookAction({
              hookType,
              hookName,
              name: action.name,
            }),
            nextState: "WAITING",
            indent: 4,
          })
        )(actions),
    ]);

  const spinnersStartProvider = ({ onStateChange }) =>
    tap(
      pipe([
        () =>
          onStateChange({
            context: contextFromProvider(),
            nextState: "WAITING",
          }),
        () =>
          onStateChange({
            context: contextFromProviderInit(),
            nextState: "WAITING",
            indent: 2,
          }),
      ])
    );

  const spinnersStopProvider = ({ onStateChange, error }) =>
    tap(() =>
      onStateChange({
        context: contextFromProvider(),
        nextState: nextStateOnError(error),
      })
    )();

  const spinnersStartResources = ({ onStateChange, title, resourcesPerType }) =>
    tap(
      pipe([
        tap(() => {
          assert(title, "title");
          assert(resourcesPerType, "resourcesPerType");
          assert(
            Array.isArray(resourcesPerType),
            "resourcesPerType must be an array"
          );
          logger.info(
            `spinnersStartResources ${title}, ${tos(resourcesPerType)}`
          );
        }),
        () =>
          onStateChange({
            context: contextFromPlanner({
              title,
              total: resourcesPerType.length,
            }),
            nextState: "WAITING",
            indent: 2,
          }),
        () =>
          onStateChange({
            context: contextFromPlanner({ title }),
            nextState: "RUNNING",
          }),
        () =>
          pipe([
            map((resourcesPerType) =>
              onStateChange({
                context: contextFromResourceType({
                  operation: title,
                  resourcesPerType,
                }),
                nextState: "WAITING",
                indent: 4,
              })
            ),
          ])(resourcesPerType),
      ])
    );
  const spinnersStartClient = ({ onStateChange, title, clients }) =>
    tap(
      pipe([
        tap(() => {
          assert(title, "title");
          assert(Array.isArray(clients), "clients must be an array");
          logger.info(
            `spinnersStartClient ${title}, ${JSON.stringify(clients)}`
          );
        }),
        tap(() =>
          onStateChange({
            context: contextFromPlanner({ title, total: clients.length }),
            nextState: "WAITING",
            indent: 2,
          })
        ),
        () =>
          pipe([
            map((client) =>
              onStateChange({
                context: contextFromClient({ client, title }),
                nextState: "WAITING",
                indent: 4,
              })
            ),
          ])(clients),
      ])
    );
  const spinnersStopClient = ({ onStateChange, title, clients, result }) =>
    tap(
      pipe([
        tap(() => {
          assert(title, "title");
          assert(Array.isArray(clients), "clients must be an array");
          logger.info(
            `spinnersStopClient ${title}, #clients ${clients.length}`
          );
        }),
        tap(() =>
          onStateChange({
            context: contextFromPlanner({ title }),
            nextState: nextStateOnError(result.error),
          })
        ),
      ])
    );
  const spinnersStartHooks = ({ onStateChange, hookType }) =>
    pipe([
      () => [...hookMap.values()],
      tap((hooks) => {
        logger.info(`spinnersStart #hooks ${hooks.length}`);
      }),
      tap(
        map(({ name, onDeployed, onDestroyed }) =>
          pipe([
            tap(() => {
              logger.debug(`spinnersStart hook`);
            }),
            switchCase([
              () => hookType === HookType.ON_DEPLOYED,
              () => onDeployed,
              () => hookType === HookType.ON_DESTROYED,
              () => onDestroyed,
              () => assert(`Invalid hook type '${hookType}'`),
            ]),
            setHookWaitingState({ onStateChange, hookType, hookName: name }),
          ])()
        )
      ),
    ]);

  const spinnersStartQuery = ({ onStateChange, options }) =>
    pipe([
      tap(() => {
        logger.debug("spinnersStartQuery");
      }),
      filter(not(get("spec.listOnly"))),
      map((resources) => ({
        provider: providerName,
        type: typeFromResources(resources),
        resources: map((resource) => ({
          type: resource.type,
          name: resource.name,
        }))(resources),
      })),
      spinnersStartProvider({ onStateChange }),
      spinnersStartClient({
        onStateChange,
        title: TitleListing,
        clients,
      }),
      (resourcesPerType) =>
        spinnersStartResources({
          onStateChange,
          title: TitleQuery,
          resourcesPerType,
        })(),
    ])([...mapTypeToResources.values()]);

  const spinnersStartListLives = ({ onStateChange, options }) =>
    tap(
      pipe([
        tap(() => {
          logger.debug(`spinnersStartListLives ${options.types}`);
        }),
        spinnersStartProvider({ onStateChange }),
        spinnersStartClient({
          onStateChange,
          title: TitleQuery,
          clients: filterReadClient(options)(clients),
        }),
      ])
    )();

  const spinnersStopListLives = ({ onStateChange, options, result }) =>
    tap(
      pipe([
        tap(() => {
          logger.debug("spinnersStopListLives");
        }),
        spinnersStopClient({
          onStateChange,
          title: TitleQuery,
          clients: filterReadClient(options)(clients),
          result,
        }),
        () => spinnersStopProvider({ onStateChange, error: result.error }),
      ])
    )();

  const spinnersStartDeploy = ({ onStateChange, plan }) =>
    tap(
      pipe([
        tap(() => {
          logger.debug("spinnersStartDeploy");
        }),
        spinnersStartProvider({ onStateChange }),
        tap(
          switchCase([
            () => isValidPlan(plan.resultCreate),
            pipe([
              spinnersStartResources({
                onStateChange,
                title: TitleDeploying,
                resourcesPerType: planToResourcesPerType({
                  providerName,
                  plans: plan.resultCreate.plans,
                }),
              }),
            ]),
            () => {
              logger.debug("no newOrUpdate ");
            },
          ])
        ),
        tap(
          switchCase([
            () => isValidPlan(plan.resultDestroy),
            pipe([
              spinnersStartResources({
                onStateChange,
                title: TitleDestroying,
                resourcesPerType: planToResourcesPerType({
                  providerName,
                  plans: plan.resultDestroy.plans,
                }),
              }),
            ]),
            () => {
              logger.debug("no destroy ");
            },
          ])
        ),
      ])
    )();

  const spinnersStartDestroyQuery = ({ onStateChange, options }) =>
    pipe([
      tap(() => {
        logger.debug(`spinnersStartDestroyQuery #clients: ${clients.length}`);
      }),
      spinnersStartProvider({ onStateChange }),
      spinnersStartClient({
        onStateChange,
        title: TitleListing,
        clients: filterReadWriteClient(options)(clients),
      }),
    ])();

  const spinnersStartDestroy = ({ onStateChange, plans }) => {
    assert(plans, "plans");
    assert(Array.isArray(plans), "plans !isArray");

    const resources = pipe([filter(({ error }) => !error), pluck("resource")])(
      plans
    );

    logger.debug(`spinnersStartDestroy #resources: ${resources.length}`);
    return pipe([
      spinnersStartProvider({ onStateChange }),
      spinnersStartResources({
        onStateChange,
        title: TitleDestroying,
        resourcesPerType: planToResourcesPerType({
          providerName,
          plans,
        }),
      }),
    ])();
  };

  const spinnersStartHook = ({ onStateChange, hookType }) =>
    pipe([
      tap(() => {
        logger.debug(`spinnersStartHook hookType: ${hookType}`);
      }),
      spinnersStartProvider({ onStateChange }),
      spinnersStartHooks({
        onStateChange,
        hookType,
      }),
    ])();

  const planApply = async ({ plan, onStateChange = identity }) =>
    pipe([
      tap(() => {
        assert(plan);
        logger.info(`Apply Plan ${tos(plan)}`);
      }),
      tap(() =>
        onStateChange({
          context: contextFromProvider(),
          nextState: "RUNNING",
        })
      ),
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
      tap((result) =>
        forEach((client) => {
          client.onDeployed && client.onDeployed(result);
        })(clients)
      ),
      tap((result) => {
        logger.info(`Apply result: ${tos(result)}`);
      }),
    ])();

  const planUpsert = async ({ onStateChange = noop, lives }) => {
    logger.info(`planUpsert: #resources ${getTargetResources().length}`);
    return pipe([
      filter(not(get("spec.listOnly"))),
      tap(() =>
        onStateChange({
          context: contextFromPlanner({ title: TitleQuery }),
          nextState: "RUNNING",
        })
      ),
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
      filter((x) => x),
      tap((plans) =>
        onStateChange({
          context: contextFromPlanner({ title: TitleQuery }),
          nextState: nextStateOnError(hasResultError(plans)),
        })
      ),
      flatten,
      (plans) => ({ error: hasResultError(plans), plans }),
      /*assign({
        targets: () =>
          map((resource) => resource.toJSON())(getTargetResources()),
      }),*/
      tap((result) => {
        logger.info(`planUpsert: result: ${tos(result)}`);
      }),
    ])(getTargetResources());
  };

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
    const name = client.findName(resource);
    const id = client.findId(resource);
    const isNameInOurPlan = find((item) => isDeepEqual(item, name))(
      resourceNames()
    );

    assert(direction);
    logger.debug(
      `filterDestroyResources ${tos({
        name,
        all,
        types,
        id,
        resource,
        isNameInOurPlan,
      })}`
    );
    return switchCase([
      // Resource that cannot be deleted
      () =>
        client.cannotBeDeleted({
          resource,
          name,
          resourceNames: resourceNames(),
          config: providerConfig,
        }),
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
      () =>
        !spec.isOurMinion({
          resource,
          resourceNames: resourceNames(),
          config: provider.config(),
        }),
      () => {
        logger.debug(`planFindDestroy ${type}/${name}, not our minion`);
        return false;
      },
      // Delete by type
      () => !isEmpty(types),
      () => any((type) => isTypeMatch({ type, typeToMatch: spec.type }))(types),
      // PlanDirection
      () => {
        logger.debug(
          `planFindDestroy ${type}/${name}, direction: ${direction}, ${isNameInOurPlan}`
        );
        if (direction == PlanDirection.UP) {
          return false;
        } else {
          return isNameInOurPlan;
        }
      },
    ])();
  };

  const getClients = ({ onStateChange, deep, title }) =>
    map(
      tryCatch(
        (client) =>
          pipe([
            tap(() =>
              onStateChange({
                context: contextFromClient({ client, title }),
                nextState: "RUNNING",
              })
            ),
            async () => ({
              type: client.spec.type,
              results: await client.getList({
                deep,
                resources: provider.getResourcesByType(client.spec.type),
              }),
            }),
            tap(() =>
              onStateChange({
                context: contextFromClient({ client, title }),
                nextState: "DONE",
              })
            ),
            tap((x) => {
              logger.debug(`getClients done`);
            }),
          ])(),
        (error, client) => {
          logger.error(`getClient error for client type ${client.spec.type}`);
          logger.error(tos(convertError({ error })));
          onStateChange({
            context: contextFromClient({ client, title }),
            nextState: "ERROR",
            error: convertError({ error }),
          });
          return { error, type: client.spec.type };
        }
      )
    );

  const findLives = async ({
    options = {},
    onStateChange = identity,
    readWrite,
  }) =>
    pipe([
      tap((clients) => {
        logger.info(
          `findLives #clients ${clients.length}, ${tos({ options })}`
        );
        assert(onStateChange);
        assert(options);
      }),
      switchCase([
        () => readWrite,
        filterReadWriteClient(options),
        (clients) => clients,
      ]),
      tap(() =>
        onStateChange({
          context: contextFromProvider(),
          nextState: "RUNNING",
        })
      ),
      tap(() =>
        onStateChange({
          context: contextFromPlanner({ title: TitleListing }),
          nextState: "RUNNING",
        })
      ),
      getClients({ onStateChange, title: TitleListing, deep: false }),
      (results) => ({ error: hasResultError(results), results }),
      tap((result) =>
        onStateChange({
          context: contextFromPlanner({ title: TitleListing }),
          nextState: nextStateOnError(result.error),
          result,
        })
      ),
      switchCase([
        get("error"),
        (result) => result,
        assign({
          liveMap: ({ results }) =>
            pipe([
              flatMap(({ type, results: { items } }) =>
                map((live) => liveToUri({ client: clientByType(type), live }))(
                  items
                )
              ),
            ])(results),
        }),
      ]),
      tap((result) => {
        logger.info(`findLives result: ${tos(result)}`);
      }),
    ])(clients);

  const planFindDestroy = async ({
    options = {},
    direction = PlanDirection.DOWN,
    onStateChange = identity,
    lives,
  }) =>
    pipe([
      tap((xxx) => {
        logger.info(`planFindDestroy ${tos({ options, direction })}`);
        assert(onStateChange);
        assert(options);
        assert(lives);
        assert(lives.results);
      }),
      filter(not(get("error"))),
      map(
        assign({
          plans: ({ type, results }) =>
            pipe([
              () => clientByType(type),
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
                  map((live) => ({
                    resource: {
                      provider: providerName,
                      type: client.spec.type,
                      name: client.findName(live),
                      meta: client.findMeta(live),
                      displayName: client.displayName({
                        name: client.findName(live),
                        meta: client.findMeta(live),
                      }),
                      id: client.findId(live),
                      uri: liveToUri({ client, live }),
                    },
                    action: "DESTROY",
                    config: live,
                  })),
                ])(results?.items || []),
            ])(),
        })
      ),
      filter(pipe([get("plans"), not(isEmpty)])),
      tap((results) => {
        logger.debug(`planFindDestroy`);
      }),
      (results) => ({
        error: lives.error,
        plans: pipe([pluck("plans"), flatten])(results),
      }),
      tap((results) => {
        logger.debug(`planFindDestroy`);
      }),
    ])(lives?.results);

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
            dependsOnType: specs,
            dependsOnInstance: mapToGraph(mapNameToResource),
            executor,
            onStateChange: onStateChangeResource({
              operation: TitleDeploying,
              onStateChange,
            }),
          }),
        (planner) => planner.run(),
        tap((result) =>
          onStateChange({
            context: contextFromPlanner({ title }),
            nextState: nextStateOnError(result.error),
          })
        ),
      ]),
      () => ({ error: false, plans }),
    ])();
  };

  const planQueryAndApply = async ({ onStateChange = identity } = {}) => {
    const plan = await planQuery({ onStateChange });
    if (plan.error) return { error: true, plan };
    return await planApply({ plan, onStateChange });
  };
  const destroyByClient = async ({
    client,
    name,
    meta,
    config,
    resourcesPerType = [],
    lives,
  }) =>
    pipe([
      tap((x) => {
        logger.debug(
          `destroyByClient: ${tos({
            type: client.spec.type,
            name,
            meta,
            config,
            resourcesPerType,
          })}`
        );
        assert(client);
        assert(config);
      }),
      () => client.findId(config),
      tap((id) => {
        assert(id, `destroyByClient missing id in config: ${tos(config)}`);
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
                  live: config,
                  id,
                  name,
                  meta,
                  resource,
                  lives,
                }),
              isExpectedResult: () => true,
              //TODO isExpectedException: client.isExpectedExceptionDelete
              shouldRetryOnException: client.shouldRetryOnExceptionDelete,
              config: provider.config(),
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

  const destroyById = async ({ type, config, name, meta, lives }) => {
    logger.debug(`destroyById: ${tos({ type, name, lives })}`);
    const client = clientByType(type);
    assert(client, `Cannot find endpoint type ${type}}`);

    return destroyByClient({
      client,
      name,
      meta,
      config, //TODO use live
      resourcesPerType: provider.getResourcesByType(type),
      lives,
    });
  };

  const planDestroy = async ({
    plans,
    onStateChange = identity,
    direction = PlanDirection.DOWN,
    lives,
  }) => {
    pipe([
      tap(() => {
        assert(Array.isArray(plans), "plans must be an array");
        logger.info(`planDestroy ${tos({ plans, direction })}`);
      }),
      tap(() =>
        onStateChange({
          context: contextFromProvider(),
          nextState: "RUNNING",
        })
      ),
      tap(() =>
        onStateChange({
          context: contextFromPlanner({ title: TitleDestroying }),
          nextState: "RUNNING",
        })
      ),
    ])();

    const planner = Planner({
      plans: plans,
      dependsOnType: specs,
      dependsOnInstance: mapToGraph(mapNameToResource),
      executor: async ({ item }) =>
        destroyById({
          lives,
          name: item.resource.name,
          meta: item.resource.meta, //TODO remove
          type: item.resource.type,
          config: item.config, //TODO use live
        }),
      down: true,
      onStateChange: onStateChangeResource({
        operation: TitleDestroying,
        onStateChange,
      }),
    });

    const plannerResult = await planner.run();

    pipe([
      tap(() =>
        onStateChange({
          context: contextFromPlanner({ title: TitleDestroying }),
          nextState: nextStateOnError(plannerResult.error),
        })
      ),
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
          findLives({
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

  checkEnv(mandatoryEnvs);
  checkConfig(config, mandatoryConfigKeys);

  const toType = () => type || providerName;
  const hookFilenameDefault = ({ dirname = process.cwd() }) =>
    path.resolve(dirname, "hooks.js");

  const getHookFactory = tryCatch(require, (error) => {
    logger.error(`getHookFactory ${tos(error)}`);
    throw error;
  });

  const register = ({ resources, dirname }) =>
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

  const getResourcesByType = (type) => mapTypeToResources.get(type) || [];

  const startBase = ({ onStateChange = identity } = {}) =>
    tryCatch(
      pipe([
        tap(() => {
          logger.debug(`start`);
        }),
        () => start(),
        tap(() =>
          onStateChange({
            context: contextFromProviderInit(),
            nextState: "DONE",
          })
        ),
        tap(() => {
          logger.debug(`start done`);
        }),
      ]),
      (error) => {
        logger.error(`start error ${tos(error)}`);
        onStateChange({
          context: contextFromProviderInit(),
          nextState: "ERROR",
          error,
        });
        onStateChange({
          context: contextFromProvider(),
          nextState: "ERROR",
        });
        throw error;
      }
    )();
  const toString = () => ({ name: providerName, type: toType() });

  const graph = ({ options }) =>
    pipe([
      tap((xxx) => {
        logger.debug(`graph`);
      }),
      () => getTargetResources(),
      reduce(
        (acc, resource) => `${acc}"${resource.type}::${resource.name}";\n`,
        ""
      ),
      (result) =>
        reduce(
          (acc, resource) =>
            `${acc}${map(
              (deps) =>
                `"${resource.type}::${resource.name}" -> "${deps.type}::${deps.name}";\n`
            )(resource.getDependencyList()).join("\n")}`,
          result
        )(getTargetResources()),
      (result) =>
        `subgraph "cluster_${providerName}" {\nlabel="${providerName}";${result}}\n`,
    ])();

  const provider = {
    toString,
    config: () => providerConfig,
    name: providerName,
    type: toType,
    destroyAll,
    planFindDestroy,
    planQueryAndApply,
    planQuery,
    planApply,
    spinnersStartQuery,
    spinnersStartDeploy,
    spinnersStartListLives,
    spinnersStopListLives,
    spinnersStartDestroyQuery,
    spinnersStartDestroy,
    spinnersStartHook,
    spinnersStopProvider,
    planDestroy,
    findLives,
    listLives,
    listTargets,
    listConfig,
    targetResourcesAdd,
    clientByType,
    getResource,
    resourceNames,
    getResourcesByType,
    getTargetResources,
    register,
    runOnDeployed,
    runOnDestroyed,
    hookAdd,
    graph,
    info: pipe([
      () => startBase(),
      () => ({
        provider: toString(),
        stage: providerConfig.stage,
        ...info(),
      }),
      tap((info) => {
        logger.debug(`info  ${tos(info)}`);
      }),
    ]),
    init,
    unInit,
    start: startBase,
  };
  const enhanceProvider = {
    ...provider,
    ...createResourceMakers({ provider, config: providerConfig, specs }),
  };

  return enhanceProvider;
}

module.exports = CoreProvider;
