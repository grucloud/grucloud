const assert = require("assert");
const plu = require("pluralize");
const prompts = require("prompts");
const colors = require("colors/safe");
const fs = require("fs");
const path = require("path");
const shell = require("shelljs");

const {
  map,
  pipe,
  switchCase,
  reduce,
  tap,
  assign,
  all,
  filter,
  not,
  any,
  or,
  tryCatch,
  get,
} = require("rubico");
const {
  pluck,
  isEmpty,
  flatten,
  forEach,
  uniq,
  size,
  first,
} = require("rubico/x");

const logger = require("../logger")({ prefix: "CliCommands" });
const YAML = require("./json2yaml");
const { runAsyncCommand, displayProviderList } = require("./cliUtils");
const {
  displayPlan,
  displayPlanSummary,
  displayPlanDestroySummary,
  displayListSummary,
  displayLive,
} = require("./displayUtils");
const { convertError, HookType } = require("../providers/Common");
const { tos } = require("../tos");
// Common

const DisplayAndThrow = ({ name }) => (error) => {
  displayError({ name, error });
  throw { code: 422, error: { ...error, displayed: true } };
};

const throwIfError = tap((result) => {
  if (result?.error) {
    throw {
      ...result,
    };
  }
});

const formatResource = ({ providerName, type, name, id } = {}) =>
  `${providerName}/${type}/${name || id}`;

const countDeployResources = pipe([
  tap((input) => {
    assert(input);
    assert(input.mapProvider);
  }),
  get("mapProvider"),
  reduce(
    (acc, value) => {
      assert(value.resultCreate, "resultCreate");
      assert(value.resultDestroy, "resultDestroy");
      const createCount = value.resultCreate.length;
      const destroyCount = value.resultDestroy.length;
      const providerActive = createCount > 0 || destroyCount > 0 ? 1 : 0;
      return {
        providers: acc.providers + providerActive,
        types:
          acc.types +
          pipe([pluck("resource.type"), uniq, size])(value.resultCreate),
        create: acc.create + createCount,
        destroy: acc.destroy + destroyCount,
      };
    },
    { providers: 0, types: 0, create: 0, destroy: 0 }
  ),
  tap((result) => {
    logger.debug(`countDeployResources ${JSON.stringify(result)}`);
  }),
]);

const hasPlans = pipe([
  tap((input) => {
    assert(input);
    assert(input.resultCreate);
    assert(input.resultCreate.plans);
    assert(input.resultDestroy);
    assert(input.resultDestroy.plans);
  }),
  ({ resultCreate, resultDestroy }) =>
    resultCreate.plans.length > 0 || resultDestroy.plans.length > 0,
  tap((hasPlan) => {
    logger.debug(`hasPlans ${hasPlan}`);
  }),
]);

const saveToJson = ({ command, commandOptions, programOptions, result }) => {
  if (!programOptions.json) {
    return;
  }
  fs.writeFileSync(
    programOptions.json,
    JSON.stringify({ command, commandOptions, programOptions, result }, null, 4)
  );
};

const displayLiveError = (result) =>
  pipe([
    tap((results) => {
      //logger.debug(results);
    }),
    filter(get("error")),
    forEach(({ type, error }) => {
      console.error(`${type}: ${error.message}`);
      error.stack && console.error(error.stack);
    }),
  ])(result.results);

const displayPlanQueryErrorResult = pipe([
  tap((result) => {
    logger.debug(result);
  }),
  filter(get("error")),
  forEach(({ resource, error }) => {
    console.error(`Resource: ${resource.uri}`);
    console.log(YAML.stringify(convertError({ error })));
  }),
]);

const displayPlanApplyErrorResult = pipe([
  tap((xx) => {
    logger.debug(tos(xx));
  }),
  filter(({ error }) => error),
  forEach(({ error, item: { resource } }) => {
    console.error(`Resource: ${resource.uri}`);
    console.log(YAML.stringify(convertError({ error })));
  }),
]);

