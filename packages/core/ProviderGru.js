const assert = require("assert");
const {
  pipe,
  tap,
  map,
  filter,
  tryCatch,
  switchCase,
  get,
  assign,
  any,
  omit,
  eq,
  not,
  flatMap,
  transform,
  pick,
} = require("rubico");

const {
  size,
  isEmpty,
  callProp,
  pluck,
  forEach,
  find,
  defaultsDeep,
  includes,
  identity,
  isFunction,
  flatten,
} = require("rubico/x");
const { Lister } = require("./Lister");
const logger = require("./logger")({ prefix: "ProviderGru" });
const { tos } = require("./tos");
const { Planner, mapToGraph } = require("./Planner");
const { convertError, TitleDeploying, TitleDestroying } = require("./Common");
const { displayLive } = require("./cli/displayUtils");
const { buildGraphLive } = require("./GraphLive");
const { buildGraphTarget } = require("./GraphTarget");
const { buildGraphTree } = require("./GraphTree");
const { createClient, decorateLive } = require("./Client");
const {
  nextStateOnError,
  contextFromProvider,
  contextFromPlanner,
  contextFromResource,
  createGetResource,
  contextFromHookGlobal,
  contextFromHookGlobalInit,
  contextFromHookGlobalAction,
  addErrorToResults,
  assignErrorToObject,
} = require("./ProviderCommon");
const GraphCommon = require("./GraphCommon");
const { createLives } = require("./Lives");

const dependenciesTodependsOn = ({ dependencies, stacks }) =>
  pipe([
    tap(() => {
      assert(Array.isArray(stacks));
    }),
    () => dependencies,
    transform(
      map(({ name }) => [name]),
      () => []
    ),
    filter((name) =>
      pipe([() => stacks, find(eq(get("provider.name"), name))])()
    ),
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
    () => stacks,
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
      pipe([
        () => specDependsOn,
        map(({ name }) => ({
          name,
          dependsOn: pipe([
            () => specDependsOn,
            filter(pipe([get("dependsOn"), includes(name)])),
            map(get("name")),
          ])(),
        })),
      ])(),
    tap((specDependsOn) => {
      logger.info(`buildDependsOnReverse: ${tos(specDependsOn)}`);
    }),
  ])();

