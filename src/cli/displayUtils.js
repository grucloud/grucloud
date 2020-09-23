const assert = require("assert");
const Table = require("cli-table3");
const colors = require("colors/safe");
const YAML = require("./json2yaml");
const { switchCase, pipe, tap, map, reduce, filter } = require("rubico");
const { isEmpty, forEach, pluck, size } = require("rubico/x");
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

exports.displayListSummary = pipe([
  tap((result) => {
    console.log("List Summary:");
  }),
  forEach(({ provider, result }) =>
    pipe([
      tap((results) => {
        console.log(`Provider: ${provider.name}`);
      }),
      filter(({ error }) => !error),
      forEach(({ type, resources }) => {
        console.log(`  Type: ${type}`);
        forEach((resource) => console.log(`    ${resource.name || "Default"}`))(
          resources
        );
      }),
      tap(() => {
        console.log(`\n`);
      }),
    ])(result.results)
  ),
]);

exports.displayPlanSummary = pipe([
  tap((result) => {
    console.log("Plan Summary:");
  }),
  map(({ provider, resultQuery }) => {
    console.log(`Provider: ${provider.name}`);
    resultQuery.resultCreate.plans.forEach(({ resource }) => {
      console.log(`+ ${resource.type}::${resource.name}`);
    });
    resultQuery.resultDestroy.plans.forEach(({ resource }) => {
      console.log(`- ${resource.type}::${resource.name}`);
    });
    console.log(`\n`);
  }),
]);

const groupByType = (init = {}) =>
  reduce((acc, item) => {
    const { type } = item.resource;
    if (acc[type]) {
      return {
        ...acc,
        [type]: [item, ...acc[type]],
      };
    } else {
      return { ...acc, [item.resource.type]: [item] };
    }
  }, init);

const tablePlanPerType = {
  columns: ["Name", "Action", "Data"],
  colWidths: ({ resources, columns }) => {
    const nameLength =
      computeLength({ field: "resource.name", maxLength: 40 })(resources) + 2;
    const actionLength = 10;
    const dataLength = columns - nameLength - actionLength - 10;
    return [nameLength, actionLength, dataLength];
  },
  fields: [
    (item) => item.resource.name,
    (item) => item.action,
    (item) => YAML.stringify(item.config),
  ],
};

exports.displayPlan = async (plan) => {
  assert(Array.isArray(plan.destroy, "Array.isArray(plan.destroy"));
  if (!hasPlan(plan)) {
    return plan;
  }

  assert(plan.providerName);
  pipe([
    () => groupByType({})(plan.newOrUpdate),
    (result) => groupByType(result)(plan.destroy),
    (result) =>
      map((type) => {
        const resources = result[type];
        const tableDefinitions = tablePlanPerType;
        const table = new Table({
          colWidths: tableDefinitions.colWidths({
            resources,
            columns: process.stdout.columns || 80,
          }),
          style: { head: [], border: [] },
        });
        table.push([
          {
            colSpan: 3,
            content: colors.yellow(
              `${resources.length} ${type} from ${plan.providerName}`
            ),
          },
        ]);
        table.push(tableDefinitions.columns.map((item) => colors.red(item)));

        resources.forEach((resource) =>
          displayLiveItem({ table, resource, tableDefinitions })
        );

        console.log(table.toString());
        console.log("\n");
      })(Object.keys(result)),
  ])();

  return plan;
};

const computeLength = ({ field, maxLength, minLength = 8 }) =>
  pipe([
    pluck(field),
    filter((name) => name),
    map(size),
    (lengths) => Math.max(...lengths),
    (max) => Math.min(maxLength, max),
    (min) => Math.max(min, minLength),
  ]);

const tablePerTypeDefinitions = [
  {
    type: "ServiceAccount",
    colWidths: ({ resources, columns }) => {
      const emailLength =
        computeLength({ field: "data.email", maxLength: 60 })(resources) + 2;
      const managedByUs = 6;
      const dataLength = columns - emailLength - managedByUs - 10;
      return [emailLength, dataLength, managedByUs];
    },
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
  colWidths: ({ resources, columns }) => {
    const nameLength =
      computeLength({ field: "name", maxLength: 40 })(resources) + 2;
    const managedByUs = 6;
    const dataLength = columns - nameLength - managedByUs - 10;
    return [nameLength, dataLength, managedByUs];
  },
  fields: [
    (resource) => resource.name,
    (resource) => YAML.stringify(resource.data),
    (resource) => displayManagedByUs(resource),
  ],
};

const displayLiveItem = ({ table, resource, tableDefinitions }) => {
  assert(resource);
  assert(tableDefinitions);
  table.push(tableDefinitions.fields.map((field) => field(resource)));
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

  const table = new Table({
    colWidths: tableDefinitions.colWidths({
      resources,
      columns: process.stdout.columns || 80,
    }),
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
