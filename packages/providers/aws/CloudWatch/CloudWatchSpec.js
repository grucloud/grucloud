const assert = require("assert");
const {
  tap,
  pipe,
  map,
  assign,
  eq,
  get,
  switchCase,
  filter,
} = require("rubico");
const { defaultsDeep, identity } = require("rubico/x");
const { replaceWithName } = require("@grucloud/core/Common");

const {
  isOurMinion,
  compareAws,
  replaceAccountAndRegion,
} = require("../AwsCommon");
const {
  CloudWatchMetricAlarm,
  AlarmDependenciesDimensions,
} = require("./CloudWatchMetricAlarm");
// const { CloudWatchCompositeAlarm } = require("./CloudWatchCompositeAlarm");

const GROUP = "CloudWatch";

const compareCloudWatch = compareAws({});

module.exports = pipe([
  () => [
    {
      type: "MetricAlarm",
      Client: CloudWatchMetricAlarm,
      inferName: get("properties.AlarmName"),
      omitProperties: [
        "AlarmArn",
        "AlarmConfigurationUpdatedTimestamp",
        "StateValue",
        "StateReason",
        "StateReasonData",
        "StateUpdatedTimestamp",
      ],
      dependencies: {
        snsTopic: { type: "Topic", group: "SNS" },
        ...AlarmDependenciesDimensions,
      },
      propertiesDefault: {
        ActionsEnabled: true,
        OKActions: [],
        InsufficientDataActions: [],
        AlarmActions: [],
      },
      filterLive: ({ lives, providerConfig }) =>
        pipe([
          assign({
            AlarmActions: pipe([
              get("AlarmActions"),
              map(replaceAccountAndRegion({ providerConfig })),
            ]),
            Dimensions: pipe([
              get("Dimensions"),
              map(
                pipe([
                  switchCase([
                    // GraphqlApi
                    eq(get("Name"), "GraphQLAPIId"),
                    pipe([
                      assign({
                        Value: pipe([
                          get("Value"),
                          replaceWithName({
                            groupType: "AppSync::GraphqlApi",
                            providerConfig,
                            lives,
                            path: "id",
                          }),
                        ]),
                      }),
                    ]),
                    // EC2 Instance
                    eq(get("Name"), "InstanceId"),
                    assign({
                      Value: pipe([
                        get("Value"),
                        replaceWithName({
                          groupType: "EC2::Instance",
                          providerConfig,
                          lives,
                          path: "id",
                        }),
                      ]),
                    }),
                    identity,
                  ]),
                ])
              ),
            ]),
          }),
          tap((params) => {
            assert(true);
          }),
        ]),
    },
  ],
  map(
    defaultsDeep({
      group: GROUP,
      isOurMinion,
      compare: compareCloudWatch({}),
    })
  ),
]);