const displayErrorHooks = ({ resultsHook }) => {
  if (resultsHook?.error) {
    pipe([
      tap((xx) => {
        logger.debug(tos(xx));
      }),
      pluck("result"),
      tap((xx) => {
        logger.debug(tos(xx));
      }),
      filter(get("error")),
      pluck("results"),
      flatten,
      tap((xx) => {
        logger.debug(tos(xx));
      }),
      filter(get("error")),
      tap((xx) => {
        logger.debug(tos(xx));
      }),
      pluck("results"),
      tap((xx) => {
        logger.debug(tos(xx));
      }),
      flatten,
      tap((xx) => {
        logger.debug(tos(xx));
      }),
      filter(get("error")),
      forEach(({ error, hookName, providerName, hookType, action }) => {
        assert(providerName);
        const fullName = `${providerName}::${hookName}::${hookType}::${
          action ? action : "init"
        }`;
        console.log(`Error running hook '${fullName}'`);
        console.log(YAML.stringify(convertError({ error })));
      }),
    ])(resultsHook.results);
  }
};

const displayErrorResults = ({ results = [], name }) => {
  if (!isEmpty(results)) {
    pipe([
      //TODO
      tap((results) => {
        logger.debug(`displayErrorResults ${tos(results)}`);
      }),
      //filter(({ result }) => result?.error),
      forEach(({ result, error, resultQuery }) => {
        if (error) {
          console.log(YAML.stringify(convertError({ error, name })));
        }
        if (resultQuery) {
          resultQuery.lives.error && displayLiveError(resultQuery.lives);
          displayPlanQueryErrorResult(resultQuery.resultCreate.plans);
          displayPlanQueryErrorResult(resultQuery.resultDestroy.plans);
        }

        if (result?.resultCreate?.results) {
          displayPlanApplyErrorResult(result.resultCreate.results);
        }
        if (result?.resultDestroy?.results) {
          displayPlanApplyErrorResult(result.resultDestroy.results);
        }

        if (result?.results) {
          pipe([
            filter(({ error }) => error),
            forEach(({ item, type, client, error }) => {
              item && console.log(`Resource ${formatResource(item.resource)}`);
              client && console.log(`Client ${client.type}`);
              type && console.log(`Client ${type}`);

              console.log(YAML.stringify(convertError({ error, name })));
            }),
          ])(result.results);
        }
      }),
    ])(results);
  }
};

const displayError = ({ name, error }) => {
  assert(error);
  assert(name);
  console.error(`ERROR running command '${name}'`);
  displayErrorResults({ name, results: error.resultQuery });
  displayErrorResults({ name, results: error.resultsDestroy });
  displayErrorHooks({ name, resultsHook: error.resultsHook });

  const results = error.resultsDestroy || error.results || error.resultsHook;

  if (!results) {
    console.log(YAML.stringify(convertError({ error })));
  }
};

const displayCommandHeader = ({ providers, verb }) =>
  `${verb} resources on ${plu(
    "provider",
    providers.length,
    true
  )}: ${displayProviderList(providers)}`;

// Plan Query
const doPlanQuery = ({ commandOptions, programOptions }) =>
  pipe([
    tap((input) => {
      logger.debug("doPlanQuery");
      assert(input.providersGru);
      assert(input.providersGru.getProviders().length > 0);
    }),
    ({ providersGru }) =>
      runAsyncCommand({
        text: displayCommandHeader({
          providers: providersGru.getProviders(),
          verb: "Querying",
        }),
        command: ({ onStateChange }) =>
          pipe([
            tap(() =>
              map.series((provider) =>
                provider.spinnersStartQuery({
                  onStateChange,
                  options: commandOptions,
                })
              )(providersGru.getProviders())
            ),
            assign({
              resultStart: () =>
                providersGru.start({
                  onStateChange,
                }),
            }),
            assign({
              resultQuery: () =>
                providersGru.planQuery({ onStateChange, commandOptions }),
            }),
          ])({}),
      }),
    tap((result) => {
      assert(result);
    }),
    assign({ error: any(get("error")) }),
    tap(
      pipe([
        tap((result) => {
          assert(result);
        }),
        get("resultQuery.mapProvider"),
        tap(
          pipe([
            forEach(({ providerName, resultCreate, resultDestroy }) =>
              displayPlan({
                providerName,
                newOrUpdate: resultCreate,
                destroy: resultDestroy,
              })
            ),
          ])
        ),
        tap((result) => {
          assert(result);
        }),
        displayPlanSummary,
      ])
    ),
  ]);

