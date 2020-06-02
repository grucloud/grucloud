//const emoji = require("node-emoji");
const assert = require("assert");
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
  assert(item.resource.name);
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

const displayLiveItem = ({ table, resource }) => {
  assert(resource);
  assert(resource.data);
  table.push([
    resource.name,
    resource.id,
    YAML.stringify(resource.data),
    resource.managedByUs ? colors.green("Yes") : colors.red("NO"),
  ]);
};

const displayTablePerType = ({
  providerName,
  resourcesByType: { type, resources },
}) => {
  assert(type);
  assert(resources);
  const table = new Table({ style: { head: [], border: [] } });
  table.push([
    {
      colSpan: 4,
      content: colors.yellow(
        `${resources.length} ${type} from ${providerName}`
      ),
    },
  ]);
  table.push(
    ["Name", "Id", "Data", "Managed by Us"].map((item) => colors.red(item))
  );

  resources.forEach((resource) => displayLiveItem({ table, resource }));

  console.log(table.toString());
  console.log("\n");
};

exports.displayLive = async ({ providerName, targets }) => {
  assert(providerName);
  assert(targets);
  targets.forEach((resourcesByType) =>
    displayTablePerType({ providerName, resourcesByType })
  );
};

// Status
const displayStatusItem = (table, item) => {
  assert(item.type);
  table.push([item.type, YAML.stringify(item.data)]);
};
exports.displayStatus = async ({ providerName, targets }) => {
  const table = new Table({ style: { head: [], border: [] } });
  table.push([
    { colSpan: 2, content: colors.yellow(`Statuses for ${providerName}`) },
  ]);
  table.push(["Type", "Data"].map((item) => colors.red(item)));

  targets.forEach((item) => displayStatusItem(table, item));
  console.log(table.toString());
  console.log("\n");
};
