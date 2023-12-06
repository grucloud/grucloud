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
  fork,
  and,
} = require("rubico");

const {
  isString,
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
  filterOut,
  uniq,
} = require("rubico/x");
const memoize = require("lodash/memoize");
const { EOL } = require("os");
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
  createGetResource,
} = require("./ProviderCommon");
const { ResourceMaker } = require("./CoreResource");
const { createClient, buildGroupType } = require("./Client");
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
          pipe([
            () =>
              spec[`${prefix}Resource`]({
                provider,
                spec,
                programOptions,
              }),
          ])
        )(acc),
      {}
    ),
    tap((params) => {
      assert(true);
    }),
  ])();

const buildProviderConfig = ({ config = {}, providerName, programOptions }) =>
  pipe([
    () => config,
    defaultsDeep({ providerName }),
    defaultsDeep(programOptions),
    defaultsDeep(configProviderDefault),
  ])();

exports.buildProviderConfig = buildProviderConfig;

const getListHofDefault = ({ getList, spec }) =>
  tryCatch(
    pipe([
      tap(() => {
        logger.info(`getList ${spec.groupType}`);
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
        logger.info(`getList ${spec.groupType} ${total}`);
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
  displayName = () => providerName,
  directory = "",
  dependencies = {},
  type,
  programOptions = {},
  fnSpecs,
  makeConfig,
  info = () => ({}),
  init = () => {},
  unInit = () => {},
  start = () => {},
  generateCode = () => {},
  getListHof = getListHofDefault,
  filterClient = () => true,
  createResources,
  mapGloblalNameToResource = new Map(),
}) {
  assert(makeConfig);

  let context = {};
  const getContext = () => context;

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
    buildProviderConfig({ config: makeConfig(), providerName, programOptions });

  //logger.debug(`CoreProvider name: ${providerName}, type ${type}`);

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
          logger.info(`hook ${name} already added`);
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
        // logger.debug(
        //   `getResourceFromLive uri: ${uri}, hasResource: ${!!resource}`
        // );
      }),
    ])();

  const getTargetGroupTypes = pipe([() => [...mapTypeToResources.keys()]]);

  const targetResourcesAdd = (resource) =>
    pipe([
      tap(() => {
        resourcesSet.add(resource);
      }),
    ])();

  const targetResourceAddToMap = (resource) => {
    const { type, group, name, spec } = resource;
    assert(name);
    assert(isString(name));

    assert(type);
    assert(spec.groupType);
    assert(spec.providerName);

    const resourceKey = resource.toString();
    logger.debug(`targetResourceAddToMap ${resourceKey}`);
    if (mapNameToResource.has(resourceKey)) {
      if (spec.listOnly) {
        return;
      }
      // logger.debug(`resource '${resourceKey}' already exists`);
    }

    resourcesObj = set(
      filter(not(isEmpty))([group, type, name]),
      resource
    )(resourcesObj);

    mapNameToResource.set(resourceKey, resource);
    mapGloblalNameToResource.set(
      `${spec.providerName}::${group}::${type}::${name}`,
      resource
    );

    const resourcesByType = getResourcesByType(resource);
    assert(resourcesByType);

    mapTypeToResources.set(resource.groupType, [
      ...filter(not(eq(get("name"), name)))(resourcesByType),
      resource,
    ]);

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
          (spec) => ({
            ...other,
            provider,
            programOptions: getProgramOptions(),
            spec,
          }),
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

  const getResource = createGetResource({ mapGloblalNameToResource });

  const getSpecs = memoize(
    pipe([
      getProviderConfig,
      fnSpecs,
      map(createSpec({ config: getProviderConfig() })),
      tap((params) => {
        assert(true);
      }),
    ]),
    () => "k"
  );

  const getResourcesByType = ({ type, group }) =>
    pipe([
      tap(() => {
        assert(type);
        //assert(group);
      }),
      () => mapTypeToResources.get(`${group}::${type}`) || [],
      tap((params) => {
        assert(true);
      }),
    ])();

  const createClientFromSpec = (spec) =>
    createClient({
      getTargetResources,
      getResourcesByType,
      getResourceFromLive,
      getResource,
      spec,
      config: getProviderConfig(),
      providerName,
      getListHof,
      lives: getLives(),
      getContext,
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
          assign({
            payload: pipe([callProp("init")]),
          }),
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
            context: contextFromProvider({ providerName: displayName() }),
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
        context: contextFromProvider({ providerName: displayName() }),
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
          // logger.debug(
          //   `spinnersStartResources ${title}, #resourcesPerType ${size(
          //     resourcesPerType
          //   )}`
          // );
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
          //logger.debug(`spinnersStartClient ${title}, #specs ${size(specs)}`);
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
          //logger.debug(`spinnersStopClient ${title}, error: ${error}`);
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
        //logger.info(`spinnersStart #hooks ${hooks.length}`);
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
        // logger.debug(
        //   `spinnersStartQuery #resourcesPerType ${size(resourcesPerType)}`
        // );
      }),
      map(filter(not(get("spec.listOnly")))),
      filter(not(isEmpty)),
      tap((resourcesPerType) => {
        // logger.debug(
        //   `spinnersStartQuery #resourcesPerType no listOnly ${size(
        //     resourcesPerType
        //   )}`
        // );
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
            //logger.debug(`register done`);
          }),
        ])()
      ),
      tap(() => {
        //logger.debug(`register done`);
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
          logger.debug(`start ${providerName}`);
        }),
        tap(() =>
          onStateChange({
            context: contextFromProviderInit({ providerName }),
            nextState: "RUNNING",
          })
        ),
        start,
        tap(validate),
        tap((result) =>
          onStateChange({
            context: contextFromProviderInit({ providerName }),
            nextState: "DONE",
            result,
          })
        ),
        () => createResources,
        unless(
          isEmpty,
          pipe([
            flatMap((cr) =>
              pipe([
                tap(() => {
                  assert(
                    isFunction(cr),
                    "createResources should be a function"
                  );
                }),
                () => cr({ provider }),
              ])()
            ),
            filter(not(isEmpty)),
            targetResourcesBuildMap,
          ])
        ),
        tap((params) => {
          logger.debug(`start done ${providerName}`);
        }),
        getSpecs,
        forEach(
          when(
            get("setup"),
            pipe([
              callProp("setup", { config: getProviderConfig() }),
              (result = {}) => {
                context = {
                  ...context,
                  ...result,
                };
              },
            ])
          )
        ),
      ]),
      (error) => {
        logger.error(`start error ${tos(convertError({ error }))}`);
        onStateChange({
          context: contextFromProviderInit({ providerName }),
          nextState: "ERROR",
          error: convertError({ error }),
        });
        onStateChange({
          context: contextFromProvider({ providerName: displayName() }),
          nextState: "ERROR",
        });
        throw error;
      }
    )();

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
        // logger.debug(
        //   `listLives #clients: ${size(clients)}, ${JSON.stringify({
        //     providerName,
        //     title,
        //     readWrite,
        //     options,
        //   })}`
        // );
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
        //logger.debug(`listLives #clients ${size(clients)}`);
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
              providerName: spec.providerName,
            }),
            tap.if(get("error"), ({ error, resources }) => {
              //assert(error);
            }),
            tap((resourcesPerType) => {
              assert(resourcesPerType);
              //getLives().addResources(resourcesPerType);
            }),
          ])(),
      })),
      tap((params) => {
        assert(true);
      }),
      Lister({
        poolSize: 10,
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
          filterOut(
            and([not(get("error")), pipe([get("resources"), isEmpty])])
          ),
          callProp("sort", (a, b) => a.groupType.localeCompare(b.groupType)),
          map(
            when(
              get("resources"),
              assign({
                resources: pipe([
                  get("resources"),
                  callProp("sort", (a, b) => a.name.localeCompare(b.name)),
                ]),
              })
            )
          ),
        ]),
      }),
      tap((params) => {
        assert(true);
      }),
      assign({ providerName: () => providerName }),
      tap(({ results }) => {
        // logger.debug(
        //   `listLives provider ${providerName}, ${size(
        //     results
        //   )} results: ${pluck("groupType")(results).join(", ")}`
        // );
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
      // logger.debug(
      //   `filterDestroyResources ${JSON.stringify({
      //     all,
      //     types,
      //     id,
      //   })}`
      // );
      return switchCase([
        // Resource that cannot be deleted
        () => resource.cannotBeDeleted,
        () => {
          // logger.debug(
          //   `filterDestroyResources ${type}/${id}, default resource cannot be deleted`
          // );
          return false;
        },
        // Delete all resources
        and([() => all, () => isEmpty(types)]),
        () => {
          //logger.debug(`filterDestroyResources ${type}/${id}, delete all`);
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
          // logger.debug(`filterDestroyResources ${type}::${id}, not our minion`);
          return false;
        },
        // Delete by type
        () => !isEmpty(types),
        pipe([
          () => types,
          any((type) =>
            isTypeMatch({
              type,
              typeToMatch: client.spec.type,
              groupTypeToMatch: client.spec.groupType,
            })
          ),
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

  const planFindDestroy = ({
    livesData,
    options = {},
    direction = PlanDirection.DOWN,
  }) =>
    pipe([
      tap(() => {
        // logger.debug(
        //   `planFindDestroy ${JSON.stringify({ options, direction })}`
        // );
        assert(livesData);
      }),
      () => livesData,
      get("results"),
      find(eq(get("providerName"), providerName)),
      get("results"),
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
              map(
                pipe([
                  (resource) => ({
                    // TODO omit ends up calling isDefault
                    resource,
                    action: "DESTROY",
                    live: client.spec.displayResource()(resource.live),
                    providerName: resource.providerName,
                  }),
                ])
              ),
            ])(),
        ])()
      ),
      filter(not(isEmpty)),
      tap((results) => {
        //logger.debug(`planFindDestroy done`);
      }),
    ])();

  const planQueryDestroy = ({ livesData, options = {} }) =>
    pipe([
      tap(() => {
        // logger.info(
        //   `planQueryDestroy ${JSON.stringify({ providerName, options })}`
        // );
        assert(livesData);
      }),
      () => ({ providerName }),
      assign({
        //TODO
        plans: () => planFindDestroy({ livesData, options }),
      }),
      assign({ error: any(get("error")) }),
      tap((result) => {
        //logger.debug(`planQueryDestroy done`);
      }),
    ])();

  const planUpsert = ({ onStateChange = noop, lives }) =>
    pipe([
      tap(() => {
        // logger.info(`planUpsert`);
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
          (resource) =>
            pipe([
              tap(() => {
                onStateChange({
                  context: contextFromResource({
                    operation: TitleQuery,
                    resource: resource.toJSON(),
                  }),
                  nextState: "RUNNING",
                });
              }),
              () => ({
                resource,
                targetResources: getTargetResources(),
                lives: getLives(),
              }),
              resource.planUpsert,
              tap((params) => {
                onStateChange({
                  context: contextFromResource({
                    operation: TitleQuery,
                    resource: resource.toJSON(),
                  }),
                  nextState: "DONE",
                });
              }),
            ])(),
          (error, resource) => {
            logger.error(`error query resource ${resource.toString()}`);
            //logger.error(util.inspect(error, { depth: 8 }));
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
      tap((plans) =>
        onStateChange({
          context: contextFromPlanner({ providerName, title: TitleQuery }),
          nextState: nextStateOnError(hasResultError(plans)),
        })
      ),
      callProp("sort", (a, b) =>
        a.resource.groupType.localeCompare(b.resource.groupType)
      ),
      tap((result) => {
        logger.info(`planUpsert done`);
      }),
    ])();

  const planQuery = ({
    livesData,
    onStateChange = identity,
    commandOptions = {},
  } = {}) =>
    pipe([
      tap(() => {
        // logger.info(`planQuery begins ${providerName}`);
        assert(livesData);
      }),
      providerRunning({ onStateChange, providerName }),
      () => ({ providerName }),
      assign({
        resultDestroy: () =>
          planFindDestroy({
            livesData,
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
          context: contextFromProvider({ providerName: displayName() }),
          nextState: nextStateOnError(error),
        })
      ),
      tap((result) => {
        // logger.debug(`planQuery done ${providerName}`);
      }),
    ])({});

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

  const destroyById = ({ resource, live }) =>
    pipe([
      tap(() => {
        assert(live);
        assert(resource);
        //logger.debug(`destroyById: ${tos(resource.toString())}`);
      }),
      () => getClient(resource),
      tap((client) => {
        assert(client, `Cannot find endpoint ${resource.toString()}}`);
        assert(client.spec);
      }),
      tap((client) =>
        retryCall({
          name: `destroy ${client.spec.groupType}/${resource.name}`,
          fn: () =>
            client.destroy({
              live,
              id: client.findId({
                lives: getLives(),
                config: getProviderConfig(),
              })(live), // TODO remove id, only use live
              name: resource.name,
              resource,
              lives: getLives(),
              config: getProviderConfig(),
            }),
          isExpectedResult: () => true,
          shouldRetryOnException: client.shouldRetryOnExceptionDelete,
          config: getProviderConfig(),
        })
      ),
    ])();

  const planDestroy = ({
    plans,
    planAll,
    onStateChange = identity,
    direction = PlanDirection.DOWN,
  }) =>
    pipe([
      tap(() => {
        assert(Array.isArray(plans), "plans must be an array");
        assert(planAll);
        logger.info(`planDestroy #plans ${plans.length}`);
        //logger.debug(`planDestroy ${tos({ plans, direction })}`);
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
      () => planAll,
      get("results"),
      pluck("plans"),
      flatten,
      (planDestroyAll) => ({
        plans,
        planDestroyAll,
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
      Planner,
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
      () => `./`,
      when(() => group, append(`${group}/`)),
      append(`${type}.md`),
    ])();

  const servicesList = ({}) =>
    pipe([getSpecs, pluck("group"), uniq, callProp("join", EOL)])();

  const resourcesList = () =>
    pipe([
      tap(() => {
        logger.debug(`resourcesList`);
      }),
      getSpecs,
      fork({
        resourcesCount: size,
        servicesCount: pipe([groupBy("group"), values, size]),
        content: pipe([
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
        ]),
      }),
      ({ resourcesCount, servicesCount, content }) => `---
id: ResourcesList
title: Resources List
---
List of ${resourcesCount} resources in ${servicesCount} services for provider ${providerName}:\n
${content}`,
    ])();

  const toString = () => ({ name: providerName, type: toType() });

  const provider = {
    toString,
    directory,
    get config() {
      return getProviderConfig();
    },
    getConfig: getProviderConfig,
    getContext,
    setLives,
    get lives() {
      return getLives();
    },
    resources: () => resourcesObj,
    name: providerName,
    displayName,
    dependencies,
    type: toType,
    servicesList,
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
    getMapNameToResource,
    generateCode,
    targetResourcesBuildMap,
    getListHof,
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
