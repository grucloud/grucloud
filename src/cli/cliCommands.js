const _ = require("lodash");
const { runAsyncCommand } = require("./cliUtils");
const { displayPlan, displayLive, displayStatus } = require("./displayUtils");

//Query Plan
const planQuery = async ({ infra }) => {
  try {
    const plans = await Promise.all(
      infra.providers.map(async (provider) => {
        const plan = await runAsyncCommand(
          () => provider.plan(),
          `Query Plan for ${provider.name()}`
        );
        displayPlan(plan);
      })
    );
    return plans;
  } catch (error) {
    console.error("error", error);
    throw error;
  }
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
  //TODO Promise all settled
  const results = await Promise.all(
    infra.providers.map(async (provider) => {
      try {
        // TODO Use  planFindDestroy and deployPlan
        await runAsyncCommand(
          () => provider.destroyAll(options),
          `Destroy Resources ${provider.name()}`
        );
        const targets = await runAsyncCommand(
          () => provider.listLives({ canBeDeleted: true, our: !options.all }),
          `Status for ${provider.name()}`
        );
        // TODO display the number od resources deleted
        {
          const targets = await runAsyncCommand(
            () => provider.listLives({ out: true }),
            `Remaining resources for provider ${provider.name()}`
          );
          displayLive({ providerName: provider.name(), targets });
        }
      } catch (error) {
        //console.error("error", error);
        return { error };
      }
    })
    //TODO Check status is empty
  );
  console.log("results", results);
  //return results.some((result) => result);
};

//Display Status
exports.displayStatus = async ({ infra }) => {
  try {
    const targets = await Promise.all(
      infra.providers.map(async (provider) => {
        const targets = await runAsyncCommand(
          () => provider.listTargets(),
          `Status for ${provider.name()}`
        );
        displayStatus({ providerName: provider.name(), targets });
        return targets;
      })
    );
    return targets;
  } catch (error) {
    console.error(error);
    throw error;
  }
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
