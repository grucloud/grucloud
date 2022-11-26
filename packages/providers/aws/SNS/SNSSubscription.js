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
const { getByNameCore, omitIfEmpty } = require("@grucloud/core/Common");

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
    when(eq(get("RawMessageDelivery"), "false"), omit(["RawMessageDelivery"])),
    ({
      TopicArn,
      Endpoint,
      Protocol,
      Owner,
      SubscriptionArn,
      SubscriptionPrincipal,
      ...Attributes
    }) => ({
      TopicArn,
      Endpoint,
      Owner,
      Protocol,
      SubscriptionArn,
      SubscriptionPrincipal,
      Attributes: Attributes,
    }),
    tap((params) => {
      assert(true);
    }),
    omitIfEmpty(["Attributes"]),
  ]);

const dependencyIdSNS =
  (Protocol) =>
  ({ lives, config }) =>
    pipe([
      switchCase([
        eq(get("Protocol"), Protocol),
        get("Endpoint"),
        () => undefined,
      ]),
    ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SNS.html
exports.SNSSubscription = () => ({
  type: "Subscription",
  package: "sns",
  client: "SNS",
  ignoreErrorCodes: ["NotFoundException", "NotFound"],
  inferName:
    ({
      dependenciesSpec: {
        snsTopic,
        firehoseDeliveryStream,
        lambdaFunction,
        sqsQueue,
      },
    }) =>
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
          () => firehoseDeliveryStream,
          pipe([append(`firehose::${firehoseDeliveryStream}`)]),
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
        endpoint: pipe([
          get("Endpoint"),
          callProp("split", ":"),
          last,
          callProp("split", "/"),
          last,
        ]),
        protocol: get("Protocol"),
      }),
      ({ topic, protocol, endpoint }) =>
        `subscription::${topic}::${protocol}::${endpoint}`,
    ]),
  findId: () => pipe([get("SubscriptionArn")]),
  dependencies: {
    snsTopic: {
      type: "Topic",
      group: "SNS",
      dependencyId: ({ lives, config }) => get("TopicArn"),
    },
    subscriptionRole: {
      type: "Role",
      group: "IAM",
      dependencyId: () => get("Attributes.SubscriptionRoleArn"),
    },
    firehoseDeliveryStream: {
      type: "DeliveryStream",
      group: "Firehose",
      dependencyId: dependencyIdSNS("firehose"),
    },
    lambdaFunction: {
      type: "Function",
      group: "Lambda",
      dependencyId: dependencyIdSNS("lambda"),
    },
    sqsQueue: {
      type: "Queue",
      group: "SQS",
      dependencyId: dependencyIdSNS("sqs"),
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
    "Attributes.PendingConfirmation",
    "Attributes.ConfirmationWasAuthenticated",
    "Attributes.SubscriptionRoleArn",
  ],
  filterLive: ({ providerConfig }) =>
    pipe([
      tap((params) => {
        assert(true);
      }),
      when(
        ({ Protocol }) =>
          pipe([() => ["lambda", "sqs", "firehose"], includes(Protocol)])(),
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
        tap((params) => {
          assert(true);
        }),
        unless(eq(get("SubscriptionArn"), "PendingConfirmation"), getById),
      ]),
  },
  create: {
    method: "subscribe",
    filterPayload: pipe([
      defaultsDeep({ ReturnSubscriptionArn: true }),
      assign({
        Attributes: pipe([
          get("Attributes"),
          assignStringifyJson("DeliveryPolicy"),
          assignStringifyJson("FilterPolicy"),
        ]),
      }),
    ]),
    pickCreated: () => pipe([pick(["SubscriptionArn"])]),
  },
  destroy: { method: "unsubscribe", pickId },
  getByName: getByNameCore,
  configDefault: ({
    name,
    properties,
    dependencies: {
      firehoseDeliveryStream,
      snsTopic,
      lambdaFunction,
      sqsQueue,
      subscriptionRole,
    },
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
        () => subscriptionRole,
        defaultsDeep({
          Attributes: {
            SubscriptionRoleArn: getField(subscriptionRole, "Arn"),
          },
        })
      ),
      switchCase([
        () => firehoseDeliveryStream,
        defaultsDeep({
          Protocol: "firehose",
          Endpoint: getField(firehoseDeliveryStream, "DeliveryStreamARN"),
        }),
        () => lambdaFunction,
        defaultsDeep({
          Protocol: "lambda",
          Endpoint: getField(lambdaFunction, "Configuration.FunctionArn"),
        }),
        () => sqsQueue,
        defaultsDeep({
          Protocol: "sqs",
          Endpoint: getField(sqsQueue, "Attributes.QueueArn"),
        }),
        () => {
          assert(false, `missing sns subscription dependency`);
        },
      ]),
    ])(),
  cannotBeDeleted: () => eq(get("SubscriptionArn"), "PendingConfirmation"),
});