const displayQueryNoPlan = () =>
  console.log("Nothing to deploy, everything is up to date");

const displayQueryPlanSummary = ({ providers, create, destroy }) =>
  console.log(
    `${plu("resource", create, true)} to deploy${
      destroy > 0 ? ` and ${plu("resource", destroy, true)} to destroy` : ""
    } on ${plu("provider", providers, true)}`
  );

const planQuery = async ({ infra, commandOptions = {}, programOptions = {} }) =>
  tryCatch(
    pipe([
      doPlanQuery({ commandOptions, programOptions }),
      tap((result) =>
        saveToJson({ command: "plan", commandOptions, programOptions, result })
      ),
      throwIfError,
      tap(
        pipe([
          tap((result) => {
            assert(result.resultQuery);
          }),
          get("resultQuery"),
          switchCase([
            hasPlans,
            pipe([countDeployResources, displayQueryPlanSummary]),
            displayQueryNoPlan,
          ]),
        ])
      ),
    ]),
    DisplayAndThrow({ name: "Plan" })
  )(infra);

exports.planQuery = planQuery;

const commandToFunction = (command) =>
  `run${command.charAt(0).toUpperCase()}${command.slice(1)}`;

const runAsyncCommandHook = ({ hookType, commandTitle, providersGru }) =>
  pipe([
    tap(() => {
      logger.debug(`runAsyncCommandHook hookType: ${hookType}`);
      assert(providersGru);
    }),
    assign({
      resultsHook: () =>
        runAsyncCommand({
          text: displayCommandHeader({
            providers: providersGru.getProviders(),
            verb: commandTitle,
          }),
          command: ({ onStateChange }) =>
            pipe([
              tap(() =>
                map((provider) =>
                  provider.spinnersStartHook({
                    onStateChange,
                    hookType,
                  })
                )(providersGru.getProviders())
              ),
              assign({
                resultStart: () =>
                  providersGru.start({
                    onStateChange,
                  }),
              }),
              assign({
                result: () =>
                  pipe([
                    map((provider) =>
                      pipe([
                        () => provider[commandToFunction(hookType)],
                        tap((fun) => {
                          assert(fun, `no provider hook for ${hookType}`);
                        }),
                        (fun) => fun({ onStateChange }),
                        tap(({ error }) =>
                          provider.spinnersStopProvider({
                            onStateChange,
                            error,
                          })
                        ),
                      ])()
                    ),
                    (results) => ({
                      error: any(get("error"))(results),
                      results,
                    }),
                  ])(providersGru.getProviders()),
              }),
              assign({ error: any(get("error")) }),
              tap((xxx) => {
                assert(xxx);
              }),
            ])({}),
        }),
    }),
    assign({ error: ({ error, resultsHook }) => error || resultsHook.error }),
    tap((xxx) => {
      logger.debug(`runAsyncCommandHook hookType: ${hookType} DONE`);
    }),
    throwIfError,
  ]);

// planRunScript
const planRunScript = async ({
  infra,
  commandOptions = {},
  programOptions = {},
}) =>
  tryCatch(
    pipe([
      tap((input) => {
        logger.debug("planRunScript");
        assert(input.providersGru);
      }),
      ({ providersGru }) =>
        switchCase([
          () => commandOptions.onDeployed,
          () =>
            runAsyncCommandHook({
              providersGru,
              hookType: HookType.ON_DEPLOYED,
              commandTitle: `Running OnDeployed`,
            })({}),
          () => commandOptions.onDestroyed,
          () =>
            runAsyncCommandHook({
              providersGru,
              hookType: HookType.ON_DESTROYED,
              commandTitle: `Running OnDestroyed`,
            })({}),
          () => {
            throw { code: 422, message: "no command found" };
          },
        ])(),
      tap((result) => {
        logger.debug("planRunScript Done");
      }),
      tap((result) =>
        saveToJson({
          command: "runScript",
          commandOptions,
          programOptions,
          result,
        })
      ),
      throwIfError,
    ]),
    DisplayAndThrow({ name: "Run Script" })
  )(infra);

