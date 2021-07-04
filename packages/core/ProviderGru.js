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
  all,
  transform,
  omit,
  pick,
} = require("rubico");

const {
  first,
  size,
  isEmpty,
  callProp,
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
  isFunction,
} = require("rubico/x");
const { Lister } = require("./Lister");
const {
  contextFromHookGlobal,
  contextFromHookGlobalInit,
  contextFromHookGlobalAction,
  nextStateOnError,
} = require("./ProviderCommon");
const logger = require("./logger")({ prefix: "ProviderGru" });
const { tos } = require("./tos");
const { convertError } = require("./Common");

const { displayLive } = require("./cli/displayUtils");
const { buildGraphLive } = require("./GraphLive");
const { buildGraphTarget } = require("./GraphTarget");

const GraphCommon = require("./GraphCommon");

const identity = (x) => x;

const dependenciesTodependsOn = ({ dependencies, stacks }) =>
  pipe([
    tap(() => {
      assert(Array.isArray(stacks));
    }),
    () => dependencies,
    reduce((acc, deps) => [...acc, deps.name], []),
    filter((name) => find(eq(get("provider.name"), name))(stacks)),
  ])();

const runnerParams = ({ provider, isProviderUp, stacks }) => ({
  key: provider.name,
  meta: { providerName: provider.name, provider },
  dependsOn: dependenciesTodependsOn({
    dependencies: provider.dependencies,
    stacks,
  }),
  isUp: isProviderUp,
});

const buildDependsOnReverse = (stacks) =>
  pipe([
    map(
      pipe([
        get("provider"),
        ({ name, dependencies }) => ({
          name,
          dependsOn: dependenciesTodependsOn({ dependencies, stacks }),
        }),
      ])
    ),
    (specDependsOn) =>
      map(({ name }) => ({
        name,
        dependsOn: pipe([
          filter(pipe([get("dependsOn"), includes(name)])),
          map(get("name")),
        ])(specDependsOn),
      }))(specDependsOn),
    tap((specDependsOn) => {
      logger.info(`buildDependsOnReverse: ${tos(specDependsOn)}`);
    }),
  ])(stacks);

