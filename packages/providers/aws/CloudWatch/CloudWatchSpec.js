const assert = require("assert");
const { tap, pipe, map, assign, eq, get, switchCase } = require("rubico");
const { defaultsDeep, find, isEmpty, values } = require("rubico/x");
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

const replaceDimension =
  ({ providerConfig, lives }) =>
  ({ Name, Value, ...other }) =>
    pipe([
      () => AlarmDependenciesDimensions,
      values,
      find(eq(get("dimensionId"), Name)),
      switchCase([
        isEmpty,
        () => ({ Value }),
        ({ type, group }) => ({
          Value: replaceWithName({
            groupType: `${group}::${type}`,
            providerConfig,
            lives,
            path: "id",
          })(Value),
        }),
      ]),
      defaultsDeep({ Name, ...other }),
    ])();

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
              map(pipe([replaceDimension({ providerConfig, lives })])),
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
