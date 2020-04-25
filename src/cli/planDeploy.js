const { runAsyncCommand } = require("./cliUtils");

exports.planDeploy = async (provider) => {
  const plan = await runAsyncCommand(() => provider.plan(), "Query Plan");
  await runAsyncCommand(() => provider.deployPlan(plan), "Deploy Plan");
  //TODO display removed items
};
