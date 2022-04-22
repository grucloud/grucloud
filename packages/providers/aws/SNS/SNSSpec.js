const assert = require("assert");
const { pipe, assign, map, omit, tap, get, eq, switchCase } = require("rubico");
const { defaultsDeep, append, includes, when } = require("rubico/x");

const { compareAws, assignPolicyAccountAndRegion } = require("../AwsCommon");

const { SNSTopic } = require("./SNSTopic");
const { SNSSubscription } = require("./SNSSubscription");

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SNS.html
const GROUP = "SNS";

const compareSNS = compareAws({});

const omitDefaultPolicy = when(
  eq(get("Policy.Id"), "__default_policy_ID"),
  omit(["Policy"])
);

module.exports = pipe([
  () => [
    {
      type: "Topic",
      Client: SNSTopic,
      dependencies: { key: { type: "Key", group: "KMS" } },
      propertiesDefault: {},
      omitProperties: [
        "Name",
        "Attributes.TopicArn",
        "Attributes.Owner",
        "Attributes.SubscriptionsPending",
        "Attributes.SubscriptionsDeleted",
        "Attributes.SubscriptionsConfirmed",
      ],
      compare: compareSNS({
        filterLive: () =>
          pipe([
            assign({
              Attributes: pipe([get("Attributes"), omitDefaultPolicy]),
            }),
          ]),
      }),
      filterLive: ({ providerConfig, lives }) =>
        pipe([
          assign({
            Attributes: pipe([
              get("Attributes"),
              assign({
                Policy: pipe([
                  get("Policy"),
                  assignPolicyAccountAndRegion({ providerConfig, lives }),
                ]),
              }),
              omitDefaultPolicy,
            ]),
          }),
        ]),
    },
    {
      type: "Subscription",
      Client: SNSSubscription,
      dependencies: {
        snsTopic: { type: "Topic", group: "SNS" },
        lambdaFunction: { type: "Function", group: "Lambda" },
        sqsQueue: { type: "Queue", group: "SQS" },
      },
      ignoreResource: () =>
        pipe([
          tap((params) => {
            assert(true);
          }),
          eq(get("live.SubscriptionArn"), "PendingConfirmation"),
        ]),
      propertiesDefault: {},
      omitProperties: ["Name", "TopicArn", "SubscriptionArn", "Owner"],
      inferName: ({
        properties,
        dependenciesSpec: { snsTopic, lambdaFunction, sqsQueue },
      }) =>
        pipe([
          tap(() => {
            assert(snsTopic);
            assert(properties);
          }),
          () => "subscription",
          append("::"),
          append(snsTopic),
          append("::"),
          switchCase([
            () => lambdaFunction,
            pipe([append(`lambda::${lambdaFunction}`)]),
            () => sqsQueue,
            pipe([append(`queue::${sqsQueue}`)]),
            pipe([
              append(properties.Protocol),
              append("::"),
              append(properties.Endpoint),
            ]),
            // () => {
            //   assert(false, "TODO: missing SNS deps");
            // },
          ]),
          tap((params) => {
            assert(true);
          }),
        ])(),
      filterLive: ({ providerConfig }) =>
        pipe([
          tap((params) => {
            assert(true);
          }),
          when(
            ({ Protocol }) =>
              pipe([() => ["lambda", "sqs"], includes(Protocol)])(),
            omit(["Protocol", "Endpoint"])
          ),
        ]),
    },
  ],
  map(
    defaultsDeep({
      group: GROUP,
      compare: compareSNS({}),
    })
  ),
]);