exports.planRunScript = planRunScript;

// Plan Apply

const processNoPlan = () => {
  console.log("Nothing to deploy");
  return true;
};

const abortDeploy = () => {
  console.log("Deployment aborted");
};

exports.planApply = async ({
  infra,
  commandOptions = {},
  programOptions = {},
}) => {
  const promptConfirmDeploy = (allPlans) =>
    pipe([
      tap((result) => {
        logger.debug("promptConfirmDeploy");
      }),
      countDeployResources,
      ({ providers, types, create, destroy }) =>
        prompts({
          type: "confirm",
          name: "confirmDeploy",
          message: `Are you sure to deploy ${plu(
            "resource",
            create,
            true
          )}, ${plu("type", types, true)} on ${plu(
            "provider",
            providers,
            true
          )}${
            destroy > 0 ? ` and destroy ${plu("resource", destroy, true)}` : ""
          }?`,
          initial: false,
        }),
      tap((result) => {
        logger.debug("promptConfirmDeploy");
      }),
      ({ confirmDeploy }) => confirmDeploy,
    ])(allPlans);

  const displayDeploySuccess = pipe([
    tap((input) => {
      logger.debug("displayDeploySuccess");
      assert(input.mapProvider);
    }),
    countDeployResources,
    ({ providers, types, create, destroy }) =>
      console.log(
        `${plu("resource", create, true)} deployed${
          destroy > 0 ? ` and ${plu("resource", destroy, true)} destroyed` : ""
        } of ${plu("type", types, true)} and ${plu(
          "provider",
          providers,
          true
        )}`
      ),
  ]);

  const doPlansDeploy = ({ commandOptions, providersGru }) =>
    pipe([
      tap((result) => {
        logger.debug("doPlansDeploy ", providersGru.sequencial);
      }),
      (result) =>
        runAsyncCommand({
          text: displayCommandHeader({
            providers: providersGru.getProviders(),
            verb: "Deploying",
          }),
          command: ({ onStateChange }) =>
            pipe([
              () => result,
              tap(
                pipe([
                  get("mapProvider"),
                  map.series(({ providerName, plans }) =>
                    providersGru
                      .getProvider({ providerName })
                      .spinnersStartDeploy({
                        onStateChange,
                        plan: result,
                      })
                  ),
                ])
              ),
              tap((xx) => {
                logger.debug("doPlansDeploy Spinners started");
              }),
              assign({
                resultStart: () =>
                  providersGru.start({
                    onStateChange,
                  }),
              }),
              assign({
                result: () =>
                  providersGru.planApply({
                    onStateChange,
                    plan: result,
                  }),
              }),
              /*mapFunction(providersGru.sequencial)(
                pipe([
                  assign({
                    result: ({ provider, resultQuery }) =>
                      provider.planApply({
                        plan: resultQuery,
                        onStateChange,
                      }),
                  }),
                  tap(({ provider, result }) =>
                    provider.spinnersStopProvider({
                      onStateChange,
                      error: result.error,
                    })
                  ),
                ])
              ),*/
            ])(),
        }),

      assign({ error: any(get("error")) }),
      tap((result) => {
        logger.debug("doPlansDeploy");
      }),
      tap((result) =>
        saveToJson({ command: "apply", commandOptions, programOptions, result })
      ),
      throwIfError,
      tap((result) => {
        logger.debug("doPlansDeploy");
      }),
      tap(
        pipe([
          tap((result) => {
            logger.debug("doPlansDeploy");
          }),

          displayDeploySuccess,
        ])
      ),
    ]);

  const processDeployPlans = ({ providersGru }) =>
    switchCase([
      (allplans) => commandOptions.force || promptConfirmDeploy(allplans),
      doPlansDeploy({ commandOptions, providersGru }),
      abortDeploy,
    ]);

  return tryCatch(
    pipe([
      () => infra,
      ({ providersGru }) =>
        pipe([
          () => ({ providersGru }),
          doPlanQuery({ commandOptions, programOptions }),
          throwIfError,
          tap((result) => {
            assert(result);
          }),
          get("resultQuery"),
          switchCase([
            hasPlans,
            processDeployPlans({ providersGru }),
            processNoPlan,
          ]),
          tap.if(
            (result) => result,
            (result) =>
              runAsyncCommandHook({
                providersGru,
                hookType: HookType.ON_DEPLOYED,
                commandTitle: `Running OnDeployed`,
                result,
              })()
          ),
        ])(),
    ]),
    DisplayAndThrow({ name: "Plan Apply" })
  )();
};

