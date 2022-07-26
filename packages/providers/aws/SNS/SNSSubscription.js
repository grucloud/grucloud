const assert = require("assert");
const {
  pipe,
  tap,
  get,
  pick,
  assign,
  eq,
  switchCase,
  fork,
} = require("rubico");
const { defaultsDeep, callProp, last, when, unless } = require("rubico/x");
const { getByNameCore } = require("@grucloud/core/Common");

const { createAwsResource } = require("../AwsClient");
const { getField } = require("@grucloud/core/ProviderCommon");

const pickId = pipe([
  pick(["SubscriptionArn"]),
  tap(({ SubscriptionArn }) => {
    assert(SubscriptionArn);
  }),
]);

const model = {
  package: "sns",
  client: "SNS",
  ignoreErrorCodes: ["NotFound"],
  getById: {
    method: "getSubscriptionAttributes",
    getField: "Attributes",
    pickId,
  },
  getList: {
    method: "listSubscriptions",
    getParam: "Subscriptions",
    decorate: ({ endpoint, getById }) =>
      pipe([
        tap(({ SubscriptionArn }) => {
          assert(SubscriptionArn);
        }),
        unless(eq(get("SubscriptionArn"), "PendingConfirmation"), getById),
      ]),
  },
  create: {
    method: "subscribe",
    filterPayload: pipe([defaultsDeep({ ReturnSubscriptionArn: true })]),
    pickCreated: () =>
      pipe([
        tap(({ SubscriptionArn }) => {
          assert(SubscriptionArn);
        }),
        pick(["SubscriptionArn"]),
      ]),
  },
  destroy: { method: "unsubscribe", pickId },
};

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SNS.html
exports.SNSSubscription = ({ spec, config }) =>
  createAwsResource({
    model,
    spec,
    config,
    findName: pipe([
      get("live"),
      fork({
        topic: pipe([get("TopicArn"), callProp("split", ":"), last]),
        endpoint: pipe([get("Endpoint"), callProp("split", ":"), last]),
        protocol: get("Protocol"),
      }),
      ({ topic, protocol, endpoint }) =>
        `subscription::${topic}::${protocol}::${endpoint}`,
    ]),
    findId: pipe([
      get("live.SubscriptionArn"),
      tap((SubscriptionArn) => {
        assert(SubscriptionArn);
      }),
    ]),
    //TODO firehose
    findDependencies: ({ live }) => [
      {
        type: "Topic",
        group: "SNS",
        ids: [pipe([() => live, get("TopicArn")])()],
      },
      {
        type: "Function",
        group: "Lambda",
        ids: [
          pipe([
            () => live,
            tap((params) => {
              assert(true);
            }),
            switchCase([
              eq(get("Protocol"), "lambda"),
              get("Endpoint"),
              () => undefined,
            ]),
            tap((params) => {
              assert(true);
            }),
          ])(),
        ],
      },
      {
        type: "Queue",
        group: "SQS",
        ids: [
          pipe([
            () => live,
            switchCase([
              eq(get("Protocol"), "sqs"),
              get("Endpoint"),
              () => undefined,
            ]),
          ])(),
        ],
      },
    ],
    getByName: getByNameCore,
    configDefault: ({
      name,
      properties,
      dependencies: { snsTopic, lambdaFunction },
    }) =>
      pipe([
        tap((params) => {
          assert(snsTopic);
        }),
        () => properties,
        defaultsDeep({
          TopicArn: getField(snsTopic, "Attributes.TopicArn"),
        }),
        when(
          () => lambdaFunction,
          defaultsDeep({
            Protocol: "lambda",
            Endpoint: getField(lambdaFunction, "Configuration.FunctionArn"),
          })
        ),
        tap((params) => {
          assert(true);
        }),
      ])(),
    cannotBeDeleted: eq(get("live.SubscriptionArn"), "PendingConfirmation"),
  });
