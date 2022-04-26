const assert = require("assert");

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
  or,
  reduce,
  eq,
  not,
  pick,
  omit,
  and,
} = require("rubico");

const {
  isEmpty,
  when,
  callProp,
  flatten,
  pluck,
  forEach,
  find,
  defaultsDeep,
  isFunction,
  identity,
  size,
  append,
  unless,
  groupBy,
  prepend,
  values,
} = require("rubico/x");
const fs = require("fs").promises;
const util = require("util");
const logger = require("./logger")({ prefix: "CoreProvider" });
const { tos } = require("./tos");
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
} = require("./ProviderCommon");
const { ResourceMaker } = require("./CoreResource");

const { createClient, decorateLive, buildGroupType } = require("./Client");
const { createLives } = require("./Lives");

const groupName = switchCase([isEmpty, () => "", pipe([append(".")])]);

const createResourceMakers = ({
  specs,
  provider,
  filterResource = identity,
  prefix,
  programOptions,
}) =>
  pipe([
    tap((params) => {
      assert(true);
    }),
    () => specs,
    filter(filterResource),
    reduce(
      (acc, spec) =>
        set(
          `${groupName(spec.group)}${prefix}${spec.type}`,
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

const getListHofDefault = ({ getList, spec }) =>
  tryCatch(
    pipe([
      tap(() => {
        logger.debug(`getList ${spec.groupType}`);
        assert(getList);
      }),
      getList,
      tap((items) => {
        if (!Array.isArray(items)) {
          assert(Array.isArray(items), JSON.stringify(spec));
        }
      }),
      (items) => ({ items, total: size(items) }),
      tap(({ total }) => {
        logger.debug(`getList ${spec.groupType} ${total}`);
      }),
    ]),
    (error, params) =>
      pipe([
        tap(() => {
          logger.error(
            `getList ${spec.groupType}, error: ${JSON.stringify({
              params,
              error,
            })}`
          );
        }),
        () => {
          throw error;
        },
      ])()
  );

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
  getListHof = getListHofDefault,
  filterClient = () => true,
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
    when(isEmpty, pipe([createLives, tap(setLives)])),
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
          cleanUp: () => {},
          actions: [],
        },
        onDestroyed: {
          init: () => {},
          cleanUp: () => {},
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
  const mapTypeToResources = new Map();
  let resourcesObj = {};
  const resourcesSet = new Set();
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

  const targetResourcesAdd = (resource) =>
    pipe([
      tap(() => {
        resourcesSet.add(resource);
      }),
    ])();

  const targetResourceAddToMap = (resource) => {
    assert(resource.spec.providerName);
    const { type, group, name, spec } = resource;
    assert(name);
    assert(type);
    assert(spec.groupType);
    const resourceKey = resource.toString();
    logger.debug(`targetResourceAddToMap ${resourceKey}`);
    if (mapNameToResource.has(resourceKey)) {
      if (spec.listOnly) {
        return;
      }
      logger.debug(`resource '${resourceKey}' already exists`);
    }

    resourcesObj = set(
      filter(not(isEmpty))([group, type, name]),
      resource
    )(resourcesObj);

    mapNameToResource.set(resourceKey, resource);
    const resourcesByType = getResourcesByType(resource);
    assert(resourcesByType);
    mapTypeToResources.set(
      JSON.stringify({ type: resource.type, group: resource.group }),
      [...filter(not(eq(get("name"), name)))(resourcesByType), resource]
    );

    tap.if(get("hook"), (client) =>
      hookAdd({
        name: client.spec.type,
        hookInstance: client.hook({ resource }),
      })
    )(resource.client);
  };

  const targetResourceAdd = (resource) =>
    pipe([
      tap((params) => {
        assert(true);
      }),
      () => targetResourceAddToMap(resource),
    ])();

  const findSpecByGroupType = ({ type, group }) =>
    pipe([
      tap((params) => {
        assert(true);
      }),
      find(and([eq(get("type"), type), eq(get("group"), group)])),
      tap((spec) => {
        assert(spec, `cannot find type:${type}, group ${group}`);
      }),
    ]);

  const targetResourcesBuildMap = (resourcesSpec = []) =>
    pipe([
      tap(() => {
        assert(resourcesSpec);
      }),
      () => resourcesSpec,
      map(({ type, group, ...other }) =>
        pipe([
          tap(() => {
            assert(type);
            assert(other);
          }),
          getSpecs,
          findSpecByGroupType({ type, group }),
          tap((params) => {
            assert(true);
          }),
          (spec) => ({ ...other, provider, programOptions, spec }),
          ResourceMaker,
          tap((params) => {
            assert(true);
          }),
          targetResourcesAdd,
        ])()
      ),
      //TODO remove below
      () => resourcesSet,
      tap((params) => {
        assert(true);
      }),
      forEach(tryCatch(targetResourceAdd, () => undefined)),
      tap((params) => {
        assert(true);
      }),
      //TODO use dependencies
      () => resourcesSet,
      forEach(targetResourceAdd),
    ])();

  const getTargetResources = () => [...mapNameToResource.values()];

  const getResourceByName = pipe([
    tap((uri) => {
      assert(uri, "getResource no uri");
    }),
    (name) =>
      pipe([
        () => mapNameToResource.get(name),
        tap((resource) => {
          if (!resource) {
            assert(
              false,
              `no resource for ${name}, available resources:\n${[
                ...mapNameToResource.keys(),
              ].join("\n")} )}`
            );
          }
        }),
      ])(),
  ]);

  const getResource = pipe([get("uri"), getResourceByName]);

  const getSpecs = pipe([
    getProviderConfig,
    fnSpecs,
    map(createSpec({ config: getProviderConfig() })),
    tap((params) => {
      assert(true);
    }),
  ]);

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

  const createClientFromSpec = (spec) =>
    createClient({
      getTargetResources,
      getResourcesByType,
      getResourceFromLive,
      spec,
      config: getProviderConfig(),
      providerName,
      getListHof,
      lives: getLives(),
    });

  const getClients = pipe([
    getSpecs,
    map(createClientFromSpec),
    filter(filterClient),
    tap((clients) => {
      logger.debug(`#client ${size(clients)}`);
    }),
  ]);

  const getClient = ({ groupType }) =>
    pipe([
      tap(() => {
        assert(groupType);
      }),
      getSpecs,
      tap((params) => {
        assert(true);
      }),
      find(eq(get("groupType"), groupType)),
      tap((spec) => {
        assert(spec, `no ${groupType}`);
      }),
      createClientFromSpec,
      tap((params) => {
        assert(true);
      }),
    ])();

  const listTargets = () =>
    pipe([
      getTargetResources,
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
      getTargetResources,
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
          ({ actions, payload, cleanUp }) =>
            pipe([
              () => actions,
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
                    tap((action) => {
                      assert(action.command);
                    }),
                    tap(callProp("command", payload)),
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
              ),
              tap((params) => {
                assert(true);
              }),
              tap(() => cleanUp(payload)),
            ])(),
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
  const spinnersStartClient = ({ onStateChange, title, specs }) =>
    tap(
      pipe([
        tap(() => {
          assert(title, "title");
          assert(Array.isArray(specs), "specs must be an array");
          logger.info(`spinnersStartClient ${title}, #specs ${size(specs)}`);
        }),
        tap(() =>
          onStateChange({
            context: contextFromPlanner({
              providerName,
              title,
              total: size(specs),
            }),
            nextState: "WAITING",
            indent: 2,
          })
        ),
        () => specs,
        map((spec) =>
          onStateChange({
            context: contextFromClient({ spec, title }),
            nextState: "WAITING",
            indent: 4,
          })
        ),
      ])
    );
  const spinnersStopClient = ({ onStateChange, title, error }) =>
    tap(
      pipe([
        tap(() => {
          assert(title, "title");
          logger.info(`spinnersStopClient ${title}, error: ${error}`);
        }),
        tap(() =>
          onStateChange({
            context: contextFromPlanner({ providerName, title }),
            nextState: nextStateOnError(error),
            error,
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
      map(assign({ groupType: buildGroupType })),
      callProp("sort", (a, b) => a.groupType.localeCompare(b.groupType)),
      tap((xxx) => {
        assert(true);
      }),
      spinnersStartProvider({ onStateChange }),
      spinnersStartClient({
        onStateChange,
        title: TitleListing,
        specs: filterReadClient({
          options,
          targetTypes: getTargetGroupTypes(),
        })(getSpecs()),
      }),
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
          specs: filterReadClient({
            options,
            targetTypes: getTargetGroupTypes(),
          })(getSpecs()),
        }),
      ])
    )();

  const spinnersStopListLives = ({ onStateChange, options, error }) =>
    tap(
      pipe([
        tap(() => {
          logger.debug(`spinnersStopListLives ${error}`);
        }),
        spinnersStopClient({
          onStateChange,
          title: TitleListing,
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
        specs: filterReadWriteClient({
          options,
          targetTypes: getTargetGroupTypes(),
        })(getSpecs()),
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
        logger.debug(`register #hooks ${size(hooks)}`);
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
        ({ name, getClient }) =>
          tap.if(
            () => getClient().validate,
            () => getClient().validate({ name })
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
          logger.debug(`start`);
        }),
        tap(() =>
          onStateChange({
            context: contextFromProviderInit({ providerName }),
            nextState: "RUNNING",
          })
        ),
        start,
        validate,
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

  const sortResources = callProp("sort", (a, b) =>
    pipe([
      tap(() => {
        // assert(a);
        // assert(a.name.localeCompare);
        // assert(a.name);
        // assert(b);
        // assert(b.name);
      }),
      () => a.name.localeCompare(b.name),
    ])()
  );

  const listLives = ({
    onStateChange = identity,
    options = {},
    title = TitleListing,
    readWrite = false,
  } = {}) =>
    pipe([
      tap(() => {}),
      getSpecs,
      tap((clients) => {
        logger.info(
          `listLives #clients: ${size(clients)}, ${JSON.stringify({
            providerName,
            title,
            readWrite,
            options,
          })}`
        );
      }),
      switchCase([
        () => readWrite,
        filterReadWriteClient({
          options,
          targetTypes: getTargetGroupTypes(),
        }),
        filterReadClient({
          options,
          targetTypes: getTargetGroupTypes(),
        }),
      ]),
      tap((clients) => {
        logger.info(`listLives #clients ${size(clients)}`);
      }),
      map((spec) => ({
        meta: pick(["type", "group", "groupType", "providerName"])(spec),
        key: `${spec.providerName}::${spec.groupType}`,
        dependsOn: pipe([
          () => spec,
          get("dependsOnList", []),
          map((dependOn) => `${spec.providerName}::${dependOn}`),
        ])(),
        executor: ({ results }) =>
          pipe([
            () => spec,
            getClient,
            (client) =>
              client.getLives({
                lives: getLives(),
                deep: true,
                options,
                resources: getResourcesByType(spec),
              }),
            //TODO add client.toString()
            ({ error, resources }) => ({
              ...(error && { error }),
              resources,
              groupType: spec.groupType,
              type: spec.type,
              group: spec.group,
              providerName: spec.providerName,
            }),
            tap(({ groupType, type }) => {
              assert(type);
              assert(groupType);
            }),
          ])(),
      })),
      tap((params) => {
        assert(true);
      }),
      Lister({
        onStateChange: ({ key, meta, result, error, ...other }) => {
          assert(key);
          const spec = meta;
          assert(spec.type);
          assert(spec.groupType);
          assert(spec.providerName);

          onStateChange({
            context: contextFromClient({
              spec,
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
            pipe([
              callProp("sort", (a, b) =>
                a.groupType.localeCompare(b.groupType)
              ),
              map(
                assign({
                  resources: pipe([
                    get("resources"),
                    unless(isEmpty, sortResources),
                  ]),
                })
              ),
            ])
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
        group = [],
      } = {},
      direction,
    }) =>
    (resource) => {
      const { type } = client.spec;
      const { id } = resource;

      assert(direction);
      logger.debug(
        `filterDestroyResources ${JSON.stringify({
          all,
          types,
          id,
        })}`
      );
      return switchCase([
        // Resource that cannot be deleted
        () => resource.cannotBeDeleted,
        () => {
          logger.debug(
            `filterDestroyResources ${type}/${id}, default resource cannot be deleted`
          );
          return false;
        },
        // Delete all resources
        and([() => all, () => isEmpty(types)]),
        () => {
          logger.debug(`filterDestroyResources ${type}/${id}, delete all`);
          return true;
        },
        // ManagedByOther, if types is specified, delete the resource regardless of managedByOther
        () => isEmpty(types) && resource.managedByOther,
        () => false,
        // Delete by id
        () => !isEmpty(idToDelete),
        () => id === idToDelete,
        // Delete by name
        () => !isEmpty(nameToDelete),
        () => resource.name === nameToDelete,
        // Not our minion
        () => isEmpty(types) && !resource.managedByUs,
        () => {
          logger.debug(`filterDestroyResources ${type}::${id}, not our minion`);
          return false;
        },
        // Delete by type
        () => !isEmpty(types),
        pipe([
          () => types,
          any((type) => isTypeMatch({ type, typeToMatch: client.spec.type })),
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
      flatMap(({ groupType, resources }) =>
        pipe([
          tap(() => {
            //assert(group); k8s
            assert(groupType);
            assert(
              Array.isArray(resources),
              `no resources for type ${groupType}`
            );
          }),
          () => getClient({ groupType }),
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
                live: client.spec.displayResource()(resource.live),
                providerName: resource.providerName,
              })),
            ])(),
        ])()
      ),
      filter(not(isEmpty)),
      tap((results) => {
        logger.debug(`planFindDestroy done`);
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

  const planUpsert = ({ onStateChange = noop, lives }) =>
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
      getTargetResources,
      tap((resources) => {
        //logger.debug(`planUpsert target #resources ${size(resources)}`);
      }),
      //filter(not(get("spec.listOnly"))),
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
          //TODO rubico
          async (resource) => {
            onStateChange({
              context: contextFromResource({
                operation: TitleQuery,
                resource: resource.toJSON(),
              }),
              nextState: "RUNNING",
            });
            const actions = await resource.planUpsert({
              resource,
              targetResources: getTargetResources(),
              lives: getLives(),
            });
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
      callProp("sort", (a, b) =>
        a.resource.groupType.localeCompare(b.resource.groupType)
      ),
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
      assign({
        error: or([
          pipe([get("resultCreate"), any(get("error"))]),
          pipe([get("resultDestroy"), any(get("error"))]),
        ]),
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
        pipe([
          getClients,
          forEach(
            tryCatch(
              tap.if(get("onDeployed"), callProp("onDeployed", result)),
              (error) => {
                logger.error(`error running client.onDeployed `);
                logger.error(error.stack);
                throw error;
              }
            )
          ),
        ])()
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
          //logger.debug(diff);
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
          // logger.debug(
          //   `upsertResources: ${resource.name} ${tos({
          //     resolvedDependencies,
          //   })}`
          // );
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
                diff: engine.spec.compare({
                  ...engine.spec,
                  live,
                  lives: getLives(),
                  target: input,
                  config: getProviderConfig(),
                  targetResources: getTargetResources(),
                  programOptions,
                }),
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
                  assert(live);
                }),
                decorateLive({
                  client: engine.getClient(),
                  lives: getLives(),
                  config: getProviderConfig(),
                }),
                tap((resource) => {
                  getLives().addResource({
                    providerName,
                    type: engine.spec.type,
                    group: engine.spec.group,
                    groupType: engine.spec.groupType,
                    resource,
                  });
                }),
              ])(),
            eq(action, "WAIT_CREATION"),
            ({ engine, input, resolvedDependencies }) =>
              pipe([
                () => ({ lives: getLives() }),
                engine.waitForResourceUp,
                tap((params) => {
                  assert(true);
                }),
              ])(),
            () => {
              assert(false, "action is not handled");
            },
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
      () => getClient(resource),
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

  const docPrefix = ({ providerName, group, type }) =>
    pipe([
      () => `./resources/`,
      when(() => group, append(`${group}/`)),
      append(`${type}.md`),
    ])();

  const resourcesList = ({ commandOptions }) =>
    pipe([
      tap(() => {
        logger.debug(`resourcesList`);
        assert(commandOptions);
      }),
      getSpecs,
      groupBy("group"),
      map.entries(([key, values]) => [
        key,
        pipe([
          () => values,
          map((spec) => `[${spec.type}](${docPrefix(spec)})`),
          switchCase([
            () => isEmpty(key),
            pipe([map(prepend("* ")), callProp("join", "\n")]),
            pipe([callProp("join", ", "), prepend(`* ${key}: \n`)]),
          ]),
        ])(),
      ]),
      values,
      callProp("join", "\n"),
      prepend(`---
id: ResourcesList
title: Resources List
---
List of resources for provider ${providerName}:\n
`),
      (content) => fs.writeFile(commandOptions.output, content),
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
    resourcesList,
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
    getClient,
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
    getSpecs,
    //TODO remove
    mapNameToResource,
    getResourceByName,
    getMapNameToResource,
    generateCode,
    targetResourcesBuildMap,
  };

  return pipe([
    () => ({}),
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
    (enhanced) => Object.assign(provider, enhanced),
  ])();
}

module.exports = CoreProvider;
