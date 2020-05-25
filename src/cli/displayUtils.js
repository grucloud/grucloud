// Live Resources
const emoji = require("node-emoji");
const Table = require("cli-table3");
const YAML = require("json-to-pretty-yaml");
var actionsEmoticon = {
  CREATE: emoji.get("sparkle"),
  DESTROY: emoji.get("x"),
};
// Plan
const displayAction = (item) => actionsEmoticon[item.action];
const displayResource = (item) => YAML.stringify(item.config);

const displayItem = (table, item) => {
  table.push([
    item.resource.name,
    item.action,
    item.resource.type,
    item.resource.provider,
    displayResource(item),
  ]);
};
exports.displayPlan = async (plan) => {
  const table = new Table({
    head: ["Name", "Action", "Type", "Provider", "Config"],
    columns: {
      4: {
        width: 20,
        wrapWord: true,
      },
    },
  });

  plan.newOrUpdate &&
    plan.newOrUpdate.forEach((item) => displayItem(table, item));
  plan.destroy && plan.destroy.forEach((item) => displayItem(table, item));
  console.log(table.toString());
};
