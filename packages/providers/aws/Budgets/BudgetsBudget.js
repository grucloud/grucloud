const assert = require("assert");
const { pipe, tap, get, assign, pick, map, or } = require("rubico");
const { defaultsDeep, callProp } = require("rubico/x");
const { getByNameCore, omitIfEmpty } = require("@grucloud/core/Common");

const { createAwsResource } = require("../AwsClient");

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

const model = ({ config }) => ({
  package: "budgets",
  client: "Budgets",
  ignoreErrorCodes: ["NotFoundException"],
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
});

exports.BudgetsBudget = ({ spec, config }) =>
  createAwsResource({
    model: model({ config }),
    spec,
    config,
    findName: pipe([get("live.BudgetName")]),
    findId: pipe([get("live.BudgetName")]),
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
    }) =>
      pipe([
        () => otherProps,
        defaultsDeep({ AccountId: config.accountId() }),
      ])(),
  });
