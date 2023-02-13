const assert = require("assert");
const { pipe, tap, get, pick, switchCase, fork, omit, eq } = require("rubico");
const { defaultsDeep, prepend, when, find } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
const { omitIfEmpty } = require("@grucloud/core/Common");

const { getField } = require("@grucloud/core/ProviderCommon");

const omitDestinationConfig = when(
  get("DestinationConfig.OnFailure"),
  omit(["DestinationConfig"])
);

const dependencyIdEventSource =
  ({ type, group }) =>
  ({ lives, config }) =>
    pipe([
      get("EventSourceArn"),
      lives.getById({
        providerName: config.providerName,
        type,
        group,
      }),
      get("id"),
    ]);

const getNameFromSource = ({ lives, config, type, group }) =>
  pipe([
    get("EventSourceArn"),
    tap((id) => {
      assert(id);
    }),
    lives.getById({
      providerName: config.providerName,
      type,
      group,
    }),
    get("name"),
  ]);

const findName =
  ({ lives, config }) =>
  (live) =>
    pipe([
      () => live,
      tap(({ FunctionArn, EventSourceArn }) => {
        assert(FunctionArn);
        assert(EventSourceArn);
      }),
      fork({
        functionName: pipe([
          get("FunctionArn"),
          lives.getById({
            providerName: config.providerName,
            type: "Function",
            group: "Lambda",
          }),
          get("name"),
        ]),
        dynamoDbTable: ({ EventSourceArn }) =>
          pipe([
            lives.getByType({
              providerName: config.providerName,
              type: "Table",
              group: "DynamoDB",
            }),
            find(eq(get("live.LatestStreamArn"), EventSourceArn)),
            get("name"),
          ])(),
        kinesisStreamName: getNameFromSource({
          lives,
          config,
          type: "Stream",
          group: "Kinesis",
        }),
        sqsQueueName: getNameFromSource({
          lives,
          config,
          type: "Queue",
          group: "SQS",
        }),
      }),
      ({ functionName, dynamoDbTable, sqsQueueName, kinesisStreamName }) =>
        `mapping::${functionName}::${
          dynamoDbTable || sqsQueueName || kinesisStreamName
        }`,
    ])();

const pickId = pipe([
  tap(({ UUID }) => {
    assert(UUID);
  }),
  pick(["UUID"]),
]);

const decorate = ({ endpoint, config }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
    omitIfEmpty([
      "StartingPosition",
      "StartingPositionTimestamp",
      //"ParallelizationFactor",
      //"BisectBatchOnFunctionError",
      //"MaximumRetryAttempts",
      //"TumblingWindowInSeconds",
      "FunctionResponseTypes",
    ]),
    omitDestinationConfig,
  ]);

exports.LambdaEventSourceMapping = ({ compare }) => ({
  type: "EventSourceMapping",
  package: "lambda",
  client: "Lambda",
  propertiesDefault: {
    BatchSize: 10,
    MaximumBatchingWindowInSeconds: 0,
    //FunctionResponseTypes: [],
  },
  inferName:
    ({
      dependenciesSpec: {
        lambdaFunction,
        dynamoDbTable,
        sqsQueue,
        kinesisStream,
      },
    }) =>
    () =>
      pipe([
        tap((params) => {
          assert(lambdaFunction);
          assert(dynamoDbTable || sqsQueue || kinesisStream);
        }),
        switchCase([
          () => dynamoDbTable,
          () => dynamoDbTable,
          () => kinesisStream,
          () => kinesisStream,
          () => sqsQueue,
          () => sqsQueue,
          () => {
            assert(false, `missing EventSourceMapping dependency`);
          },
        ]),
        prepend(`mapping::${lambdaFunction}::`),
      ])(),
  findName,
  findId: () =>
    pipe([
      get("UUID"),
      tap((id) => {
        assert(id);
      }),
    ]),
  omitProperties: [
    "EventSourceArn",
    "UUID",
    "FunctionArn",
    "LastModified",
    "LastProcessingResult",
    "StateTransitionReason",
    "State",
  ],
  compare: compare({
    filterTarget: () => pipe([omit(["FunctionName"])]),
  }),
  dependencies: {
    lambdaFunction: {
      type: "Function",
      group: "Lambda",
      parent: true,
      dependencyId: ({ lives, config }) => pipe([get("FunctionArn")]),
    },
    dynamoDbTable: {
      type: "Table",
      group: "DynamoDB",
      dependencyId:
        ({ lives, config }) =>
        ({ EventSourceArn }) =>
          pipe([
            lives.getByType({
              providerName: config.providerName,
              type: "Table",
              group: "DynamoDB",
            }),
            find(eq(get("live.LatestStreamArn"), EventSourceArn)),
            get("id"),
          ])(),
    },
    kinesisStream: {
      type: "Stream",
      group: "Kinesis",
      dependencyId: dependencyIdEventSource({
        type: "Stream",
        group: "Kinesis",
      }),
    },
    sqsQueue: {
      type: "Queue",
      group: "SQS",
      dependencyId: dependencyIdEventSource({
        type: "Queue",
        group: "SQS",
      }),
    },

    //TODO other event source
    /*
  Amazon DynamoDB Streams
Amazon MQ::Broker
Amazon MSK::ClusterV2
Apache Kafka
*/
  },
  ignoreErrorCodes: ["ResourceNotFoundException"],
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/MyModule.html#getEventSourceMapping-property
  getById: {
    pickId,
    method: "getEventSourceMapping",
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/MyModule.html#listEventSourceMappings-property
  getList: {
    method: "listEventSourceMappings",
    getParam: "EventSourceMappings",
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/MyModule.html#createEventSourceMapping-property
  create: {
    method: "createEventSourceMapping",
    shouldRetryOnExceptionMessages: [
      "The provided execution role does not have permissions to call ReceiveMessage on SQS",
      "Please add Lambda as a Trusted Entity",
    ],
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/MyModule.html#updateEventSourceMapping-property
  update: {
    method: "updateEventSourceMapping",
    filterParams: ({ payload, diff, live }) =>
      pipe([() => payload, defaultsDeep(pickId(live))])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/MyModule.html#deleteEventSourceMapping-property
  destroy: {
    method: "deleteEventSourceMapping",
    pickId,
  },
  getByName: getByNameCore,
  configDefault: ({
    name,
    namespace,
    properties,
    dependencies: { lambdaFunction, dynamoDbTable, kinesisStream, sqsQueue },
  }) =>
    pipe([
      tap(() => {
        assert(lambdaFunction);
      }),
      () => properties,
      defaultsDeep({
        // TODO  FunctionArn ?
        FunctionName: getField(lambdaFunction, "Configuration.FunctionName"),
      }),
      switchCase([
        () => dynamoDbTable,
        defaultsDeep({
          EventSourceArn: getField(dynamoDbTable, "LatestStreamArn"),
        }),
        () => sqsQueue,
        defaultsDeep({
          EventSourceArn: getField(sqsQueue, "Attributes.QueueArn"),
        }),
        () => kinesisStream,
        defaultsDeep({
          EventSourceArn: getField(kinesisStream, "StreamARN"),
        }),
        () => {
          assert(false, "missing EventSourceMapping dependency");
        },
      ]),
      tap((params) => {
        assert(true);
      }),
    ])(),
});
