const assert = require("assert");
const Table = require("cli-table3");
const colors = require("colors/safe");
const YAML = require("./json2yaml");
const {
  switchCase,
  pipe,
  tap,
  map,
  reduce,
  filter,
  not,
  get,
  eq,
} = require("rubico");
const { isEmpty, forEach, pluck, size, find, groupBy } = require("rubico/x");

const { planToResourcesPerType } = require("../Common");

const hasPlan = (plan) => !isEmpty(plan.newOrUpdate) || !isEmpty(plan.destroy);

const displayManagedByUs = (resource) =>
  resource.managedByUs ? colors.green("Yes") : colors.red("NO");

exports.displayListSummary = pipe([
  tap((input) => {
    console.log("List Summary:");
    assert(input);
  }),
  map(({ providerName, error, results }) =>
    pipe([
      tap(() => {
        assert(providerName);
        console.log(`Provider: ${providerName}`);
      }),
      () =>
        new Table({
          colWidths: tableSummaryDefs.colWidths({
            columns: process.stdout.columns || 80,
          }),
          style: { head: [], border: [] },
        }),
      (table) =>
        pipe([
          tap(() => {
            table.push([
              {
                colSpan: 2,
                content: colors.yellow(`${providerName}`),
              },
            ]);
          }),
          tap.if(
            () => error,
            () =>
              table.push([
                {
                  colSpan: 2,
                  content: colors.red(error),
                },
              ])
          ),
          () => results,
          filter(not(get("error"))),
          forEach(({ type, resources }) =>
            pipe([
              tap(() => {
                assert(type);
                assert(
                  Array.isArray(resources),
                  `no resources for type ${type}`
                );
              }),
              () => pluck("displayName")(resources).join("\n"),
              tap.if(not(isEmpty), (content) =>
                table.push([
                  {
                    content: type,
                  },
                  { content },
                ])
              ),
            ])()
          ),
          tap(() => {
            console.log(table.toString());
          }),
        ])(),
    ])()
  ),
]);

const displayResourcePerType = ({
  table,
  title,
  providerName,
  plans,
  colorName,
}) =>
  tap.if(
    not(isEmpty),
    pipe([
      tap(() =>
        table.push([
          {
            colSpan: 2,
            content: colors[colorName]["bold"](title),
          },
        ])
      ),
      () =>
        planToResourcesPerType({
          providerName,
          plans,
        }),
      map((resourcesPerType) =>
        table.push([
          {
            content: `${colors[colorName]["bold"](resourcesPerType.type)}`,
          },
          {
            content: pipe([
              pluck("displayName"),
              (names) => names.join(", "),
              (names) => colors[colorName](names),
            ])(resourcesPerType.resources),
          },
        ])
      ),
    ])
  )(plans);

exports.displayPlanSummary = pipe([
  filter(not(get("error"))),
  map(({ providerName, resultCreate, resultDestroy }) =>
    pipe([
      tap(() => {
        assert(providerName);
        assert(resultCreate);
        assert(resultDestroy);
      }),
      () =>
        new Table({
          colWidths: tableSummaryDefs.colWidths({
            columns: process.stdout.columns || 80,
          }),
          wordWrap: true,
          style: { head: [], border: [] },
        }),
      tap((table) =>
        table.push([
          {
            colSpan: 2,
            content: colors.yellow(`Plan summary for provider ${providerName}`),
          },
        ])
      ),
      tap((table) =>
        displayResourcePerType({
          table,
          providerName,
          plans: resultCreate,
          title: "DEPLOY RESOURCES",
          colorName: "brightGreen",
        })
      ),
      tap((table) =>
        displayResourcePerType({
          table,
          providerName,
          plans: resultDestroy,
          title: "DESTROY RESOURCES",
          colorName: "brightRed",
        })
      ),
      tap((table) => {
        console.log(table.toString());
      }),
    ])()
  ),
]);

exports.displayPlanDestroySummary = forEach(({ providerName, error, plans }) =>
  pipe([
    tap(() => {
      assert(providerName);
    }),
    () =>
      new Table({
        colWidths: tableSummaryDefs.colWidths({
          columns: process.stdout.columns || 80,
        }),
        wordWrap: true,
        style: { head: [], border: [] },
      }),
    tap.if(
      () => error,
      (table) =>
        table.push([
          {
            colSpan: 2,
            content: colors.red(error),
          },
        ])
    ),
    tap.if(
      () => !isEmpty(plans),
      (table) =>
        displayResourcePerType({
          table,
          providerName,
          plans: plans,
          title: `Destroy summary for provider ${providerName}`,
          colorName: "brightRed",
        })
    ),
    tap((table) => {
      console.log(table.toString());
    }),
  ])()
);

const groupByType = (init = {}) =>
  reduce((acc, item) => {
    const type = item.resource?.type;
    if (!type) {
      return acc;
    } else if (acc[type]) {
      return {
        ...acc,
        [type]: [item, ...acc[type]],
      };
    } else {
      return { ...acc, [item.resource.type]: [item] };
    }
  }, init);

const tableSummaryDefs = {
  columns: ["Type", "Resources"],
  colWidths: ({ columns }) => {
    const typeLength = 20;
    const resourceLength = columns - typeLength - 10;
    return [typeLength, resourceLength];
  },
  fields: [
    //
    (item) => item.resource.type,
    (item) => item.resource.name,
  ],
};

