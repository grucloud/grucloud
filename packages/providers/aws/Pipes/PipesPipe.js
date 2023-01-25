const assert = require("assert");
const {
  pipe,
  tap,
  get,
  pick,
  assign,
  reduce,
  switchCase,
  map,
} = require("rubico");
const {
  defaultsDeep,
  identity,
  find,
  unless,
  isEmpty,
  callProp,
  includes,
  when,
  append,
} = require("rubico/x");
const { camelCase } = require("change-case");

const { getByNameCore, omitIfEmpty } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");
const { buildTagsObject } = require("@grucloud/core/Common");

const { Tagger } = require("./PipesCommon");
const { replaceAccountAndRegion } = require("../AwsCommon");

const sourceDependencies = [
  { type: "Stream", group: "Kinesis", arnKey: "StreamARN" },
  { type: "Queue", group: "SQS", arnKey: "Attributes.QueueArn" },
  { type: "Broker", group: "MQ", arnKey: "BrokerArn" },
  //TODO
  //{ type: "Stream", group: "MSK", arnKey: "" },
];

const enrichmentDependencies = [
  { type: "Function", group: "Lambda", arnKey: "Configuration.FunctionArn" },
  { type: "StateMachine", group: "StepFunctions", arnKey: "stateMachineArn" },
  { type: "Api", group: "ApiGatewayV2", arnKey: "Arn" },
  {
    type: "ApiDestination",
    group: "CloudWatchEvents",
    arnKey: "ApiDestinationArn",
  },
];

const targetDependencies = [
  {
    type: "ApiDestination",
    group: "CloudWatchEvents",
    arnKey: "ApiDestinationArn",
  },
  { type: "Api", group: "ApiGatewayV2", arnKey: "Arn" },
  { type: "Function", group: "Lambda", arnKey: "Configuration.FunctionArn" },
  //TODO
  //{ type: "JobQueue", group: "Batch" },
  { type: "Cluster", group: "ECS", arnKey: "clusterArn" },
  { type: "EventBus", group: "CloudWatchEvents", arnKey: "Arn" },
  { type: "DeliveryStream", group: "Firehose", arnKey: "DeliveryStreamARN" },
  //{ type: "Assessment", group: "Inspector" },
  { type: "Stream", group: "Kinesis", arnKey: "StreamARN" },
  { type: "Cluster", group: "Redshift", arnKey: "Arn" },
  { type: "Topic", group: "SNS", arnKey: "Attributes.TopicArn" },
  { type: "Queue", group: "SQS", arnKey: "Attributes.QueueArn" },
  { type: "StateMachine", group: "StepFunctions", arnKey: "stateMachineArn" },
];

const findArnKeyFromName = (name) =>
  pipe([
    tap((params) => {
      assert(name);
    }),
    () => [
      ...sourceDependencies,
      ...targetDependencies,
      ...enrichmentDependencies,
    ],
    find(({ type, group }) =>
      pipe([() => name, includes(`${group}${type}`)])()
    ),
    get("arnKey"),
    tap((arnKey) => {
      assert(arnKey);
    }),
  ])();

// side : Target  or Source
const buildDependencies = ({ side, sourceTargetDependencies }) =>
  pipe([
    tap((params) => {
      assert(true);
    }),
    () => sourceTargetDependencies,
    reduce(
      (acc, { type, group }) =>
        pipe([
          () => ({
            [`${camelCase(side)}${group}${type}`]: {
              type,
              group,
              dependencyId: () => pipe([get(side)]),
            },
          }),
          (dep) => ({ ...acc, ...dep }),
        ])(),
      {}
    ),
  ])();

const findSourceTargetDeps = ({ side, optional }) =>
  pipe([
    Object.entries,
    find(([name, dep]) => name.startsWith(side)),
    tap.if(
      () => !optional,
      ([name, dep]) => {
        assert(name);
        assert(dep);
      }
    ),
    unless(isEmpty, ([name, dep]) => getField(dep, findArnKeyFromName(name))),
  ]);

const buildArn = () =>
  pipe([
    get("Arn"),
    tap((arn) => {
      assert(arn);
    }),
  ]);

const pickId = pipe([
  tap(({ Name }) => {
    assert(Name);
  }),
  pick(["Name"]),
]);

const decorate = ({ endpoint, config }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
    JSON.stringify,
    JSON.parse,
    omitIfEmpty(["TargetParameters", "EnrichmentParameters"]),
    assign({
      SourceParameters: pipe([
        get("SourceParameters"),
        when(
          get("FilterCriteria"),
          assign({
            FilterCriteria: pipe([
              get("FilterCriteria"),
              assign({
                Filters: pipe([
                  get("Filters"),
                  map(
                    assign({
                      Pattern: pipe([get("Pattern"), JSON.parse]),
                    })
                  ),
                ]),
              }),
            ]),
          })
        ),
      ]),
    }),
  ]);

