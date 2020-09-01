const assert = require("assert");
const plu = require("pluralize");
const logger = require("../logger")({ prefix: "CliCommands" });
const { runAsyncCommand } = require("./cliUtils");
const { displayPlan, displayLive } = require("./displayUtils");
const prompts = require("prompts");
const colors = require("colors/safe");
const fs = require("fs");
const YAML = require("./json2yaml");
const { convertError, HookType } = require("../providers/Common");
const { tos } = require("../tos");
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
const { pluck, isEmpty, flatten, forEach, uniq, size } = require("rubico/x");
// Common

const displayProviderList = pipe([
  tap((xx) => {
    //logger.debug(xx);
  }),
  pluck("name"),
  tap((list) => {
    assert(list[0]);
  }),
  (list) => list.join(","),
]);

const filterProvidersByName = ({
  commandOptions: { provider: providerOptions = [] },
  providers,
}) =>
  pipe([
    tap((xx) => {
      logger.debug(`filterProvidersByName ${providerOptions}`);
      assert(providers[0].name, "not an array of providers");
    }),
    filter(
      or([
        () => isEmpty(providerOptions),
        (provider) =>
          any((providerName) =>
            new RegExp(`${providerName}`, "i").test(provider.name)
          )(providerOptions),
      ])
    ),
    tap(
      switchCase([
        isEmpty,
        () => {
          const message = `No provider matches: '${providerOptions}', ${plu(
            "provider",
            providers.length,
            true
          )} available: ${displayProviderList(providers)}`;
          throw { code: 422, message };
        },
        tap((xx) => {
          logger.debug(`filterProvidersByName ${xx.length}`);
        }),
      ])
    ),
  ]);

const formatResource = ({ provider, type, name } = {}) =>
  `${provider}/${type}/${name}`;

const countDeployResources = pipe([
  tap((xx) => {
    logger.debug(`countDeployResources`);
  }),
  pluck("resultQuery"),
  tap((xx) => {
    logger.debug(`countDeployResources`);
  }),
  reduce(
    (acc, value) => {
      assert(value.resultCreate, "resultCreate");
      assert(value.resultDestroy, "resultDestroy");
      return {
        providers: acc.providers + 1,
        types:
          acc.types +
          pipe([pluck("resource.type"), uniq, size])(value.resultCreate.plans),
        create: acc.create + value.resultCreate.plans.length,
        destroy: acc.destroy + value.resultDestroy.plans.length,
      };
    },
    { providers: 0, types: 0, create: 0, destroy: 0 }
  ),
  tap((xx) => {
    logger.debug(`countDeployResources`);
  }),
]);

