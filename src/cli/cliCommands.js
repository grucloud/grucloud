const _ = require("lodash");
const { runAsyncCommand } = require("./cliUtils");
const { displayPlan, displayLive } = require("./displayUtils");
const prompts = require("prompts");
const { map, pipe, switchCase } = require("rubico");
const { flatten, tap, isEmpty, pluck, ifElse } = require("ramda");

//Query Plan
const planQuery = async ({ infra }) => {
  await map(async (provider) => {
    await pipe([
      () =>
        runAsyncCommand(
          () => provider.plan(),
          `Query Plan for ${provider.name()}`
        ),
      displayPlan,
    ])();
  })(infra.providers);
};
exports.planQuery = planQuery;

//Deploy plan
exports.planDeploy = async ({ infra }) => {
  try {
    await planQuery({ infra });
    //What if plans is empty ?
    //TODO Promise.all settled ?
    await Promise.all(
      infra.providers.map(async (provider) => {
        try {
          const plan = await runAsyncCommand(
            () => provider.plan(),
            `Query Plan for ${provider.name()}`
          );

          await runAsyncCommand(
            () => provider.deployPlan(plan),
            `Deploy Plan for ${provider.name()}`
          );
          {
            const plan = await runAsyncCommand(
              () => provider.plan(),
              `Check Plan for ${provider.name()}`
            );
            if (!provider.isPlanEmpty(plan)) {
              throw Error(
                `plan for ${provider.name()} is not empty after deploy`
              );
            }
          }
          {
            const targets = await runAsyncCommand(
              () => provider.listLives({ out: true }),
              `List for provider ${provider.name()}`
            );
            displayLive({ providerName: provider.name(), targets });
          }
        } catch (error) {
          console.error("error", error);

          return { error };
        }
      })
    );
  } catch (error) {
    console.error("error", error);
    throw error;
  }
};

// Destroy plan
exports.planDestroy = async ({ infra, options }) => {
  const hasEmptyPlan = pipe([pluck("plan"), flatten, isEmpty]);

  const processHasNoPlan = () => {
    console.log("no resources to destroy");
  };

  const displayResourcesDestroyed = pipe([
    flatten,
    (plans) => console.log(`${plans.length} Resource(s) destroyed`),
  ]);

  const promptConfirmDestroy = async () => {
    const { confirmDestroy } = await prompts({
      type: "confirm",
      name: "confirmDestroy",
      message: "Are you sure to destroy the resources ?",
    });
    return confirmDestroy;
  };

  const doPlansDestroy = pipe([
    async (result) =>
      map(async ({ provider, plan }) => await provider.destroyPlan(plan))(
        result
      ),
    displayResourcesDestroyed,
  ]);

  const processHasPlan = switchCase([
    promptConfirmDestroy,
    doPlansDestroy,
    () => {
      console.log("Aborted");
    },
  ]);

  await pipe([
    async (providers) =>
      await map(async (provider) => ({
        provider,
        plan: await provider.planFindDestroy(options, -1),
      }))(providers),
    ifElse(hasEmptyPlan, processHasNoPlan, processHasPlan),
  ])(infra.providers);
};

//List all
exports.list = async ({ infra, options }) => {
  try {
    const targets = await Promise.all(
      infra.providers.map(async (provider) => {
        const targets = await runAsyncCommand(
          () => provider.listLives(options),
          `List for ${provider.name()}`
        );
        displayLive({ providerName: provider.name(), targets });
        return targets;
      })
    );
    return targets;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
