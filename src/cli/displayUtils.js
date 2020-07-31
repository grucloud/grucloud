const assert = require("assert");
const Table = require("cli-table3");
const colors = require("colors/safe");
const YAML = require("./json2yaml");
const isEmpty = require("rubico/x/isEmpty");
const { switchCase } = require("rubico");

const hasPlan = (plan) => !isEmpty(plan.newOrUpdate) || !isEmpty(plan.destroy);

const displayResource = (item) =>
  item.config != null ? YAML.stringify(item.config) : undefined;

const displayManagedByUs = (resource) =>
  resource.managedByUs ? colors.green("Yes") : colors.red("NO");

const displayItem = (table, item) =>
  switchCase([
    () => item.error,
    () => {
      table.push(["Error", item.action, "", item.error.message]);
    },
    () =>
      table.push([
        item.resource?.name,
        item.action,
        item.resource?.type,
        displayResource(item),
      ]),
  ])();

exports.displayPlan = async (plan) => {
  assert(Array.isArray(plan.destroy, "Array.isArray(plan.destroy"));
  if (!hasPlan(plan)) {
    return plan;
  }
  const table = new Table({
    colWidths: [undefined, undefined, undefined, 120],
    style: { head: [], border: [] },
  });
  table.push([{ colSpan: 4, content: colors.yellow(plan.providerName) }]);
  table.push(
    ["Name", "Action", "Type", "Config"].map((item) => colors.red(item))
  );

  plan.newOrUpdate?.forEach((item) => displayItem(table, item));
  //TODO tap if
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

const tablePerTypeDefinitions = [
  {
    type: "ServiceAccount",
    colWidths: [undefined, 120, undefined],
    columns: ["Email", "Data", "Our"],
    fields: [
      (resource) => resource.data.email,
      (resource) => YAML.stringify(resource.data),
      (resource) => displayManagedByUs(resource),
    ],
  },
];

const tablePerTypeDefault = {
  columns: ["Name", "Data", "Our"],
  colWidths: [undefined, 120, undefined],
  fields: [
    (resource) => resource.name,
    (resource) => YAML.stringify(resource.data),
    (resource) => displayManagedByUs(resource),
  ],
};

const displayTablePerType = ({
  providerName,
  resourcesByType: { type, resources },
}) => {
  assert(type);
  assert(resources);
  const tableDefinitions =
    tablePerTypeDefinitions.find((def) => def.type === type) ||
    tablePerTypeDefault;

  //console.log("Terminal columns: " + process.stdout.columns)
  //TODO
  const table = new Table({
    colWidths: tableDefinitions.colWidths,
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
  table.push(tableDefinitions.columns.map((item) => colors.red(item)));

  resources.forEach((resource) =>
    displayLiveItem({ table, resource, tableDefinitions })
  );

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
