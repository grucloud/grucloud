// Live Resources
const emoji = require("node-emoji");

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

// Live Resources
exports.displayLive = (live) => {
  //console.log(JSON.stringify(live, null, 4));
  console.log(`${live.type} - ${live.data.items.length} `);
};

exports.displayPlan = async (plan) => {
  plan.newOrUpdate && plan.newOrUpdate.map((item) => planDisplayItem(item));
  //TODO display removed items
};