// Plan Destroy

const processHasNoPlan = tap(() => {
  console.log("No resources to destroy");
});

const countDestroyed = reduce(
  (acc, value) => {
    assert(value, "value.result");
    assert(value.plans, "value.plans");
    const resourceCount = value.plans.length;
    const providerActive = resourceCount > 0 ? 1 : 0;
    return {
      providers: acc.providers + providerActive,
      types:
        acc.types + pipe([pluck("resource.type"), uniq, size])(value.plans),
      resources: acc.resources + resourceCount,
    };
  },
  { providers: 0, types: 0, resources: 0 }
);

const displayDestroySuccess = pipe([
  tap((x) => {
    logger.debug(`displayDestroySuccess`);
  }),
  get("resultProviders"),
  tap((resultProviders) => {
    assert(resultProviders);
  }),
  countDestroyed,
  tap((stats) => {
    logger.debug(`displayDestroySuccess ${tos(stats)}`);
  }),
  ({ providers, types, resources }) =>
    console.log(
      `${plu("resource", resources, true)} destroyed, ${plu(
        "type",
        types,
        true
      )} on ${plu("provider", providers, true)}`
    ),
]);

const promptConfirmDestroy = (result) =>
  pipe([
    () => result.resultProviders,
    tap((resultProviders) => {
      assert(resultProviders);
      logger.debug(`promptConfirmDestroy`);
    }),
    countDestroyed,
    ({ providers, types, resources }) =>
      prompts({
        type: "confirm",
        name: "confirmDestroy",
        message: colors.red(
          `Are you sure to destroy ${plu("resource", resources, true)}, ${plu(
            "type",
            types,
            true
          )} on ${plu("provider", providers, true)}?`
        ),
        initial: false,
      }),
    get("confirmDestroy"),
  ])();

const displayDestroyErrors = pipe([
  tap((x) => {
    //TODO
    //logger.error(`displayDestroyErrors ${tos(x)}`);
  }),
]);