const payloadStringify = pipe([
  assign({
    SourceParameters: pipe([
      get("SourceParameters"),
      when(
        get("FilterCriteria"),
        assign({
          FilterCriteria: pipe([
            get("FilterCriteria"),
            assign({
              Filters: pipe([
                get("Filters"),
                map(
                  assign({
                    Pattern: pipe([get("Pattern"), JSON.stringify]),
                  })
                ),
              ]),
            }),
          ]),
        })
      ),
    ]),
  }),
]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Pipes.html
exports.PipesPipe = () => ({
  type: "Pipe",
  package: "pipes",
  client: "Pipes",
  propertiesDefault: {},
  omitProperties: [
    "Arn",
    "CreationTime",
    "CurrentState",
    "DesiredState",
    "LastModifiedTime",
    "Source",
    "StateReason",
    "Target",
    "RoleArn",
    "Enrichment",
  ],
  inferName: () =>
    pipe([
      get("Name"),
      tap((Name) => {
        assert(Name);
      }),
    ]),
  findName: () =>
    pipe([
      get("Name"),
      tap((name) => {
        assert(name);
      }),
    ]),
  findId: () =>
    pipe([
      get("Arn"),
      tap((id) => {
        assert(id);
      }),
    ]),
  ignoreErrorCodes: ["NotFoundException"],
  dependencies: {
    iamRole: {
      type: "Role",
      group: "IAM",
      dependencyId: ({ lives, config }) => pipe([get("RoleArn")]),
    },
    sourceDynamoDB: {
      type: "Table",
      group: "DynamoDB",
      dependencyId: () =>
        pipe([
          get("Source"),
          callProp("split", "/"),
          callProp("slice", 0, -2),
          callProp("join", "/"),
        ]),
    },
    sqsQueueDeadLetter: {
      type: "Queue",
      group: "SQS",
      dependencyId: ({ lives, config }) =>
        pipe([
          get("SourceParameters.DynamoDBStreamParameters.DeadLetterConfig.Arn"),
        ]),
    },
    ...buildDependencies({
      side: "Source",
      sourceTargetDependencies: sourceDependencies,
    }),
    ...buildDependencies({
      side: "Enrichment",
      sourceTargetDependencies: enrichmentDependencies,
    }),
    destinationCloudWatchLogGroup: {
      type: "LogGroup",
      group: "CloudWatchLogs",
      dependencyId: ({ lives, config }) =>
        pipe([
          get("Target"),
          tap((params) => {
            assert(true);
          }),
          switchCase([
            callProp("startsWith", "arn:aws:logs"),
            callProp("replace", ":*", ""),
            () => undefined,
          ]),
        ]),
    },
    ...buildDependencies({
      side: "Target",
      sourceTargetDependencies: targetDependencies,
    }),
  },
  filterLive: ({ lives, providerConfig }) =>
    pipe([
      assign({
        SourceParameters: pipe([
          get("SourceParameters"),
          when(
            get("DynamoDBStreamParameters"),
            assign({
              DynamoDBStreamParameters: pipe([
                get("DynamoDBStreamParameters"),
                when(
                  get("DeadLetterConfig"),
                  assign({
                    DeadLetterConfig: pipe([
                      get("DeadLetterConfig"),
                      assign({
                        Arn: pipe([
                          get("Arn"),
                          replaceAccountAndRegion({ lives, providerConfig }),
                        ]),
                      }),
                    ]),
                  })
                ),
              ]),
            })
          ),
        ]),
      }),
    ]),

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Pipes.html#describePipe-property
  getById: {
    method: "describePipe",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Pipes.html#listPipes-property
  getList: {
    method: "listPipes",
    getParam: "Pipes",
    decorate: ({ getById }) => pipe([getById]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Pipes.html#createPipe-property
  create: {
    filterPayload: payloadStringify,
    method: "createPipe",
    pickCreated: ({ payload }) => pipe([identity]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Pipes.html#updatePipe-property
  update: {
    method: "updatePipe",
    filterParams: ({ payload, diff, live }) =>
      pipe([() => payload, payloadStringify])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Pipes.html#deletePipe-property
  destroy: {
    method: "deletePipe",
    pickId,
    shouldRetryOnExceptionCodes: ["ConflictException"],
  },
  getByName: getByNameCore,
  tagger: ({ config }) =>
    Tagger({
      buildArn: buildArn({ config }),
    }),
  configDefault: ({
    name,
    namespace,
    properties: { Tags, ...otherProps },
    dependencies: {
      iamRole,
      sourceDynamoDB,
      destinationCloudWatchLogGroup,
      ...sourceTargetDeps
    },
    config,
  }) =>
    pipe([
      tap((params) => {
        assert(iamRole);
        assert(sourceTargetDeps);
      }),
      () => otherProps,
      defaultsDeep({
        Tags: buildTagsObject({ name, config, namespace, userTags: Tags }),
        RoleArn: getField(iamRole, "Arn"),
      }),
      switchCase([
        () => sourceDynamoDB,
        assign({ Source: () => getField(sourceDynamoDB, "LatestStreamArn") }),
        assign({
          Source: pipe([
            () => sourceTargetDeps,
            findSourceTargetDeps({ side: "source" }),
          ]),
        }),
      ]),
      switchCase([
        () => destinationCloudWatchLogGroup,
        assign({
          Target: () => `${getField(destinationCloudWatchLogGroup, "arn")}:*`,
        }),
        assign({
          Target: pipe([
            () => sourceTargetDeps,
            findSourceTargetDeps({ side: "target" }),
          ]),
        }),
      ]),
      assign({
        Enrichment: pipe([
          () => sourceTargetDeps,
          findSourceTargetDeps({ side: "enrichment", optional: true }),
        ]),
      }),
    ])(),
});
