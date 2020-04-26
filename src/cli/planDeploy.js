const { runAsyncCommand } = require("./cliUtils");
const { planQuery } = require("./planQuery");

exports.planDeploy = async (provider) => {
  {
    const plan = await planQuery(provider);

    await runAsyncCommand(() => provider.deployPlan(plan), "Deploy Plan");
  }
  {
    const plan = await planQuery(provider);
    if (!provider.isPlanEmpty(plan)) {
      throw Error(`plan is not empty after deploy`);
    }
  }
};