exports.planDestroy = async ({
  infra,
  commandOptions = {},
  programOptions = {},
}) => {
  const doPlansDestroy = ({ commandOptions, providersGru, lives }) =>
    pipe([
      tap(({ plans, resultProviders }) => {
        logger.debug(`doPlansDestroy`);
        assert(plans);
        assert(resultProviders);
      }),
      assign({
        resultsDestroy: (result) =>
          runAsyncCommand({
            text: displayCommandHeader({
              providers: providersGru.getProviders(),
              verb: "Destroying",
            }),
            command: ({ onStateChange }) =>
              pipe([
                () => result,
                tap(
                  pipe([
                    get("resultProviders"),
                    map.series(({ providerName, plans }) =>
                      providersGru
                        .getProvider({ providerName })
                        .spinnersStartDestroy({
                          onStateChange,
                          plans,
                        })
                    ),
                  ])
                ),
                assign({
                  resultStart: () =>
                    providersGru.start({
                      onStateChange,
                    }),
                }),
                tap((xxx) => {
                  assert(xxx);
                }),
                assign({
                  result: ({ plans, resultProviders }) =>
                    providersGru.planDestroy({
                      onStateChange,
                      lives,
                      plans: plans.reverse(),
                      resultProviders,
                    }),
                }),
              ])(),
          }),
      }),
      tap((xxx) => {
        assert(xxx);
      }),
      assign({ error: pipe([get("resultsDestroy"), any(get("error"))]) }),
      tap((xxx) => {
        assert(xxx);
      }),
      tap((result) =>
        saveToJson({
          command: "destroy",
          commandOptions,
          programOptions,
          result,
        })
      ),
      tap(
        switchCase([get("error"), displayDestroyErrors, displayDestroySuccess])
      ),
      tap((result) => {
        logger.debug(`doPlansDestroy finished, error: ${result.error}`);
      }),
    ]);

  const processDestroyPlans = ({ providersGru, lives }) =>
    pipe([
      tap((input) => {
        assert(input.plans);
        logger.debug("processDestroyPlans");
      }),
      //get("plans"),
      switchCase([
        (plans) => commandOptions.force || promptConfirmDestroy(plans),
        doPlansDestroy({ commandOptions, providersGru, lives }),
        tap(() => {
          console.log("Abort destroying plan");
        }),
      ]),
    ]);

  return tryCatch(
    pipe([
      ({ providersGru }) =>
        pipe([
          () =>
            runAsyncCommand({
              text: displayCommandHeader({
                providers: providersGru.getProviders(),
                verb: "Find",
              }),
              command: ({ onStateChange }) =>
                pipe([
                  tap(() =>
                    map.series((provider) =>
                      provider.spinnersStartDestroyQuery({
                        onStateChange,
                        options: commandOptions,
                      })
                    )(providersGru.getProviders())
                  ),
                  assign({
                    resultStart: () =>
                      providersGru.start({
                        onStateChange,
                      }),
                  }),
                  assign({
                    lives: () =>
                      providersGru.listLives({
                        onStateChange,
                        options: commandOptions,
                        readWrite: true,
                      }),
                  }),
                  assign({
                    result: ({ lives }) =>
                      providersGru.planFindDestroy({
                        onStateChange,
                        options: commandOptions,
                        lives,
                      }),
                  }),
                  tap((xxx) => {
                    assert(xxx);
                  }),
                  assign({ error: any(get("error")) }),
                  tap(
                    pipe([
                      get("result.resultProviders"),
                      tap((xxx) => {
                        //console.log(JSON.stringify(xxx, null, 4));
                      }),
                      forEach(
                        pipe([
                          ({ providerName, error }) =>
                            providersGru
                              .getProvider({ providerName })
                              .spinnersStopProvider({
                                onStateChange,
                                error,
                              }),
                        ])
                      ),
                    ])
                  ),
                ])({}),
            }),
          tap((xxx) => {
            assert(xxx);
          }),
          tap(
            pipe([
              get("result.resultProviders"),
              forEach(({ providerName, plans }) =>
                displayPlan({
                  providerName: providerName,
                  newOrUpdate: [],
                  destroy: plans,
                })
              ),
              displayPlanDestroySummary,
            ])
          ),
          tap((xxx) => {
            assert(xxx);
          }),
          assign({
            resultDestroy: ({ lives, result }) =>
              pipe([
                () => result,
                switchCase([
                  pipe([get("plans"), isEmpty]),
                  processHasNoPlan,
                  processDestroyPlans({ providersGru, lives }),
                ]),
                tap((xxx) => {
                  assert(xxx);
                }),
              ])(),
          }),
          assign({ error: any(get("error")) }),
          tap((xxx) => {
            assert(xxx);
          }),
          throwIfError,
          tap.if(
            not(isEmpty),
            runAsyncCommandHook({
              providersGru: providersGru,
              hookType: HookType.ON_DESTROYED,
              commandTitle: `Running OnDestroyed`,
            })
          ),
          tap((x) => {
            //console.log(JSON.stringify(x, null, 4));
          }),
        ])(),
    ]),
    DisplayAndThrow({ name: "Plan Destroy" })
  )(infra);
};

