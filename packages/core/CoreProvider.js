const assert = require("assert");
const { camelCase } = require("change-case");

const {
  pipe,
  tap,
  map,
  flatMap,
  filter,
  tryCatch,
  switchCase,
  set,
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
  uniq,
  prepend,
  unless,
} = require("rubico/x");

const logger = require("./logger")({ prefix: "CoreProvider" });
const { tos } = require("./tos");
const { checkConfig, checkEnv } = require("./Utils");
const { createSpec } = require("./SpecDefault");
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
  providerRunning,
  findClient,
} = require("./ProviderCommon");

const { createClient, decorateLive } = require("./CoreResource");
const { createLives } = require("./Lives");

const createResourceMakers = ({
  specs,
  provider,
  filterResource = identity,
  prefix,
  programOptions,
}) =>
  pipe([
    () => specs,
    filter(filterResource),
    reduce(
      (acc, spec) =>
        set(
          `${spec.group ? `${spec.group}.` : ""}${prefix}${spec.type}`,
          spec[`${prefix}Resource`]({
            provider,
            spec,
            programOptions,
          })
        )(acc),
      {}
    ),
    tap((params) => {
      assert(true);
    }),
  ])();

const buildProviderConfig = ({ config = {}, providerName }) =>
  pipe([
    () => config,
    defaultsDeep({ providerName }),
    defaultsDeep(configProviderDefault),
  ])();

exports.buildProviderConfig = buildProviderConfig;

