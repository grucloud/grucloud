const assert = require("assert");
const { pipe, tap, get, pick, assign, reduce } = require("rubico");
const { defaultsDeep, identity, find, unless, isEmpty } = require("rubico/x");
const { camelCase } = require("change-case");

const { getByNameCore } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");
const { buildTagsObject } = require("@grucloud/core/Common");

const { Tagger } = require("./PipesCommon");

const sourceDependencies = [
  { type: "DeliveryStream", group: "Kinesis", arnKey: "DeliveryStreamARN" },
  { type: "Queue", group: "SQS", arnKey: "Attributes.QueueArn" },
  //TODO
  //{ type: "Stream", group: "DynamoDB" },
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
  { type: "LogGroup", group: "CloudWatchLogs", arnKey: "arn" },
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
    tap((params) => {
      assert(true);
    }),
  ])();

const findSourceTargetDeps = ({ side, optional }) =>
  pipe([
    tap((params) => {
      assert(side);
    }),
    Object.entries,
    find(([name, dep]) => name.startsWith(side)),
    tap((params) => {
      assert(true);
    }),

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
    ...buildDependencies({
      side: "Source",
      sourceTargetDependencies: sourceDependencies,
    }),
    ...buildDependencies({
      side: "Enrichment",
      sourceTargetDependencies: enrichmentDependencies,
    }),
    ...buildDependencies({
      side: "Target",
      sourceTargetDependencies: targetDependencies,
    }),
  },
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
    method: "createPipe",
    pickCreated: ({ payload }) => pipe([identity]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Pipes.html#updatePipe-property
  update: {
    method: "updatePipe",
    filterParams: ({ payload, diff, live }) => pipe([() => payload])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Pipes.html#deletePipe-property
  destroy: {
    method: "deletePipe",
    pickId,
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
    dependencies: { iamRole, ...sourceTargetDeps },
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
      assign({
        Source: pipe([
          () => sourceTargetDeps,
          findSourceTargetDeps({ side: "source" }),
        ]),
        Target: pipe([
          () => sourceTargetDeps,
          findSourceTargetDeps({ side: "target" }),
        ]),
        Enrichment: pipe([
          () => sourceTargetDeps,
          findSourceTargetDeps({ side: "enrichment", optional: true }),
        ]),
      }),
    ])(),
});