exports.ProviderGru = ({
  mapGloblalNameToResource,
  hookGlobal,
  stacks,
  lives = createLives(),
  programOptions,
}) => {
  assert(Array.isArray(stacks));
  assert(mapGloblalNameToResource);
  assert(programOptions);
  const getResource = createGetResource({ mapGloblalNameToResource });

  const getProviderConfig = pipe([
    get("provider.config"),
    tap((config) => {
      assert(config);
    }),
  ]);

  const getClient = ({ providerName, groupType }) =>
    pipe([
      tap(() => {
        assert(groupType);
        assert(providerName);
      }),
      getSpecs,
      find(eq(get("groupType"), groupType)),
      tap((spec) => {
        assert(spec, `no ${groupType}`);
      }),
      (spec) =>
        pipe([
          () => ({ providerName }),
          getProvider,
          (provider) =>
            createClient({
              provider,
              getTargetResources: () => mapGloblalNameToResource,
              getResourcesByType: provider.getResourcesByType,
              getResource,
              spec,
              config: provider.config,
              providerName,
              getListHof: provider.getListHof,
              lives,
            }),
        ])(),
      tap((params) => {
        assert(true);
      }),
    ])();

  const destroyById = ({ resource, live }) =>
    pipe([
      tap(() => {
        assert(live);
        assert(resource);
        logger.debug(`destroyById: ${tos(resource.toString())}`);
      }),
      () => resource,
      getClient,
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
              id: client.findId({ lives, config: getProviderConfig() })(live), // TODO remove id, only use live
              name: resource.name,
              resource,
              lives,
            }),
          isExpectedResult: () => true,
          shouldRetryOnException: client.shouldRetryOnExceptionDelete,
          config: getProviderConfig(),
        })
      ),
    ])();

  const onStateChangeResource =
    ({ operation, onStateChange }) =>
    ({ resource, error, ...other }) =>
      pipe([
        tap((params) => {
          assert(resource, "no resource");
          assert(resource.type, "no resource.type");
        }),
        () =>
          onStateChange({
            context: contextFromResource({ operation, resource }),
            error,
            ...other,
          }),
        tap.if(
          () => error,
          pipe([
            () =>
              onStateChange({
                context: contextFromPlanner({
                  providerName: resource.providerName,
                  title: TitleDeploying,
                }),
                nextState: nextStateOnError(true),
              }),
            () =>
              onStateChange({
                context: contextFromProvider({
                  providerName: getProvider(resource).displayName(),
                }),
                nextState: nextStateOnError(true),
              }),
          ])
        ),
      ])();

  const upsertResources = ({ plans, onStateChange, title }) =>
    pipe([
      tap((params) => {
        assert(onStateChange);
        assert(title);
        assert(Array.isArray(plans));
        assert(plans);
      }),
      () => plans,
      switchCase([
        isEmpty,
        pipe([() => ({ error: false, plans })]),
        pipe([
          () => ({
            plans,
            dependsOnType: getSpecs(),
            dependsOnInstance: mapToGraph(mapGloblalNameToResource),
            executor: plannerExecutor,
            onStateChange: onStateChangeResource({
              operation: TitleDeploying,
              onStateChange,
            }),
          }),
          Planner,
          callProp("run"),
          tap((params) => {
            assert(true);
          }),
          //omit(["plans"]),
        ]),
      ]),
    ])();

  const plannerExecutor = ({ item: { resource, live, action, diff } }) =>
    pipe([
      tap(() => {
        assert(resource);
        assert(resource.type);
        assert(resource.name);
        logger.debug(
          `plannerExecutor: executor ${resource.uri}, action: ${action}`
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
          //TODO rubico
          () => action === "UPDATE",
          ({ engine, input, resolvedDependencies }) =>
            engine.update({
              payload: input,
              live,
              diff: engine.spec.compare({
                ...engine.spec,
                live,
                lives,
                target: input,
                config: getProviderConfig(engine),
                targetResources: [...mapGloblalNameToResource.values()],
                programOptions,
              }),
              resolvedDependencies,
              lives,
            }),
          //TODO rubico
          () => action === "CREATE",
          ({ engine, input, resolvedDependencies }) =>
            pipe([
              () =>
                engine.create({
                  payload: input,
                  resolvedDependencies,
                  lives,
                }),
              tap((live) => {
                assert(live);
              }),
              decorateLive({
                client: engine.getClient(),
                lives,
                config: getProviderConfig(engine),
              }),
              tap((resource) => {
                lives.addResource({
                  groupType: engine.spec.groupType,
                  resource,
                });
              }),
            ])(),
          () => action === "WAIT_CREATION",
          ({ engine, input, resolvedDependencies }) =>
            pipe([
              () => ({ lives }),
              engine.waitForResourceUp,
              tap((params) => {
                assert(true);
              }),
            ])(),
          () => {
            assert(false, `action '${action}' is not handled`);
          },
        ]),
      }),
      pick(["input", "output"]),
      tap((params) => {
        assert(true);
      }),
    ])();

  const getProviders = pipe([() => stacks, pluck("provider")]);

  const getSpecs = pipe([
    getProviders,
    flatMap(pipe([callProp("getSpecs")])),
    tap((params) => {
      assert(true);
    }),
  ]);
  pipe([
    () => stacks,
    forEach(({ provider, resources, hooks }) =>
      pipe([
        tap(() => {
          assert(provider);
          assert(provider.register);
        }),
        () => provider.register({ resources, hooks }),
        () => provider.setLives(lives),
      ])()
    ),
  ])();

  const onStateChangeDefault =
    ({ onStateChange }) =>
    ({ key, error, result, nextState }) =>
      pipe([
        tap.if(
          pipe([() => ["DONE", "ERROR"], includes(nextState)]),
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
      tap(() => {
        assert(providerName);
      }),
      getProviders,
      find(eq(get("name"), providerName)),
      tap.if(isEmpty, () => {
        assert(`no provider with name: '${providerName}'`);
      }),
      tap((params) => {
        assert(true);
      }),
    ])();

  const listLives = ({
    onStateChange,
    onProviderEnd = () => {},
    options,
    readWrite,
  }) =>
    pipe([
      tap((providers) => {
        logger.info(`listLives ${JSON.stringify({ options, readWrite })}`);
        assert(onStateChange);
        assert(providers);
      }),
      map((provider) =>
        pipe([
          tap(() => {
            assert(provider);
          }),
          () =>
            provider.listLives({
              onStateChange,
              options,
              readWrite,
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
      tap((params) => {
        assert(true);
      }),
      addErrorToResults,
    ]);

  const displayLives = (lives) =>
    pipe([
      tap(() => {
        assert(lives);
        logger.info(`displayLive`);
      }),
      () => lives,
      get("results"),
      tap((results) => {
        assert(results);
      }),
      forEach(({ results, providerName }) => {
        displayLive({ providerName, resources: results });
      }),
    ])();

  const planQuery = ({ onStateChange = identity, providers } = {}) =>
    pipe([
      tap(() => {
        logger.info(`planQuery`);
        assert(Array.isArray(providers));
      }),
      () => providers,
      listLives({ onStateChange }),
      tap((params) => {
        assert(true);
      }),
      switchCase([
        get("error"),
        (livesData) => ({ lives: livesData }),
        (livesData) =>
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
                      livesData,
                      onStateChange,
                    }),
                ])(),
            })),
            Lister({
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
            tap((params) => {
              assert(true);
            }),
            assign({
              results: pipe([
                get("results"),
                callProp("sort", (a, b) =>
                  a.providerName.localeCompare(b.providerName)
                ),
              ]),
            }),
            (result) => ({
              lives: livesData,
              resultQuery: result,
            }),
            assignErrorToObject,
            tap((result) => {
              logger.info(`planQuery done`);
            }),
          ])(),
      ]),
      tap((params) => {
        assert(true);
      }),
    ]);

  const planApply = ({ plan, onStateChange }) =>
    pipe([
      tap(() => {
        logger.info(`planApply`);
        assert(Array.isArray(plan.results));
      }),
      () => plan,
      get("results"),
      filter(not(get("error"))),
      (plans) => ({ plans }),
      assign({
        start: pipe([
          get("plans"),
          map(
            tryCatch(
              pipe([
                pick(["providerName"]),
                getProvider,
                callProp("start", { onStateChange }),
              ]),
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
      assign({
        resultCreate: pipe([
          get("plans"),
          pluck("resultCreate"),
          flatten,
          (plans) =>
            upsertResources({
              plans,
              onStateChange,
              title: TitleDeploying,
            }),
          tap((params) => {
            assert(true);
          }),
        ]),
      }),
      assign({
        resultHooks: pipe([
          get("plans"),
          tap((params) => {
            assert(true);
          }),
          map(
            tryCatch(
              pipe([
                pick(["providerName"]),
                getProvider,
                callProp("runOnDeployed", { onStateChange }),
              ]),
              (error, { providerName }) => {
                logger.error(
                  `planApply hooks error ${tos(convertError({ error }))}`
                );
                return {
                  error: convertError({ error, name: "Apply" }),
                  providerName,
                };
              }
            )
          ),
          addErrorToResults,
        ]),
      }),
      tap((params) => {
        assert(true);
      }),
      tap(
        pipe([
          get("plans"),
          map(({ providerName }) =>
            pipe([
              () =>
                onStateChange({
                  context: contextFromPlanner({
                    providerName,
                    title: TitleDeploying,
                  }),
                  nextState: "DONE",
                }),
              () =>
                onStateChange({
                  context: contextFromProvider({
                    providerName: getProvider({ providerName }).displayName(),
                  }),
                  nextState: "DONE",
                }),
            ])()
          ),
        ])
      ),
      tap((params) => {
        assert(true);
      }),
      assignErrorToObject,
      tap((result) => {
        logger.info(`planApply done`);
      }),
    ])();

  const startProvider = ({ onStateChange }) =>
    pipe([
      tap(() => {
        logger.info(`startProvider`);
        assert(onStateChange);
        assert(stacks);
      }),
      () => stacks,
      map(({ provider, isProviderUp }) => ({
        ...runnerParams({ provider, isProviderUp, stacks }),
        executor: ({ results }) =>
          pipe([
            tap(() => {
              logger.info(`startProvider`);
            }),
            () => provider.start({ onStateChange }),
            tap((params) => {
              logger.info(`startProvider started`);
            }),
            () => ({
              provider,
              isProviderUp,
            }),
          ])(),
      })),
      Lister({
        onStateChange: ({ key, result, nextState }) =>
          pipe([
            tap.if(
              //TODO eq ?
              () => includes(nextState)(["ERROR"]),
              pipe([
                () => getProvider({ providerName: key }),
                tap((provider) => {
                  logger.error(`error startProvider provider ${provider.name}`);
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
      map(pick(["error", "providerName"])),
      addErrorToResults,
      tap(({ results }) => {
        logger.info(`startProvider #providers ${size(results)}`);
      }),
    ])();

  const planQueryDestroy = ({ onStateChange, options, providers }) =>
    pipe([
      tap(() => {
        logger.info(`planQueryDestroy ${JSON.stringify(options)}`);
        assert(onStateChange);
        assert(Array.isArray(providers));
      }),
      () => providers,
      listLives({ onStateChange, options, readWrite: true }),
      (livesData) =>
        pipe([
          tap((params) => {
            assert(livesData);
          }),
          //TODO start twice ?
          () => ({ onStateChange }),
          startProvider,
          () => providers,
          map((provider) =>
            pipe([
              tap((params) => {
                assert(provider);
              }),
              () =>
                provider.planQueryDestroy({
                  onStateChange,
                  options,
                  livesData,
                }),
              tap(({ error }) => {
                provider.spinnersStopProvider({
                  onStateChange,
                  error,
                });
              }),
            ])()
          ),
          tap((params) => {
            assert(true);
          }),
          addErrorToResults,
          (resultQueryDestroy) => ({ lives: livesData, resultQueryDestroy }),
          assignErrorToObject,
          tap((results) => {
            logger.info(`planQueryDestroy done`);
          }),
        ])(),
    ]);

  const planDestroy = ({ plan, onStateChange = identity, options }) =>
    pipe([
      tap(() => {
        logger.info(`planDestroy`);
        assert(plan);
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
                      plans,
                      planAll: plan,
                      onStateChange,
                      options,
                    }),
                }),
                assign({
                  resultHooks: () => provider.runOnDestroyed({ onStateChange }),
                }),
                assignErrorToObject,
                tap((xxx) => {
                  assert(xxx);
                }),
              ])(),
          }),
        ])()
      ),
      Lister({
        onStateChange: onStateChangeDefault({ onStateChange }),
      }),
      tap((result) => {
        logger.debug(`planDestroy done`);
      }),
    ])();

  //TODO do not use lister
  const runCommand = ({
    onStateChange = identity,
    commandOptions,
    programOptions,
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
            //TODO
            () =>
              provider[functionName]({
                onStateChange,
                commandOptions,
                programOptions,
                providers: getProviders(),
              }),
            assign({ providerName: () => provider.name }),
          ])(),
      })),
      Lister({
        onStateChange: onStateChangeDefault({ onStateChange }),
        name: functionName,
      }),
      tap((result) => {
        logger.info(`runCommand result: ${tos(result)}`);
      }),
    ])();

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
      () => hookInstance,
      get(hookType),
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
          () => hookInstance,
          get(hookType),
          callProp("init"),
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
          assignErrorToObject,
          tap((result) => {
            assert(true);
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

  const generateCode = ({ commandOptions, programOptions }) =>
    pipe([
      tap(() => {
        logger.info(
          `generateCode ${JSON.stringify({ commandOptions, programOptions })}`
        );
      }),
      getProviders,
      // Synchronous loop
      map.pool(
        1,
        tryCatch(
          callProp("generateCode", {
            commandOptions,
            programOptions,
            providers: getProviders(),
          }),
          (error) => {
            logger.error("generateCode", error);
            throw error;
          }
        )
      ),
    ])();

  return {
    startProvider,
    listLives,
    planQuery,
    planApply,
    planQueryDestroy,
    planDestroy,
    generateCode,
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
    buildGraphTree: ({ options }) =>
      buildGraphTree({
        providers: getProviders(),
        options,
      }),
    generateCode,
    getResource,
  };
};
