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
  pick,
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
const { Lister } = require("./Lister");

const logger = require("../logger")({ prefix: "ProviderGru" });
const { tos } = require("../tos");
const { convertError } = require("./Common");

const { displayLive } = require("../cli/displayUtils");

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
  meta: { providerName: provider.name },
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

exports.ProviderGru = ({ stacks }) => {
  assert(Array.isArray(stacks));

  const getProviders = () => pipe([map(get("provider"))])(stacks);

  forEach(({ provider, resources, hooks }) =>
    provider.register({ resources, hooks })
  )(stacks);

  const onStateChangeDefault = ({ onStateChange }) => ({
    key,
    error,
    result,
    nextState,
  }) =>
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

  //TODO remove it
  const start = ({ onStateChange }) =>
    pipe([
      tap(() => {
        logger.info(`start`);
      }),
      () => getProviders(),
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

  const listLives = async ({ onStateChange, options }) =>
    pipe([
      tap(() => {
        logger.info(`listLives ${JSON.stringify(options)}`);
        assert(onStateChange);
      }),
      () => stacks,
      map(({ provider, isProviderUp }) => ({
        ...runnerParams({ provider, isProviderUp, stacks }),
        executor: ({ lives }) =>
          pipe([
            () => provider.start({ onStateChange }),
            () => provider.listLives({ onStateChange, lives, options }),
          ])(),
      })),
      (inputs) =>
        Lister({
          inputs,
          onStateChange: ({ key, error, result, nextState }) =>
            pipe([
              tap.if(
                () => includes(nextState)(["DONE", "ERROR"]),
                pipe([
                  () => getProvider({ providerName: key }),
                  (provider) =>
                    provider.spinnersStopListLives({
                      onStateChange,
                      error: result?.error || error,
                    }),
                ])
              ),
            ])(),
        }),
      tap((result) => {
        logger.info(`listLives result: ${tos(result)}`);
      }),
    ])();

  const displayLives = ({ results }) =>
    pipe([
      tap(() => {
        assert(Array.isArray(results));
        logger.info(`displayLive ${results.length}`);
      }),
      () => results,
      forEach(({ results, providerName }) => {
        displayLive({ providerName, resources: results });
      }),
    ])();

  const planQuery = ({ onStateChange = identity } = {}) =>
    pipe([
      tap(() => {
        logger.info(`planQuery`);
      }),
      () => stacks,
      map(({ provider, isProviderUp }) => ({
        ...runnerParams({ provider, isProviderUp, stacks }),
        executor: ({ lives }) =>
          pipe([
            () => provider.start({ onStateChange }),
            () => provider.planQuery({ onStateChange, lives }),
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
      tap((result) => {
        logger.info(`planQuery result: ${tos(result)}`);
      }),
    ])();

  const planApply = ({ plan, onStateChange }) =>
    pipe([
      tap(() => {
        logger.info(`planApply`);
        assert(Array.isArray(plan.results));
      }),
      () => plan.results,
      //filter(not(get("error"))),
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
                  () =>
                    provider.planApply({
                      plan: planPerProvider,
                      onStateChange,
                    }),
                  assign({
                    resultHooks: () =>
                      provider.runOnDeployed({ onStateChange }),
                  }),
                  assign({ error: any(get("error")) }),
                  tap((xxx) => {
                    assert(xxx);
                  }),
                ])(),
            ])(),
          (error, { providerName }) => {
            logger.error(`planApply ${tos(error)}`);
            return {
              error: convertError({ error, name: "Apply" }),
              providerName,
            };
          }
        )
      ),
      (results) => ({ error: any(get("error"))(results), results }),
      tap((result) => {
        logger.info(`planApply done`);
      }),
    ])();

  const planQueryDestroy = async ({ onStateChange, options }) =>
    pipe([
      tap(() => {
        logger.info(`planQueryDestroy`);
        assert(onStateChange);
      }),
      () => stacks,
      map(({ provider, isProviderUp }) => ({
        ...runnerParams({ provider, isProviderUp, stacks }),
        executor: ({ lives }) =>
          pipe([
            () => provider.start({ onStateChange }),
            () => provider.planQueryDestroy({ onStateChange, options, lives }),
          ])(),
      })),
      (inputs) =>
        Lister({
          inputs,
          onStateChange: onStateChangeDefault({ onStateChange }),
        }),
      tap((result) => {
        logger.info(`planQueryDestroy done`);
      }),
    ])();

  const planDestroy = async ({ plan, onStateChange = identity, options }) =>
    pipe([
      tap(() => {
        logger.info(`planDestroy`);
        assert(plan);
      }),
      () => plan.results,
      filter(not(get("error"))),
      map(({ providerName, lives, plans }) =>
        pipe([
          () => getStack({ providerName }),
          ({ provider, isProviderUp }) => ({
            key: providerName,
            meta: { providerName },
            dependsOn: pipe([
              () => stacks,
              buildDependsOnReverse,
              find(eq(get("name"), providerName)),
              get("dependsOn"),
            ])(),
            isUp: isProviderUp,
            executor: ({}) =>
              pipe([
                () => provider.start({ onStateChange }),
                assign({
                  resultDestroy: () =>
                    provider.planDestroy({
                      plans: plans,
                      lives: lives,
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

  const destroyAll = () =>
    pipe([
      tap(() => {
        //TODO
        logger.info(`planQuery `);
        assert(false);
      }),
    ])();

  const runCommand = ({
    onStateChange = identity,
    options,
    functionName,
  } = {}) =>
    pipe([
      tap(() => {
        logger.info(`runCommand ${functionName}`);
      }),
      () => stacks,
      map(({ provider, isProviderUp }) => ({
        ...runnerParams({ provider, isProviderUp, stacks }),
        executor: ({ lives }) =>
          pipe([
            tap(() => {
              assert(provider[functionName]);
            }),
            () => provider.start({ onStateChange }),
            () => provider[functionName]({ onStateChange, options, lives }),
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
    return await planApply({ plan, onStateChange });
  };

  return {
    start,
    listLives,
    planQuery,
    planApply,
    planQueryDestroy,
    planDestroy,
    destroyAll,
    planQueryAndApply,
    displayLives,
    getProvider,
    getProviders,
    runCommand,
  };
};
