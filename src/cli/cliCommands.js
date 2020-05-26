const { runAsyncCommand } = require("./cliUtils");
const { createInfra } = require("./infra");
const { displayPlan, displayLive } = require("./displayUtils");

//Query Plan
const planQuery = async ({ program }) => {
  try {
    const infra = await createInfra({ infra: program.infra });
    await Promise.all(
      infra.providers.map(async (provider) => {
        const plan = await runAsyncCommand(
          () => provider.plan(),
          `Query Plan for ${provider.name()}`
        );
        displayPlan(plan);
      })
    );
  } catch (error) {
    console.error("error", error);
    throw error;
  }
};
exports.planQuery = planQuery;

//Deploy plan
exports.planDeploy = async ({ program }) => {
  try {
    const infra = await createInfra({ infra: program.infra });
    const provider = infra.providers[0];
    {
      const plan = await runAsyncCommand(() => provider.plan(), "Query Plan");
      await runAsyncCommand(() => provider.deployPlan(plan), "Deploy Plan");
    }
    {
      const plan = await runAsyncCommand(() => provider.plan(), "Check Plan");
      if (!provider.isPlanEmpty(plan)) {
        throw Error(`plan is not empty after deploy`);
      }
    }
  } catch (error) {
    console.error("error", error);
    throw error;
  }
};

// Destroy plan
exports.planDestroy = async ({ program }) => {
  try {
    const infra = await createInfra({ infra: program.infra });
    const provider = infra.providers[0];
    await runAsyncCommand(() => provider.destroyAll(), "Destroy Resources");
  } catch (error) {
    console.error("error", error);
    throw error;
  }
};

//Display Status
exports.displayStatus = async ({ program }) => {
  try {
    const infra = await createInfra({ infra: program.infra });
    await Promise.all(
      infra.providers.map(async (provider) => {
        const targets = await runAsyncCommand(
          () => provider.listTargets(),
          `Target Resources ${provider.name()}`
        );
        displayLive({ providerName: provider.name(), targets });
      })
    );
  } catch (error) {
    console.error(error);
    throw error;
  }
};