const countResources = pipe([
  tap((xx) => {
    logger.debug(`countResources`);
  }),
  reduce(
    (acc, { providerName, type, resources }) =>
      pipe([
        tap(() => {
          assert(providerName);
          assert(type);
          assert(Array.isArray(resources));
        }),
        tap(() => {
          acc.providerSet.add(providerName);
          acc.typeSet.add(type);
          acc.resources = acc.resources + resources.length;
        }),
        () => acc,
      ])(),
    { providerSet: new Set(), typeSet: new Set(), resources: 0 }
  ),
  ({ providerSet, typeSet, resources }) => ({
    providers: providerSet.size,
    types: typeSet.size,
    resources,
  }),
  tap((result) => {
    logger.info(`countResources ${JSON.stringify(result)}`);
  }),
]);

const displayNoList = () => {
  console.log("No live resources to list");
};

const displayListSummaryResults = ({ providers, types, resources }) => {
  console.log(
    `${plu("resource", resources, true)}, ${plu("type", types, true)}, ${plu(
      "provider",
      providers,
      true
    )}`
  );
};

const listDoOk = ({ commandOptions, programOptions }) =>
  pipe([
    ({ providersGru }) =>
      pipe([
        () =>
          runAsyncCommand({
            text: displayCommandHeader({
              providers: providersGru.getProviders(),
              verb: "Listing",
            }),
            command: ({ onStateChange }) =>
              pipe([
                tap(() =>
                  map.series((provider) =>
                    provider.spinnersStartListLives({
                      onStateChange,
                      options: commandOptions,
                    })
                  )(providersGru.getProviders())
                ),
                assign({
                  resultStart: () =>
                    providersGru.start({
                      onStateChange,
                    }),
                }),
                assign({
                  result: () =>
                    providersGru.listLives({
                      onStateChange,
                      options: commandOptions,
                    }),
                }),
                tap(({ result }) =>
                  map.series((provider) =>
                    provider.spinnersStopListLives({
                      onStateChange,
                      options: commandOptions,
                      result,
                    })
                  )(providersGru.getProviders())
                ),
              ])({}),
          }),
        tap((xx) => {
          logger.debug(`listLives`);
        }),
        tap(({ result }) => providersGru.displayLives(result)),
      ])(),

    tap(
      pipe([
        tap((xxx) => {
          assert(xxx);
        }),
        switchCase([
          pipe([get("result.results"), isEmpty]),
          displayNoList,
          pipe([
            tap((xx) => {
              logger.debug(`listLives`);
            }),
            tap(displayListSummary),
            tap((xx) => {
              logger.debug(`listLives`);
            }),
            get("result.results"),
            filter(not(get("error"))),
            tap((xx) => {
              logger.debug(`listLives`);
            }),
            countResources,
            displayListSummaryResults,
          ]),
        ]),
      ])
    ),

    tap((results) => {
      logger.debug(`listLives`);
    }),
    (results) => ({ error: any(get("error"))(results), results }),
    tap((result) =>
      saveToJson({ command: "list", commandOptions, programOptions, result })
    ),
    throwIfError,
  ]);

//List all
exports.list = async ({ infra, commandOptions = {}, programOptions = {} }) =>
  tryCatch(
    listDoOk({ commandOptions, programOptions }),
    DisplayAndThrow({ name: "List" })
  )(infra);

