const assert = require("assert");
const _ = require("lodash");
const fs = require("fs");
const path = require("path");
const { defaultsDeep } = require("lodash/fp");

const { isEmpty, flatten, pluck } = require("rubico/x");
const {
  pipe,
  tap,
  map,
  filter,
  tryCatch,
  switchCase,
  get,
  assign,
  all,
  and,
  not,
  any,
  reduce,
  fork,
} = require("rubico");
const Promise = require("bluebird");
const logger = require("../logger")({ prefix: "Core" });
const { tos } = require("../tos");
const { checkConfig, checkEnv } = require("../Utils");
const { fromTagName } = require("./TagName");
const { SpecDefault } = require("./SpecDefault");
const { retryExpectOk, retryCall } = require("./Retry");
const {
  logError,
  mapPoolSize,
  convertError,
  HookType,
  TitleQuery,
  TitleDeploying,
  TitleDestroying,
} = require("./Common");
const { Planner, mapToGraph } = require("./Planner");

const configProviderDefault = {
  tag: "ManagedByGru",
  managedByKey: "ManagedBy",
  managedByValue: "GruCloud",
  managedByDescription: "Managed By GruCloud",
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

const filterReadWriteClient = filter((client) => !client.spec.listOnly);

const hasResultError = any(({ error }) => error);

const nextStateOnError = (error) => (error ? "ERROR" : "DONE");

const toUri = ({ providerName, type, name }) => {
  assert(type, "type");
  //TODO
  //assert(name, "name");
  return `${providerName}::${type}::${name}`;
};

const augmentResultWithError = (results) => ({
  error: pipe([flatten, any((result) => result.error)])(results),
  results,
});

const ResourceMaker = ({
  name: resourceName,
  dependencies = {},
  transformConfig,
  properties = () => ({}),
  spec,
  provider,
  config,
}) => {
  const { type } = spec;
  logger.debug(
    `ResourceMaker: ${tos({ type, resourceName, properties: properties() })}`
  );

  const client = spec.Client({ spec, config });
  let parent;
  const getLive = async () => {
    logger.info(`getLive ${type}/${resourceName}`);
    const live = await client.getByName({ name: resourceName, dependencies });
    logger.debug(`getLive ${type}/${resourceName} result: ${tos(live)}`);
    return live;
  };

  const planUpdate = async ({ resource, live }) => {
    logger.info(
      `planUpdate resource: ${tos(resource.toJSON())}, live: ${tos(live)}`
    );
    const target = await resource.resolveConfig();
    logger.debug(`planUpdate target: ${tos(target)}`);

    if (_.isEmpty(target)) {
      return;
    }
    const diff = spec.compare({ target, live });
    logger.info(`planUpdate diff ${tos(diff)}`);
    if (diff.length > 0) {
      return [{ action: "UPDATE", resource: resource.toJSON(), target, live }];
    }
  };

  const resolveDependencies = pipe([
    map(async (dependency) => {
      if (_.isString(dependency)) {
        return dependency;
      }
      if (!dependency.getLive) {
        return resolveDependencies(dependency);
      }
      const live = await dependency.getLive();
      //TODO refactor
      const config = await dependency.resolveConfig();
      return { resource: dependency, live: live || config };
    }),
    tap((x) => logger.debug(`resolveDependencies: ${tos(x)}`)),
  ]);
  const resolveConfig = async () => {
    logger.info(`resolveConfig ${type}/${resourceName}`);
    //TODO use function to extract resources: mapTypeToResources.get(client.type)
    const { items } = await client.getList({
      resources: provider.getMapTypeToResources().get(client.type),
    });
    //logger.debug(`config ${tos({ type, resourceName, items })}`);

    const resolvedDependencies = await resolveDependencies(dependencies);

    assert(client.configDefault);

    const config = await client.configDefault({
      name: resourceName,
      properties: defaultsDeep(spec.propertiesDefault)(properties()),
      dependencies: resolvedDependencies,
    });
    logger.debug(`resolveConfig: configDefault: ${tos(config)}`);
    const finalConfig = transformConfig
      ? await transformConfig({
          dependencies: resolvedDependencies,
          items,
          config,
          configProvider: provider.config(),
        })
      : config;

    logger.info(`resolveConfig: final: ${tos(finalConfig)}`);
    //assert(!_.isEmpty(finalConfig));
    return finalConfig;
  };
  const create = async ({ payload }) => {
    logger.info(`create ${tos({ resourceName, type, payload })}`);
    // Is the resource already created ?
    if (await getLive()) {
      throw Error(`Resource ${type}/${resourceName} already exists`);
    }

    // Create now
    const instance = await retryCall({
      name: `create ${type}/${resourceName}`,
      fn: () =>
        client.create({
          name: resourceName,
          payload,
          dependencies,
        }),
      shouldRetryOnException: client.shouldRetryOnException,
      retryCount: provider.config().retryCount,
      retryDelay: provider.config().retryDelay,
    });

    logger.info(`created:  ${type}/${resourceName}`);

    const live = await retryCall({
      name: `create getLive ${type}/${resourceName}`,
      fn: async () => {
        const live = await getLive();
        if (!live) {
          throw Error(
            `Resource ${type}/${resourceName} not there after being created`
          );
        }
        return live;
      },
      shouldRetryOnException: () => true,
      retryCount: provider.config().retryCount,
      retryDelay: provider.config().retryDelay,
    });

    if (
      !client.spec.isOurMinion({
        resource: live,
        resourceNames: provider.resourceNames(),
        config: provider.config(),
      })
    ) {
      throw Error(`Resource ${type}/${resourceName} is not tagged correctly`);
    }

    return instance;
  };

  const planUpsert = async ({ resource }) => {
    logger.info(`planUpsert resource: ${resource.toString()}`);
    const live = await resource.getLive();
    logger.debug(`planUpsert live: ${tos(live)}`);
    //TODO check if live is empty
    const plan = live
      ? planUpdate({ live, resource })
      : [
          {
            action: "CREATE",
            resource: resource.toJSON(),
            config: await resource.resolveConfig(),
          },
        ];
    logger.debug(`planUpsert plan: ${tos(plan)}`);
    return plan;
  };

  const toJSON = () => ({
    provider: provider.name,
    type,
    name: resourceName,
    uri: toUri({
      providerName: provider.name,
      type,
      name: resourceName,
    }),
  });

  const toString = () =>
    toUri({
      providerName: provider.name,
      type,
      name: resourceName,
    });

  const addParent = (parentToSet) => {
    parent = parentToSet;
  };
  const resourceMaker = {
    type,
    provider,
    name: resourceName,
    dependencies,
    getParent: () => parent,
    spec,
    client,
    toJSON,
    toString,
    resolveConfig,
    create,
    planUpsert,
    getLive,
    addParent,
    resolveDependencies: () => resolveDependencies(dependencies),
  };
  //TODO rubico map ?
  _.map(dependencies, (dependency) => {
    if (_.isString(dependency)) {
      return;
    }
    if (!dependency) {
      throw { code: 422, message: "missing dependency" };
    }
    if (!dependency.addParent) {
      _.forEach(dependency, (item) => {
        if (item.addParent) {
          item.addParent(resourceMaker);
        }
      });
    } else {
      dependency.addParent(resourceMaker);
    }
  });
  return resourceMaker;
};

const factoryName = (spec) => `${spec.listOnly ? "use" : "make"}${spec.type}`;

const createResourceMakers = ({ specs, config, provider }) =>
  specs.reduce((acc, spec) => {
    assert(spec.type);
    acc[factoryName(spec)] = async ({
      name,
      dependencies,
      properties,
      transformConfig,
    }) => {
      const resource = ResourceMaker({
        name,
        transformConfig,
        properties,
        dependencies,
        spec: _.defaults(spec, SpecDefault({ config })),
        provider,
        config,
      });
      provider.targetResourcesAdd(resource);

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
}) {
  const providerConfig = defaultsDeep(configProviderDefault)(config);
  logger.debug(
    `CoreProvider name: ${providerName}, type ${type}, config: ${tos(
      providerConfig
    )}`
  );

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
    //const newHookdash = _fp.defaultsDeep(defaultHook)(hook);
    const newHook = defaultsDeep(defaultHook)(hook);
    hookMap.set(name, newHook);
  };

  //Rename
  const contextFromResource = ({ uri, name, type } = {}) => {
    if (!uri) {
      assert(uri, "uri");
    }
    return {
      uri: uri,
      display: `${type}::${name}`,
      name,
      type,
    };
  };

  const contextFromPlanner = ({ title }) => ({
    uri: `${providerName}::${title}`,
    display: title,
  });

  const contextFromClient = (client) => {
    const { type } = client.spec;
    assert(type, "client.spec.type");

    return {
      uri: `${providerName}::client::${type}`,
      display: `${type}`,
    };
  };

  const contextFromHook = ({ hookType, hookName }) => ({
    display: `${hookName}::${hookType}`,
    uri: `${providerName}::${hookName}::${hookType}`,
  });

  const contextFromHookAction = ({ hookType, hookName, name }) => ({
    display: `${name}`,
    uri: `${providerName}::${hookName}::${hookType}::${name}`,
  });

  // Target Resources
  const mapNameToResource = new Map();
  const mapTypeToResources = new Map();
  const targetResourcesAdd = (resource) => {
    assert(resource.name);
    assert(resource.type);
    if (mapNameToResource.has(resource.name)) {
      throw {
        code: 400,
        message: `resource name '${resource.name}' already exists`,
      };
    }
    mapNameToResource.set(resource.name, resource);

    const resourcesPerType = mapTypeToResources.has(resource.type)
      ? mapTypeToResources.get(resource.type)
      : [];

    mapTypeToResources.set(resource.type, [...resourcesPerType, resource]);
  };

  const getTargetResources = () => [...mapNameToResource.values()];
  const resourceNames = () => [...mapNameToResource.keys()];

  const resourceByName = (name) => mapNameToResource.get(name);

  const specs = fnSpecs(providerConfig).map((spec) =>
    _.defaults(spec, SpecDefault({ config: providerConfig, providerName }))
  );

  const clients = specs.map((spec) =>
    spec.Client({ spec, config: providerConfig })
  );

  const clientByType = (type) => {
    assert(type);
    const spec = specs.find((spec) => spec.type === type);
    if (!spec) {
      throw new Error(`type ${type} not found`);
    }
    return spec.Client({ spec, config: providerConfig });
  };

  const filterClient = async ({
    client,
    our,
    name,
    id,
    canBeDeleted,
    providerName,
  }) => {
    logger.debug(`listLives type: ${client.spec.type}`);
    const { items } = await client.getList({
      resources: mapTypeToResources.get(client.type),
    });
    //logger.debug(`listLives resources: ${tos(items)}`);
    //TODO use rubico anf tap at the end
    return {
      type: client.spec.type,
      resources: items
        .map((item) => ({
          name: client.findName(item),
          id: client.findId(item),
          managedByUs: client.spec.isOurMinion({
            resource: item,
            resourceNames: resourceNames(),
            config: provider.config(),
          }),
          providerName: client.spec.providerName,
          data: item,
        }))
        .filter((item) => (our ? item.managedByUs : true))
        .filter((item) => (name ? item.name === name : true))
        .filter((item) => (id ? item.id === id : true))
        .filter((item) =>
          providerName ? item.providerName === providerName : true
        )
        .filter((item) =>
          canBeDeleted
            ? !client.cannotBeDeleted({
                resource: item.data,
                name: item.name,
                resourceNames: resourceNames(),
              }) //TODO is it ever called ?
            : true
        ),
    };
  };

  const listLives = async ({
    all = false,
    our = false,
    types = [],
    name,
    id,
    provider: providerName,
    canBeDeleted = false,
  } = {}) => {
    return await pipe([
      tap(() =>
        logger.debug(`listLives filters: ${tos({ all, our, types, name, id })}`)
      ),
      filter((client) => all || !client.spec.listOnly),
      filter((client) =>
        !_.isEmpty(types) ? types.includes(client.spec.type) : true
      ),
      map(
        tryCatch(
          (client) =>
            filterClient({
              client,
              our,
              name,
              id,
              canBeDeleted,
              providerName,
            }),
          (error, client) => ({
            error: convertError({ error }),
            client,
          })
        )
      ),
      tap((list) => {
        logger.debug(`listLives: ${tos(list)}`);
      }),
      filter((live) => (live.resources ? !isEmpty(live.resources) : true)),
      tap((list) => {
        // logger.debug(`listLives: ${tos(list)}`);
      }),
      (list) => ({
        error: hasResultError(list),
        results: list,
      }),
      tap((result) => {
        logger.debug(`listLives result: ${tos(result)}`);
      }),
    ])(clients);
  };

  const listTargets = async () => {
    const lists = (
      await Promise.all(
        getTargetResources().map(async (resource) => ({
          ...resource.toJSON(),
          data: await resource.getLive(),
        }))
      )
    ).filter((x) => x.data);
    logger.debug(`listTargets ${tos(lists)}`);
    return lists;
  };

  const listConfig = async () => {
    const lists = await Promise.all(
      getTargetResources().map(async (resource) => ({
        resource: resource.toJSON(),
        //config: await resource.config(),
      }))
    );
    logger.debug(`listConfig ${JSON.stringify(lists, null, 4)}`);
    return lists;
  };

  const planQuery = async ({ onStateChange = identity } = {}) =>
    pipe([
      tap(() => {
        logger.debug(`planQuery begins`);
        assert(onStateChange);
      }),
      tap(() =>
        onStateChange({
          context: { uri: providerName },
          nextState: "RUNNING",
        })
      ),
      fork({
        resultCreate: () =>
          planUpsert({
            onStateChange,
          }),
        resultDestroy: () =>
          planFindDestroy({
            onStateChange,
            direction: PlanDirection.UP,
          }),
      }),
      (result) => ({
        providerName,
        error: result.resultCreate.error || result.resultDestroy.error,
        ...result,
      }),
      tap((result) => {
        logger.debug(`planQuery ${tos(result)}`);
      }),
      tap((result) =>
        onStateChange({
          context: { uri: providerName },
          nextState: nextStateOnError(result.error),
        })
      ),
    ])();

  const runScriptCommands = ({ onStateChange, hookType, hookName }) =>
    pipe([
      tap((x) => {
        assert(hookType, "hookType");
        assert(hookName, "hookName");
        logger.debug(
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
              10,
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
                  logger.error(error);
                  onStateChange({
                    context: contextFromHookAction({
                      hookType,
                      hookName,
                      name: action.name,
                    }),
                    nextState: "ERROR",
                    error: convertError({ error }),
                  });

                  logger.error(error);
                  return { error, action, hookType, hookName, providerName };
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
            logger.debug(`runScriptCommands DONE ${tos(xx)}`);
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

  const runOnDeployed = ({ onStateChange }) =>
    pipe([
      tap((hooks) => {
        logger.info(`runOnDeployed hookName:  #hooks ${hooks.length}`);
        //assert(hookName);
      }),
      map(({ name, onDeployed }) =>
        tryCatch(
          pipe([
            tap(() => {
              assert(name, "name");
              logger.info(`runOnDeployed start ${name}`);
            }),
            () => onDeployed,
            runScriptCommands({
              onStateChange,
              hookType: HookType.ON_DEPLOYED,
              hookName: name,
            }),
            tap((obj) => {
              logger.info(`runOnDeployed stop`);
            }),
          ]),
          (error, hook) => {
            logger.error("runOnDeployed error");
            logger.error(error);
            return { error, hook };
          }
        )()
      ),
      (results) =>
        assign({ error: ({ results }) => any(({ error }) => error)(results) })({
          results,
        }),
      tap((result) => {
        logger.info(`runOnDeployed DONE`);
      }),
    ])([...hookMap.values()]);

  const runOnDestroyed = ({ onStateChange }) =>
    pipe([
      tap((hooks) => {
        logger.info(`runOnDestroyed hookName, #hooks ${hooks.length}`);
      }),
      map(({ name, onDestroyed }) =>
        tryCatch(
          pipe([
            () => onDestroyed,
            runScriptCommands({
              onStateChange,
              hookType: HookType.ON_DESTROYED,
              hookName: name,
            }),
          ]),
          (error, hook) => {
            logger.error("runOnDestroyed");
            logger.error(error);
            return { error, hook };
          }
        )()
      ),
      augmentResultWithError,
      tap((result) => {
        logger.info(`runOnDestroyed DONE`);
      }),
    ])([...hookMap.values()]);

  //TODO Rename
  const setRunningState = ({ onStateChange, hookType, hookName }) =>
    pipe([
      tap(({ actions }) => {
        logger.debug(
          `setRunningState ${hookName}::${hookType}, #actions ${actions.length}`
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
    pipe([
      () =>
        onStateChange({
          context: { uri: providerName },
          nextState: "WAITING",
        }),
    ]);
  const spinnersStopProvider = ({ onStateChange, error }) =>
    onStateChange({
      context: { uri: providerName },
      nextState: nextStateOnError(error),
    });

  const spinnersStartResources = ({ onStateChange, title, resources }) =>
    tap(
      pipe([
        tap(() => {
          assert(title, "title");
          assert(resources, "resources");
          assert(Array.isArray(resources), "resources must be an array");
          logger.info(
            `spinnersStartResources ${title}, ${JSON.stringify(resources)}`
          );
        }),
        () =>
          onStateChange({
            context: contextFromPlanner({ title }),
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
            map((resource) =>
              onStateChange({
                context: contextFromResource(resource),
                nextState: "WAITING",
                indent: 4,
              })
            ),
          ])(resources),
      ])
    );
  const spinnersStartClient = ({ onStateChange, title, clients }) =>
    tap(
      pipe([
        tap(() => {
          assert(title, "title");
          assert(clients, "clients");
          assert(Array.isArray(clients), "clients must be an array");
          logger.info(
            `spinnersStartResources ${title}, ${JSON.stringify(clients)}`
          );
        }),
        tap(() =>
          onStateChange({
            context: contextFromPlanner({ title }),
            nextState: "WAITING",
            indent: 2,
          })
        ),
        () =>
          pipe([
            map((client) =>
              onStateChange({
                context: contextFromClient(client),
                nextState: "WAITING",
                indent: 4,
              })
            ),
          ])(clients),
      ])
    );

  const spinnersStartHooks = ({ onStateChange, hookType }) =>
    tap(() =>
      map(({ name, onDeployed, onDestroyed }) =>
        pipe([
          tap(() => {
            logger.info(`spinnersStart hook`);
          }),
          () => (hookType === HookType.ON_DESTROYED ? onDestroyed : onDeployed), //TODO refactor
          setRunningState({ onStateChange, hookType, hookName: name }),
        ])()
      )([...hookMap.values()])
    );

  const spinnersStartQuery = ({ onStateChange }) => {
    const resources = pipe([
      filter((resource) => !resource.spec.listOnly),
      tap((obj) => {
        logger.debug("spinnersStartQuery no listOnly");
      }),
      map((resource) => resource.toJSON()),
      tap((obj) => {
        logger.debug("spinnersStartQuery json");
      }),
    ])(getTargetResources());
    return pipe([
      spinnersStartProvider({ onStateChange }),
      spinnersStartResources({
        onStateChange,
        title: TitleQuery,
        resources,
      }),
      spinnersStartClient({
        onStateChange,
        title: TitleDestroying,
        clients: filterReadWriteClient(clients),
      }),
    ])();
  };

  const spinnersStartDeploy = ({ onStateChange, plan }) => {
    return pipe([
      spinnersStartProvider({ onStateChange }),
      tap(
        switchCase([
          () => isValidPlan(plan.resultCreate),
          pipe([
            spinnersStartResources({
              onStateChange,
              title: TitleDeploying,
              resources: pluck("resource")(plan.resultCreate.plans),
            }),
            spinnersStartHooks({
              onStateChange,
              hookType: HookType.ON_DEPLOYED,
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
              resources: pluck("resource")(plan.resultDestroy.plans),
            }),
            //TODO
            /*spinnersStartHooks({
              onStateChange,
              hookType: HookType.ON_DESTROYED,
            }),*/
          ]),
          () => {
            logger.debug("no destroy ");
          },
        ])
      ),
    ])();
  };

  const spinnersStartDestroyQuery = ({ onStateChange }) => {
    logger.debug(`spinnersStartDestroyQuery #clients: ${clients.length}`);
    return pipe([
      spinnersStartProvider({ onStateChange }),
      spinnersStartClient({
        onStateChange,
        title: TitleDestroying,
        clients: filterReadWriteClient(clients),
      }),
    ])();
  };
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
        resources,
      }),
      spinnersStartHooks({
        onStateChange,
        hookType: HookType.ON_DESTROYED,
      }),
    ])();
  };
  const spinnersStartHook = ({ onStateChange, hookType }) => {
    assert(hookType, "hookType");
    return pipe([
      spinnersStartProvider({ onStateChange }),
      spinnersStartHooks({
        onStateChange,
        hookType,
      }),
    ])();
  };

  const planApply = async ({ plan, onStateChange = identity }) => {
    return await pipe([
      tap(() => {
        assert(plan);
        logger.info(`Apply Plan ${tos(plan)}`);
      }),
      tap(() =>
        onStateChange({
          context: { uri: providerName },
          nextState: "RUNNING",
        })
      ),
      fork({
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
        resultCreate: switchCase([
          () => isValidPlan(plan.resultCreate),
          pipe([
            () =>
              upsertResources({
                plans: plan.resultCreate.plans,
                onStateChange,
                title: TitleDeploying,
              }),
            (create) =>
              assign({
                hooks: () => runOnDeployed({ onStateChange }),
              })({ create }),
          ]),
          () => ({
            create: { error: false, newOrUpdate: { plans: [] } },
            hooks: { error: false },
          }),
        ]),
      }),
      (result) => ({
        error:
          result.resultCreate.create.error ||
          result.resultCreate.hooks.error ||
          result.resultDestroy.error,
        resultCreate: result.resultCreate.create,
        resultHooks: result.resultCreate.hooks,
        resultDestroy: result.resultDestroy,
      }),
    ])();
  };

  /**
   * Find live resources to create or update based on the target resources
   */
  const planUpsert = async ({ onStateChange = noop }) => {
    logger.debug(`planUpsert: #resources ${getTargetResources().length}`);
    return pipe([
      filter((resource) => !resource.spec.listOnly),
      tap(() =>
        onStateChange({
          context: contextFromPlanner({ title: TitleQuery }),
          nextState: "RUNNING",
        })
      ),
      tap(
        map((resource) =>
          onStateChange({
            context: contextFromResource(resource.toJSON()),
            nextState: "RUNNING",
          })
        )
      ),
      map.pool(
        mapPoolSize,
        tryCatch(
          async (resource) => {
            onStateChange({
              context: contextFromResource(resource.toJSON()),
              nextState: "RUNNING",
            });
            const actions = await resource.planUpsert({ resource });
            onStateChange({
              context: contextFromResource(resource.toJSON()),
              nextState: "DONE",
            });
            return actions;
          },
          (error, resource) => {
            logger.error(`error query resource ${resource.toString()}`);
            logger.error(error);
            onStateChange({
              context: contextFromResource(resource.toJSON()),
              nextState: "ERROR",
              error,
            });
            return { error: { error } };
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
      (plans) => ({ error: hasResultError(plans), plans: flatten(plans) }),
      assign({
        targets: () =>
          map((resource) => resource.toJSON())(getTargetResources()),
      }),
      tap((result) =>
        logger.debug(`planUpsert: result: ${JSON.stringify(result, null, 4)}`)
      ),
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
    assert(direction);
    logger.debug(
      `filterDestroyResources ${tos({ name, types, id, resource })}`
    );

    // Cannot delete default resource
    if (
      client.cannotBeDeleted({ resource, name, resourceNames: resourceNames() })
    ) {
      logger.debug(
        `planFindDestroy ${type}/${name}, default resource cannot be deleted`
      );
      return false;
    }
    // Delete all
    if (all) {
      logger.debug(`planFindDestroy ${type}/${name}, delete all`);
      return true;
    }
    if (
      !spec.isOurMinion({
        resource,
        resourceNames: resourceNames(),
        config: provider.config(),
      })
    ) {
      logger.debug(`planFindDestroy ${type}/${name}, not our minion`);
      return false;
    }
    //TODO switchCase
    // Delete by type
    if (!_.isEmpty(types)) {
      return types.includes(type);
    }

    // Delete by id
    if (!_.isEmpty(idToDelete)) {
      return id === idToDelete;
    }

    // Delete by name
    if (!_.isEmpty(nameToDelete)) {
      return name === nameToDelete;
    }

    const isNameInOurPlan = resourceNames().includes(
      fromTagName(name, providerConfig.tag)
    );
    if (direction == PlanDirection.UP) {
      if (!isNameInOurPlan) {
        logger.debug(
          `planFindDestroy ${type}/${name} is not ${resourceNames()} and plan UP`
        );
        return true;
      } else {
        return false;
      }
    } else {
      logger.debug(`planFindDestroy ${type}/${name} going down`);
      return true;
    }
  };

  const getClients = ({ onStateChange }) =>
    map(
      tryCatch(
        pipe([
          tap((client) =>
            onStateChange({
              context: contextFromClient(client),
              nextState: "RUNNING",
            })
          ),
          (client) =>
            assign({ results: ({ client }) => client.getList({}) })({ client }),
          tap(({ client }) =>
            onStateChange({
              context: contextFromClient(client),
              nextState: "DONE",
            })
          ),
          tap((x) => {
            logger.debug(`getList done`);
          }),
        ]),
        (error, client) => {
          logger.error(`getClient error for client type ${client}`);
          logger.error(error);
          onStateChange({
            context: contextFromClient(client),
            nextState: "ERROR",
            error: convertError({ error }),
          });

          return { error, client };
        }
      )
    );

  const planFindDestroy = async ({
    options,
    direction = PlanDirection.DOWN,
    onStateChange,
  }) =>
    pipe([
      tap((x) => {
        logger.debug(`planFindDestroy ${tos({ options, direction })}`);
        assert(onStateChange);
      }),
      filter((client) => !client.spec.listOnly),

      tap(() =>
        onStateChange({
          context: { uri: providerName },
          nextState: "RUNNING",
        })
      ),
      tap(() =>
        onStateChange({
          context: contextFromPlanner({ title: TitleDestroying }),
          nextState: "RUNNING",
        })
      ),
      getClients({ onStateChange }),
      //filter(get("results")),
      tap((x) => {
        logger.debug(`planFindDestroy`);
      }),
      map(
        assign({
          plans: ({ client, results }) =>
            results?.items
              .filter((resource) =>
                filterDestroyResources({
                  client,
                  resource,
                  options,
                  direction,
                })
              )
              .map((live) => ({
                resource: {
                  provider: providerName,
                  type: client.spec.type,
                  name: client.findName(live),
                  id: client.findId(live),
                  uri: toUri({
                    providerName,
                    type: client.spec.type,
                    name: client.findName(live),
                  }),
                },
                action: "DESTROY",
                config: live,
              })),
        })
      ),
      tap((results) => {
        logger.debug(`planFindDestroy`);
      }),
      (results) => {
        const plans = pipe([
          filter((result) => !isEmpty(result.plans || [])),
          reduce((acc, result) => [...acc, ...result.plans], []),
        ])(results);
        return { error: hasResultError(results), results, plans };
      },
      tap((results) => {
        logger.debug(`planFindDestroy done`);
      }),

      tap((result) =>
        onStateChange({
          context: contextFromPlanner({ title: TitleDestroying }),
          nextState: nextStateOnError(result.error),
          result,
        })
      ),
      tap((x) => logger.debug(`planFindDestroy  ${tos(x)}`)),
    ])(clients);

  const onStateChangeResource = (onStateChange) => {
    return ({ resource, error, ...other }) => {
      logger.debug(
        `onStateChangeResource resource:${tos(resource)}, ${tos(other)}`
      );

      if (!resource) {
        assert(false, "no resource");
      }
      // TODO
      /*
      if (!resource.name) {
        assert(false, "no resource.name");
      }
      */
      if (!resource.type) {
        assert(false, "no resource.type");
      }
      onStateChange({
        context: contextFromResource(resource),
        error,
        ...other,
      });
    };
  };
  const upsertResources = async ({ plans = [], onStateChange, title }) => {
    assert(onStateChange);
    assert(title);

    const executor = async ({ item }) => {
      const engine = resourceByName(item.resource.name);
      if (!engine) {
        throw Error(`Cannot find resource ${tos(item.resource.name)}`);
      }
      const input = await engine.resolveConfig();
      const output = await engine.create({
        payload: input,
      });
      return { input, output };
    };

    return await switchCase([
      () => !isEmpty(plans),
      pipe([
        () =>
          Planner({
            plans,
            specs: mapToGraph(mapNameToResource),
            executor,
            onStateChange: onStateChangeResource(onStateChange),
          }),
        (planner) => planner.run(),
        tap((result) =>
          onStateChange({
            context: contextFromPlanner({ title }),
            nextState: nextStateOnError(result.error),
          })
        ),
      ]),
      () => ({ error: false }),
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
    config,
    resourcesPerType = [],
  }) => {
    assert(client);
    assert(config);

    logger.info(
      `destroyByClient: ${tos({
        type: client.spec.type,
        name,
        config,
        resourcesPerType,
      })}`
    );

    const id = client.findId(config);
    assert(id, "destroyByClient missing id");
    const result = await client.destroy({ id, name, resourcesPerType });
    await retryExpectOk({
      name: `destroy ${name}`,
      fn: () => client.isDownById({ id, name, resourcesPerType }),
      config: client.config || providerConfig,
    });

    logger.debug(
      `destroyByClient: DONE ${tos({ type: client.spec.type, name, result })}`
    );
    //TODO Double check with getByName
    return result;
  };

  const destroyById = async ({ type, config, name }) => {
    logger.debug(`destroyById: ${tos({ type, name })}`);
    const client = clientByType(type);
    if (!client) {
      throw new Error(`Cannot find endpoint type ${type}}`);
    }
    return await destroyByClient({
      client,
      name,
      config,
      resourcesPerType: provider.getMapTypeToResources().get(type),
    });
  };

  const planDestroy = async ({
    plans,
    onStateChange = identity,
    direction = PlanDirection.DOWN,
  }) => {
    assert(plans);
    assert(Array.isArray(plans), "plans must be an array");

    const executor = async ({ item }) => {
      return await destroyById({
        name: item.resource.name,
        type: item.resource.type,
        config: item.config,
      });
    };
    pipe([
      tap((options) =>
        logger.debug(`planDestroy ${tos({ direction, options })}`)
      ),
      tap(() =>
        onStateChange({
          context: { uri: providerName },
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
      specs: mapToGraph(mapNameToResource),
      executor,
      down: true,
      onStateChange: onStateChangeResource(onStateChange),
    });

    const plannerResult = await planner.run();

    pipe([
      tap((options) => logger.debug(`planDestroy ${tos({ options })}`)),
      tap(() =>
        onStateChange({
          context: contextFromPlanner({ title: TitleDestroying }),
          nextState: nextStateOnError(plannerResult.error),
        })
      ),
    ])();

    if (direction === PlanDirection.DOWN) {
      const resultHooks = await runOnDestroyed({ onStateChange });

      return {
        error: resultHooks.error || plannerResult.error ? true : false,
        results: plannerResult.results,
        resultHooks,
      };
    } else {
      return plannerResult;
    }
  };

  const destroyAll = tryCatch(
    pipe([
      tap(() => logger.debug(`destroyAll`)),
      async ({ onStateChange = identity } = {}) =>
        planFindDestroy({ options: {}, onStateChange }),
      async ({ plans }) =>
        await planDestroy({ plans, direction: PlanDirection.DOWN }),

      tap(({ error, results }) =>
        logger.debug(
          `destroyAll DONE, error: ${error}, #results ${results.length}`
        )
      ),
    ]),
    (error) => {
      logError("destroyAll", error);
      throw error;
    }
  );

  const isPlanEmpty = switchCase([
    and([
      (plan) => isEmpty(plan.resultDestroy.plans),
      (plan) => isEmpty(plan.resultCreate.plans),
    ]),
    () => true,
    () => false,
  ]);

  checkEnv(mandatoryEnvs);
  checkConfig(config, mandatoryConfigKeys);

  const toType = () => type || providerName;
  const hookFilenameDefault = ({ dirname }) =>
    path.resolve(dirname || process.cwd(), "hooks.js");

  const getHookFactory = tryCatch(require, (error) => {
    logger.error(`getHookFactory ${tos(error)}`);
    throw error;
  });

  const register = ({ resources, dirname }) =>
    pipe([
      hookFilenameDefault,
      switchCase([
        (fileName) => fs.existsSync(fileName),
        pipe([
          getHookFactory,
          (hookFactory) => {
            const hooks = hookFactory({ resources, config: providerConfig });
            hookAdd("default", hooks);
          },
        ]),
        (filename) => {
          logger.error(`hook '${filename}' does not exist`);
        },
      ]),
    ])({
      dirname,
    });

  const provider = {
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
    spinnersStartDestroyQuery,
    spinnersStartDestroy,
    spinnersStartHook,
    spinnersStopProvider,
    planDestroy,
    listLives,
    listTargets,
    listConfig,
    targetResourcesAdd,
    clientByType,
    resourceByName,
    resourceNames,
    getMapTypeToResources: () => mapTypeToResources,
    getTargetResources,
    isPlanEmpty,
    register,
    runOnDeployed,
    runOnDestroyed,
    hookAdd,
  };
  const enhanceProvider = {
    ...provider,
    ...createResourceMakers({ provider, config: providerConfig, specs }),
  };

  return enhanceProvider;
}

module.exports = CoreProvider;
