const emoji = require("node-emoji");

const { runAsyncCommand } = require("./cliUtils");
var actionsEmoticon = {
  CREATE: emoji.get("sparkle"),
  DELETE: "-",
};
// Plan
const displayAction = (action) => actionsEmoticon[action];

const displayResource = (r) => `${r.provider}/${r.type}/${r.name}`;

const planDisplayItem = (item) => {
  console.log(
    `${displayAction(item.action)}  ${displayResource(item.resource)}`
  );
};

exports.displayPlan = async (provider) => {
  const plan = await runAsyncCommand(() => provider.plan(), "Query Plan");
  plan.newOrUpdate && plan.newOrUpdate.map((item) => planDisplayItem(item));
  //TODO display removed items
};
