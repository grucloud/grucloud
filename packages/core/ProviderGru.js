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

const logger = require("./logger")({ prefix: "ProviderGru" });
const { tos } = require("./tos");
const { convertError } = require("./Common");

const { displayLive } = require("./cli/displayUtils");

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

  const createLives = () => {
    const mapPerProvider = new Map();

    let error;

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

    return {
      get error() {
        return error;
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
        resources = [],
        error: latestError,
      }) => {
        assert(providerName);
        assert(type);
        assert(Array.isArray(resources) || latestError);
        logger.debug(
          `live addResources ${JSON.stringify({
            providerName,
            type,
            resourceCount: resources.length,
          })}`
        );

        const mapPerType = mapPerProvider.get(providerName) || new Map();
        mapPerType.set(type, { type, resources, error: latestError });
        mapPerProvider.set(providerName, mapPerType);

        if (latestError) {
          error = true;
        }
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
      getByType: ({ providerName, type }) =>
        pipe([
          () => mapPerProvider.get(providerName) || new Map(),
          (mapPerType) => mapPerType.get(type),
          tap.if(isEmpty, () => {
            logger.error(
              `cannot find type ${type} on provider ${providerName}`
            );
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
        ])(),
    };
  };

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
              tap((result) => {
                logger.info(`listLives result: ${tos(result)}`);
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
          tap((xxx) => {
            logger.info(`listLives result: ${lives.toString()}`);
          }),
          () => lives,
        ])(),
    ])();

  const displayLives = (lives) =>
    pipe([
      tap(() => {
        assert(lives);
        logger.info(`displayLive`);
      }),
      () => lives.json,
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
                        assert(xxx);
                      }),
                    ])(),
                ])(),
              (error, { providerName }) => {
                logger.error(`planApply start error ${tos(error)}`);
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
                    assign({ error: any(get("error")) }),
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
      map(
        assign({
          providerUp: ({ provider, isProviderUp = () => true }) =>
            pipe([
              () => provider.start({ onStateChange }),
              () => isProviderUp(),
            ])(),
        })
      ),
      tap((stacks) => {
        assert(stacks);
      }),
      (stacks) =>
        filter(({ provider }) =>
          pipe([
            () => provider.dependencies,
            map(
              pipe([
                (providerDep) =>
                  find(eq(get("provider.name"), providerDep.name))(stacks),
                tap((xxx) => {
                  assert(true);
                }),
                get("providerUp", true),
                tap((isUp) => {
                  logger.info(`provider is up: ${isUp}`);
                }),
              ])
            ),
            values,
            tap((ups) => {
              assert(ups);
            }),
            all((v) => v),
            tap((keep) => {
              assert(true);
            }),
          ])()
        )(stacks),
      tap((results) => {
        logger.info(`filterProviderUp #providers ${results.length}`);
      }),
    ])();

  const planQueryDestroy = async ({ onStateChange, options }) =>
    pipe([
      tap(() => {
        logger.info(`planQueryDestroy`);
        assert(onStateChange);
      }),
      () => listLives({ onStateChange, options, readWrite: true }),
      (lives) =>
        pipe([
          () => stacks, // filter by isProviderUp
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
        logger.info(`runCommand ${functionName}`);
      }),
      () => stacks, //TODO provider up
      map(({ provider, isProviderUp }) => ({
        ...runnerParams({ provider, isProviderUp, stacks }),
        executor: ({ results }) =>
          pipe([
            tap(() => {
              assert(provider[functionName]);
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

  const buildSubGraph = ({ options }) =>
    pipe([
      () => getProviders(),
      map(
        tryCatch(
          (provider) => provider.buildSubGraph({ options }),
          (error, provider) => {
            return { error, provider: provider.toString() };
          }
        )
      ),
      (results) => results.join("\n"),
      tap((result) => {
        logger.info(`buildSubGraph ${result}`);
      }),
    ])();

  const buildGraphAssociation = ({ options }) =>
    pipe([
      () => getProviders(),
      map(
        tryCatch(
          (provider) => provider.buildGraphAssociation({ options }),
          (error, provider) => {
            return { error, provider: provider.toString() };
          }
        )
      ),
      (results) => results.join("\n"),
      tap((result) => {
        logger.info(`buildGraphAssociation ${result}`);
      }),
    ])();

  const buildGraph = ({ options }) =>
    pipe([
      tap(() => {
        logger.info(`buildGraph ${tos(options)}`);
      }),
      () => `digraph graphname {
  rankdir=LR; 
  ${buildSubGraph({ options })}
  ${buildGraphAssociation({ options })}
}`,
      tap((result) => {
        logger.info(`buildGraph done`);
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
    buildGraph,
  };
};
