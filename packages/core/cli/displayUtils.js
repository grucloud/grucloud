const assert = require("assert");
const util = require("util");
const Table = require("cli-table3");
const colors = require("colors/safe");
const YAML = require("./json2yaml");
const {
  tryCatch,
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
  gt,
} = require("rubico");
const {
  callProp,
  isEmpty,
  forEach,
  pluck,
  size,
  find,
  identity,
  when,
  append,
  prepend,
} = require("rubico/x");
const logger = require("../logger")({ prefix: "Display" });

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
            results,
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
          forEach(({ groupType, resources }) =>
            pipe([
              tap(() => {
                assert(groupType);
                assert(
                  Array.isArray(resources),
                  `no resources for type ${groupType}`
                );
              }),
              () => resources,
              filter(not(callProp("hideResource"))),
              pluck("displayName"),
              callProp("join", "\n"),
              tap.if(not(isEmpty), (content) =>
                table.push([
                  {
                    content: groupType,
                  },
                  { content },
                ])
              ),
            ])()
          ),
          tap(() => {
            logger.debug("display table summary");
            console.log(table.toString());
            logger.debug("display table summary done");
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
            results: pluck("resource")([...resultCreate, ...resultDestroy]),
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
          results: pluck("resource")(plans),
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

const maxGroupTypeLength = pipe([
  pluck("groupType"),
  reduce((max, item) => Math.max(max, size(item)), 0),
]);

const tableSummaryDefs = {
  columns: ["Type", "Resources"],
  colWidths: ({ columns, results }) => {
    const typeLength = maxGroupTypeLength(results) + 2;
    const resourceLength = columns - typeLength - 6;
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

const MaxLine = 400;

const stringifyLimit = tryCatch(
  pipe([
    YAML.stringify,
    callProp("split", "\n"),
    when(
      gt(size, MaxLine),
      pipe([callProp("slice", 0, MaxLine), append("[TRUNCATED]")])
    ),
    callProp("join", "\n"),
  ]),
  (error, toFormat) =>
    pipe([
      tap((params) => {
        assert(error);
        assert(toFormat);
      }),
      () => "ERROR",
    ])()
);

const tablePerTypeDefault = {
  fields: [
    pipe([
      fork({
        name: get("displayName"),
        managedByUs: displayManagedByUs,
        live: pipe([({ displayResource, live }) => displayResource({ live })]),
      }),
      stringifyLimit,
    ]),
  ],
};

const displayLiveItem =
  ({ table, tableDefinitions }) =>
  (resource) => {
    assert(resource);
    assert(tableDefinitions);
    switchCase([
      () => resource.hideResource(),
      () => undefined,
      () => resource.error,
      () =>
        table.push([
          {
            content: colors.red(stringifyLimit(resource)),
          },
        ]),
      () => table.push(tableDefinitions.fields.map((field) => field(resource))),
    ])();
  };

const addSymbol = ({ symbol, color }) =>
  pipe([
    tap((params) => {
      assert(true);
    }),
    get("value", ""),
    callProp("split", "\n"),
    map(prepend(`${symbol} `)),
    callProp("join", "\n"),
    (value) => colors[color](value),
  ]);

const contentFromChange = pipe([
  tap((params) => {
    assert(true);
  }),
  switchCase([
    get("added"),
    addSymbol({ symbol: "+", color: "bold" }),
    get("removed"),
    addSymbol({ symbol: "-", color: "red" }),
    addSymbol({ symbol: " ", color: "green" }),
  ]),
]);

const displayJsonDiff = ({ tableItem }) =>
  pipe([
    map(contentFromChange),
    callProp("join", ""),
    (content) =>
      tableItem.push([
        {
          colSpan: 2,
          content,
        },
      ]),
  ]);

const displayPlanItemUpdate =
  ({ tableItem }) =>
  ({ diff, resource, id, action }) =>
    pipe([
      tap(() => {
        assert(diff.liveDiff);
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
      tap((params) => {
        assert(true);
      }),
      tap.if(
        get("hasDataDiff"),
        pipe([get("jsonDiff"), displayJsonDiff({ tableItem })])
      ),
      tap.if(
        get("hasTagsDiff"),
        pipe([
          tap(() =>
            tableItem.push([
              {
                colSpan: 2,
                content: colors.yellow(`UPDATE TAGS`),
              },
            ])
          ),
          get("tags.diffTags"),
          displayJsonDiff({ tableItem }),
        ])
      ),
    ])();

const itemHeader =
  ({ tableItem, resource, color = "green" }) =>
  () =>
    tableItem.push([
      {
        colSpan: 2,
        content: colors[color](
          `${resource.action}: ${resource.resource.displayName}`
        ),
      },
    ]);

const displayPlanItemCreate =
  ({ tableItem }) =>
  (resource) =>
    pipe([
      itemHeader({ tableItem, resource }),
      () =>
        tableItem.push([
          {
            colSpan: 2,
            content: colors.green(stringifyLimit(resource.target)),
          },
        ]),
    ])();

const displayPlanItemDestroy =
  ({ tableItem }) =>
  (resource) =>
    pipe([
      itemHeader({ tableItem, resource, color: "red" }),
      () =>
        tableItem.push([
          {
            colSpan: 2,
            content: colors.red(stringifyLimit(resource.live)),
          },
        ]),
    ])();

const displayPlanItemWaitAvailability =
  ({ tableItem }) =>
  (resource) =>
    pipe([itemHeader({ tableItem, resource })])();

const displayError = switchCase([get("stack"), identity, YAML.stringify]);

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
          content: colors.red(displayError(resource.error)),
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
        eq(get("action"), "WAIT_CREATION"),
        displayPlanItemWaitAvailability({ tableItem }),
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
  resourcesByType: { groupType, resources = [], error },
}) => {
  assert(providerName);
  assert(groupType);
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
              `${resources.length} ${groupType} from ${providerName}`
            ),
          },
        ]),
      switchCase([
        () => error,
        () =>
          table.push([
            {
              content: colors.red(YAML.stringify(util.inspect(error))),
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
