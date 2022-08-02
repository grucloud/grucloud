const assert = require("assert");
const { pipe, get, map, tap, pick } = require("rubico");
const { defaultsDeep, find } = require("rubico/x");
const { isOurMinionObject } = require("../AwsCommon");
const { compareAws } = require("../AwsCommon");

const { CloudWatchLogGroup } = require("./CloudWatchLogsGroup");
const { CloudWatchLogStream } = require("./CloudWatchLogStream");
const {
  CloudWatchSubscriptionFilter,
  SubscriptionFilterDependencies,
} = require("./CloudWatchSubscriptionFilter");

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CloudWatchLogs.html
const GROUP = "CloudWatchLogs";
const tagsKey = "tags";

const compareCloudWatchLog = compareAws({ tagsKey: "tags" });

const isOurMinion = ({ live, config }) =>
  isOurMinionObject({ tags: live.tags, config });

module.exports = pipe([
  () => [
    {
      type: "LogGroup",
      Client: CloudWatchLogGroup,
      pickPropertiesCreate: ["retentionInDays"],
      // ignoreResource: () =>
      //   pipe([get("name"), callProp("startsWith", "/aws/")]),
      //TODO
      compare: compareCloudWatchLog({
        filterAll: () => pipe([pick(["retentionInDays"])]),
      }),
      // TODO use propertiesCreate ?
      filterLive: () => pipe([pick(["retentionInDays"])]),
      dependencies: {
        kmsKey: { type: "Key", group: "KMS" },
      },
    },
    {
      type: "LogStream",
      Client: CloudWatchLogStream,
      compare: compareCloudWatchLog({
        filterAll: () => pipe([pick([])]),
      }),
      filterLive: () => pipe([pick(["logStreamName"])]),
      inferName: ({
        properties: { logStreamName },
        dependenciesSpec: { cloudWatchLogGroup },
      }) => pipe([() => `${cloudWatchLogGroup}::${logStreamName}`])(),
      dependencies: {
        cloudWatchLogGroup: {
          type: "LogGroup",
          group: GROUP,
          parent: true,
          dependencyId:
            ({ lives, config }) =>
            (live) =>
              pipe([
                () =>
                  lives.getByType({
                    providerName: config.providerName,
                    type: "LogGroup",
                    group: "CloudWatchLogs",
                  }),
                find(pipe([({ id }) => live.arn.includes(id)])),
                get("id"),
              ])(),
        },
      },
    },
    {
      type: "SubscriptionFilter",
      Client: CloudWatchSubscriptionFilter,
      compare: compareCloudWatchLog({
        filterAll: () => pipe([pick([])]),
      }),
      omitProperties: [
        "destinationArn",
        "roleArn",
        "logGroupName",
        "creationTime",
      ],
      inferName: ({
        properties: { filterName },
        dependenciesSpec: { cloudWatchLogGroup },
      }) => pipe([() => `${cloudWatchLogGroup}::${filterName}`])(),
      dependencies: {
        cloudWatchLogGroup: {
          type: "LogGroup",
          group: GROUP,
          parent: true,
          dependencyId:
            ({ lives, config }) =>
            (live) =>
              pipe([
                () =>
                  lives.getByName({
                    name: live.logGroupName,
                    providerName: config.providerName,
                    type: "LogGroup",
                    group: "CloudWatchLogs",
                  }),
                get("id"),
              ])(),
        },
        role: {
          type: "Role",
          group: "IAM",
          dependencyId: () => get("roleArn"),
        },
        ...SubscriptionFilterDependencies,
      },
    },
  ],
  map(
    defaultsDeep({
      group: GROUP,
      tagsKey,
      isOurMinion,
      compare: compareCloudWatchLog({}),
    })
  ),
]);