const hasPlans = pipe([
  tap((xx) => {
    logger.debug(`hasPlans`);
  }),
  countDeployResources,
  ({ create, destroy }) => create > 0 || destroy > 0,
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

const displayPlanQueryErrorResult = pipe([
  tap((result) => {
    logger.debug(result);
  }),
  filter(({ error }) => error),
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

const displayErrorHooks = (resultHooks) => {
  if (resultHooks?.error) {
    pipe([
      tap((xx) => {
        logger.debug(tos(xx));
      }),
      filter(({ error }) => error),
      pluck("results"),
      tap((xx) => {
        logger.debug(tos(xx));
      }),
      flatten,
      filter(({ error }) => error),
      tap((xx) => {
        logger.debug(tos(xx));
      }),
      forEach(({ error, hookName, providerName, hookType, action }) => {
        const fullName = `${providerName}::${hookName}::${hookType}::${
          action ? action.name : "init"
        }`;
        console.log(`Error running hook '${fullName}'`);
        console.log(YAML.stringify(convertError({ error })));
      }),
    ])(resultHooks.results);
  }
};

const displayError = ({ name, error }) => {
  assert(error);
  assert(name);
  console.error(`ERROR running command '${name}'`);
  if (error.results) {
    forEach(({ provider, result, resultQuery }) => {
      assert(provider.name);
      console.log(`Provider ${provider.name}`);
      if (resultQuery) {
        displayPlanQueryErrorResult(resultQuery.resultCreate.plans);
        displayPlanQueryErrorResult(resultQuery.resultDestroy.plans);
      }

      displayErrorHooks(result?.resultHooks);

      if (result?.resultCreate) {
        displayPlanApplyErrorResult(result.resultCreate.results);
      }
      if (result?.resultDestroy) {
        displayPlanApplyErrorResult(result.resultDestroy.results);
      }
      if (result?.results) {
        pipe([
          tap((xx) => {
            logger.debug(tos(xx));
          }),
          filter(({ error }) => error),
          forEach(({ item, client, error }) => {
            item && console.log(`Resource ${formatResource(item.resource)}`);
            client && console.log(`Client ${client.type}`);

            console.log(YAML.stringify(convertError({ error, name })));
          }),
        ])(result.results);
      }
    })(error.results);
  } else {
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
const doPlanQuery = ({ providers, commandOptions, programOptions }) =>
  pipe([
    async (providers) =>
      await runAsyncCommand({
        text: displayCommandHeader({ providers, verb: "Querying" }),
        command: ({ onStateChange }) =>
          pipe([
            tap(
              map.series((provider) =>
                provider.spinnersStartQuery({ onStateChange })
              )
            ),
            map((provider) =>
              assign({
                resultQuery: async ({ provider }) =>
                  provider.planQuery({ onStateChange }),
              })({ provider })
            ),
          ])(providers),
      }),
    tap(
      pipe([
        tap((xx) => {
          logger.debug("planQuery displayPlan");
        }),
        filter(({ resultQuery }) => !resultQuery.error),
        map(({ provider, resultQuery }) =>
          displayPlan({
            providerName: provider.name,
            newOrUpdate: resultQuery.resultCreate.plans,
            destroy: resultQuery.resultDestroy.plans,
          })
        ),
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

const planQuery = async ({
  infra: { providers },
  commandOptions = {},
  programOptions = {},
}) =>
  tryCatch(
    pipe([
      ({ providers }) =>
        filterProvidersByName({ commandOptions, providers })(providers),
      doPlanQuery({ providers, commandOptions, programOptions }),
      // augmentWithError
      (results) => ({
        error: any(({ resultQuery: { error } }) => error)(results),
        results,
      }),
      tap((result) =>
        saveToJson({ command: "plan", commandOptions, programOptions, result })
      ),
      tap((result) => {
        if (result.error) throw result;
      }),
      tap(
        pipe([
          tap((xx) => {
            // logger.debug("planQuery");
          }),
          get("results"),
          tap((xx) => {
            logger.debug("planQuery");
          }),
          switchCase([
            hasPlans,
            pipe([countDeployResources, displayQueryPlanSummary]),
            displayQueryNoPlan,
          ]),
        ])
      ),
    ]),
    (error) => {
      displayError({ name: "plan", error });
      throw { code: 422, error };
    }
  )({ providers, commandOptions, programOptions });

exports.planQuery = planQuery;

const commandToFunction = (command) =>
  `run${command.charAt(0).toUpperCase()}${command.slice(1)}`;

const runAsyncCommandHook = ({ hookType, commandTitle, providers }) =>
  runAsyncCommand({
    text: displayCommandHeader({ providers, verb: commandTitle }),
    command: ({ onStateChange }) =>
      pipe([
        tap(
          map((provider) =>
            provider.spinnersStartHook({
              onStateChange,
              hookType,
            })
          )
        ),
        map((provider) =>
          pipe([
            assign({
              result: async ({ provider }) => {
                const fun = provider[commandToFunction(hookType)];
                assert(fun, `no provider hook for ${hookType}`);
                return {
                  resultHooks: await fun({ onStateChange }),
                };
              },
            }),
            tap(({ provider, result: { resultHooks } }) =>
              provider.spinnersStopProvider({
                onStateChange,
                error: resultHooks.error,
              })
            ),
          ])({ provider })
        ),
      ])(providers),
  });

// planRunScript
const planRunScript = async ({
  infra: { providers },
  commandOptions = {},
  programOptions = {},
}) =>
  tryCatch(
    pipe([
      tap((x) => {
        logger.debug("planRunScript");
      }),
      ({ providers }) =>
        filterProvidersByName({ commandOptions, providers })(providers),
      switchCase([
        () => commandOptions.onDeployed,
        (providers) =>
          runAsyncCommandHook({
            providers,
            hookType: HookType.ON_DEPLOYED,
            commandTitle: `Running OnDeployed`,
          }),
        () => commandOptions.onDestroyed,
        (providers) =>
          runAsyncCommandHook({
            providers,
            hookType: HookType.ON_DESTROYED,
            commandTitle: `Running OnDestroyed`,
          }),
        () => {
          throw { code: 422, message: "no command found" };
        },
      ]),
      tap((result) => {
        logger.debug("planRunScript Done");
      }),
      (results) => ({
        error: any(
          ({
            result: {
              resultHooks: { error },
            },
          }) => error
        )(results),
        results,
      }),
      tap((result) =>
        saveToJson({
          command: "runScript",
          commandOptions,
          programOptions,
          result,
        })
      ),
      tap((result) => {
        if (result.error) throw result;
      }),
    ]),
    (error) => {
      displayError({ name: "planRunScript", error });
      throw { code: 422, error };
    }
  )({ providers, programOptions, commandOptions });

exports.planRunScript = planRunScript;

// Plan Apply
exports.planApply = async ({
  infra: { providers },
  commandOptions = {},
  programOptions = {},
}) => {
  const processNoPlan = () => {
    console.log("Nothing to deploy");
  };

  const abortDeploy = () => {
    console.log("Deployment aborted");
  };

  const promptConfirmDeploy = async (allPlans) => {
    return await pipe([
      countDeployResources,
      async ({ providers, types, create, destroy }) =>
        await prompts({
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
  };

  const displayDeploySuccess = pipe([
    tap((result) => {
      logger.debug("displayDeploySuccess");
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

  const doPlansDeploy = ({ commandOptions, providers }) =>
    pipe([
      tap((xx) => {
        logger.debug("doPlansDeploy ");
      }),
      async (results) =>
        await runAsyncCommand({
          text: displayCommandHeader({ providers, verb: "Deploying" }),
          command: ({ onStateChange }) =>
            pipe([
              tap(
                map.series(({ provider, resultQuery }) =>
                  provider.spinnersStartDeploy({
                    onStateChange,
                    plan: resultQuery,
                  })
                )
              ),
              tap((xx) => {
                logger.debug("doPlansDeploy Spinners started");
              }),
              map(
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
              ),
            ])(results),
        }),
      tap((result) => {
        logger.debug("doPlansDeploy");
      }),
      (results) => ({
        error: any(({ result: { error } }) => error)(results),
        results,
      }),
      tap((result) =>
        saveToJson({ command: "apply", commandOptions, programOptions, result })
      ),
      tap((result) => {
        if (result.error) throw result;
      }),
      tap((result) => {
        logger.debug("doPlansDeploy");
      }),
      tap(
        pipe([
          tap((result) => {
            logger.debug("doPlansDeploy");
          }),
          get("results"),
          displayDeploySuccess,
        ])
      ),
    ]);

  const processDeployPlans = switchCase([
    (allplans) => commandOptions.force || promptConfirmDeploy(allplans),
    doPlansDeploy({ commandOptions, providers }),
    abortDeploy,
  ]);

  return tryCatch(
    pipe([
      ({ providers }) =>
        filterProvidersByName({ commandOptions, providers })(providers),
      doPlanQuery({ providers, commandOptions, programOptions }),
      //TODO
      tap((results) => {
        if (any(({ resultQuery }) => resultQuery.error)(results))
          throw { results };
      }),
      switchCase([hasPlans, processDeployPlans, processNoPlan]),
    ]),
    (error) => {
      displayError({ name: "Plan Apply", error });

      throw { code: 422, error };
    }
  )({ providers, commandOptions });
};

// Plan Destroy
exports.planDestroy = async ({
  infra: { providers },
  commandOptions = {},
  programOptions = {},
}) => {
  const hasEmptyPlan = ({ plans }) => isEmpty(plans);

  const processHasNoPlan = tap(() => {
    console.log("No resources to destroy");
  });

  const countDestroyed = reduce(
    (acc, value) => {
      assert(value.result, "value.result");
      assert(value.result.results, "value.result.results");
      return {
        providers: acc.providers + 1,
        types:
          acc.types +
          pipe([pluck("item.resource.type"), uniq, size])(value.result.results),
        resources: acc.resources + value.result.results.length,
      };
    },
    { providers: 0, types: 0, resources: 0 }
  );

  const displayDestroySuccess = pipe([
    tap((x) => {
      logger.error(`displayDestroySuccess ${tos(x)}`);
    }),
    get("resultsDestroy"),
    countDestroyed,
    tap((stats) => {
      logger.error(`displayDestroySuccess ${tos(stats)}`);
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

  const promptConfirmDestroy = async ({ results }) =>
    pipe([
      countDestroyed,
      async ({ providers, types, resources }) =>
        await prompts({
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
      ({ confirmDestroy }) => confirmDestroy,
    ])(results);

  const displayDestroyErrors = pipe([
    tap((x) => {
      logger.error(`displayDestroyErrors ${tos(x)}`);
    }),
  ]);

  const doPlansDestroy = ({ commandOptions }) =>
    pipe([
      tap((x) => {
        logger.error(`doPlansDestroy`);
      }),
      assign({
        resultsDestroy: async (result) =>
          await runAsyncCommand({
            text: displayCommandHeader({
              providers: pluck("provider")(result.results),
              verb: "Destroying",
            }),
            command: ({ onStateChange }) =>
              pipe([
                tap(
                  map.series(({ provider, result }) =>
                    provider.spinnersStartDestroy({
                      onStateChange,
                      plans: result.plans,
                    })
                  )
                ),
                map(
                  pipe([
                    assign({
                      result: async ({ provider, result }) =>
                        provider.planDestroy({
                          plans: result.plans,
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
                ),
                tap((xx) => {
                  // logger.debug("doPlansDestroy DONE");
                }),
              ])(result.results),
          }),
      }),
      (result) => ({
        ...result,
        error:
          any(({ result: { error } }) => error)(result.resultsDestroy) ||
          result.error,
      }),
      tap((result) =>
        saveToJson({
          command: "destroy",
          commandOptions,
          programOptions,
          result,
        })
      ),
      tap((x) => {
        logger.error(`doPlansDestroy`);
      }),
      tap(
        switchCase([
          ({ error }) => !error,
          displayDestroySuccess,
          displayDestroyErrors,
        ])
      ),
      tap((result) => {
        logger.debug("doPlansDestroy finished");
      }),
    ]);

  const processDestroyPlans = switchCase([
    (plans) => commandOptions.force || promptConfirmDestroy(plans),
    doPlansDestroy({ commandOptions }),
    tap(() => {
      console.log("Abort destroying plan");
    }),
  ]);

  return tryCatch(
    pipe([
      ({ providers }) =>
        filterProvidersByName({ commandOptions, providers })(providers),
      async (providers) =>
        await runAsyncCommand({
          text: displayCommandHeader({
            providers,
            verb: "Find",
          }),
          command: ({ onStateChange }) =>
            pipe([
              tap(
                map.series((provider) =>
                  provider.spinnersStartDestroyQuery({ onStateChange })
                )
              ),
              map(
                pipe([
                  (provider) =>
                    assign({
                      result: async ({ provider }) =>
                        provider.planFindDestroy({
                          options: commandOptions,
                          onStateChange,
                        }),
                    })({ provider }),
                  tap(({ provider, result }) =>
                    provider.spinnersStopProvider({
                      onStateChange,
                      error: result.error,
                    })
                  ),
                ])
              ),
            ])(providers),
        }),
      tap((x) => {
        //console.log(JSON.stringify(x, null, 4));
      }),
      tap(
        map(({ provider, result }) =>
          displayPlan({
            providerName: provider.name,
            newOrUpdate: [],
            destroy: result.plans,
          })
        )
      ),
      tap((x) => {
        //console.log(JSON.stringify(x, null, 4));
      }),
      (results) => ({
        error: any(get("result.error"))(results),
        plans: pipe([pluck("result.plans"), flatten])(results),
        results,
      }),
      tap((x) => {
        //console.log(JSON.stringify(x, null, 4));
      }),
      switchCase([hasEmptyPlan, processHasNoPlan, processDestroyPlans]),
      tap((result) => {
        if (result.error) {
          throw result;
        }
      }),
    ]),
    (error) => {
      displayError({ name: "Plan Destroy", error });
      throw { code: 422, error };
    }
  )({ providers });
};

const countResources = pipe([
  filter(not(isEmpty)),
  reduce(
    (acc, value) => ({
      providers: acc.providers + 1,
      types: reduce((acc) => acc + 1, acc.types)(value),
      resources: reduce(
        (acc, value) => acc + value.resources.length,
        acc.resources
      )(value),
    }),
    { providers: 0, types: 0, resources: 0 }
  ),
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

const isEmptyList = pipe([pluck("result.results"), flatten, isEmpty]);

const listDoOk = ({ commandOptions, programOptions }) =>
  pipe([
    ({ providers }) =>
      filterProvidersByName({ commandOptions, providers })(providers),
    (providers) =>
      runAsyncCommand({
        text: displayCommandHeader({ providers, verb: "Listing" }),
        command: (
          { onStateChange } //TODO use onStateChange
        ) =>
          pipe([
            map((provider) =>
              assign({
                result: async ({ provider }) =>
                  provider.listLives(commandOptions),
              })({ provider })
            ),
          ])(providers),
      }),
    tap(
      pipe([
        tap((xx) => {
          logger.debug(`listLives`);
        }),
        filter(({ result }) => !result.error),
        map(({ provider, result }) =>
          displayLive({
            providerName: provider.name,
            targets: result.results,
          })
        ),
      ])
    ),
    tap(
      switchCase([
        isEmptyList,
        displayNoList,
        pipe([
          tap((xx) => {
            logger.debug(`listLives`);
          }),
          pluck("result"),
          filter(({ error }) => !error),
          pluck("results"),

          tap((xx) => {
            // logger.debug(`listLives`);
          }),
          countResources,
          displayListSummaryResults,
        ]),
      ])
    ),
    (results) => ({
      error: any(({ result: { error } }) => error)(results),
      results,
    }),
    tap((result) =>
      saveToJson({ command: "list", commandOptions, programOptions, result })
    ),
    (result) => {
      if (result.error) throw result;
    },
  ]);

const listDoError = (error) => {
  displayError({ name: "Plan List", error });
  throw { code: 422, error };
};
//List all
exports.list = async ({ infra, commandOptions = {}, programOptions = {} }) =>
  tryCatch(listDoOk({ commandOptions, programOptions }), listDoError)(infra);
