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
  or,
  get,
  eq,
  and,
  fork,
} = require("rubico");
const { isEmpty, forEach, pluck, size, find } = require("rubico/x");

const { planToResourcesPerType } = require("../Common");

const { displayType } = require("../ProviderCommon");

const hasPlan = or([
  pipe([get("newOrUpdate"), not(isEmpty)]),
  pipe([get("destroy"), not(isEmpty)]),
]);

const displayManagedByUs = ({ managedByUs }) =>
  managedByUs ? colors.green("Yes") : colors.red("NO");

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
          forEach(({ type, group, resources }) =>
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
                    content: displayType({ type, group }),
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
            content: `${colors[colorName]["bold"](
              displayType(resourcesPerType)
            )}`,
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
  pipe([
    tap((xxx) => {
      assert(true);
    }),
    filter(get("resource")),
    reduce(
      (acc, item) =>
        pipe([
          () => displayType(item.resource),
          switchCase([
            (fullType) => acc[fullType],
            (fullType) => ({
              ...acc,
              [fullType]: [item, ...acc[fullType]],
            }),
            (fullType) => ({ ...acc, [fullType]: [item] }),
          ]),
        ])(),
      init
    ),
    tap((xxx) => {
      assert(true);
    }),
  ]);

const tableSummaryDefs = {
  columns: ["Type", "Resources"],
  colWidths: ({ columns }) => {
    const typeLength = 32;
    const resourceLength = columns - typeLength - 10;
    return [typeLength, resourceLength];
  },
  fields: [
    //
    (item) => displayType(item.resource),
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
      map((fullType) => {
        const resources = result[fullType];
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
              `${size(resources)} ${fullType} from ${plan.providerName}`
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

const tablePerTypeDefinitions = [
  {
    type: "ServiceAccount",
    fields: [
      pipe([
        fork({
          name: get("data.email"),
          managedByUs: displayManagedByUs,
          live: get("live"),
        }),
        YAML.stringify,
      ]),
    ],
  },
];

const tablePerTypeDefault = {
  fields: [
    pipe([
      fork({
        name: get("displayName"),
        managedByUs: displayManagedByUs,
        live: get("live"),
      }),
      YAML.stringify,
    ]),
  ],
};

const displayLiveItem =
  ({ table, tableDefinitions }) =>
  (resource) => {
    assert(resource);
    assert(tableDefinitions);
    switchCase([
      () => resource.error,
      () =>
        table.push([
          {
            content: colors.red(YAML.stringify(resource)),
          },
        ]),
      () => table.push(tableDefinitions.fields.map((field) => field(resource))),
    ])();
  };

const displayPlanItemUpdate =
  ({ tableItem }) =>
  ({ diff, resource, id, action }) =>
    pipe([
      tap(() => {
        assert(diff.targetDiff);
        assert(diff.targetDiff.updated);
      }),
      () => diff,
      tap(() =>
        tableItem.push([
          {
            colSpan: 2,
            content: colors.green(
              `${action}: name: ${resource.displayName}, id: ${id}`
            ),
          },
        ])
      ),
      tap.if(get("updateNeedDestroy"), () =>
        tableItem.push([
          {
            colSpan: 2,
            content: colors.red(`REQUIRES DESTROYING AND CREATING`),
          },
        ])
      ),
      tap.if(
        and([get("updateNeedRestart"), not(get("updateNeedDestroy"))]),
        () =>
          tableItem.push([
            {
              colSpan: 2,
              content: colors.yellow(`REQUIRES STOPPING AND STARTING`),
            },
          ])
      ),
      () => diff.targetDiff.updated,
      map.entries(([key, value]) => {
        tableItem.push([
          {
            colSpan: 2,
            content: colors.yellow(`Key: ${key}`),
          },
        ]);
        tableItem.push([
          {
            content: colors.red(`- ${YAML.stringify(value)}`),
          },
          {
            content: colors.green(
              `+ ${YAML.stringify(diff.liveDiff.updated[key])}`
            ),
          },
        ]);
        return [key, value];
      }),
    ])();

const displayPlanItemCreate =
  ({ tableItem }) =>
  (resource) =>
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

const displayPlanItemDestroy =
  ({ tableItem }) =>
  (resource) =>
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
        displayPlanItemUpdate({ tableItem }),
        eq(get("action"), "CREATE"),
        displayPlanItemCreate({ tableItem }),
        eq(get("action"), "DESTROY"),
        displayPlanItemDestroy({ tableItem }),
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
  resourcesByType: { type, group, resources = [], error },
}) => {
  assert(providerName);
  assert(type);
  const tableDefinitions =
    find(eq(get("type")))(tablePerTypeDefinitions) || tablePerTypeDefault;

  const table = new Table({
    colWidths: [(process.stdout.columns || 80) - 4],
    style: { head: [], border: [] },
  });
  tap.if(
    () => !isEmpty(resources) || error,
    pipe([
      () =>
        table.push([
          {
            content: colors.yellow(
              `${resources.length} ${displayType({
                group,
                type,
              })} from ${providerName}`
            ),
          },
        ]),
      switchCase([
        () => error,
        () =>
          table.push([
            {
              content: colors.red(YAML.stringify(error)),
            },
          ]),
        pipe([
          () => resources,
          forEach(displayLiveItem({ table, tableDefinitions })),
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