exports.ProviderGru = ({ commandOptions, hookGlobal, stacks }) => {
  assert(Array.isArray(stacks));

  const getProviders = () => pipe([map(get("provider"))])(stacks);

  forEach(({ provider, resources, hooks }) =>
    provider.register({ resources, hooks })
  )(stacks);

  const onStateChangeDefault =
    ({ onStateChange }) =>
    ({ key, error, result, nextState }) =>
      pipe([
        tap.if(
          () => includes(nextState)(["DONE", "ERROR"]),
          pipe([
            () => getProvider({ providerName: key }),
            (provider) =>
              provider.spinnersStopProvider({
                onStateChange,
                error: result?.error || error,
              }),
          ])
        ),
      ])();

  const getStack = ({ providerName }) =>
    pipe([
      () => stacks,
      find(eq(get("provider.name"), providerName)),
      tap.if(isEmpty, () => {
        assert(`no provider with name: '${providerName}'`);
      }),
    ])();

  const getProvider = ({ providerName }) =>
    pipe([
      find(eq(get("name"), providerName)),
      tap.if(isEmpty, () => {
        assert(`no provider with name: '${providerName}'`);
      }),
    ])(getProviders());

  const createLives = (livesRaw = []) => {
    const livesToMap = map(({ providerName, results }) => [
      providerName,
      new Map(map((perProvider) => [perProvider.type, perProvider])(results)),
    ]);

    const mapPerProvider = new Map(livesToMap(livesRaw));

    const toJSON = () =>
      pipe([
        () => mapPerProvider,
        tap((results) => {
          logger.debug(`toJSON `);
        }),
        map.entries(([providerName, mapPerType]) => [
          providerName,
          {
            providerName,
            kind: "livesPerType",
            error: any(get("error"))([...mapPerType.values()]),
            results: [...mapPerType.values()],
          },
        ]),
        (resultMap) => [...resultMap.values()],
        tap((results) => {
          logger.debug(`toJSON `);
        }),
      ])();

    const getByType = ({ providerName, type }) =>
      pipe([
        () => mapPerProvider.get(providerName) || new Map(),
        (mapPerType) => mapPerType.get(type),
        tap.if(isEmpty, () => {
          logger.error(`cannot find type ${type} on provider ${providerName}`);
        }),
        tap((results) => {
          logger.debug(
            `getByType ${JSON.stringify({
              providerName,
              type,
              count: pipe([get("resources"), size])(results),
            })}`
          );
        }),
      ])();

    const getById = ({ providerName, type, id }) =>
      pipe([
        () => getByType({ providerName, type }),
        tap.if(isEmpty, () => {
          logger.error(`cannot find type ${type} on provider ${providerName}`);
        }),
        get("resources"),
        find(eq(get("id"), id)),
        tap((result) => {
          assert(true);
        }),
      ])();
    const getByName = ({ providerName, type, name }) =>
      pipe([
        () => getByType({ providerName, type }),
        tap.if(isEmpty, () => {
          logger.error(`cannot find type ${type} on provider ${providerName}`);
        }),
        get("resources"),
        find(eq(get("name"), name)),
        tap((result) => {
          assert(true);
        }),
      ])();
    return {
      get error() {
        return any(get("error"))(toJSON());
      },
      addResource: ({ providerName, type, live }) => {
        assert(providerName);
        assert(type);

        if (!live) {
          logger.debug(`live addResource no live for ${type}`);
          return;
        }

        const mapPerType = mapPerProvider.get(providerName) || new Map();

        logger.debug(
          `live addResource ${JSON.stringify({
            providerName,
            type,
            mapPerTypeSize: mapPerType.size,
          })}`
        );

        const resources = mapPerType.get(type) || { type, resources: [] };
        assert(
          Array.isArray(resources.resources),
          `no an array: ${tos(resources)}`
        );
        mapPerType.set(type, {
          type,
          providerName,
          resources: [...resources.resources, { live }],
        });

        mapPerProvider.set(providerName, mapPerType);
        //logger.debug(`live addResource all: ${tos(toJSON())}`);
      },
      addResources: ({
        providerName,
        type,
        group,
        resources = [],
        error: latestError,
      }) => {
        assert(providerName);
        assert(type);
        assert(Array.isArray(resources) || latestError);
        logger.debug(
          `live addResources ${JSON.stringify({
            providerName,
            group,
            type,
            resourceCount: resources.length,
          })}`
        );

        const mapPerType = mapPerProvider.get(providerName) || new Map();
        mapPerType.set(type, { type, group, resources, error: latestError });
        mapPerProvider.set(providerName, mapPerType);
      },
      get json() {
        return toJSON();
      },
      toJSON,
      getByProvider: ({ providerName }) => {
        const mapPerType = mapPerProvider.get(providerName) || new Map();
        return [...mapPerType.values()];
      },
      setByProvider: ({ providerName, livesPerProvider }) => {
        const mapPerType = new Map(
          map((livesPerProvider) => [livesPerProvider.type, livesPerProvider])(
            livesPerProvider
          )
        );
        mapPerProvider.set(providerName, mapPerType);
      },
      getByType,
      getById,
      getByName,
    };
  };

  // Add namespace and dependencies.
  const resourceDecorate =
    ({ lives, commandOptions }) =>
    (resource) =>
      pipe([
        tap(() => {
          assert(resource.providerName);
          assert(resource.type);
          assert(lives);
        }),
        // Use Lister
        () => getProvider({ providerName: resource.providerName }),
        (provider) =>
          pipe([
            () => provider.clientByType({ type: resource.type }),
            (client) => ({
              ...resource,
              get isDefault() {
                return client.isDefault({ live: resource.live, lives });
              },
              get namespace() {
                return client.findNamespace({ live: resource.live, lives });
              },
              get dependencies() {
                return client.findDependencies({
                  live: resource.live,
                  lives,
                });
              },
              get managedByUs() {
                return client.spec.isOurMinion({
                  resource: provider.getResourceFromLive({
                    client,
                    live: resource.live,
                  }),
                  live: resource.live,
                  lives,
                  //TODO remove resourceNames
                  resourceNames: provider.resourceNames(),
                  resources: provider.getResourcesByType({
                    type: client.spec.type,
                  }),
                  config: provider.config,
                });
              },
            }),
            tap((resource) =>
              Object.defineProperty(resource, "show", {
                enumerable: true,
                get: () => showLive({ commandOptions })(resource),
              })
            ),
          ])(),
        tap((resource) => {
          assert(true);
        }),
      ])();

  const showLive =
    ({ commandOptions = {} } = {}) =>
    (resource) =>
      pipe([
        () => resource,
        and([
          (resource) =>
            switchCase([not(isEmpty), includes(resource.type), () => true])(
              commandOptions.types
            ),
          (resource) => !includes(resource.type)(commandOptions.typesExclude),
          (resource) =>
            commandOptions.defaultExclude ? !resource.isDefault : true,
          (resource) => (commandOptions.our ? resource.managedByUs : true),
          (resource) =>
            commandOptions.name ? resource.name === commandOptions.name : true,
          (resource) =>
            commandOptions.id ? resource.id === commandOptions.id : true,
          (resource) =>
            commandOptions.providerName &&
            !isEmpty(commandOptions.providerNames)
              ? includes(resource.providerName)(commandOptions.providerNames)
              : true,
          (resource) =>
            commandOptions.canBeDeleted ? !resource.cannotBeDeleted : true,
        ]),
        tap((show) => {
          logger.debug(`showLive ${resource.name} show: ${show}`);
        }),
      ])();

  const decorateListResult =
    ({}) =>
    (perProvider) =>
      pipe([
        tap((xxx) => {
          assert(true);
        }),
        () => createLives(),
        tap((lives) =>
          map(
            assign({
              results: pipe([
                get("results"),
                tap((results) => {
                  logger.debug(`decorateListResult #types: ${size(results)}`);
                }),
                map(
                  assign({
                    resources: ({
                      providerName,
                      resources,
                      type,
                      group,
                      error,
                    }) =>
                      pipe([
                        () => resources,
                        map(resourceDecorate({ lives, commandOptions })),
                        tap((resources) => {
                          lives.addResources({
                            providerName,
                            type,
                            group,
                            resources,
                            error,
                          });
                        }),
                      ])(),
                  })
                ),
              ]),
            })
          )(perProvider)
        ),
        tap((lives) => {
          assert(true);
        }),
      ])();

  const listLives = async ({
    onStateChange,
    onProviderEnd = () => {},
    options,
    readWrite,
  }) =>
    pipe([
      tap(() => {
        logger.info(`listLives ${JSON.stringify({ options, readWrite })}`);
        assert(onStateChange);
      }),
      () => createLives(),
      (lives) =>
        pipe([
          () => filterProviderUp({ stacks, onStateChange }),
          map(({ provider }) =>
            pipe([
              () =>
                provider.listLives({
                  onStateChange,
                  options,
                  readWrite,
                  lives,
                }),
              tap(({ error }) =>
                provider.spinnersStopListLives({
                  onStateChange,
                  error,
                })
              ),
              tap(({ error }) => {
                onProviderEnd({ provider, error });
              }),
            ])()
          ),
          decorateListResult({ lives }),
        ])(),
    ])();

  const displayLives = (lives) =>
    pipe([
      tap(() => {
        assert(lives);
        logger.info(`displayLive`);
      }),
      () => lives,
      tap((livesContent) => {
        assert(livesContent);
      }),
      forEach(({ results, providerName }) => {
        displayLive({ providerName, resources: results });
      }),
    ])();

  const planQuery = ({ onStateChange = identity } = {}) =>
    pipe([
      tap(() => {
        logger.info(`planQuery`);
      }),
      () => listLives({ onStateChange }),
      tap((lives) => {
        logger.info(`planQuery`);
      }),
      (lives) =>
        pipe([
          () => stacks,
          map(({ provider, isProviderUp }) => ({
            ...runnerParams({ provider, isProviderUp, stacks }),
            executor: ({ results }) =>
              pipe([
                tap(() => {
                  assert(results);
                }),
                () =>
                  provider.planQuery({
                    onStateChange,
                    lives,
                  }),
              ])(),
          })),
          (inputs) =>
            Lister({
              inputs,
              onStateChange: ({ key, result, nextState }) =>
                pipe([
                  tap.if(
                    () => includes(nextState)(["DONE", "ERROR"]),
                    pipe([
                      () => getProvider({ providerName: key }),
                      (provider) => {
                        //TODO
                      },
                    ])
                  ),
                ])(),
            }),
          (result) => ({
            lives,
            resultQuery: result,
          }),
          assign({ error: any(get("error")) }),
          tap((result) => {
            logger.info(`planQuery done`);
          }),
        ])(),
    ])();

  const planApply = ({
    plan,
    lives,
    onStateChange,
    onProviderEnd = () => {},
  }) =>
    pipe([
      tap(() => {
        logger.info(`planApply`);
        assert(lives);
        assert(Array.isArray(plan.results));
      }),
      () => plan.results,
      filter(not(get("error"))),
      (results) => ({ results }),
      assign({
        start: pipe([
          get("results"),
          map(
            tryCatch(
              (planPerProvider) =>
                pipe([
                  () =>
                    getProvider({
                      providerName: planPerProvider.providerName,
                    }),
                  (provider) =>
                    pipe([
                      () => provider.start({ onStateChange }),
                      tap((xxx) => {
                        assert(true);
                      }),
                    ])(),
                ])(),
              (error, { providerName }) => {
                logger.error(
                  `planApply start error ${tos(convertError({ error }))}`
                );
                return {
                  error: convertError({ error, name: "Apply" }),
                  providerName,
                };
              }
            )
          ),
        ]),
      }),

      ({ results }) =>
        map(
          tryCatch(
            (planPerProvider) =>
              pipe([
                () =>
                  getProvider({
                    providerName: planPerProvider.providerName,
                  }),
                (provider) =>
                  pipe([
                    () =>
                      provider.planApply({
                        plan: planPerProvider,
                        onStateChange,
                        lives,
                      }),
                    tap((xxx) => {
                      assert(xxx);
                    }),
                    assign({
                      resultHooks: () =>
                        provider.runOnDeployed({ onStateChange }),
                    }),
                    assign({
                      error: pipe([omit(["lives"]), any(get("error"))]),
                    }),
                    tap((xxx) => {
                      assert(xxx);
                    }),
                    tap(({ error }) => {
                      onProviderEnd({ provider, error });
                    }),
                  ])(),
              ])(),
            (error, { providerName }) =>
              pipe([
                () => convertError({ error, name: "Apply" }),
                tap((error) => {
                  logger.error(`planApply ${tos(error)}`);
                }),
                (error) => ({
                  error,
                  providerName,
                }),
              ])()
          )
        )(results),
      (results) => ({ error: any(get("error"))(results), results }),
      tap((result) => {
        logger.info(`planApply done`);
      }),
    ])();

  const filterProviderUp = ({ stacks, onStateChange }) =>
    pipe([
      tap(() => {
        logger.info(`filterProviderUp`);
      }),

      () => stacks,
      map(({ provider, isProviderUp }) => ({
        ...runnerParams({ provider, isProviderUp, stacks }),
        executor: ({ results }) =>
          pipe([
            tap(() => {
              logger.info(`filterProviderUp start`);
            }),
            () => provider.start({ onStateChange }),
            tap(() => {
              logger.info(`filterProviderUp started`);
            }),
            () => ({
              provider,
              isProviderUp,
            }),
          ])(),
      })),
      (inputs) =>
        Lister({
          inputs,
          onStateChange: ({ key, result, nextState }) =>
            pipe([
              tap.if(
                () => includes(nextState)(["ERROR"]),
                pipe([
                  () => getProvider({ providerName: key }),
                  tap((provider) => {
                    logger.info(`filterProviderUp provider ${provider.name}`);
                  }),
                  (provider) =>
                    provider.spinnersStopListLives({
                      onStateChange,
                      error: true,
                    }),
                ])
              ),
            ])(),
        }),
      get("results"),
      tap((results) => {
        assert(true);
      }),
      tap((results) => {
        logger.info(`filterProviderUp #providers ${size(results)}`);
      }),
    ])();

  const planQueryDestroy = async ({ onStateChange, options }) =>
    pipe([
      tap(() => {
        logger.info(`planQueryDestroy ${JSON.stringify(options)}`);
        assert(onStateChange);
        assert(stacks);
      }),
      () => listLives({ onStateChange, options, readWrite: true }),
      (lives) =>
        pipe([
          () => filterProviderUp({ stacks, onStateChange }),
          map(({ provider, isProviderUp }) =>
            pipe([
              () =>
                provider.planQueryDestroy({
                  onStateChange,
                  options,
                  lives,
                }),
              tap(({ error }) => {
                provider.spinnersStopProvider({
                  onStateChange,
                  error,
                });
              }),
            ])()
          ),
          (results) => ({ error: any(get("error"))(results), results }),
          (resultQueryDestroy) => ({ lives, resultQueryDestroy }),
          assign({ error: any(get("error")) }),
          tap((results) => {
            logger.info(`planQueryDestroy done`);
          }),
        ])(),
    ])();

  const planDestroy = async ({
    plan,
    onStateChange = identity,
    lives,
    options,
  }) =>
    pipe([
      tap(() => {
        logger.info(`planDestroy`);
        assert(plan);
        assert(lives);
      }),
      () => plan.results,
      filter(not(get("error"))),
      map(({ providerName, plans }) =>
        pipe([
          () => getStack({ providerName }),
          ({ provider }) => ({
            key: providerName,
            meta: { providerName },
            dependsOn: pipe([
              () => stacks,
              buildDependsOnReverse,
              find(eq(get("name"), providerName)),
              get("dependsOn"),
            ])(),
            isUp: () => true,
            executor: ({}) =>
              pipe([
                () => provider.start({ onStateChange }),
                assign({
                  resultDestroy: () =>
                    provider.planDestroy({
                      plans: plans,
                      lives,
                      onStateChange,
                      options,
                    }),
                }),
                assign({
                  resultHooks: () => provider.runOnDestroyed({ onStateChange }),
                }),
                assign({ error: any(get("error")) }),
                tap((xxx) => {
                  assert(xxx);
                }),
              ])(),
          }),
        ])()
      ),
      (inputs) =>
        Lister({
          inputs,
          onStateChange: onStateChangeDefault({ onStateChange }),
        }),
      tap((result) => {
        logger.debug(`planDestroy done`);
      }),
    ])();

  //TODO do not use lister
  const runCommand = ({
    onStateChange = identity,
    options,
    functionName,
  } = {}) =>
    pipe([
      tap(() => {
        assert(functionName);
        logger.info(`runCommand ${functionName}`);
      }),
      () => stacks, //TODO provider up
      map(({ provider, isProviderUp }) => ({
        ...runnerParams({ provider, isProviderUp, stacks }),
        executor: ({ results }) =>
          pipe([
            tap(() => {
              assert(
                provider[functionName],
                `${functionName} is not a provider function `
              );
            }),
            () => provider.start({ onStateChange }),
            () =>
              provider[functionName]({
                onStateChange,
                options,
                // TODO lives,
              }),
            assign({ providerName: () => provider.name }),
            tap((xxx) => {
              assert(xxx);
            }),
          ])(),
      })),
      (inputs) =>
        Lister({
          inputs,
          onStateChange: onStateChangeDefault({ onStateChange }),
        }),
      tap((result) => {
        logger.info(`runCommand result: ${tos(result)}`);
      }),
    ])();

  const planQueryAndApply = async ({ onStateChange = identity } = {}) => {
    const plan = await planQuery({ onStateChange });
    if (plan.error) return { error: true, plan };
    return await planApply({
      plan: plan.resultQuery,
      lives: plan.lives,
      onStateChange,
    });
  };

  const startHookGlobalSpinners = ({ hookType, onStateChange, hookInstance }) =>
    pipe([
      () => {
        logger.debug(`startHookGlobalSpinners: ${hookType}`);
        assert(hookType);
        assert(onStateChange);
        assert(hookInstance[hookType]);
      },
      () =>
        onStateChange({
          context: contextFromHookGlobalInit({ hookType }),
          nextState: "WAITING",
          indent: 2,
        }),
      () => hookInstance[hookType],
      get("actions"),
      forEach((action) =>
        onStateChange({
          context: contextFromHookGlobalAction({
            hookType,
            name: action.name,
          }),
          nextState: "WAITING",
          indent: 4,
        })
      ),
    ])();

  const runGlobalActions = ({
    actions,
    hookType,
    onStateChange,
    actionPayload,
  }) =>
    pipe([
      tap(() => {
        logger.debug(`runGlobalActions: ${hookType}, #action ${size(actions)}`);
        //assert(Array.isArray(actions), "actions is not an array");
        assert(hookType);
        assert(onStateChange);
      }),
      () => actions,
      map((action) =>
        pipe([
          tap(() => {
            assert(action);
            assert(isFunction(action.command), `command is not a function`);
            assert(action.name, "action is missing the name properties");
            logger.debug(`action name: ${action.name}`);
          }),
          tap(() =>
            onStateChange({
              context: contextFromHookGlobalAction({
                hookType,
                name: action.name,
              }),
              nextState: "RUNNING",
            })
          ),
          tryCatch(
            () => action.command(actionPayload),
            pipe([
              (error) => convertError({ error }),
              tap((error) => {
                logger.error(
                  `runCommandGlobal ${convertError({
                    error,
                    name: action.name,
                  })}`
                );
              }),
              (error) => ({ error, action: action.name }),
            ])
          ),
          tap(({ error } = {}) =>
            onStateChange({
              context: contextFromHookGlobalAction({
                hookType,
                name: action.name,
              }),
              nextState: nextStateOnError(error),
              error,
            })
          ),
        ])()
      ),
      tap((result) => {
        assert(true);
      }),
      (results) => ({
        error: any(get("error"))(results),
        results,
      }),
      tap((result) => {
        assert(result);
      }),
    ])();

  const runHookInstance = ({ hookType, onStateChange, hookInstance }) =>
    pipe([
      tap(() => {
        assert(hookInstance);
        assert(hookInstance[hookType]);
      }),
      tap(() =>
        startHookGlobalSpinners({
          hookType,
          onStateChange,
          hookInstance,
        })
      ),
      tap(() =>
        onStateChange({
          context: contextFromHookGlobalInit({ hookType }),
          nextState: "RUNNING",
        })
      ),
      tryCatch(
        pipe([
          () => hookInstance[hookType].init(),
          tap((actionPayload) => {
            logger.debug(`init result: ${actionPayload}`);
          }),
          tap(() =>
            onStateChange({
              context: contextFromHookGlobalInit({ hookType }),
              nextState: "DONE",
            })
          ),
          (actionPayload) => ({ kind: "#hookActions", actionPayload }),
          assign({
            results: ({ actionPayload }) =>
              runGlobalActions({
                onStateChange,
                actions: hookInstance[hookType].actions,
                hookType,
                actionPayload,
              }),
          }),
          assign({ error: any(get("error")) }),
          tap((result) => {
            logger.debug(``);
          }),
        ]),
        pipe([
          (error) => convertError({ error }),
          tap((error) => {
            logger.error(`runHookInstance ${hookType}, ${tos(error)}`);
          }),
          tap((error) =>
            onStateChange({
              context: contextFromHookGlobalInit({ hookType }),
              nextState: "ERROR",
              error,
            })
          ),
          (error) => ({ error, hookType }),
        ])
      ),
      //assign({ error: any(get("error")) }),
      tap((result) => {
        assert(result);
      }),
    ])();

  const runCommandGlobal = ({ hookType, onStateChange }) =>
    pipe([
      tap(() => {
        assert(hookType);
        assert(onStateChange);
        logger.info(
          `runCommandGlobal ${hookType}, hashookGlobal: ${!!hookGlobal}`
        );
      }),

      switchCase([
        () => hookGlobal,
        pipe([
          tap(() =>
            onStateChange({
              context: contextFromHookGlobal({ hookType }),
              nextState: "WAITING",
            })
          ),
          tap(() =>
            onStateChange({
              context: contextFromHookGlobal({ hookType }),
              nextState: "RUNNING",
            })
          ),
          tryCatch(
            pipe([
              tap(() => {
                logger.info(
                  `runCommandGlobal ${hookType}, hashookGlobal: ${!!hookGlobal}`
                );
                assert(isFunction(hookGlobal));
                assert(stacks);
              }),
              () => hookGlobal({ stacks }),
              switchCase([
                pipe([get(hookType), isEmpty]),
                identity,
                (hookInstance) =>
                  runHookInstance({ hookType, onStateChange, hookInstance }),
              ]),
            ]),
            (error) =>
              pipe([
                tap(() => {
                  logger.error(
                    `runCommandGlobal ${hookType}, ${tos(
                      convertError({ error })
                    )}`
                  );
                }),
                tap(() =>
                  onStateChange({
                    context: contextFromHookGlobalInit({ hookType }),
                    nextState: "ERROR",
                    error: convertError({ error, name: hookType }),
                  })
                ),
                () => ({ error, hookType }),
              ])()
          ),
          tap((result) => {
            logger.debug(result);
          }),
          tap(({ error }) =>
            onStateChange({
              context: contextFromHookGlobal({ hookType }),
              nextState: nextStateOnError(error),
              error,
            })
          ),
        ]),
        identity,
      ]),
      tap((result) => {
        logger.info(`runCommandGlobal ${hookType}, done`);
      }),
    ])();

  return {
    listLives,
    planQuery,
    planApply,
    planQueryDestroy,
    planDestroy,
    planQueryAndApply,
    displayLives,
    getProvider,
    getProviders,
    runCommand,
    runCommandGlobal,
    buildGraphTarget: ({ options }) =>
      buildGraphTarget({
        providers: getProviders(),
        options: defaultsDeep(GraphCommon.optionsDefault({ kind: "target" }))(
          options
        ),
      }),
    buildGraphLive: ({ lives, options }) =>
      buildGraphLive({
        lives,
        options: defaultsDeep(GraphCommon.optionsDefault({ kind: "live" }))(
          options
        ),
      }),
  };
};
