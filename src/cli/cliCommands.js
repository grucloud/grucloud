const _ = require("lodash");
const plu = require("pluralize");
const { runAsyncCommand } = require("./cliUtils");
const { displayPlan, displayLive } = require("./displayUtils");
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
} = require("rubico");
const { isEmpty, pluck, flatten } = require("ramda");

const plansHasSuccess = all(({ results }) => results.success);

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

const displayError = (error) => {
  if (!error) {
    // TODO why error is sometimes undefined ?
    console.error("error because the error is not defined!");
  }
  console.error(error.message);
  if (error.response) {
    console.error(JSON.stringify(error.response?.data, null, 4));
    console.error(JSON.stringify(error.response?.config, null, 4));
  }
};

// Plan Query
const doPlanQuery = async ({ providers, programOptions }) =>
  await map(async (provider) => ({
    provider,
    plan: await pipe([
      () =>
        runAsyncCommand(
          () => provider.planQuery(),
          `Query Plan for ${provider.name()}`
        ),
      displayPlan,
    ])(),
  }))(providers);

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
  commandOptions,
  programOptions,
}) =>
  pipe([
    doPlanQuery,
    tap((result) =>
      saveToJson({ command: "plan", commandOptions, programOptions, result })
    ),
    switchCase([
      hasPlans,
      pipe([countDeployResources, displayQueryPlanSummary]),
      displayQueryNoPlan,
    ]),
  ])({ providers, programOptions });

exports.planQuery = planQuery;

// Plan Apply
exports.planApply = async ({
  infra: { providers },
  commandOptions,
  programOptions,
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
    countDeployResources,
    ({ create, destroy }) =>
      console.log(
        `${plu("resource", create, true)} deployed${
          destroy > 0 ? ` and ${plu("resource", destroy, true)} destroyed` : ""
        }`
      ),
  ]);

  const doPlanDeploy = pipe([
    //tap((x) => console.log("doPlanDeploy begin ", x)),
    assign({
      results: async ({ provider, plan }) =>
        await runAsyncCommand(
          () => provider.planApply(plan),
          `Deploying resources on provider ${provider.name()}`
        ),
    }),
    //tap((x) => console.log("doPlanDeploy end", x)),
  ]);

  const displayDeployError = ({ item, error = {} }) => {
    console.log(`Cannot deploy resource ${formatResource(item.resource)}`);
    displayError(error);
  };

  const displayDeployErrors = pipe([
    //tap((x) => console.log("displayDeployErrors", x)),
    filter(({ results: { success } }) => !success),
    flatten,
    pluck("results"),
    pluck("results"),
    flatten,
    //tap((x) => console.log("displayDeployErrors", x)),
    map(tap(displayDeployError)),
  ]);

  const doPlansDeploy = pipe([
    map(doPlanDeploy),
    tap((result) =>
      saveToJson({ command: "apply", commandOptions, programOptions, result })
    ),
    switchCase([plansHasSuccess, displayDeploySuccess, displayDeployErrors]),
  ]);

  const processDeployPlans = switchCase([
    (allplans) => commandOptions.force || promptConfirmDeploy(allplans),
    doPlansDeploy,
    abortDeploy,
  ]);

  await pipe([
    doPlanQuery,
    switchCase([hasPlans, processDeployPlans, processNoPlan]),
  ])({ providers });
};

// Plan Destroy
exports.planDestroy = async ({
  infra: { providers },
  commandOptions,
  programOptions,
}) => {
  const hasEmptyPlan = pipe([pluck("plan"), flatten, isEmpty]);

  const processHasNoPlan = () => {
    console.log("No resources to destroy");
  };

  const countDestroyed = reduce((acc, value) => acc + value.plan.length, 0);

  const displayDestroySuccess = pipe([
    countDestroyed,
    (length) => console.log(`${plu("resource", length, true)} destroyed`),
  ]);

  const promptConfirmDestroy = async (plans) => {
    return await pipe([
      countDestroyed,
      async (length) =>
        await prompts({
          type: "confirm",
          name: "confirmDestroy",
          message: colors.red(
            `Are you sure to destroy these ${plu("resource", length, true)} ?`
          ),
          initial: false,
        }),
      ({ confirmDestroy }) => confirmDestroy,
    ])(plans);
  };

  const doPlanDestroy = pipe([
    assign({
      results: async ({ provider, plan }) =>
        await runAsyncCommand(
          () => provider.planDestroy(plan),
          `Destroying ${plu(
            "resource",
            plan.length,
            true
          )} on provider ${provider.name()}`
        ),
    }),
  ]);

  const displayDestroyError = ({ item, error }) => {
    console.log(`Cannot destroy resource ${formatResource(item.resource)}`);
    displayError(error);
  };

  const displayDestroyErrors = pipe([
    tap((x) => console.log("displayDestroyErrors begin ", x)),
    filter(({ results: { success } }) => !success),
    flatten,
    pluck("results"),
    pluck("results"),
    flatten,
    tap((x) => console.log("displayDestroyErrors begin ", x)),
    map(tap(displayDestroyError)),
  ]);

  const doPlansDestroy = pipe([
    map(doPlanDestroy),
    tap((result) =>
      saveToJson({ command: "destroy", commandOptions, programOptions, result })
    ),
    switchCase([plansHasSuccess, displayDestroySuccess, displayDestroyErrors]),
  ]);

  const processDestroyPlans = switchCase([
    (plans) => commandOptions.force || promptConfirmDestroy(plans),
    doPlansDestroy,
    () => {
      console.log("Aborted");
    },
  ]);

  const findDestroy = async (provider) => {
    return {
      provider,
      plan: await pipe([
        async () => await provider.planFindDestroy(commandOptions),
        tap((plan) =>
          displayPlan({
            providerName: provider.name(),
            newOrUpdate: [],
            destroy: plan,
          })
        ),
      ])(),
    };
  };

  await pipe([
    async ({ providers }) => await map(findDestroy)(providers),
    //tap((x) => console.log(JSON.stringify(x, null, 4))),
    switchCase([hasEmptyPlan, processHasNoPlan, processDestroyPlans]),
  ])({ providers });
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
const displayListResults = ({ providers, types, resources }) => {
  console.log(
    `${plu("resource", resources, true)}, ${plu("type", types, true)}, ${plu(
      "provider",
      providers,
      true
    )}`
  );
};

const isEmptyList = pipe([flatten, isEmpty]);

//List all
exports.list = async ({ infra, commandOptions, programOptions }) =>
  await pipe([
    async (providers) =>
      await map(
        async (provider) =>
          await pipe([
            () =>
              runAsyncCommand(
                () => provider.listLives(commandOptions),
                `List for ${provider.name()}`
              ),
            tap((targets) =>
              displayLive({ providerName: provider.name(), targets })
            ),
          ])()
      )(providers),
    tap((result) =>
      saveToJson({ command: "list", commandOptions, programOptions, result })
    ),

    switchCase([
      isEmptyList,
      displayNoList,
      pipe([countResources, displayListResults]),
    ]),
  ])(infra.providers);
