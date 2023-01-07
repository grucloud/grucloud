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
  switchCase,
} = require("rubico");
const { defaultsDeep, callProp, when, pluck } = require("rubico/x");
const { getByNameCore, omitIfEmpty } = require("@grucloud/core/Common");
const { replaceWithName } = require("@grucloud/core/Common");
const { retryCall } = require("@grucloud/core/Retry");

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
    assign({
      Actions: pipe([
        pickId,
        endpoint().describeBudgetActionsForBudget,
        get("Actions"),
        sortJson,
      ]),
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
    omitIfEmpty(["CostFilters", "Actions", "Notifications"]),
  ]);

const createActions = ({ endpoint, live }) =>
  pipe([
    get("Actions", []),
    map((Action) =>
      pipe([
        () =>
          retryCall({
            name: `createBudgetAction`,
            fn: pipe([
              () => live,
              pickId,
              defaultsDeep(Action),
              endpoint().createBudgetAction,
            ]),
            // IAM not ready yet
            shouldRetryOnException: pipe([
              tap((params) => {
                assert(true);
              }),
              () => true,
            ]),
          }),
      ])()
    ),
  ]);

const deleteActions = ({ endpoint, live }) =>
  pipe([
    get("Actions", []),
    map(({ ActionId }) =>
      pipe([
        tap((params) => {
          assert(ActionId);
        }),
        () =>
          retryCall({
            name: `createBudgetAction`,
            fn: pipe([
              () => live,
              pickId,
              defaultsDeep({ ActionId }),
              endpoint().deleteBudgetAction,
            ]),
            // ResourceLockedException: This method is not allowed during [ActionStatus: Execution_In_Progress]
            shouldRetryOnException: pipe([
              tap((params) => {
                assert(true);
              }),
              () => true,
            ]),
          }),
      ])()
    ),
  ]);

const createNotification = ({ endpoint, live }) =>
  pipe([
    get("Notifications", []),
    map(({ Subscribers, ...Notification }) =>
      pipe([
        () => live,
        pickId,
        defaultsDeep({ Notification, Subscribers }),
        endpoint().createNotification,
      ])()
    ),
  ]);

const deleteNotification = ({ endpoint, live }) =>
  pipe([
    get("Notifications"),
    map((Notification) =>
      pipe([
        () => live,
        pickId,
        defaultsDeep({ Notification }),
        endpoint().deleteNotification,
      ])()
    ),
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
    "Actions[].ActionId",
    "Actions[].AccountId",
    "Actions[].BudgetName",
    "Actions[].Status",
  ],
  compare: compare({ filterAll: () => pipe([omit(["TimePeriod"])]) }),
  dependencies: {
    iamRolesExecution: {
      type: "Role",
      group: "IAM",
      list: true,
      dependencyIds: () => pipe([get("Actions"), pluck("ExecutionRoleArn")]),
    },
    organisationsPolicies: {
      type: "Policy",
      group: "Organisations",
      list: true,
      dependencyIds: () =>
        pipe([
          get("Actions"),
          pluck("Definition.ScpActionDefinition.PolicyId"),
        ]),
    },
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
        Actions: pipe([
          get("Actions"),
          map(
            pipe([
              assign({
                Definition: pipe([
                  get("Definition"),
                  when(
                    get("IamActionDefinition.PolicyArn"),
                    assign({
                      IamActionDefinition: pipe([
                        get("IamActionDefinition"),
                        assign({
                          PolicyArn: pipe([
                            get("PolicyArn"),
                            replaceWithName({
                              groupType: "IAM::Policy",
                              path: "id",
                              providerConfig,
                              lives,
                            }),
                          ]),
                        }),
                        when(
                          get("Roles"),
                          assign({
                            Roles: pipe([
                              get("Roles"),
                              map(
                                replaceWithName({
                                  groupType: "IAM::Role",
                                  path: "id",
                                  providerConfig,
                                  lives,
                                })
                              ),
                            ]),
                          })
                        ),
                        when(
                          get("Groups"),
                          assign({
                            Groups: pipe([
                              get("Groups"),
                              map(
                                replaceWithName({
                                  groupType: "IAM::Group",
                                  path: "id",
                                  providerConfig,
                                  lives,
                                })
                              ),
                            ]),
                          })
                        ),
                        when(
                          get("Users"),
                          assign({
                            Users: pipe([
                              get("Users"),
                              map(
                                replaceWithName({
                                  groupType: "IAM::User",
                                  path: "id",
                                  providerConfig,
                                  lives,
                                })
                              ),
                            ]),
                          })
                        ),
                      ]),
                    })
                  ),
                  when(
                    get("ScpActionDefinition.PolicyId"),
                    assign({
                      ScpActionDefinition: pipe([
                        get("ScpActionDefinition"),
                        assign({
                          PolicyId: pipe([
                            get("PolicyId"),
                            replaceWithName({
                              groupType: "Organisations::Policy",
                              path: "id",
                              providerConfig,
                              lives,
                            }),
                          ]),
                        }),
                      ]),
                    })
                  ),
                  when(
                    get("SsmActionDefinition.InstanceIds"),
                    assign({
                      SsmActionDefinition: pipe([
                        get("SsmActionDefinition"),
                        assign({
                          InstanceIds: switchCase([
                            eq(get("ActionSubType"), "STOP_EC2_INSTANCES"),
                            pipe([
                              get("InstanceIds"),
                              map(
                                pipe([
                                  replaceWithName({
                                    groupType: "EC2::Instance",
                                    path: "id",
                                    providerConfig,
                                    lives,
                                  }),
                                ])
                              ),
                            ]),
                            eq(get("ActionSubType"), "STOP_RDS_INSTANCES"),
                            pipe([
                              get("InstanceIds"),
                              map(
                                pipe([
                                  replaceWithName({
                                    groupType: "RDS::Instance",
                                    path: "id",
                                    providerConfig,
                                    lives,
                                  }),
                                ])
                              ),
                            ]),
                            () => {
                              assert(false, "should be ec2 or rds");
                            },
                          ]),
                        }),
                      ]),
                    })
                  ),
                ]),
                ExecutionRoleArn: pipe([
                  get("ExecutionRoleArn"),
                  replaceWithName({
                    groupType: "IAM::Role",
                    path: "id",
                    providerConfig,
                    lives,
                  }),
                ]),
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
              }),
            ])
          ),
        ]),
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
          createNotification({ endpoint, live }),
          () => payload,
          createActions({ endpoint, live }),
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
        () => diff,
        tap((params) => {
          assert(true);
        }),
        tap.if(
          or([
            get("liveDiff.added.Actions"),
            get("targetDiff.added.Actions"),
            get("liveDiff.updated.Actions"),
          ]),
          pipe([
            // deleteAction
            () => live,
            deleteActions({ endpoint, live }),
            // createAction
            () => NewBudget,
            createActions({ endpoint, live }),
          ])
        ),
        tap.if(
          or([
            get("liveDiff.added.Notifications"),
            get("targetDiff.added.Notifications"),
            get("liveDiff.updated.Notifications"),
          ]),
          pipe([
            // deleteNotification
            () => live,
            deleteNotification({ endpoint, live }),
            // createNotification
            () => NewBudget,
            createNotification({ endpoint, live }),
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
