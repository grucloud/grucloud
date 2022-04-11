const assert = require("assert");
const { pipe, assign, map, omit, tap, get, eq } = require("rubico");
const { when, defaultsDeep } = require("rubico/x");

const { compareAws } = require("../AwsCommon");

const {
  isOurMinionObject,
  assignPolicyAccountAndRegion,
} = require("../AwsCommon");

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
      propertiesDefault: {
        Attributes: {
          VisibilityTimeout: "30",
          MaximumMessageSize: "262144",
          MessageRetentionPeriod: "345600",
          DelaySeconds: "0",
          ReceiveMessageWaitTimeSeconds: "0",
        },
      },
      omitProperties: [
        "QueueName",
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