//Output
const OutputDoOk = ({ commandOptions, programOptions }) =>
  pipe([
    tap(() => {
      logger.info(
        `output ${JSON.stringify({ commandOptions, programOptions })}`
      );
    }),
    ({ providersGru }) => providersGru.getProviders(),
    tap((providers) => {
      logger.debug(`output #providers ${providers.length}`);
    }),
    map((provider) =>
      provider.getResource({
        uri: `${provider.name}::${commandOptions.type}::${commandOptions.name}`,
      })
    ),
    filter((resource) => resource),
    switchCase([
      isEmpty,
      () => {
        throw {
          message: `Cannot find resource: '${commandOptions.type}::${commandOptions.name}'`,
        };
      },
      (resources) => size(resources) > 1,
      () => {
        throw {
          message: `resource: '${commandOptions.name}' found in multiple providers, use the --provider option`,
        };
      },
      first,
    ]),
    tap((resource) => {
      assert(resource);
      logger.debug(`output resource: ${resource.toString()}`);
    }),
    (resource) => resource.getLive(),
    tap((live) => {
      logger.debug(`output live: ${live}`);
    }),
    get(commandOptions.field),
    tap((result) => {
      logger.info(`output result: ${result}`);
      console.log(result);
    }),
  ]);

exports.output = async ({ infra, commandOptions = {}, programOptions = {} }) =>
  tryCatch(
    OutputDoOk({ commandOptions, programOptions }),
    DisplayAndThrow({ name: "Output" })
  )(infra);

//Init
const DoCommand = ({ commandOptions, command }) =>
  pipe([
    tap((xxx) => {
      logger.debug(`DoCommand ${command}`);
    }),
    ({ providersGru }) => providersGru.getProviders(),
    map(
      tryCatch(
        (provider) => provider[command]({ options: commandOptions }),
        (error, provider) => {
          return { error, provider: provider.toString() };
        }
      )
    ),
    (results) => ({
      error: any(get("error"))(results),
      results,
      command,
    }),
    switchCase([
      get("error"),
      (result) => {
        throw result;
      },
      tap((xxx) => {
        logger.debug(`${command} done`);
      }),
    ]),
  ]);

exports.info = async ({ infra, commandOptions = {}, programOptions = {} }) =>
  tryCatch(
    pipe([
      tap((xxx) => {
        logger.debug(`info`);
      }),
      DoCommand({ commandOptions, programOptions, command: "info" }),
      tap((info) => {
        console.log(YAML.stringify(info.results));
      }),
    ]),
    DisplayAndThrow({ name: "Info" })
  )(infra);

exports.init = async ({ infra, commandOptions = {}, programOptions = {} }) =>
  tryCatch(
    DoCommand({ commandOptions, programOptions, command: "init" }),
    DisplayAndThrow({ name: "Init" })
  )(infra);

exports.unInit = async ({ infra, commandOptions = {}, programOptions = {} }) =>
  tryCatch(
    DoCommand({ commandOptions, programOptions, command: "unInit" }),
    DisplayAndThrow({ name: "UnInit" })
  )(infra);

//TODO move to ProviderGru
exports.graph = async ({
  infra,
  config,
  commandOptions = {},
  programOptions = {},
}) =>
  tryCatch(
    pipe([
      tap((input) => {
        logger.debug(`graph`, config);
        assert(input.providersGru);
      }),
      ({ providersGru }) => providersGru.getProviders(),
      map(
        tryCatch(
          (provider) => provider.graph({ options: commandOptions }),
          (error, provider) => {
            return { error, provider: provider.toString() };
          }
        )
      ),
      tap((result) => {
        logger.debug(`graph done`);
      }),
      // TODO add title from config.projectName
      (results) => `digraph graphname {
rankdir=LR;
${results.join("\n")}
}`,
      tap((result) => fs.writeFileSync(commandOptions.file, result)),
      tap((result) => {
        console.log(`dot file written to: ${commandOptions.file}`);
      }),
      tap((result) => {
        const { type } = commandOptions;
        const output = `${path.parse(commandOptions.file).name}.${type}`;
        const command = `dot  -T${type} ${commandOptions.file} -o ${output}`;

        const { stdout, stderr, code } = shell.exec(command, {
          silent: true,
        });
        if (code !== 0) {
          throw {
            message: `command '${command}' failed`,
            stdout,
            stderr,
            code,
          };
        }
        console.log(`output saved to: ${output}`);
      }),
    ]),
    DisplayAndThrow({ name: "graph" })
  )(infra);
