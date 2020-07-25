const { pick } = require("lodash");

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

const pluck = require("rubico/x/pluck");

const { isEmpty, flatten } = require("ramda");

// Common
const plansHasSuccess = all(({ results }) => results.success);

const displayProviderList = pipe([pluck("name"), (list) => list.join(",")]);

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
        (xx) => {
          //  console.log("XX");
          logger.debug(`filterProvidersByName ${xx.length}`);
        },
      ])
    ),
  ]);

const formatResource = ({ provider, type, name } = {}) =>
  `${provider}/${type}/${name}`;

const countDeployResources = reduce(
  (acc, value) => {
    return {
      providers: acc.providers + 1,
      create: acc.create + value.plan.newOrUpdate.length,
      destroy: acc.destroy + value.plan.destroy.length,
    };
  },
  { providers: 0, create: 0, destroy: 0 }
);

const hasPlans = pipe([
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

const displayError = (name, error) => {
  assert(error);
  if (Array.isArray(error)) {
    map((err) => displayError(name, err))(error);
    return;
  }
  console.log(YAML.stringify(convertError({ error, name })));
};

const pluckErrorsCommon = pipe([
  tap((aa) => {
    //logger.debug("pluckErrorsCommon ");
  }),
  filter(({ results: { success } }) => !success),
  flatten,
  pluck("results.resultCreate"),
  flatten,
  tap((xx) => {
    //logger.debug("pluckErrorsCommon ");
  }),
  filter(({ error }) => error),
  tap((xx) => {
    logger.debug("pluckErrorsCommon result  ");
  }),
]);
const pluckErrorsHooks = pipe([
  tap((xx) => {
    logger.debug("pluckErrorsHooks ");
  }),
  filter(({ results: { success } }) => !success),
  flatten,
  pluck("results"),
  pluck("hookResults"),
  pluck("results"),

  flatten,
  filter(({ error }) => error),
  tap((xx) => {
    logger.debug("pluckErrorsHooks result  ");
  }),
]);

const displayErrorHooks = ({
  error = {},
  hookName,
  providerName,
  hookType,
  action,
}) => {
  logger.error(`displayErrorHooks ${tos({ error })}`);
  //assert(item, "item");
  const fullName = `${providerName}::${hookName}::${hookType}::${
    action ? action.name : "init"
  }`;
  console.log(`Error running hook '${fullName}'`);
  displayError(`Hook: ${fullName}`, error);
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
                plan: async ({ provider }) =>
                  provider.planQuery({ onStateChange }),
              })({ provider })
            ),
          ])(providers),
      }),
    tap(
      pipe([
        tap((xx) => {
          logger.debug("planQuery showing result");
        }),
        map(({ provider, plan }) =>
          displayPlan({
            providerName: provider.name,
            newOrUpdate: plan.newOrUpdate,
            destroy: plan.destroy.plans,
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
      tap((result) =>
        saveToJson({ command: "plan", commandOptions, programOptions, result })
      ),
      switchCase([
        hasPlans,
        pipe([countDeployResources, displayQueryPlanSummary]),
        displayQueryNoPlan,
      ]),
    ]),
    (error) => {
      displayError("PlanQuery", error);
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
        map(async (provider) => {
          const fun = provider[commandToFunction(hookType)];
          if (fun) return await fun({ onStateChange });
        }),
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
      switchCase([
        () => commandOptions.onDeployed,
        () =>
          runAsyncCommandHook({
            providers,
            hookType: HookType.ON_DEPLOYED,
            commandTitle: `Running OnDeployed`,
          }),
        () => commandOptions.onDestroyed,
        () =>
          runAsyncCommandHook({
            providers,
            hookType: HookType.ON_DESTROYED,
            commandTitle: `Running OnDestroyed`,
          }),
        () => {
          throw { code: 422, message: "no command found" };
        },
      ]),
      tap((results) => {
        logger.debug("planRunScript Done");
      }),
      tap(
        pipe([
          pluck("results"),
          flatten,
          tap((results) => {
            logger.debug("planRunScript flatten");
          }),
          filter(({ error }) => error),
          map(displayErrorHooks),
        ])
      ),
    ]),
    (error) => {
      displayError("planRunScript", error);
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
      async ({ create, destroy }) =>
        await prompts({
          type: "confirm",
          name: "confirmDeploy",
          message: `Are you sure to deploy ${plu("resource", create, true)}${
            destroy > 0 ? ` and destroy ${plu("resource", destroy, true)}` : ""
          } ?`,
          initial: false,
        }),
      ({ confirmDeploy }) => confirmDeploy,
    ])(allPlans);
  };

  const displayDeploySuccess = pipe([
    tap((result) => {
      logger.debug("displayDeploySuccess");
    }),
    countDeployResources,
    ({ create, destroy }) =>
      console.log(
        `${plu("resource", create, true)} deployed${
          destroy > 0 ? ` and ${plu("resource", destroy, true)} destroyed` : ""
        }`
      ),
  ]);

  const displayDeployError = ({ item, error = {} }) => {
    logger.error(`displayDeployError ${tos({ item, error })}`);
    assert(item, "item");
    console.log(`Cannot deploy resource ${formatResource(item.resource)}`);
    displayError("Plan Apply", error);
  };

  const displayDeployErrors = pipe([
    tap((x) => {
      logger.error(`displayDeployErrors begins ${tos(x)}`);
    }),
    tap(pipe([pluckErrorsCommon, map(tap(displayDeployError))])),
    tap(pipe([pluckErrorsHooks, map(tap(displayErrorHooks))])),

    (result) => {
      logger.error(`displayDeployErrors result: ${tos({ result })}`);

      throw result;
    },
  ]);

  const doPlansDeploy = ({ commandOptions }) =>
    pipe([
      async (providers) =>
        await runAsyncCommand({
          text: displayCommandHeader({ providers, verb: "Deploying" }),
          command: ({ onStateChange }) =>
            pipe([
              tap(
                map.series(({ provider, plan }) =>
                  provider.spinnersStartDeploy({
                    onStateChange,
                    plan,
                  })
                )
              ),
              tap((xx) => {
                logger.debug("doPlansDeploy Spinners started");
              }),
              map(
                pipe([
                  assign({
                    results: async ({ provider, plan }) => {
                      try {
                        const result = await provider.planApply({
                          plan,
                          onStateChange,
                        });
                        return result;
                      } catch (error) {
                        logger.error("doPlansDeploy");
                        logger.error(error);
                        throw error;
                      }
                    },
                  }),
                  tap(({ provider, results }) =>
                    provider.spinnersStopProvider({
                      onStateChange,
                      error: !results.success,
                    })
                  ),
                ])
              ),
              tap((xx) => {
                logger.debug("doPlansDeploy DONE");
              }),
            ])(providers),
        }),

      tap((result) =>
        saveToJson({ command: "apply", commandOptions, programOptions, result })
      ),
      tap((result) => {
        logger.debug("doPlansDeploy DONE");
      }),
      switchCase([plansHasSuccess, displayDeploySuccess, displayDeployErrors]),
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
      tap((xxx) => {
        console.log("ss");
      }),
      switchCase([hasPlans, processDeployPlans, processNoPlan]),
    ]),
    (error) => {
      displayError("Plan Apply", error);
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

  const processHasNoPlan = () => {
    console.log("No resources to destroy");
  };

  const countDestroyed = reduce((acc, value) => {
    if (!value.result) {
      assert(value.result);
    }
    return acc + value.result.plans.length;
  }, 0);

  const displayDestroySuccess = pipe([
    tap((x) => {
      logger.error(`displayDestroySuccess ${tos(x)}`);
    }),
    countDestroyed,
    tap((length) => {
      logger.error(`displayDestroySuccess ${length}`);
    }),
    (length) => console.log(`${plu("resource", length, true)} destroyed`),
  ]);

  const promptConfirmDestroy = async ({ results }) => {
    return await pipe([
      countDestroyed,
      async (length) =>
        await prompts({
          type: "confirm",
          name: "confirmDestroy",
          message: colors.red(
            `Are you sure to destroy ${plu("resource", length, true)} ?`
          ),
          initial: false,
        }),
      ({ confirmDestroy }) => confirmDestroy,
    ])(results);
  };

  const displayDestroyError = ({ item, error }) => {
    console.log(`Cannot destroy resource ${formatResource(item.resource)}`);
    displayError("Plan Destroy", error);
  };

  const displayDestroyErrors = pipe([
    tap((x) => {
      logger.error(`displayDestroyErrors ${tos(x)}`);
    }),
    tap(pipe([pluckErrorsCommon, map(tap(displayDestroyError))])),
    tap(pipe([pluckErrorsHooks, map(tap(displayErrorHooks))])),

    (result) => {
      throw result;
    },
  ]);

  const doPlansDestroy = ({ commandOptions }) =>
    pipe([
      tap((x) => {
        logger.error(`doPlansDestroy`);
      }),
      async (result) =>
        await runAsyncCommand({
          text: displayCommandHeader({
            providers: result.results,
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
                    results: async ({ provider, result }) =>
                      provider.planDestroy({
                        plans: result.plans,
                        onStateChange,
                      }),
                  }),
                  tap(({ provider, results }) =>
                    provider.spinnersStopProvider({
                      onStateChange,
                      error: !results.success,
                    })
                  ),
                ])
              ),
              tap((xx) => {
                //logger.debug("doPlansDestroy DONE");
              }),
            ])(result.results),
        }),
      tap((result) =>
        saveToJson({
          command: "destroy",
          commandOptions,
          programOptions,
          result,
        })
      ),
      switchCase([
        plansHasSuccess,
        displayDestroySuccess,
        displayDestroyErrors,
      ]),
      tap(() => {
        logger.debug("doPlansDestroy finished");
      }),
    ]);

  const processDestroyPlans = switchCase([
    (plans) => commandOptions.force || promptConfirmDestroy(plans),
    doPlansDestroy({ commandOptions }),
    () => {
      console.log("Aborted");
    },
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
      (results) => ({
        error: any(get("result.error"))(results),
        plans: pipe([pluck("result.plans"), flatten])(results),
        results,
      }),
      tap((x) => {
        //console.log(JSON.stringify(x, null, 4));
      }),
      tap(switchCase([hasEmptyPlan, processHasNoPlan, processDestroyPlans])),
      tap((result) => {
        if (result.error) {
          throw result;
        }
      }),
    ]),
    (error) => {
      //TODO
      displayError("Plan Destroy", error);
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

const displayNoList = () => console.log("No live resources to list");
const displayListSummaryResults = ({ providers, types, resources }) => {
  console.log(
    `${plu("resource", resources, true)}, ${plu("type", types, true)}, ${plu(
      "provider",
      providers,
      true
    )}`
  );
};

const isEmptyList = pipe([flatten, isEmpty]);

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
                results: async ({ provider }) =>
                  provider.listLives(commandOptions),
              })({ provider })
            ),
          ])(providers),
      }),
    tap(
      map(({ provider, results }) =>
        displayLive({
          providerName: provider.name,
          targets: results,
        })
      )
    ),
    switchCase([
      isEmptyList,
      displayNoList,
      pipe([pluck("results"), countResources, displayListSummaryResults]),
    ]),
    tap((result) =>
      saveToJson({ command: "list", commandOptions, programOptions, result })
    ),
  ]);

const listDoError = (error) => {
  displayError("Plan List", error);
  throw { code: 422, error };
};
//List all
exports.list = async ({ infra, commandOptions = {}, programOptions = {} }) =>
  tryCatch(listDoOk({ commandOptions, programOptions }), listDoError)(infra);
