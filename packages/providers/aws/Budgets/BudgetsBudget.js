const assert = require("assert");
const {
  pipe,
  tap,
  get,
  assign,
  pick,
  map,
  or,
  omit,
  flatMap,
  filter,
  eq,
} = require("rubico");
const { defaultsDeep, callProp, when, pluck } = require("rubico/x");
const { getByNameCore, omitIfEmpty } = require("@grucloud/core/Common");
const { replaceWithName } = require("@grucloud/core/Common");

const sortJson = pipe([
  callProp("sort", (a, b) =>
    JSON.stringify(a).localeCompare(JSON.stringify(b))
  ),
]);

const pickId = pipe([
  pick(["BudgetName", "AccountId"]),
  tap(({ BudgetName, AccountId }) => {
    assert(BudgetName);
    assert(AccountId);
  }),
]);

const decorate = ({ endpoint, config }) =>
  pipe([
    defaultsDeep({ AccountId: config.accountId() }),
    omitIfEmpty(["CostFilters"]),
    assign({
      Notifications: (live) =>
        pipe([
          () => live,
          pickId,
          endpoint().describeNotificationsForBudget,
          get("Notifications"),
          sortJson,
          map((Notification) =>
            pipe([
              () => ({ Notification }),
              defaultsDeep(pickId(live)),
              endpoint().describeSubscribersForNotification,
              get("Subscribers"),
              sortJson,
              (Subscribers) => ({ ...Notification, Subscribers }),
            ])()
          ),
        ])(),
    }),
  ]);

exports.BudgetsBudget = ({ compare }) => ({
  type: "Budget",
  package: "budgets",
  client: "Budgets",
  ignoreErrorCodes: ["NotFoundException"],
  inferName: () =>
    pipe([
      get("BudgetName"),
      tap((BudgetName) => {
        assert(BudgetName);
      }),
    ]),
  findName: () => pipe([get("BudgetName")]),
  findId: () => pipe([get("BudgetName")]),
  propertiesDefault: {},
  omitProperties: [
    "AccountId",
    "LastUpdatedTime",
    "CalculatedSpend",
    "TimePeriod",
    "Notifications[].NotificationState",
  ],
  compare: compare({ filterAll: () => pipe([omit(["TimePeriod"])]) }),
  dependencies: {
    snsTopics: {
      type: "Topic",
      group: "SNS",
      list: true,
      dependencyIds: () =>
        pipe([
          get("Notifications"),
          flatMap(
            pipe([
              get("Subscribers"),
              filter(eq(get("SubscriptionType"), "SNS")),
              pluck("Address"),
            ])
          ),
        ]),
    },
  },
  filterLive: ({ providerConfig, lives }) =>
    pipe([
      assign({
        Notifications: pipe([
          get("Notifications"),
          map(
            assign({
              Subscribers: pipe([
                get("Subscribers"),
                map(
                  when(
                    eq(get("SubscriptionType"), "SNS"),
                    assign({
                      Address: pipe([
                        get("Address"),
                        replaceWithName({
                          groupType: "SNS::Topic",
                          path: "id",
                          providerConfig,
                          lives,
                        }),
                      ]),
                    })
                  )
                ),
              ]),
            })
          ),
        ]),
      }),
    ]),
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Budgets.html#describeBudget-property
  getById: {
    pickId,
    method: "describeBudget",
    getField: "Budget",
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Budgets.html#describeBudgets-property
  getList: {
    method: "describeBudgets",
    enhanceParams:
      ({ config }) =>
      () => ({ AccountId: config.accountId() }),
    getParam: "Budgets",
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Budgets.html#createBudget-property
  create: {
    method: "createBudget",
    filterPayload: pipe([
      ({ AccountId, Notifications, ...Budget }) => ({ AccountId, Budget }),
    ]),
    pickCreated: ({ payload }) => pipe([() => payload]),
    postCreate:
      ({ endpoint, payload }) =>
      (live) =>
        pipe([
          () => payload,
          get("Notifications", []),
          map(({ Subscribers, ...Notification }) =>
            pipe([
              () => live,
              pickId,
              defaultsDeep({ Notification, Subscribers }),
              endpoint().createNotification,
            ])()
          ),
        ])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Budgets.html#deleteBudget-property
  destroy: {
    method: "deleteBudget",
    pickId,
  },
  getByName: getByNameCore,
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Budgets.html#updateBudget-property
  update:
    ({ endpoint }) =>
    ({ payload: { ...NewBudget }, live, diff }) =>
      pipe([
        () => diff.liveDiff,
        tap.if(
          or([
            get("added.Notifications"),
            get("deleted.Notifications"),
            get("updated.Notifications"),
          ]),
          pipe([
            // deleteNotification
            () => live,
            get("Notifications"),
            map((Notification) =>
              pipe([
                () => live,
                pickId,
                defaultsDeep({ Notification }),
                endpoint().deleteNotification,
              ])()
            ),
            // createNotification
            () => NewBudget,
            get("Notifications", []),
            map(({ Subscribers, ...Notification }) =>
              pipe([
                () => live,
                pickId,
                defaultsDeep({ Notification, Subscribers }),
                endpoint().createNotification,
              ])()
            ),
          ])
        ),
        () => ({ AccountId: live.AccountId, NewBudget }),
        endpoint().updateBudget,
      ])(),
  configDefault: ({
    name,
    namespace,
    properties: { ...otherProps },
    dependencies: {},
    config,
  }) =>
    pipe([() => otherProps, defaultsDeep({ AccountId: config.accountId() })])(),
});
