const assert = require("assert");
const { pipe, assign, map, omit, tap, get, eq, flatMap } = require("rubico");
const { when, defaultsDeep } = require("rubico/x");

const { compareAws } = require("../AwsCommon");

const {
  isOurMinionObject,
  assignPolicyAccountAndRegion,
} = require("../AwsCommon");
const { findInStatement } = require("../IAM/AwsIamCommon");

const { SQSQueue } = require("./SQSQueue");

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SQS.html
const GROUP = "SQS";
const tagsKey = "tags";

const compareSQS = compareAws({ tagsKey });

module.exports = pipe([
  () => [
    {
      type: "Queue",
      Client: SQSQueue,
      inferName: get("properties.QueueName"),
      propertiesDefault: {
        Attributes: {
          VisibilityTimeout: "30",
          MaximumMessageSize: "262144",
          MessageRetentionPeriod: "345600",
          DelaySeconds: "0",
          ReceiveMessageWaitTimeSeconds: "0",
        },
      },
      dependencies: {
        snsTopics: {
          type: "Topic",
          group: "SNS",
          list: true,
          dependencyIds: ({ lives, config }) =>
            pipe([
              get("Attributes.Policy.Statement", []),
              flatMap(
                findInStatement({ type: "Topic", group: "SNS", lives, config })
              ),
            ]),
        },
      },
      omitProperties: [
        "QueueUrl",
        "Attributes.QueueArn",
        "Attributes.ApproximateNumberOfMessages",
        "Attributes.ApproximateNumberOfMessagesNotVisible",
        "Attributes.ApproximateNumberOfMessagesDelayed",
        "Attributes.CreatedTimestamp",
        "Attributes.LastModifiedTimestamp",
        "Attributes.SqsManagedSseEnabled",
      ],
      filterLive: ({ providerConfig, lives }) =>
        pipe([
          omit(["QueueUrl"]),
          assign({
            Attributes: pipe([
              get("Attributes"),
              when(
                get("Policy"),
                assign({
                  Policy: pipe([
                    get("Policy"),
                    assignPolicyAccountAndRegion({ providerConfig, lives }),
                  ]),
                })
              ),
              when(
                eq(get("Policy.Id"), "__default_policy_ID"),
                omit(["Policy"])
              ),
            ]),
          }),
        ]),
    },
  ],
  map(
    defaultsDeep({
      group: GROUP,
      tagsKey,
      compare: compareSQS({}),
      isOurMinion: ({ live, config }) =>
        isOurMinionObject({ tags: live.tags, config }),
    })
  ),
]);
