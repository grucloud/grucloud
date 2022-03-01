const assert = require("assert");
const { pipe, assign, map, omit, tap, get, eq } = require("rubico");
const { when } = require("rubico/x");
const defaultsDeep = require("rubico/x/defaultsDeep");

const { compareAws } = require("../AwsCommon");

const { isOurMinionObject } = require("../AwsCommon");

const { SQSQueue } = require("./SQSQueue");

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SQS.html
const GROUP = "SQS";

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
      compare: compareAws({
        filterTarget: () => pipe([omit(["QueueName"])]),
        filterLive: () =>
          pipe([
            omit([
              "QueueUrl",
              "Attributes.QueueArn",
              "Attributes.ApproximateNumberOfMessages",
              "Attributes.ApproximateNumberOfMessagesNotVisible",
              "Attributes.ApproximateNumberOfMessagesDelayed",
              "Attributes.CreatedTimestamp",
              "Attributes.LastModifiedTimestamp",
              "Attributes.SqsManagedSseEnabled",
            ]),
          ]),
      }),
      filterLive: () =>
        pipe([
          omit(["QueueUrl"]),
          assign({
            Attributes: pipe([
              get("Attributes"),
              omit([
                "QueueArn",
                "ApproximateNumberOfMessages",
                "ApproximateNumberOfMessagesNotVisible",
                "ApproximateNumberOfMessagesDelayed",
                "CreatedTimestamp",
                "LastModifiedTimestamp",
                "SqsManagedSseEnabled",
              ]),
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
      isOurMinion: ({ live, config }) =>
        isOurMinionObject({ tags: live.tags, config }),
    })
  ),
]);
