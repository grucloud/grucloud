const { displayPlan } = require("./displayPlan");
const { runAsyncCommand } = require("./cliUtils");

exports.planQuery = async (provider) => {
  const plan = await runAsyncCommand(() => provider.plan(), "Query Plan");
  displayPlan(plan);
  return plan;
};
