const _ = require("lodash");
const { runAsyncCommand } = require("./cliUtils");
const { displayPlan, displayLive } = require("./displayUtils");
const prompts = require("prompts");
const { map, pipe, switchCase, any } = require("rubico");
const { flatten, tap, isEmpty, pluck, ifElse } = require("ramda");

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
  const hasPlans = ({ plan }) =>
    any((plan) => !isEmpty(plan.newOrUpdate) || !isEmpty(plan.destroy));

  const processNoPlan = () => {
    console.log("Nothing to deploy");
  };

  const abortDeploy = () => {
    console.log("Deployment aborted");
  };

  const promptConfirmDeploy = async (allPlans) => {
    //console.log("promptConfirmDeploy", allPlans);
    // Count resources to deploy and destroy
    const { confirmDeploy } = await prompts({
      type: "confirm",
      name: "confirmDeploy",
      message: "Are you sure to deploy these resources ?",
      initial: false,
    });
    return confirmDeploy;
  };

  const doPlanDeploy = pipe([
    //tap((x) => console.log("doPlanDeploy", x)),
    async ({ provider, plan }) => {
      await runAsyncCommand(
        () => provider.deployPlan(plan),
        `Deploy Plan for ${provider.name()}`
      );
      return { provider, plan };
    },
    //tap((x) => console.log("deployPlan", x)),
  ]);

  const doPlansDeploy = (plans) => map(doPlanDeploy)(plans);

  const processPlans = switchCase([
    promptConfirmDeploy,
    doPlansDeploy,
    abortDeploy,
  ]);

  await pipe([
    planQuery,
    //tap((x) => console.log("planQuery", x)),
    switchCase([hasPlans, processPlans, processNoPlan]),
    //tap((x) => console.log("switchCase", x)),
  ])({ infra });
};

// Destroy plan
exports.planDestroy = async ({ infra, options }) => {
  const hasEmptyPlan = pipe([pluck("plan"), flatten, isEmpty]);

  const processHasNoPlan = () => {
    console.log("No resources to destroy");
  };

  const displayResourcesDestroyed = pipe([
    flatten,
    (plans) => console.log(`${plans.length} Resource(s) destroyed`),
  ]);

  const promptConfirmDestroy = async () => {
    const { confirmDestroy } = await prompts({
      type: "confirm",
      name: "confirmDestroy",
      message: "Are you sure to destroy these resources ?",
      initial: false,
    });
    return confirmDestroy;
  };

  const doPlansDestroy = pipe([
    async (result) =>
      map(async ({ provider, plan }) => {
        return await runAsyncCommand(
          () => provider.destroyPlan(plan),
          `Destroying Resources on provider ${provider.name()}`
        );
      })(result),
    displayResourcesDestroyed,
  ]);

  const processPlans = switchCase([
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
    ifElse(hasEmptyPlan, processHasNoPlan, processPlans),
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
