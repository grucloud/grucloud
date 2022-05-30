const assert = require("assert");
const { pipe, get, map, omit, lte, and } = require("rubico");
const { defaultsDeep, isEmpty, first, size, when } = require("rubico/x");

const { compareAws, isOurMinion } = require("../AwsCommon");

const { CloudTrail } = require("./CloudTrail");
const { CloudTrailEventDataStore } = require("./CloudTrailEventDataStore");

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CloudTrail.html
const GROUP = "CloudTrail";
const tagsKey = "TagsList";
const compareCloudTrail = compareAws({ tagsKey });

const filterEventSelector = when(
  and([
    pipe([get("EventSelectors", lte(size, 1))]),
    pipe([get("EventSelectors", first, get("DataResources"), isEmpty)]),
  ]),
  omit(["EventSelectors"])
);

module.exports = pipe([
  () => [
    {
      type: "Trail",
      Client: CloudTrail,
      omitProperties: [
        "Name",
        "S3BucketName",
        "SnsTopicARN",
        "TrailARN",
        "CloudWatchLogsLogGroupArn",
        "CloudWatchLogsRoleArn",
        "KmsKeyId",
        "HasCustomEventSelectors",
        "LogFileValidationEnabled",
      ],
      compare: compareCloudTrail({
        filterLive: () => pipe([filterEventSelector]),
      }),
      filterLive: () => pipe([filterEventSelector]),
      dependencies: {
        bucket: { type: "Bucket", group: "S3" },
        logGroup: { type: "LogsGroup", group: "CloudWatchLogs" },
        logGroupRole: { type: "role", group: "IAM" },
        kmsKey: { type: "Key", group: "KMS" },
        snsTopic: { type: "Topic", group: "SNS" },
      },
    },
    {
      type: "EventDataStore",
      Client: CloudTrailEventDataStore,
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
