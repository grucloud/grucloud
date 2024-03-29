const assert = require("assert");
const {
  pipe,
  tap,
  get,
  pick,
  switchCase,
  fork,
  omit,
  eq,
  filter,
  assign,
  map,
} = require("rubico");
const {
  defaultsDeep,
  prepend,
  when,
  find,
  callProp,
  pluck,
} = require("rubico/x");
const { replaceWithName } = require("@grucloud/core/Common");

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
      assert(lives);
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
        EventSourceArn: get("EventSourceArn"),
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
        kinesisStreamConsumerName: getNameFromSource({
          lives,
          config,
          type: "StreamConsumer",
          group: "Kinesis",
        }),
        mqBrokerName: getNameFromSource({
          lives,
          config,
          type: "Broker",
          group: "MQ",
        }),
        mskClusterName: getNameFromSource({
          lives,
          config,
          type: "ClusterV2",
          group: "MSK",
        }),
        sqsQueueName: getNameFromSource({
          lives,
          config,
          type: "Queue",
          group: "SQS",
        }),
      }),
      ({
        functionName,
        dynamoDbTable,
        sqsQueueName,
        kinesisStreamName,
        kinesisStreamConsumerName,
        mqBrokerName,
        mskClusterName,
        EventSourceArn,
      }) =>
        `mapping::${functionName}::${
          dynamoDbTable ||
          sqsQueueName ||
          kinesisStreamName ||
          kinesisStreamConsumerName ||
          mqBrokerName ||
          mskClusterName ||
          EventSourceArn
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
  },
  inferName:
    ({
      dependenciesSpec: {
        lambdaFunction,
        dynamoDbTable,
        sqsQueue,
        kinesisStream,
        kinesisStreamConsumer,
        mqBroker,
        mskCluster,
      },
    }) =>
    () =>
      pipe([
        tap((params) => {
          assert(lambdaFunction);
          assert(
            dynamoDbTable ||
              sqsQueue ||
              kinesisStream ||
              kinesisStreamConsumer ||
              mqBroker ||
              mskCluster
          );
        }),
        switchCase([
          () => dynamoDbTable,
          () => dynamoDbTable,
          () => kinesisStream,
          () => kinesisStream,
          () => kinesisStreamConsumer,
          () => kinesisStreamConsumer,
          () => mqBroker,
          () => mqBroker,
          () => mskCluster,
          () => mskCluster,
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
    kinesisStreamConsumer: {
      type: "StreamConsumer",
      group: "Kinesis",
      parent: true,
      dependencyId: dependencyIdEventSource({
        type: "StreamConsumer",
        group: "Kinesis",
      }),
    },
    mqBroker: {
      type: "Broker",
      group: "MQ",
      dependencyId: dependencyIdEventSource({
        type: "Broker",
        group: "MQ",
      }),
    },
    mskCluster: {
      type: "ClusterV2",
      group: "MSK",
      dependencyId: dependencyIdEventSource({
        type: "ClusterV2",
        group: "MSK",
      }),
    },
    secretsManagerSecrets: {
      type: "Secret",
      group: "SecretsManager",
      list: true,
      dependencyIds: ({ lives, config }) =>
        pipe([
          get("SourceAccessConfigurations"),
          filter(
            pipe([
              get("URI", ""),
              callProp("startsWith", "arn:aws:secretsmanager:"),
            ])
          ),
          pluck("URI"),
        ]),
    },
    sqsQueue: {
      type: "Queue",
      group: "SQS",
      dependencyId: dependencyIdEventSource({
        type: "Queue",
        group: "SQS",
      }),
    },
  },
  filterLive: ({ lives, providerConfig }) =>
    pipe([
      when(
        get("SourceAccessConfigurations"),
        assign({
          SourceAccessConfigurations: pipe([
            get("SourceAccessConfigurations"),
            map(
              assign({
                URI: pipe([
                  get("URI"),
                  replaceWithName({
                    groupType: "SecretsManager::Secret",
                    pathLive: "id",
                    path: "id",
                    providerConfig,
                    lives,
                  }),
                ]),
              })
            ),
          ]),
        })
      ),
    ]),
  ignoreErrorCodes: ["ResourceNotFoundException"],
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Lambda.html#getEventSourceMapping-property
  getById: {
    pickId,
    method: "getEventSourceMapping",
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Lambda.html#listEventSourceMappings-property
  getList: {
    method: "listEventSourceMappings",
    getParam: "EventSourceMappings",
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Lambda.html#createEventSourceMapping-property
  create: {
    method: "createEventSourceMapping",
    shouldRetryOnExceptionMessages: [
      "The provided execution role does not have permissions to call ReceiveMessage on SQS",
      "Please add Lambda as a Trusted Entity",
    ],
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Lambda.html#updateEventSourceMapping-property
  update: {
    method: "updateEventSourceMapping",
    filterParams: ({ payload, diff, live }) =>
      pipe([() => payload, defaultsDeep(pickId(live))])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Lambda.html#deleteEventSourceMapping-property
  destroy: {
    method: "deleteEventSourceMapping",
    pickId,
  },
  getByName: getByNameCore,
  configDefault: ({
    name,
    namespace,
    properties,
    dependencies: {
      lambdaFunction,
      dynamoDbTable,
      kinesisStream,
      kinesisStreamConsumer,
      mqBroker,
      mskCluster,
      sqsQueue,
    },
  }) =>
    pipe([
      tap(() => {
        assert(lambdaFunction);
      }),
      () => properties,
      defaultsDeep({
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
        () => mskCluster,
        defaultsDeep({
          EventSourceArn: getField(mskCluster, "ClusterArn"),
        }),
        () => mqBroker,
        defaultsDeep({
          EventSourceArn: getField(mqBroker, "BrokerArn"),
        }),
        () => kinesisStream,
        defaultsDeep({
          EventSourceArn: getField(kinesisStream, "StreamARN"),
        }),
        () => kinesisStreamConsumer,
        defaultsDeep({
          EventSourceArn: getField(kinesisStreamConsumer, "ConsumerARN"),
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
