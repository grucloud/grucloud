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
const { defaultsDeep, callProp, last, when } = require("rubico/x");
const { getByNameCore } = require("@grucloud/core/Common");

const { createAwsResource } = require("../AwsClient");
const { getField } = require("@grucloud/core/ProviderCommon");

const model = {
  package: "sns",
  client: "SNS",
  pickIds: ["Attributes.SubscriptionArn"],
  ignoreErrorCodes: ["NotFound"],
  getById: { method: "getSubscriptionAttributes", getField: "Attributes" },
  getList: { method: "listSubscriptions", getParam: "Subscriptions" },
  create: { method: "subscribe" },
  destroy: { method: "unsubscribe" },
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
    pickId: pipe([
      tap((params) => {
        assert(true);
      }),
      pick(["SubscriptionArn"]),
      tap(({ SubscriptionArn }) => {
        assert(SubscriptionArn);
      }),
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
    decorateList: ({ endpoint, getById }) =>
      pipe([
        tap(({ SubscriptionArn }) => {
          assert(SubscriptionArn);
          assert(getById);
          assert(endpoint);
        }),
        getById,
      ]),
    decorate: ({ endpoint }) =>
      pipe([
        tap((params) => {
          assert(true);
        }),
        assign({}),
      ]),
    createFilterPayload: pipe([
      tap((params) => {
        assert(true);
      }),
      defaultsDeep({ ReturnSubscriptionArn: true }),
    ]),
    pickCreated: () =>
      pipe([
        tap(({ SubscriptionArn }) => {
          assert(SubscriptionArn);
        }),
        pick(["SubscriptionArn"]),
      ]),
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
  });
