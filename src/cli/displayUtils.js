//const emoji = require("node-emoji");
const Table = require("cli-table3");
const colors = require("colors/safe");
const YAML = require("./json2yaml");

/*
const actionsEmoticon = {
  CREATE: emoji.get("sparkle"),
  DESTROY: emoji.get("x"),
};
const displayAction = (item) => actionsEmoticon[item.action];
*/

const displayResource = (item) =>
  item.config != null ? YAML.stringify(item.config) : undefined;

const displayItem = (table, item) => {
  table.push([
    item.resource.name,
    item.action,
    item.resource.type,
    displayResource(item),
  ]);
};

exports.displayPlan = async (plan) => {
  const table = new Table({ style: { head: [], border: [] } });
  table.push([{ colSpan: 4, content: colors.yellow(plan.providerName) }]);
  table.push(
    ["Name", "Action", "Type", "Config"].map((item) => colors.red(item))
  );

  plan.newOrUpdate?.forEach((item) => displayItem(table, item));
  plan.destroy?.forEach((item) => displayItem(table, item));
  console.log(table.toString());
  console.log("\n");
};

const displayLiveItem = (table, item) => {
  table.push([item.name, item.type, YAML.stringify(item.data)]);
};
exports.displayLive = async ({ providerName, targets }) => {
  const table = new Table({ style: { head: [], border: [] } });
  table.push([{ colSpan: 3, content: colors.yellow(providerName) }]);
  table.push(["Name", "Type", "Data"].map((item) => colors.red(item)));

  targets.forEach((item) => displayLiveItem(table, item));
  console.log(table.toString());
  console.log("\n");
};
