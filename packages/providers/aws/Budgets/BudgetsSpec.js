const assert = require("assert");
const {
  tap,
  pipe,
  map,
  get,
  omit,
  flatMap,
  filter,
  eq,
  assign,
} = require("rubico");
const { defaultsDeep, when, pluck } = require("rubico/x");
const { replaceWithName } = require("@grucloud/core/Common");

const { compareAws } = require("../AwsCommon");

const GROUP = "Budgets";

// TODO no tags for budgets
const tagsKey = "Tags";
const compare = compareAws({ tagsKey, key: "key" });

const { BudgetsBudget } = require("./BudgetsBudget");

module.exports = pipe([
  () => [
    {
      type: "Budget",
      Client: BudgetsBudget,
      propertiesDefault: {},
      omitProperties: [
        "AccountId",
        "LastUpdatedTime",
        "CalculatedSpend",
        "TimePeriod",
        "Notifications[].NotificationState",
      ],
      compare: compare({ filterAll: () => pipe([omit(["TimePeriod"])]) }),
      inferName: pipe([
        get("properties.BudgetName"),
        tap((BudgetName) => {
          assert(BudgetName);
        }),
      ]),
      dependencies: {
        snsTopics: {
          type: "Topic",
          group: "SNS",
          list: true,
          dependencyIds: () =>
            pipe([
              tap((params) => {
                assert(true);
              }),
              get("Notifications"),
              flatMap(
                pipe([
                  get("Subscribers"),
                  tap((params) => {
                    assert(true);
                  }),
                  filter(eq(get("SubscriptionType"), "SNS")),
                  pluck("Address"),
                ])
              ),
              tap((params) => {
                assert(true);
              }),
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
                            tap((params) => {
                              assert(true);
                            }),
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
    },
  ],
  map(
    defaultsDeep({
      group: GROUP,
      compare: compare({}),
      tagsKey,
    })
  ),
]);