exports.displayPlan = async (plan) => {
  if (!hasPlan(plan)) {
    return plan;
  }
  assert(Array.isArray(plan.destroy, "Array.isArray(plan.destroy"));

  assert(plan.providerName);
  pipe([
    () => groupByType({})(plan.newOrUpdate),
    (result) => groupByType(result)(plan.destroy),
    (result) =>
      map((type) => {
        const resources = result[type];
        const columns = process.stdout.columns || 80;
        const table = new Table({
          colWidths: [columns - 2],
          style: {
            head: [],
            border: [],
          },
        });
        table.push([
          {
            content: colors.yellow(
              `${resources.length} ${type} from ${plan.providerName}`
            ),
          },
        ]);

        forEach((resource) => displayPlanItem({ table, resource }))(resources);

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
      get("data.email"),
      pipe([get("live"), YAML.stringify]),
      displayManagedByUs,
    ],
  },
];

const tablePerTypeDefault = {
  columns: ["Name", "Data", "Our"],
  colWidths: ({ resources, columns }) => {
    const nameLength =
      computeLength({ field: "displayName", maxLength: 40 })(resources) + 2;
    const managedByUs = 6;
    const dataLength = columns - nameLength - managedByUs - 10;
    return [nameLength, dataLength, managedByUs];
  },
  fields: [
    get("displayName"),
    pipe([get("live"), YAML.stringify]),
    displayManagedByUs,
  ],
};

const displayLiveItem = ({ table, resource, tableDefinitions }) => {
  assert(resource);
  assert(tableDefinitions);
  switchCase([
    () => resource.error,
    () =>
      table.push([
        {
          colSpan: 3,
          content: colors.red(YAML.stringify(resource)),
        },
      ]),
    () => table.push(tableDefinitions.fields.map((field) => field(resource))),
  ])();
};

const displayPlanItemUpdate = ({ tableItem, resource }) =>
  pipe([
    tap(() => {
      assert(true);
    }),
    () =>
      tableItem.push([
        {
          colSpan: 2,
          content: colors.green(
            YAML.stringify({
              [resource.action]: resource.resource.displayName,
            })
          ),
        },
      ]),
    () =>
      tableItem.push([
        {
          content: colors.red(YAML.stringify(resource.diff.targetDiff)),
        },
        {
          content: colors.green(YAML.stringify(resource.diff.liveDiff)),
        },
      ]),
  ])();

const displayPlanItemCreate = ({ tableItem, resource }) =>
  pipe([
    tap(() => {
      assert(true);
    }),
    () =>
      tableItem.push([
        {
          colSpan: 2,
          content: colors.green(
            `${resource.action}: ${resource.resource.displayName}`
          ),
        },
      ]),

    () =>
      tableItem.push([
        {
          colSpan: 2,
          content: colors.green(YAML.stringify(resource.target)),
        },
      ]),
  ])();

const displayPlanItemDestroy = ({ tableItem, resource }) =>
  pipe([
    tap(() => {
      assert(true);
    }),
    () =>
      tableItem.push([
        {
          colSpan: 2,
          content: colors.red(
            `${resource.action} ${resource.resource.displayName}`
          ),
        },
      ]),
    () =>
      tableItem.push([
        {
          colSpan: 2,
          content: colors.red(YAML.stringify(resource.live)),
        },
      ]),
  ])();

const displayPlanItem = ({ table, resource }) => {
  assert(resource);
  const columnsWidth = Math.floor(((process.stdout.columns || 80) - 8) / 2);

  const tableItem = new Table({
    colWidths: [columnsWidth, columnsWidth],
    style: { head: [], border: [] },
  });

  switchCase([
    () => resource.error,
    () =>
      table.push([
        {
          content: colors.red(YAML.stringify(resource)),
        },
      ]),
    pipe([
      () => resource,
      switchCase([
        eq(get("action"), "UPDATE"),
        (resource) => displayPlanItemUpdate({ tableItem, resource }),
        eq(get("action"), "CREATE"),
        (resource) => displayPlanItemCreate({ tableItem, resource }),
        eq(get("action"), "DESTROY"),
        (resource) => displayPlanItemDestroy({ tableItem, resource }),
        (resource) => {
          throw Error(
            `not a valid action in resource ${JSON.stringify(
              resource,
              null,
              4
            )}`
          );
        },
      ]),
      () => table.push([{ content: tableItem.toString() }]),
    ]),
  ])();
};

const displayTablePerType = ({
  providerName,
  resourcesByType: { type, resources = [], error },
}) => {
  assert(providerName);
  assert(type);
  const tableDefinitions =
    find(eq(get("type")))(tablePerTypeDefinitions) || tablePerTypeDefault;

  const table = new Table({
    colWidths: tableDefinitions.colWidths({
      resources,
      columns: process.stdout.columns || 80,
    }),
    style: { head: [], border: [] },
  });
  tap.if(
    () => !isEmpty(resources) || error,
    pipe([
      () =>
        table.push([
          {
            content: colors.yellow(
              `${resources.length} ${type} from ${providerName}`
            ),
          },
        ]),
      () =>
        table.push(tableDefinitions.columns.map((item) => colors.red(item))),
      switchCase([
        () => error,
        () =>
          table.push([
            {
              colSpan: 3,
              content: colors.red(YAML.stringify(error)),
            },
          ]),
        pipe([
          () => resources,
          forEach((resource) =>
            displayLiveItem({ table, resource, tableDefinitions })
          ),
        ]),
      ]),
      () => {
        console.log(table.toString());
        console.log("\n");
      },
    ])
  )();
};

exports.displayLive = ({ providerName, error, resources = [] }) =>
  pipe([
    tap(() => {
      assert(providerName);
    }),
    () => resources,
    forEach((resourcesByType) =>
      displayTablePerType({ providerName, resourcesByType })
    ),
  ])();
