const { runAsyncCommand } = require("./cliUtils");

exports.planDestroy = async (provider) => {
  await runAsyncCommand(() => provider.destroyAll(), "Deploy Plan");
};
