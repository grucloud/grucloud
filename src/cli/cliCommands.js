const _ = require("lodash");
const { runAsyncCommand } = require("./cliUtils");
const { displayPlan, displayLive } = require("./displayUtils");
const prompts = require("prompts");
const { map, pipe, switchCase, any, reduce } = require("rubico");
const { flatten, tap, isEmpty, pluck, ifElse } = require("ramda");

const countResources = reduce(
  (acc, value) => {
    return {
      create: acc.create + value.plan.newOrUpdate.length,
      destroy: acc.destroy + value.plan.destroy.length,
    };
  },
  { create: 0, destroy: 0 }
);

//Query Plan
const planQuery = async ({ infra }) =>
  map(async (provider) => ({
    provider,
    plan: await pipe([
      () =>
        runAsyncCommand(
          () => provider.plan(),
          `Query Plan for ${provider.name()}`
        ),
      displayPlan,
    ])(),
  }))(infra.providers);

exports.planQuery = planQuery;

//Deploy plan
exports.planDeploy = async ({ infra }) => {
  const hasPlans = pipe([
    countResources,
    ({ create, destroy }) => create > 0 || destroy > 0,
  ]);

  const processNoPlan = () => {
    console.log("Nothing to deploy");
  };

  const abortDeploy = () => {
    console.log("Deployment aborted");
  };

  const promptConfirmDeploy = async (allPlans) => {
    return await pipe([
      countResources,
      async ({ create, destroy }) =>
        await prompts({
          type: "confirm",
          name: "confirmDeploy",
          message: `Are you sure to deploy ${create}${
            destroy > 0 ? ` and destroy ${destroy}` : ""
          } resource(s) ?`,
          initial: false,
        }),
      ({ confirmDeploy }) => confirmDeploy,
    ])(allPlans);
  };

  const displayResourcesDeployed = pipe([
    countResources,
    ({ create, destroy }) =>
      console.log(
        `${create} deployed${
          destroy > 0 ? ` and ${destroy} destroyed` : ""
        } resource(s)`
      ),
  ]);

  const doPlanDeploy = pipe([
    //tap((x) => console.log("doPlanDeploy", x)),
    async ({ provider, plan }) => {
      await runAsyncCommand(
        () => provider.deployPlan(plan),
        `Deploy Plan for ${provider.name()}`
      );
      return { provider, plan };
    },
  ]);

  const doPlansDeploy = pipe([map(doPlanDeploy), displayResourcesDeployed]);

  const processDeployPlans = switchCase([
    promptConfirmDeploy,
    doPlansDeploy,
    abortDeploy,
  ]);

  await pipe([
    planQuery,
    switchCase([hasPlans, processDeployPlans, processNoPlan]),
    //tap((x) => console.log("switchCase", x)),
  ])({ infra });
};

// Destroy plan
exports.planDestroy = async ({ infra, options }) => {
  const hasEmptyPlan = pipe([pluck("plan"), flatten, isEmpty]);

  const processHasNoPlan = () => {
    console.log("No resources to destroy");
  };

  const countDestroyed = reduce((acc, value) => {
    return acc + value.plan.length;
  }, 0);

  const displayResourcesDestroyed = pipe([
    countDestroyed,
    (length) => console.log(`${length} Resource(s) destroyed`),
  ]);

  const promptConfirmDestroy = async (plans) => {
    return await pipe([
      countDestroyed,
      async (length) =>
        await prompts({
          type: "confirm",
          name: "confirmDestroy",
          message: `Are you sure to destroy these ${length} resources ?`,
          initial: false,
        }),
      ({ confirmDestroy }) => confirmDestroy,
    ])(plans);
  };

  const doPlanDestroy = pipe([
    //tap((x) => console.log("doPlanDeploy", x)),
    async ({ provider, plan }) => {
      await runAsyncCommand(
        () => provider.destroyPlan(plan),
        `Destroying ${plan.length} resource(s) on provider ${provider.name()}`
      );
      return { provider, plan };
    },
  ]);

  const doPlansDestroy = pipe([map(doPlanDestroy), displayResourcesDestroyed]);

  const processDestroyPlans = switchCase([
    promptConfirmDestroy,
    doPlansDestroy,
    () => {
      console.log("Aborted");
    },
  ]);

  const findDestroy = async (provider) => {
    return {
      provider,
      plan: await pipe([
        async () => await provider.planFindDestroy(options, -1),
        (plan) => {
          displayPlan({
            providerName: provider.name(),
            newOrUpdate: [],
            destroy: plan,
          });
          return plan;
        },
      ])(),
    };
  };

  await pipe([
    async (providers) => await map(findDestroy)(providers),
    //tap((x) => console.log(JSON.stringify(x, null, 4))),
    ifElse(hasEmptyPlan, processHasNoPlan, processDestroyPlans),
  ])(infra.providers);
};

//List all
exports.list = async ({ infra, options }) => {
  return await map(async (provider) => {
    return await pipe([
      () =>
        runAsyncCommand(
          () => provider.listLives(options),
          `List for ${provider.name()}`
        ),
      (targets) => {
        displayLive({ providerName: provider.name(), targets });
        return targets;
      },
    ])();
  })(infra.providers);
};
