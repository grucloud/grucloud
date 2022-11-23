const assert = require("assert");
const { tap, pipe, get, map, omit, lte, and, assign } = require("rubico");
const { defaultsDeep, isEmpty, first, size, when } = require("rubico/x");

const { compareAws, isOurMinion, replaceRegionAll } = require("../AwsCommon");

const { CloudTrail } = require("./CloudTrail");
const { CloudTrailEventDataStore } = require("./CloudTrailEventDataStore");

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CloudTrail.html
const GROUP = "CloudTrail";
const tagsKey = "TagsList";
const compareCloudTrail = compareAws({ tagsKey });

const filterEventSelector = pipe([
  when(
    and([
      pipe([get("EventSelectors"), lte(size, 1)]),
      pipe([get("EventSelectors"), first, get("DataResources"), isEmpty]),
    ]),
    omit(["EventSelectors"])
  ),
]);

module.exports = pipe([
  () => [
    {
      type: "Trail",
      Client: CloudTrail,
      omitProperties: [
        "S3BucketName",
        "SnsTopicARN",
        "TrailARN",
        "CloudWatchLogsLogGroupArn",
        "CloudWatchLogsRoleArn",
        "KmsKeyId",
        "HasCustomEventSelectors",
        "LogFileValidationEnabled",
        "HasInsightSelectors",
      ],
      inferName: () => pipe([get("Name")]),
      compare: compareCloudTrail({
        filterLive: () => pipe([filterEventSelector]),
      }),
      filterLive: ({ providerConfig }) =>
        pipe([
          filterEventSelector,
          assign({
            HomeRegion: pipe([
              get("HomeRegion"),
              replaceRegionAll({ providerConfig }),
            ]),
          }),
        ]),
      dependencies: {
        bucket: {
          type: "Bucket",
          group: "S3",
          dependencyId: ({ lives, config }) => get("S3BucketName"),
        },
        logGroup: {
          type: "LogsGroup",
          group: "CloudWatchLogs",
          dependencyId: ({ lives, config }) => get("CloudWatchLogsLogGroupArn"),
        },
        logGroupRole: {
          type: "role",
          group: "IAM",
          dependencyId: ({ lives, config }) => get("CloudWatchLogsRoleArn"),
        },
        kmsKey: {
          type: "Key",
          group: "KMS",
          dependencyId: ({ lives, config }) => get("KmsKeyId"),
        },
        snsTopic: {
          type: "Topic",
          group: "SNS",
          dependencyId: ({ lives, config }) => get("SnsTopicARN"),
        },
      },
    },
    {
      type: "EventDataStore",
      Client: CloudTrailEventDataStore,
      inferName: () => get("Name"),
      omitProperties: [],
      // compare: compareCloudTrail({
      //   filterTarget: () => pipe([defaultsDeep({ EventBusName: "default" })]),
      //   filterLive: () => pipe([omit(["Arn", "CreatedBy", "Targets"])]),
      // }),
      // filterLive: () =>
      //   pipe([omit(["Name", "Arn", "EventBusName"]), omitIfEmpty(["Targets"])]),
    },
  ],
  map(
    defaultsDeep({
      group: GROUP,
      tagsKey,
      compare: compareCloudTrail({}),
      isOurMinion,
    })
  ),
]);
