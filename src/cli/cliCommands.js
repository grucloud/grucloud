const assert = require("assert");
const plu = require("pluralize");
const prompts = require("prompts");
const colors = require("colors/safe");
const fs = require("fs");
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
const { runAsyncCommand } = require("./cliUtils");
const {
  displayPlan,
  displayPlanSummary,
  displayListSummary,
  displayLive,
} = require("./displayUtils");
const {
  convertError,
  HookType,
  combineProviders,
} = require("../providers/Common");
const { tos } = require("../tos");

// Common

const providersToString = map(({ provider, ...other }) => ({
  provider: provider.toString(),
  ...other,
}));

const throwIfError = tap((result) => {
  if (result.error) {
    throw {
      ...result,
      results: providersToString(result.results),
    };
  }
});

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
      assert(providers && !isEmpty(providers), "no providers");
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
      const createCount = value.resultCreate.plans.length;
      const destroyCount = value.resultDestroy.plans.length;
      const providerActive = createCount > 0 || destroyCount > 0 ? 1 : 0;
      return {
        providers: acc.providers + providerActive,
        types:
          acc.types +
          pipe([pluck("resource.type"), uniq, size])(value.resultCreate.plans),
        create: acc.create + createCount,
        destroy: acc.destroy + destroyCount,
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

const displayErrorResults = ({ results = [], name }) => {
  if (!isEmpty(results)) {
    pipe([
      //filter(({ result }) => result?.error),
      forEach(({ provider, result, resultQuery }) => {
        assert(provider.name);
        console.log(`Provider ${provider.name}`);
        if (resultQuery) {
          displayPlanQueryErrorResult(resultQuery.resultCreate.plans);
          displayPlanQueryErrorResult(resultQuery.resultDestroy.plans);
        }

        displayErrorHooks(result?.resultHooks);

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
  displayErrorResults({ name, results: error.results });
  displayErrorResults({ name, results: error.resultsDestroy });

  const results = error.resultsDestroy || error.results;

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
    (results) => ({
      error: any(({ resultQuery: { error } }) => error)(results),
      results,
    }),
    tap(
      pipe([
        tap((xx) => {
          logger.debug("planQuery displayPlan");
        }),
        get("results"),
        filter(({ resultQuery }) => !resultQuery.error),
        tap(
          map(({ provider, resultQuery }) =>
            displayPlan({
              providerName: provider.name,
              newOrUpdate: resultQuery.resultCreate.plans,
              destroy: resultQuery.resultDestroy.plans,
            })
          )
        ),
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
      combineProviders,
      ({ providers }) =>
        filterProvidersByName({ commandOptions, providers })(providers),
      doPlanQuery({ commandOptions, programOptions }),
      tap((result) =>
        saveToJson({ command: "plan", commandOptions, programOptions, result })
      ),
      throwIfError,
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
  )(infra);

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
  infra,
  commandOptions = {},
  programOptions = {},
}) =>
  tryCatch(
    pipe([
      tap((x) => {
        logger.debug("planRunScript");
      }),
      combineProviders,
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
      throwIfError,
    ]),
    (error) => {
      displayError({ name: "planRunScript", error });
      throw { code: 422, error };
    }
  )(infra);

exports.planRunScript = planRunScript;

// Plan Apply
exports.planApply = async ({
  infra,
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

  const doPlansDeploy = ({ commandOptions }) =>
    pipe([
      tap((xx) => {
        logger.debug("doPlansDeploy ");
      }),
      async (results) =>
        await runAsyncCommand({
          text: displayCommandHeader({
            providers: pluck("provider")(results),
            verb: "Deploying",
          }),
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
      throwIfError,
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
    doPlansDeploy({ commandOptions, providers: infra.providers }),
    abortDeploy,
  ]);

  return tryCatch(
    pipe([
      combineProviders,
      ({ providers }) =>
        filterProvidersByName({ commandOptions, providers })(providers),
      doPlanQuery({ commandOptions, programOptions }),
      throwIfError,
      get("results"),
      tap((result) => {
        logger.debug("doPlansDeploy");
      }),
      switchCase([hasPlans, processDeployPlans, processNoPlan]),
    ]),
    (error) => {
      displayError({ name: "Plan Apply", error });

      throw { code: 422, error };
    }
  )(infra);
};

// Plan Destroy
exports.planDestroy = async ({
  infra,
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
      assert(value.result.plans, "value.result.plans");
      const resourceCount = value.result.plans.length;
      const providerActive = resourceCount > 0 ? 1 : 0;
      return {
        providers: acc.providers + providerActive,
        types:
          acc.types +
          pipe([pluck("resource.type"), uniq, size])(value.result.plans),
        resources: acc.resources + resourceCount,
      };
    },
    { providers: 0, types: 0, resources: 0 }
  );

  const displayDestroySuccess = pipe([
    tap((x) => {
      logger.debug(`displayDestroySuccess ${tos(x)}`);
    }),
    get("results"),
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

  const promptConfirmDestroy = async ({ results }) =>
    pipe([
      tap((xx) => {
        logger.debug(`promptConfirmDestroy ${tos(xx)}`);
      }),
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
                providersToString,
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
      combineProviders,
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
                      result: ({ provider }) =>
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
      throwIfError,
    ]),
    (error) => {
      displayError({ name: "Plan Destroy", error });
      throw { code: 422, error };
    }
  )(infra);
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
    combineProviders,
    ({ providers }) =>
      filterProvidersByName({ commandOptions, providers })(providers),
    (providers) =>
      runAsyncCommand({
        text: displayCommandHeader({ providers, verb: "Listing" }),
        command: ({ onStateChange }) =>
          pipe([
            tap(
              map.series((provider) =>
                provider.spinnersStartListLives({ onStateChange })
              )
            ),
            map.pool(10, (provider) =>
              assign({
                result: async ({ provider }) =>
                  provider.listLives({ onStateChange, ...commandOptions }),
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
          displayListSummary,
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
    throwIfError,
  ]);

const listDoError = (error) => {
  displayError({ name: "List", error });
  throw { code: 422, error };
};

//List all
exports.list = async ({ infra, commandOptions = {}, programOptions = {} }) =>
  tryCatch(listDoOk({ commandOptions, programOptions }), listDoError)(infra);

//Output
const OutputDoOk = ({ commandOptions, programOptions }) =>
  pipe([
    tap(() => {
      logger.debug(
        `output ${JSON.stringify({ commandOptions, programOptions })}`
      );
    }),
    combineProviders,
    ({ providers }) =>
      filterProvidersByName({ commandOptions, providers })(providers),
    tap((providers) => {
      logger.debug(`output #providers ${providers.length}`);
    }),
    forEach((provider) => {
      logger.debug(`provider ${provider.name}: ${provider.resourceNames()}`);
    }),
    filter((provider) => provider.getResourceByName(commandOptions.name)),
    switchCase([
      (providers) => isEmpty(providers),
      () => {
        throw { message: `Cannot find resource: '${commandOptions.name}'` };
      },
      (providers) => size(providers) > 1,
      () => {
        throw {
          message: `resource: '${commandOptions.name}' found in multiple providers, use the --provider option`,
        };
      },
      (providers) => first(providers),
    ]),
    (provider) => provider.getResourceByName(commandOptions.name),
    (resource) => resource.getLive(),
    tap((live) => {
      logger.debug(`output live: ${live}`);
    }),
    get(commandOptions.field),
    tap((result) => {
      logger.debug(`output result: ${result}`);
      console.log(result);
    }),
  ]);

const OutputDoError = (error) => {
  displayError({ name: "Output", error });
  throw { code: 422, error };
};

exports.output = async ({ infra, commandOptions = {}, programOptions = {} }) =>
  tryCatch(
    OutputDoOk({ commandOptions, programOptions }),
    OutputDoError
  )(infra);
