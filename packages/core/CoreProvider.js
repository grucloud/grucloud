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
  pick,
  omit,
} = require("rubico");

const {
  first,
  isEmpty,
  isString,
  callProp,
  flatten,
  pluck,
  forEach,
  find,
  defaultsDeep,
  isDeepEqual,
  includes,
  isFunction,
  identity,
  size,
} = require("rubico/x");

const logger = require("./logger")({ prefix: "CoreProvider" });
const { tos } = require("./tos");
const { checkConfig, checkEnv } = require("./Utils");
const { SpecDefault } = require("./SpecDefault");
const { retryCall } = require("./Retry");
const {
  mapPoolSize,
  convertError,
  HookType,
  TitleListing,
  TitleQuery,
  TitleDeploying,
  TitleDestroying,
  typeFromResources,
  groupFromResources,
  planToResourcesPerType,
  configProviderDefault,
} = require("./Common");
const { Lister } = require("./Lister");
const { Planner, mapToGraph } = require("./Planner");
const {
  nextStateOnError,
  hasResultError,
  PlanDirection,
  isTypesMatch,
  isTypeMatch,
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
  liveToUri,
  providerRunning,
} = require("./ProviderCommon");

const { ResourceMaker, createClient } = require("./CoreResource");

const createResourceMakers = ({ specs, config, provider }) =>
  pipe([
    () => specs,
    filter(not(get("listOnly"))),
    reduce((acc, spec) => {
      assert(spec.type);
      if (!acc[spec.group] && spec.group) {
        acc[spec.group] = {};
      }

      const specAll = defaultsDeep(SpecDefault({ config }))(spec);

      const makeResource = specAll.makeResource({
        provider,
        spec: specAll,
      });

      //TODO remove
      acc[`make${spec.type}`] = makeResource;
      if (spec.group) {
        acc[spec.group][`make${spec.type}`] = makeResource;
      }

      return acc;
    }, {}),
  ])();

const createResourceMakersListOnly = ({
  specs,
  config: configProvider,
  provider,
}) =>
  pipe([
    () => specs,
    reduce((acc, spec) => {
      assert(spec.type);
      if (!acc[spec.group] && spec.group) {
        acc[spec.group] = {};
      }
      const useResource = ({
        name,
        meta,
        namespace,
        config: configUser = {},
        dependencies,
        properties,
        attributes,
        filterLives,
      }) => {
        const config = defaultsDeep(configProvider)(configUser);
        const resource = ResourceMaker({
          meta,
          name,
          namespace,
          filterLives,
          properties,
          attributes,
          dependencies,
          readOnly: true,
          spec: pipe([
            () => ({ listOnly: true }),
            defaultsDeep(SpecDefault({ config })),
            defaultsDeep(spec),
          ])(),
          provider,
          config,
        });
        provider.targetResourcesAdd(resource);

        return resource;
      };

      acc[`use${spec.type}`] = useResource;
      if (spec.group) {
        acc[spec.group][`use${spec.type}`] = useResource;
      }
      return acc;
    }, {}),
  ])();

