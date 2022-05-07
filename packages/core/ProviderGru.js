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
  reduce,
  eq,
  not,
  omit,
  transform,
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
const { buildGraphTree } = require("./GraphTree");

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
  commandOptions,
  programOptions,
  hookGlobal,
  stacks,
}) => {
  assert(Array.isArray(stacks));

  const lives = createLives();

  const getProviders = () => pipe([() => stacks, pluck("provider")])();

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
      () => getProviders(),
      find(eq(get("name"), providerName)),
      tap.if(isEmpty, () => {
        assert(`no provider with name: '${providerName}'`);
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
      map(({ provider }) =>
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
      () => lives,
    ]);

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
      tap((providers) => {
        logger.info(`planQuery`);
        assert(Array.isArray(providers));
      }),
      listLives({ onStateChange }),
      tap((params) => {
        assert(true);
      }),
      switchCase([
        get("error"),
        pipe([
          () => ({
            lives: lives,
          }),
        ]),
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
          (result) => ({
            lives: lives,
            resultQuery: result,
          }),
          assign({ error: any(get("error")) }),
          tap((result) => {
            logger.info(`planQuery done`);
          }),
        ]),
      ]),
    ]);

  const planApply = ({ plan, onStateChange, onProviderEnd = () => {} }) =>
    pipe([
      tap(() => {
        logger.info(`planApply`);
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
                  () => ({
                    providerName: planPerProvider.providerName,
                  }),
                  getProvider,
                  // TODO do we need that here
                  (provider) => provider.start({ onStateChange }),
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
      assign({
        results: pipe([
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
                      () =>
                        provider.planApply({
                          plan: planPerProvider,
                          onStateChange,
                        }),
                      tap((params) => {
                        assert(true);
                      }),
                      assign({
                        resultHooks: () =>
                          provider.runOnDeployed({ onStateChange }),
                      }),
                      tap((params) => {
                        assert(true);
                      }),
                      assign({
                        error: pipe([/*omit(["lives"]),*/ any(get("error"))]),
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
          ),
        ]),
      }),
      assign({ error: pipe([get("results"), any(get("error"))]) }),
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
            tap(() => {
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
      tap((results) => {
        logger.info(`startProvider #providers ${size(results)}`);
      }),
    ])();

  const planQueryDestroy = ({ onStateChange, options }) =>
    pipe([
      tap((providers) => {
        logger.info(`planQueryDestroy ${JSON.stringify(options)}`);
        assert(onStateChange);
        assert(stacks);
        assert(Array.isArray(providers));
      }),
      listLives({ onStateChange, options, readWrite: true }),
      () =>
        pipe([
          //TODO start twice ?
          () => ({ onStateChange }),
          startProvider,
          map(({ provider, isProviderUp }) =>
            pipe([
              () =>
                provider.planQueryDestroy({
                  onStateChange,
                  options,
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
          (results) => ({ error: any(get("error"))(results), results }),
          (resultQueryDestroy) => ({ lives: lives, resultQueryDestroy }),
          assign({ error: any(get("error")) }),
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
            () =>
              provider[functionName]({
                onStateChange,
                commandOptions,
                programOptions,
              }),
            assign({ providerName: () => provider.name }),
            tap((xxx) => {
              assert(xxx);
            }),
          ])(),
      })),
      Lister({
        onStateChange: onStateChangeDefault({ onStateChange }),
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
          assign({ error: any(get("error")) }),
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

  const generateCode = ({ commandOptions, programOptions }) =>
    pipe([
      tap(() => {
        logger.info(
          `generateCode ${JSON.stringify({ commandOptions, programOptions })}`
        );
      }),
      getProviders,
      map(
        tryCatch(
          callProp("generateCode", { commandOptions, programOptions }),
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
  };
};
