const assert = require("assert");
const Table = require("cli-table3");
const colors = require("colors/safe");
const YAML = require("./json2yaml");
const { isEmpty } = require("ramda");

const hasPlan = (plan) => !isEmpty(plan.newOrUpdate) || !isEmpty(plan.destroy);

const displayResource = (item) =>
  item.config != null ? YAML.stringify(item.config) : undefined;

const displayItem = (table, item) => {
  //assert(item.resource.name);
  table.push([
    item.resource.name,
    item.action,
    item.resource.type,
    displayResource(item),
  ]);
};

exports.displayPlan = async (plan) => {
  if (!hasPlan(plan)) {
    return plan;
  }
  const table = new Table({ style: { head: [], border: [] } });
  table.push([{ colSpan: 4, content: colors.yellow(plan.providerName) }]);
  table.push(
    ["Name", "Action", "Type", "Config"].map((item) => colors.red(item))
  );

  plan.newOrUpdate?.forEach((item) => displayItem(table, item));
  plan.destroy?.forEach((item) => displayItem(table, item));
  console.log(table.toString());
  console.log("\n");
  return plan;
};
const displayLiveItem = ({ table, resource }) => {
  assert(resource);
  assert(resource.data);
  table.push([
    resource.name,
    //resource.id,
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
  //console.log("Terminal columns: " + process.stdout.columns)
  //TODO
  const table = new Table({
    colWidths: [undefined, 140, undefined],
    style: { head: [], border: [] },
  });
  table.push([
    {
      colSpan: 3,
      content: colors.yellow(
        `${resources.length} ${type} from ${providerName}`
      ),
    },
  ]);
  table.push(["Name", "Data", "Managed by Us"].map((item) => colors.red(item)));

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
