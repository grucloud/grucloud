const assert = require("assert");
const {
  pipe,
  tap,
  get,
  pick,
  assign,
  eq,
  fork,
  switchCase,
  omit,
} = require("rubico");
const {
  defaultsDeep,
  callProp,
  last,
  when,
  unless,
  append,
  includes,
} = require("rubico/x");
const { getByNameCore } = require("@grucloud/core/Common");

const { getField } = require("@grucloud/core/ProviderCommon");

const pickId = pipe([
  pick(["SubscriptionArn"]),
  tap(({ SubscriptionArn }) => {
    assert(SubscriptionArn);
  }),
]);

const assignParseJson = (property) =>
  when(
    get(property),
    assign({ [property]: pipe([get(property), JSON.parse]) })
  );

const assignStringifyJson = (property) =>
  when(
    get(property),
    assign({ [property]: pipe([get(property), JSON.stringify]) })
  );

const decorate = ({}) =>
  pipe([
    tap((params) => {
      assert(true);
    }),
    assignParseJson("DeliveryPolicy"),
    assignParseJson("FilterPolicy"),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SNS.html
exports.SNSSubscription = () => ({
  type: "Subscription",
  package: "sns",
  client: "SNS",
  ignoreErrorCodes: ["NotFoundException", "NotFound"],
  inferName:
    ({ dependenciesSpec: { snsTopic, lambdaFunction, sqsQueue } }) =>
    (properties) =>
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
  findName: () =>
    pipe([
      fork({
        topic: pipe([get("TopicArn"), callProp("split", ":"), last]),
        endpoint: pipe([get("Endpoint"), callProp("split", ":"), last]),
        protocol: get("Protocol"),
      }),
      ({ topic, protocol, endpoint }) =>
        `subscription::${topic}::${protocol}::${endpoint}`,
    ]),
  findId: () => pipe([get("SubscriptionArn")]),
  //TODO firehose
  dependencies: {
    snsTopic: {
      type: "Topic",
      group: "SNS",
      dependencyId: ({ lives, config }) => get("TopicArn"),
    },
    lambdaFunction: {
      type: "Function",
      group: "Lambda",
      dependencyId: ({ lives, config }) =>
        pipe([
          switchCase([
            eq(get("Protocol"), "lambda"),
            get("Endpoint"),
            () => undefined,
          ]),
        ]),
    },
    sqsQueue: {
      type: "Queue",
      group: "SQS",
      dependencyId: ({ lives, config }) =>
        pipe([
          switchCase([
            eq(get("Protocol"), "sqs"),
            get("Endpoint"),
            () => undefined,
          ]),
        ]),
    },
  },
  ignoreResource: () =>
    pipe([
      tap((params) => {
        assert(true);
      }),
      eq(get("live.SubscriptionArn"), "PendingConfirmation"),
    ]),
  omitProperties: [
    "Name",
    "TopicArn",
    "SubscriptionArn",
    "Owner",
    "SubscriptionPrincipal",
  ],

  filterLive: ({ providerConfig }) =>
    pipe([
      tap((params) => {
        assert(true);
      }),
      when(
        ({ Protocol }) => pipe([() => ["lambda", "sqs"], includes(Protocol)])(),
        omit(["Protocol", "Endpoint"])
      ),
    ]),
  getById: {
    method: "getSubscriptionAttributes",
    getField: "Attributes",
    pickId,
    decorate,
  },
  getList: {
    method: "listSubscriptions",
    getParam: "Subscriptions",
    decorate: ({ endpoint, getById }) =>
      pipe([
        unless(eq(get("SubscriptionArn"), "PendingConfirmation"), getById),
      ]),
  },
  create: {
    method: "subscribe",
    filterPayload: pipe([
      defaultsDeep({ ReturnSubscriptionArn: true }),
      assignStringifyJson("DeliveryPolicy"),
      assignStringifyJson("FilterPolicy"),
    ]),
    pickCreated: () => pipe([pick(["SubscriptionArn"])]),
  },
  destroy: { method: "unsubscribe", pickId },
  getByName: getByNameCore,
  configDefault: ({
    name,
    properties,
    dependencies: { snsTopic, lambdaFunction, sqsQueue },
    config,
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
      when(
        () => sqsQueue,
        defaultsDeep({
          Protocol: "sqs",
          Endpoint: getField(sqsQueue, "Attributes.QueueArn"),
        })
      ),
    ])(),
  cannotBeDeleted: () => eq(get("SubscriptionArn"), "PendingConfirmation"),
});