function CoreProvider({
  name: providerName,
  dependencies = {},
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

  const hookMap = new Map();

  const hookAdd = ({ name, hookInstance }) =>
    pipe([
      tap(() => {
        assert(name);
        assert(hookInstance);
        logger.info(`hookAdd ${name}`);
      }),
      () => hookInstance,
      defaultsDeep({
        name,
        onDeployed: {
          init: () => {},
          actions: [],
        },
        onDestroyed: {
          init: () => {},
          actions: [],
        },
      }),
      tap.if(
        () => hookMap.has(name),
        () => {
          logger.error(`hook ${name} already added`);
        }
      ),
      (newHook) => hookMap.set(name, newHook),
    ])();

  // Target Resources
  const mapNameToResource = new Map();
  const getMapNameToResource = () => mapNameToResource;

  const getResourceFromLive = ({ live, lives, client }) =>
    pipe([
      tap(() => {
        assert(lives);
      }),
      () => ({
        providerName: provider.name,
        type: client.spec.type,
        group: client.spec.group,
        name: client.findName({ live, lives }),
        id: client.findId({ live, lives }),
        meta: client.findMeta(live),
      }),
      tap((params) => {
        logger.debug(`getResourceFromLive ${JSON.stringify(params)}`);
      }),
      (params) => client.resourceKey(params),
      tap((key) => {
        logger.debug(`${key}`);
      }),
      (key) => mapNameToResource.get(key),
      tap((resource) => {
        logger.debug(`getResourceFromLive: ${!!resource}`);
      }),
    ])();

  const mapTypeToResources = new Map();

  const getTargetTypes = () => [...mapTypeToResources.keys()];

  const targetResourcesAdd = (resource) => {
    assert(resource.name);
    assert(resource.type);
    assert(resource.spec.providerName);

    const resourceKey = resource.toString();
    logger.debug(`targetResourcesAdd ${resourceKey}`);
    if (mapNameToResource.has(resourceKey) && !resource.spec.listOnly) {
      throw {
        code: 400,
        message: `resource '${resourceKey}' already exists`,
      };
    }
    mapNameToResource.set(resourceKey, resource);

    mapTypeToResources.set(resource.type, [
      ...getResourcesByType({ type: resource.type }),
      resource,
    ]);

    tap.if(get("hook"), (client) =>
      hookAdd({
        name: client.spec.type,
        hookInstance: client.hook({ resource }),
      })
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
  const getSpecs = () => specs;

  const clients = specs.map((spec) =>
    createClient({
      mapTypeToResources,
      spec,
      config: providerConfig,
      providerName,
    })
  );

  const getClients = () => clients;

  const clientByType = ({ type }) => find(eq(get("spec.type"), type))(clients);

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
          context: contextFromHook({ providerName, hookName, hookType }),
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
                        providerName,
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
                        providerName,
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
                      providerName,
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
              context: contextFromHook({ providerName, hookName, hookType }),
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
            context: contextFromHook({ providerName, hookName, hookType }),
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
            assert(onStateChange);
            assert(hookType);
            assert(onHook);
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
          (results) => ({ error: any(get("error"))(results), results }),
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
          context: contextFromHook({ providerName, hookType, hookName }),
          nextState: "WAITING",
          indent: 2,
        });
      }),
      ({ actions }) =>
        map((action) =>
          onStateChange({
            context: contextFromHookAction({
              providerName,
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
            context: contextFromProvider({ providerName }),
            nextState: "WAITING",
          }),
        () =>
          onStateChange({
            context: contextFromProviderInit({ providerName }),
            nextState: "WAITING",
            indent: 2,
          }),
      ])
    );

  const spinnersStopProvider = ({ onStateChange, error }) =>
    tap(() =>
      onStateChange({
        context: contextFromProvider({ providerName }),
        nextState: nextStateOnError(error),
        error,
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
            `spinnersStartResources ${title}, #resourcesPerType ${size(
              resourcesPerType
            )}`
          );
        }),
        () =>
          onStateChange({
            context: contextFromPlanner({
              providerName,
              title,
              total: resourcesPerType.length,
            }),
            nextState: "WAITING",
            indent: 2,
          }),
        () =>
          onStateChange({
            context: contextFromPlanner({ providerName, title }),
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
            `spinnersStartClient ${title}, #client ${clients.length}`
          );
        }),
        tap(() =>
          onStateChange({
            context: contextFromPlanner({
              providerName,
              title,
              total: clients.length,
            }),
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
  const spinnersStopClient = ({ onStateChange, title, clients, error }) =>
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
            context: contextFromPlanner({ providerName, title }),
            nextState: nextStateOnError(error),
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
      () => [...mapTypeToResources.values()],
      tap((resourcesPerType) => {
        logger.debug("spinnersStartQuery");
      }),
      filter(pipe([first, not(get("spec.listOnly"))])),
      map((resources) => ({
        provider: providerName,
        type: typeFromResources(resources),
        group: groupFromResources(resources),
        resources: map(callProp("toJSON"))(resources),
      })),
      tap((xxx) => {
        assert(true);
      }),
      spinnersStartProvider({ onStateChange }),
      spinnersStartClient({
        onStateChange,
        title: TitleListing,
        clients: filterReadClient({ options, targetTypes: getTargetTypes() })(
          clients
        ),
      }),
      (resourcesPerType) =>
        spinnersStartResources({
          onStateChange,
          title: TitleQuery,
          resourcesPerType,
        })(),
    ])();

  const spinnersStartListLives = ({ onStateChange, options }) =>
    tap(
      pipe([
        tap(() => {
          logger.debug(`spinnersStartListLives ${options.types}`);
        }),
        spinnersStartProvider({ onStateChange }),
        spinnersStartClient({
          onStateChange,
          planQueryDestroy,
          title: TitleListing,
          clients: filterReadClient({ options, targetTypes: getTargetTypes() })(
            clients
          ),
        }),
      ])
    )();

  const spinnersStopListLives = ({ onStateChange, options, error }) =>
    tap(
      pipe([
        tap(() => {
          logger.debug("spinnersStopListLives");
        }),
        spinnersStopClient({
          onStateChange,
          title: TitleListing,
          clients: filterReadClient({ options, targetTypes: getTargetTypes() })(
            clients
          ),
          error,
        }),
        //TODO
        //() => spinnersStopProvider({ onStateChange, error }),
      ])
    )();

  const spinnersStartDeploy = ({ onStateChange, plan }) =>
    tap(
      pipe([
        tap(() => {
          logger.debug("spinnersStartDeploy");
          assert(plan);
        }),
        spinnersStartProvider({ onStateChange }),
        tap(
          switchCase([
            () => isValidPlan(plan.resultCreate),
            pipe([
              tap(() => {
                assert(Array.isArray(plan.resultCreate));
              }),
              spinnersStartResources({
                onStateChange,
                title: TitleDeploying,
                resourcesPerType: planToResourcesPerType({
                  providerName,
                  plans: plan.resultCreate,
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
                  plans: plan.resultDestroy,
                }),
              }),
            ]),
            () => {
              logger.debug("no destroy ");
            },
          ])
        ),
        spinnersStartHooks({
          onStateChange,
          hookType: HookType.ON_DEPLOYED,
        }),
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
        clients: filterReadWriteClient({
          options,
          targetTypes: getTargetTypes(),
        })(clients),
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
      spinnersStartHooks({
        onStateChange,
        hookType: HookType.ON_DESTROYED,
      }),
    ])();
  };

  const spinnersStartHook = ({ onStateChange, hookType }) =>
    pipe([
      tap(() => {
        logger.debug(`spinnersStartHook hookType: ${hookType}`);
        assert(hookType);
      }),
      spinnersStartProvider({ onStateChange }),
      spinnersStartHooks({
        onStateChange,
        hookType,
      }),
    ])();

  const toType = () => type || providerName;

  const register = ({ resources, hooks = [] }) =>
    pipe([
      () => hooks,
      tap(() => {
        logger.debug(`register #hooks ${hooks.length}`);
      }),
      map((hook) =>
        pipe([
          tap(() => {
            assert(isFunction(hook), "hook must be a function.");
          }),
          () =>
            hook({
              resources,
              config: providerConfig,
              provider,
            }),
          tap((hookInstance) => {
            assert(
              !isFunction(hookInstance),
              "hook instance must be not a function."
            );
          }),
          (hookInstance) =>
            pipe([
              () => hookInstance,
              get("name", "default"),
              tap((name) => {
                logger.debug(`register hook ${name}`);
              }),
              (name) => hookAdd({ name, hookInstance }),
            ])(),
          tap(() => {
            logger.debug(`register done`);
          }),
        ])()
      ),
      tap(() => {
        logger.debug(`register done`);
      }),
    ])();

  const getResourcesByType = ({ type }) => mapTypeToResources.get(type) || [];

  const validate = pipe([
    () => [...mapTypeToResources.values()],
    flatten,
    tap((xxx) => {
      logger.debug(``);
    }),
    map(
      tryCatch(
        ({ name, client }) =>
          tap.if(
            () => client.validate,
            () => client.validate({ name })
          )(),
        (error, resource) =>
          pipe([
            tap(() => {
              logger.error(
                `validate error for resource ${resource.toString()} ${tos(
                  error
                )}`
              );
            }),
            () => ({ error, resource: resource.toString() }),
          ])()
      )
    ),
    filter(get("error")),
    tap.if(not(isEmpty), (errors) => {
      logger.error(`validate errors ${tos(errors)}`);
      throw errors;
    }),
  ]);

  const startBase = ({ onStateChange = identity } = {}) =>
    tryCatch(
      pipe([
        tap(() => {
          assert(onStateChange);
          logger.debug(`start`);
        }),
        tap(() =>
          onStateChange({
            context: contextFromProviderInit({ providerName }),
            nextState: "RUNNING",
          })
        ),
        validate,
        start,
        tap(() =>
          onStateChange({
            context: contextFromProviderInit({ providerName }),
            nextState: "DONE",
          })
        ),
        tap(() => {
          logger.debug(`start done`);
        }),
      ]),
      (error) => {
        logger.error(`start error ${tos(convertError({ error }))}`);
        onStateChange({
          context: contextFromProviderInit({ providerName }),
          nextState: "ERROR",
          error: convertError({ error }),
        });
        onStateChange({
          context: contextFromProvider({ providerName }),
          nextState: "ERROR",
        });
        throw error;
      }
    )();

  const decorateLive =
    ({ client, lives }) =>
    (live) =>
      pipe([
        () => live,
        () => ({
          uri: liveToUri({ client, live, lives }),
          name: client.findName({ live, lives }),
          displayName: client.displayName({
            name: client.findName({ live, lives }),
            meta: client.findMeta(live),
          }),
          meta: client.findMeta(live),
          id: client.findId({ live, lives }),
          providerName: client.spec.providerName,
          type: client.spec.type,
          group: client.spec.group,
          live,
          managedByOther: client.managedByOther({ live, lives }),
          cannotBeDeleted: client.cannotBeDeleted({
            live,
            name: client.findName({ live, lives }),
            //TODO remove resourceNames
            resourceNames: resourceNames(),
            resources: getResourcesByType({ type: client.spec.type }),
            resource: getResourceFromLive({ client, live, lives }),
            config: providerConfig,
          }),
        }),
      ])();

  const decorateLives = async ({ result, client, lives }) =>
    switchCase([
      get("error"),
      () => result,
      pipe([
        tap((result) => {}),
        get("items"),
        filter(not(get("error"))),
        map(decorateLive({ client, lives })),
        (resources) => ({
          type: client.spec.type,
          group: client.spec.group,
          resources,
          providerName: client.providerName,
        }),
        tap((xxx) => {
          assert(true);
        }),
      ]),
    ])(result);

  const listLives = async ({
    onStateChange = identity,
    options = {},
    title = TitleListing,
    readWrite = false,
    lives,
  } = {}) =>
    pipe([
      () => getClients(),
      tap((clients) => {
        logger.info(
          `listLives #clients: ${clients.length}, ${JSON.stringify({
            providerName,
            title,
            readWrite,
            options,
          })}`
        );
      }),
      switchCase([
        () => readWrite,
        filterReadWriteClient({ options, targetTypes: getTargetTypes() }),
        filterReadClient({ options, targetTypes: getTargetTypes() }),
      ]),
      tap((clients) => {
        logger.info(`listLives #clients ${size(clients)}`);
      }),
      map((client) => ({
        meta: pick(["type", "group", "providerName"])(client.spec),
        key: `${client.spec.providerName}::${client.spec.group}::${client.spec.type}`,
        dependsOn: map(
          (dependOn) => `${client.spec.providerName}::${dependOn}`
        )(client.spec.dependsOn),
        executor: ({ results }) =>
          pipe([
            () =>
              client.getList({
                lives,
                deep: true,
                resources: getResourcesByType({ type: client.spec.type }),
              }),
            tap((result) => {
              assert(true);
            }),
            (result) =>
              decorateLives({
                result,
                client,
                onStateChange,
                options,
                lives,
              }),
            tap((result) => {
              lives.addResources(result);
            }),
          ])(),
      })),
      (inputs) =>
        Lister({
          inputs,
          onStateChange: ({ key, meta, result, error, ...other }) => {
            assert(key);
            assert(meta.type);
            assert(meta.providerName);
            if (error) {
              lives.addResources({ ...meta, error });
            }
            onStateChange({
              context: contextFromClient({
                client: clientByType({ type: meta.type }),
                title,
              }),
              error,
              ...other,
            });
          },
        }),
      tap((result) => {
        assert(result);
      }),
      //TODO do we still need that ?
      assign({
        results: pipe([
          get("results"),
          filter(
            or([
              and([pipe([get("resources"), not(isEmpty)])]),
              pipe([get("error"), not(isEmpty)]),
            ])
          ),
        ]),
      }),
      tap((result) => {
        assert(result);
      }),
      assign({ providerName: () => providerName }),
      tap(({ results }) => {
        lives.setByProvider({ providerName, livesPerProvider: results });
        logger.debug(
          `listLives provider ${providerName}, ${size(
            results
          )} results: ${pluck("type")(results).join(", ")}`
        );
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
      `filterDestroyResources ${JSON.stringify({
        name,
        all,
        types,
        id,
        managedByUs,
      })}`
    );
    return switchCase([
      // Resource that cannot be deleted
      () => cannotBeDeleted,
      () => {
        logger.debug(
          `filterDestroyResources ${type}/${name}, default resource cannot be deleted`
        );
        return false;
      },
      // Delete all resources
      () => all,
      () => {
        logger.debug(`filterDestroyResources ${type}/${name}, delete all`);
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
        logger.debug(`filterDestroyResources ${type}/${name}, not our minion`);
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
    lives,
  }) =>
    pipe([
      tap(() => {
        logger.info(
          `planFindDestroy ${JSON.stringify({ options, direction })}`
        );
        assert(lives);
      }),
      () => lives.getByProvider({ providerName }),
      tap((livesPerProvider) => {
        assert(livesPerProvider);
      }),
      filter(not(get("error"))),
      flatMap(({ type, resources }) =>
        pipe([
          tap(() => {
            assert(type);
            assert(Array.isArray(resources), `no resources for type ${type}`);
          }),
          () => clientByType({ type }),
          (client) =>
            pipe([
              () => resources,
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
            ])(),
        ])()
      ),
      tap((results) => {
        assert(results);
      }),
      filter(not(isEmpty)),
      tap((results) => {
        logger.debug(`planFindDestroy`);
      }),
    ])();

  const planQueryDestroy = async ({ options = {}, lives }) =>
    pipe([
      tap(() => {
        logger.info(
          `planQueryDestroy ${JSON.stringify({ providerName, options })}`
        );
        assert(lives);
      }),
      () => ({ providerName }),
      tap((result) => {
        assert(result);
      }),
      assign({
        //TODO
        plans: () => planFindDestroy({ options, lives }),
      }),
      assign({ error: any(get("error")) }),
      tap((result) => {
        logger.debug(`planQueryDestroy done`);
      }),
    ])();

  const planUpsert = async ({ onStateChange = noop, lives }) =>
    pipe([
      tap(() => {
        logger.info(`planUpsert`);
        assert(lives);
      }),
      tap(() =>
        onStateChange({
          context: contextFromPlanner({
            providerName: providerName,
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
        assert(result);
      }),
      tap((plans) =>
        onStateChange({
          context: contextFromPlanner({ providerName, title: TitleQuery }),
          nextState: nextStateOnError(hasResultError(plans)),
        })
      ),
      tap((result) => {
        logger.info(`planUpsert done`);
      }),
    ])();

  const planQuery = async ({
    onStateChange = identity,
    commandOptions = {},
    lives,
  } = {}) =>
    pipe([
      tap(() => {
        logger.info(`planQuery begins ${providerName}`);
        assert(lives);
      }),
      providerRunning({ onStateChange, providerName }),
      () => ({ providerName }),
      assign({
        resultDestroy: () =>
          planFindDestroy({
            direction: PlanDirection.UP,
            options: commandOptions,
            lives,
          }),
      }),
      assign({
        resultCreate: () =>
          planUpsert({
            onStateChange,
            lives,
          }),
      }),
      tap((result) => {
        assert(result);
      }),
      assign({ error: any(get("error")) }),
      tap((result) => {
        assert(result);
      }),
      tap(({ error }) =>
        onStateChange({
          context: contextFromProvider({ providerName }),
          nextState: nextStateOnError(error),
        })
      ),
      tap((result) => {
        logger.debug(`planQuery done ${providerName}`);
      }),
    ])({});

  const planApply = async ({ plan, lives, onStateChange = identity }) =>
    pipe([
      tap(() => {
        assert(plan);
        assert(lives);
        logger.info(`Apply Plan ${providerName}`);
      }),
      providerRunning({ onStateChange, providerName }),
      assign({
        resultDestroy: switchCase([
          () => isValidPlan(plan.resultDestroy),
          () =>
            planDestroy({
              plans: plan.resultDestroy,
              onStateChange,
              direction: PlanDirection.UP,
              title: TitleDestroying,
              lives,
            }),
          () => ({ error: false, results: [], plans: [] }),
        ]),
      }),
      assign({
        resultCreate: switchCase([
          () => isValidPlan(plan.resultCreate),
          pipe([
            () =>
              upsertResources({
                plans: plan.resultCreate,
                onStateChange,
                title: TitleDeploying,
                lives,
              }),
          ]),
          () => ({ error: false, plans: [] }),
        ]),
      }),
      tap((result) => {
        assert(result);
      }),
      (result) => ({
        providerName,
        lives,
        error: result.resultCreate.error || result.resultDestroy.error,
        resultCreate: result.resultCreate,
        resultDestroy: result.resultDestroy,
      }),
      tap((result) =>
        forEach((client) => {
          //TODO Refactor and
          client.onDeployed && client.onDeployed(result);
        })(getClients())
      ),
      tap((result) => {
        logger.info(`Apply done`);
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
  const upsertResources = async ({ plans, onStateChange, title, lives }) => {
    assert(onStateChange);
    assert(title);
    assert(Array.isArray(plans));
    assert(lives);

    const executor = async ({ item }) => {
      const { resource, live, action, diff } = item;
      const engine = getResource(resource);
      assert(engine, `Cannot find resource ${tos(resource)}`);
      const resolvedDependencies = await engine.resolveDependencies({
        lives,
        dependenciesMustBeUp: true,
      });
      const input = await engine.resolveConfig({
        live,
        resolvedDependencies,
        lives,
        deep: true,
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
            lives,
          }),
        }),
        () => action === "CREATE",
        pipe([
          async () => ({
            input,
            output: await engine.create({
              payload: input,
              resolvedDependencies,
              lives,
            }),
          }),
          tap(({ output }) => {
            lives.addResource({
              providerName,
              type: engine.type,
              live: output,
            });
          }),
        ]),
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
        tap((result) =>
          onStateChange({
            context: contextFromPlanner({ providerName, title }),
            nextState: nextStateOnError(result.error),
          })
        ),
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
        //assert(name);
      }),
      () => client.findId({ live, lives }),
      tap((id) => {
        assert(id, `destroyByClient missing id in live: ${tos(live)}`);
      }),
      (id) =>
        pipe([
          () => resourcesPerType,
          tap((params) => {
            assert(true);
          }),
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
              config: provider.config,
            })
          ),
        ])(),
      tap(() => {
        logger.info(
          `destroyByClient: DONE ${JSON.stringify({
            type: client.spec.type,
            name,
          })}`
        );
      }),
    ])();

  const destroyById = async ({ resource, live, lives }) =>
    pipe([
      tap(() => {
        assert(live);
        assert(lives);
        assert(resource);
        logger.debug(`destroyById: ${tos(resource.toString())}`);
      }),
      () => clientByType(resource),
      tap((client) => {
        assert(client, `Cannot find endpoint ${resource.toString()}}`);
        assert(client.spec);
      }),
      (client) =>
        destroyByClient({
          client,
          name: resource.name,
          meta: resource.meta,
          live,
          lives,
          resourcesPerType: getResourcesByType(resource),
        }),
    ])();

  const planDestroy = async ({
    plans,
    onStateChange = identity,
    direction = PlanDirection.DOWN,
    lives,
  }) =>
    pipe([
      tap(() => {
        assert(Array.isArray(plans), "plans must be an array");
        logger.info(`planDestroy #plans ${plans.length}`);
        logger.debug(`planDestroy ${tos({ plans, direction })}`);
        assert(lives);
      }),
      providerRunning({ onStateChange, providerName }),
      tap(() =>
        onStateChange({
          context: contextFromPlanner({
            providerName,
            title: TitleDestroying,
          }),
          nextState: "RUNNING",
        })
      ),
      () =>
        Planner({
          plans: plans,
          dependsOnType: getSpecs(),
          dependsOnInstance: mapToGraph(getMapNameToResource()),
          executor: ({ item }) =>
            destroyById({
              resource: item.resource,
              live: item.live,
              lives,
            }),
          down: true,
          onStateChange: onStateChangeResource({
            operation: TitleDestroying,
            onStateChange,
          }),
        }),
      (planner) => planner.run(),
      tap((xxx) => {
        assert(xxx);
      }),
      tap(({ error }) =>
        onStateChange({
          context: contextFromPlanner({ providerName, title: TitleDestroying }),
          nextState: nextStateOnError(error),
        })
      ),
    ])();

  const toString = () => ({ name: providerName, type: toType() });

  const provider = {
    toString,
    get config() {
      return providerConfig;
    },
    name: providerName,
    dependencies,
    type: toType,
    getResourceFromLive,
    spinnersStopProvider,
    spinnersStartHook,
    spinnersStartQuery,
    spinnersStartDeploy,
    spinnersStartListLives,
    spinnersStopListLives,
    spinnersStartDestroyQuery,
    spinnersStartDestroy,
    planQueryDestroy,
    planDestroy,
    planFindDestroy,
    listLives,
    planQuery,
    planApply,
    listTargets,
    listConfig,
    targetResourcesAdd,
    clientByType,
    getResource,
    resourceNames,
    getResourcesByType,
    getTargetResources,
    getClients,
    register,
    runOnDeployed,
    runOnDestroyed,
    hookAdd,
    info: pipe([
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
    specs,
    mapNameToResource,
  };

  return pipe([
    () => ({
      ...provider,
      get config() {
        return providerConfig;
      },
    }),
    defaultsDeep(
      createResourceMakers({ provider, config: providerConfig, specs })
    ),
    defaultsDeep(
      createResourceMakersListOnly({ provider, config: providerConfig, specs })
    ),
    tap((xxx) => {
      assert(true);
    }),
  ])();
}

module.exports = CoreProvider;