function CoreProvider({
  name: providerName,
  dependencies = {},
  type,
  programOptions = {},
  mandatoryEnvs = [],
  mandatoryConfigKeys = [],
  fnSpecs,
  makeConfig,
  info = () => ({}),
  init = () => {},
  unInit = () => {},
  start = () => {},
  generateCode = () => {},
}) {
  assert(makeConfig);
  let _lives;
  const setLives = (livesToSet) => {
    _lives = livesToSet;
  };
  const getProgramOptions = () =>
    pipe([
      () => programOptions,
      defaultsDeep({ workingDirectory: process.cwd() }),
    ])();

  const getLives = pipe([
    () => _lives,
    //TODO rubico when
    switchCase([isEmpty, pipe([() => createLives(), tap(setLives)]), identity]),
  ]);

  const getProviderConfig = () =>
    buildProviderConfig({ config: makeConfig(), providerName });

  logger.debug(`CoreProvider name: ${providerName}, type ${type}`);

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

  const getResourceFromLive = ({ uri }) =>
    pipe([
      tap(() => {
        assert(uri);
      }),
      () => mapNameToResource.get(uri),
      tap((resource) => {
        logger.debug(
          `getResourceFromLive uri: ${uri}, hasResource: ${!!resource}`
        );
      }),
    ])();

  const mapTypeToResources = new Map();
  let resourcesObj = {};
  const getTargetGroupTypes = pipe([
    () => [...mapTypeToResources.keys()],
    tap((params) => {
      assert(true);
    }),
    map(
      pipe([
        JSON.parse,
        ({ group, type }) => `${group}::${type}`,
        tap((params) => {
          assert(true);
        }),
      ])
    ),
    tap((params) => {
      assert(true);
    }),
  ]);

  const targetResourcesAdd = (resource) => {
    assert(resource.spec.providerName);
    const { type, group, name, spec } = resource;
    assert(name);
    assert(type);
    const resourceKey = resource.toString();
    logger.debug(`targetResourcesAdd ${resourceKey}`);
    if (mapNameToResource.has(resourceKey) && !spec.listOnly) {
      throw {
        code: 400,
        message: `resource '${resourceKey}' already exists`,
      };
    }
    const resourceVarName = camelCase(name);
    resourcesObj = set(
      `${group ? `${group}.` : ""}${type}.${resourceVarName}`,
      resource
    )(resourcesObj);

    mapNameToResource.set(resourceKey, resource);

    mapTypeToResources.set(
      JSON.stringify({ type: resource.type, group: resource.group }),
      [...getResourcesByType(resource), resource]
    );

    tap.if(get("hook"), (client) =>
      hookAdd({
        name: client.spec.type,
        hookInstance: client.hook({ resource }),
      })
    )(resource.client);
  };

  const getTargetResources = () => [...mapNameToResource.values()];

  const getResource = pipe([
    get("uri"),
    tap((uri) => {
      assert(uri, "getResource no uri");
    }),
    (uri) => mapNameToResource.get(uri),
  ]);

  const getSpecs = () =>
    pipe([
      () => fnSpecs(getProviderConfig()),
      map(createSpec({ config: getProviderConfig() })),
      tap((params) => {
        assert(true);
      }),
    ])();

  const getResourcesByType = ({ type, group }) =>
    pipe([
      tap(() => {
        assert(type);
        //assert(group);
      }),
      () => mapTypeToResources.get(JSON.stringify({ type, group })) || [],
      tap((params) => {
        assert(true);
      }),
    ])();

  const getClients = pipe([
    getProviderConfig,
    (providerConfig) =>
      pipe([
        getSpecs,
        map((spec) =>
          createClient({
            getResourcesByType,
            getResourceFromLive,
            spec,
            config: providerConfig,
            providerName,
          })
        ),
      ])(),
  ]);
  //TODO refactor no curry

  const clientByType = pipe([
    getClients,
    findClient,
    tap((params) => {
      assert(true);
    }),
  ]);

  const listTargets = () =>
    pipe([
      () => getTargetResources(),
      map(async (resource) => ({
        ...resource.toJSON(),
        data: await resource.getLive(),
      })),
      filter(get("data")),
      tap((list) => {
        logger.debug(`listTargets ${tos(list)}`);
      }),
    ])();

  const listConfig = () =>
    pipe([
      () => getTargetResources(),
      map((resource) => ({
        resource: resource.toJSON(),
      })),
      tap((list) => {
        logger.debug(`listConfig ${tos(list)}`);
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
                  //TODO tap.if
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
        () => clients,
        map((client) =>
          onStateChange({
            context: contextFromClient({ client, title }),
            nextState: "WAITING",
            indent: 4,
          })
        ),
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
        logger.debug(
          `spinnersStartQuery #resourcesPerType ${size(resourcesPerType)}`
        );
      }),
      map(filter(not(get("spec.listOnly")))),
      filter(not(isEmpty)),
      tap((resourcesPerType) => {
        logger.debug(
          `spinnersStartQuery #resourcesPerType no listOnly ${size(
            resourcesPerType
          )}`
        );
      }),
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
        clients: filterReadClient({
          options,
          targetTypes: getTargetGroupTypes(),
        })(getClients()),
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
          clients: filterReadClient({
            options,
            targetTypes: getTargetGroupTypes(),
          })(getClients()),
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
          clients: filterReadClient({
            options,
            targetTypes: getTargetGroupTypes(),
          })(getClients()),
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
        logger.debug(`spinnersStartDestroyQuery`);
      }),
      spinnersStartProvider({ onStateChange }),
      spinnersStartClient({
        onStateChange,
        title: TitleListing,
        clients: filterReadWriteClient({
          options,
          targetTypes: getTargetGroupTypes(),
        })(getClients()),
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
              config: getProviderConfig(),
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

  const findClientByGroupType = (clients) => (groupType) =>
    pipe([
      tap(() => {
        assert(clients);
        assert(groupType);
      }),
      () => clients,
      find(eq(get("spec.groupType"), groupType)),
      tap((params) => {
        assert(true);
      }),
    ])();

  const findClientDependencies = (clients) => (client) =>
    pipe([
      tap(() => {
        assert(clients);
        assert(client);
      }),
      () => client,
      get("spec.dependsOn", []),
      map(findClientByGroupType(clients)),
      filter(not(isEmpty)),
      flatMap(findClientDependencies(clients)),
      prepend(client),
    ])();

  const addDependentClients = (clients) =>
    pipe([
      () => clients,
      flatMap(findClientDependencies(clients)),
      filter(not(isEmpty)),
      uniq,
    ])();

  const listLives = ({
    onStateChange = identity,
    options = {},
    title = TitleListing,
    readWrite = false,
  } = {}) =>
    pipe([
      tap(() => {}),
      getClients,
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
        filterReadWriteClient({ options, targetTypes: getTargetGroupTypes() }),
        filterReadClient({ options, targetTypes: getTargetGroupTypes() }),
      ]),
      addDependentClients,
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
              client.getLives({
                lives: getLives(),
                deep: true,
                options,
                resources: getResourcesByType(client.spec),
              }),
            //TODO add client.toString()
            ({ error, resources }) => ({
              ...(error && { error }),
              resources,
              groupType: client.spec.groupType,
              type: client.spec.type,
              group: client.spec.group,
              providerName: client.providerName,
            }),
            tap((result) => {
              getLives().addResources(result);
            }),
          ])(),
      })),
      (inputs) =>
        Lister({
          inputs,
          onStateChange: ({ key, meta, result, error, ...other }) => {
            assert(key);
            assert(meta.type);
            //assert(meta.group);

            assert(meta.providerName);
            if (error) {
              getLives().addResources({ ...meta, error });
            }
            const client = clientByType()(meta);
            assert(client.spec);
            onStateChange({
              context: contextFromClient({
                client,
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
      assign({
        results: pipe([
          get("results"),
          unless(
            isEmpty,
            callProp("sort", (a, b) => a.groupType.localeCompare(b.groupType))
          ),
        ]),
      }),
      tap((result) => {
        assert(result);
      }),
      assign({ providerName: () => providerName }),
      tap(({ results }) => {
        getLives().setByProvider({ providerName, livesPerProvider: results });
        logger.debug(
          `listLives provider ${providerName}, ${size(
            results
          )} results: ${pluck("type")(results).join(", ")}`
        );
      }),
    ])();

  const filterDestroyResources =
    ({
      client,
      options: {
        all = false,
        name: nameToDelete = "",
        id: idToDelete = "",
        types = [],
      } = {},
      direction,
    }) =>
    (resource) => {
      const { spec } = client;
      const { type } = spec;
      const { name, id, cannotBeDeleted, managedByUs, managedByOther } =
        resource;

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
        // ManagedByOther
        () => managedByOther,
        () => false,
        // Delete by id
        () => !isEmpty(idToDelete),
        () => id === idToDelete,
        // Delete by name
        () => !isEmpty(nameToDelete),
        () => name === nameToDelete,
        // Not our minion
        () => !managedByUs,
        () => {
          logger.debug(
            `filterDestroyResources ${type}/${name}, not our minion`
          );
          return false;
        },
        // Delete by type
        () => !isEmpty(types),
        pipe([
          () => types,
          any((type) => isTypeMatch({ type, typeToMatch: spec.type })),
          tap((params) => {
            assert(true);
          }),
        ]),
        // PlanDirection
        () => direction == PlanDirection.UP,
        () => false,
        () => true,
      ])();
    };

  const planFindDestroy = ({ options = {}, direction = PlanDirection.DOWN }) =>
    pipe([
      tap(() => {
        logger.info(
          `planFindDestroy ${JSON.stringify({ options, direction })}`
        );
      }),
      () => getLives().getByProvider({ providerName }),
      tap((livesPerProvider) => {
        assert(livesPerProvider);
      }),
      filter(not(get("error"))),
      flatMap(({ type, group, resources }) =>
        pipe([
          tap(() => {
            assert(type);
            assert(Array.isArray(resources), `no resources for type ${type}`);
          }),
          () => clientByType()({ type, group }),
          (client) =>
            pipe([
              () => resources,
              filter(
                filterDestroyResources({
                  client,
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

  const planQueryDestroy = ({ options = {} }) =>
    pipe([
      tap(() => {
        logger.info(
          `planQueryDestroy ${JSON.stringify({ providerName, options })}`
        );
      }),
      () => ({ providerName }),
      tap((result) => {
        assert(result);
      }),
      assign({
        //TODO
        plans: () => planFindDestroy({ options }),
      }),
      assign({ error: any(get("error")) }),
      tap((result) => {
        logger.debug(`planQueryDestroy done`);
      }),
    ])();

  const planUpsert = ({ onStateChange = noop }) =>
    pipe([
      tap(() => {
        logger.info(`planUpsert`);
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
            const actions = await resource.planUpsert({ resource });
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

  const planQuery = ({ onStateChange = identity, commandOptions = {} } = {}) =>
    pipe([
      tap(() => {
        logger.info(`planQuery begins ${providerName}`);
      }),
      providerRunning({ onStateChange, providerName }),
      () => ({ providerName }),
      assign({
        resultDestroy: () =>
          planFindDestroy({
            direction: PlanDirection.UP,
            options: commandOptions,
          }),
      }),
      assign({
        resultCreate: () =>
          planUpsert({
            onStateChange,
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

  const planApply = ({ plan, onStateChange = identity }) =>
    pipe([
      tap(() => {
        assert(plan);
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
        lives: getLives(),
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
      // logger.debug(
      //   `onStateChangeResource resource:${tos(resource)}, ${tos(other)}`
      // );

      assert(resource, "no resource");
      assert(resource.type, "no resource.type");

      onStateChange({
        context: contextFromResource({ operation, resource }),
        error,
        ...other,
      });
    };
  };
  const upsertResources = ({ plans, onStateChange, title }) => {
    assert(onStateChange);
    assert(title);
    assert(Array.isArray(plans));

    const executor = async ({ item: { resource, live, action, diff } }) =>
      pipe([
        tap(() => {
          assert(resource);
          assert(resource.type);
          assert(resource.name);
          logger.debug(
            `upsertResources: executor ${resource.type} ${resource.name}, action: ${action}`
          );
        }),
        () => ({}),
        assign({ engine: () => getResource(resource) }),
        tap(({ engine }) => {
          assert(engine, `Cannot find resource ${tos(resource)}`);
        }),
        assign({
          resolvedDependencies: ({ engine }) =>
            engine.resolveDependencies({
              dependenciesMustBeUp: true,
            }),
        }),
        tap(({ resolvedDependencies }) => {
          logger.debug(
            `upsertResources: ${resource.name} ${tos({
              resolvedDependencies,
            })}`
          );
        }),
        assign({
          input: ({ engine, resolvedDependencies }) =>
            engine.resolveConfig({
              live,
              resolvedDependencies,
              deep: true,
            }),
        }),
        assign({
          output: switchCase([
            eq(action, "UPDATE"),
            ({ engine, input, resolvedDependencies }) =>
              engine.update({
                payload: input,
                live,
                diff,
                resolvedDependencies,
                lives: getLives(),
              }),
            eq(action, "CREATE"),
            ({ engine, input, resolvedDependencies }) =>
              pipe([
                () =>
                  engine.create({
                    payload: input,
                    resolvedDependencies,
                    lives: getLives(),
                  }),

                tap((live) => {
                  //assert(live);
                }),
                decorateLive({
                  client: engine.client,
                  lives: getLives(),
                  config: getProviderConfig(),
                }),
                tap((resource) => {
                  getLives().addResource({
                    providerName,
                    type: engine.type,
                    group: engine.group,
                    resource,
                  });
                }),
              ])(),
            () => assert("action is not handled"),
          ]),
        }),

        pick(["input", "output"]),
        tap((params) => {
          assert(true);
        }),
      ])();

    //TODO try catch
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
        callProp("run"),
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

  const destroyByClient = ({
    client,
    name,
    meta,
    resourcesPerType = [],
    live,
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
        //assert(name);
      }),
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
          name: `destroy ${client.spec.type}/${name}`,
          fn: () =>
            client.destroy({
              live,
              id: client.findId({ live, lives: getLives() }), // TODO remove id, only use live
              name,
              meta,
              resource,
              lives: getLives(),
            }),
          isExpectedResult: () => true,
          shouldRetryOnException: client.shouldRetryOnExceptionDelete,
          config: getProviderConfig(),
        })
      ),
      tap(() => {
        logger.info(
          `destroyByClient: DONE ${JSON.stringify({
            type: client.spec.type,
            name,
          })}`
        );
      }),
    ])();

  const destroyById = ({ resource, live }) =>
    pipe([
      tap(() => {
        assert(live);
        assert(resource);
        logger.debug(`destroyById: ${tos(resource.toString())}`);
      }),
      () => clientByType()(resource),
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
          resourcesPerType: getResourcesByType(resource),
        }),
    ])();

  const planDestroy = ({
    plans,
    onStateChange = identity,
    direction = PlanDirection.DOWN,
  }) =>
    pipe([
      tap(() => {
        assert(Array.isArray(plans), "plans must be an array");
        logger.info(`planDestroy #plans ${plans.length}`);
        logger.debug(`planDestroy ${tos({ plans, direction })}`);
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
            }),
          down: true,
          onStateChange: onStateChangeResource({
            operation: TitleDestroying,
            onStateChange,
          }),
        }),
      callProp("run"),
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
      return getProviderConfig();
    },
    getConfig: getProviderConfig,
    setLives,
    get lives() {
      return getLives();
    },
    resources: () => resourcesObj,
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
        stage: getProviderConfig().stage,
        ...info(),
      }),
      tap((info) => {
        logger.debug(`info  ${tos(info)}`);
      }),
    ]),
    init,
    unInit,
    start: startBase,
    specs: getSpecs(),
    mapNameToResource,
    generateCode,
  };

  return pipe([
    () => provider,
    defaultsDeep(
      createResourceMakers({
        provider,
        specs: getSpecs(),
        prefix: "make",
        filterResource: not(get("listOnly")),
        programOptions: getProgramOptions(),
      })
    ),
    defaultsDeep(
      createResourceMakers({
        provider,
        specs: getSpecs(),
        prefix: "use",
        programOptions: getProgramOptions(),
      })
    ),
    defaultsDeep(
      createResourceMakers({
        provider,
        specs: getSpecs(),
        prefix: "useDefault",
        programOptions: getProgramOptions(),
      })
    ),
  ])();
}

module.exports = CoreProvider;
