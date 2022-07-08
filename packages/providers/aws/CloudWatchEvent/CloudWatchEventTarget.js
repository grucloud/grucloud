const assert = require("assert");
const { pipe, tap, get, eq, and, assign, map } = require("rubico");
const {
  defaultsDeep,
  callProp,
  find,
  when,
  values,
  keys,
  first,
  isEmpty,
} = require("rubico/x");

const { getField } = require("@grucloud/core/ProviderCommon");
const { AwsClient } = require("../AwsClient");
const {
  createCloudWatchEvents,
  ignoreErrorCodes,
} = require("./CloudWatchEventCommon");

//TODO
// Batch job queue
// API Gateway v2
// Amazon EC2 CreateSnapshot API call
// Amazon EC2 RebootInstances API call
// Amazon EC2 StopInstances API call
// Amazon EC2 TerminateInstances API call
// Firehose delivery stream (Kinesis Data Firehose)
// Inspector assessment template (Amazon Inspector)
// Kinesis stream (Kinesis Data Stream)
// Redshift clusters (Data API statement execution)
// SSM Automation
// SSM OpsItem
// SSM Run Command

const EventTargetDependencies = {
  rule: { type: "Rule", group: "CloudWatchEvents", parent: true },
  role: { type: "Role", group: "IAM" },
  //TODO https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CloudWatchEvents.html#putTargets-property
  apiDestination: {
    type: "ApiDestination",
    group: "CloudWatchEvents",
    buildArn: () => get("ApiDestinationArn"),
  },
  logGroup: {
    type: "LogGroup",
    group: "CloudWatchLogs",
    buildArn: () => get("arn"),
  },
  sqsQueue: {
    type: "Queue",
    group: "SQS",
    buildArn: () => get("Attributes.QueueArn"),
  },
  snsTopic: { type: "Topic", group: "SNS", buildArn: () => get("TopicArn") },
  apiGatewayRest: {
    type: "RestApi",
    group: "APIGateway",
    buildArn:
      () =>
      ({ id }) =>
        `arn:aws:apigateway:${config.region}::/restapis/${id}`,
  },
  eventBus: {
    type: "EventBus",
    group: "CloudWatchEvents",
    buildArn:
      ({ config }) =>
      ({ Name }) =>
        `arn:aws:events:${
          config.region
        }:${config.accountId()}:event-bus/${Name}`,
  },
  ecsTask: { type: "Task", group: "ECS", buildArn: () => get("taskArn") },
  lambdaFunction: {
    type: "Function",
    group: "Lambda",
    buildArn: () => get("Configuration.FunctionArn"),
  },
  sfnStateMachine: {
    type: "StateMachine",
    group: "StepFunctions",
    buildArn: () => get("stateMachineArn"),
  },
  codePipeline: {
    type: "Pipeline",
    group: "CodePipeline",
    buildArn: () => get("metadata.pipelineArn"),
  },
  codeBuildProject: {
    type: "Project",
    group: "CodeBuild",
    buildArn: () => get("arn"),
  },
};

exports.EventTargetDependencies = EventTargetDependencies;

const findId = get("live.Id");
const findName = pipe([
  get("live"),
  tap(({ Id, Rule }) => {
    assert(Id);
    assert(Rule);
  }),
  ({ Id, Rule }) => `target::${Rule}::${Id}`,
]);

exports.CloudWatchEventTarget = ({ spec, config }) => {
  const cloudWatchEvents = createCloudWatchEvents(config);
  const client = AwsClient({ spec, config })(cloudWatchEvents);

  const managedByOther = pipe([
    get("live.Arn"),
    callProp("startsWith", "arn:aws:autoscaling"),
  ]);

  const findTargetDependency =
    ({ live, lives }) =>
    ({ type, group }) => ({
      type,
      group,
      ids: [
        pipe([
          () => live,
          get("Arn"),
          tap((Arn) => {
            assert(Arn);
          }),
          (Arn) =>
            lives.getById({
              id: Arn,
              type,
              group,
              providerName: config.providerName,
            }),
        ])(),
      ],
    });

  const findTargetDependenciesEventTarget = ({ live, lives }) =>
    pipe([
      () => EventTargetDependencies,
      values,
      map(findTargetDependency({ live, lives })),
    ])();

  const findDependencies = ({ live, lives }) => [
    {
      type: "Rule",
      group: "CloudWatchEvents",
      ids: [
        pipe([
          () => live,
          get("Rule"),
          tap((Rule) => {
            assert(Rule);
          }),
          (name) =>
            lives.getByName({
              name,
              type: "Rule",
              group: "CloudWatchEvents",
              providerName: config.providerName,
            }),
          get("id"),
        ])(),
      ],
    },
    {
      type: "Role",
      group: "IAM",
      ids: [live.RoleArn],
    },
    ...findTargetDependenciesEventTarget({ live, lives }),
  ];

  const decorate = ({ parent }) =>
    pipe([
      defaultsDeep({ Rule: parent.Name, EventBusName: parent.EventBusName }),
    ]);

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CloudWatchEvents.html#listRules-property
  const getList = client.getListWithParent({
    parent: { type: "Rule", group: "CloudWatchEvents" },
    pickKey: pipe([
      tap(({ Name, EventBusName }) => {
        assert(Name);
        assert(EventBusName);
      }),
      ({ Name, EventBusName }) => ({ Rule: Name, EventBusName }),
    ]),
    method: "listTargetsByRule",
    getParam: "Targets",
    config,
    decorate,
  });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CloudWatchEvents.html#describeRule-property
  const getById =
    ({ lives }) =>
    ({ Rule, Id }) =>
      pipe([() => ({ lives }), getList, find(and([eq(get("Id"), Id)]))])();

  const getByName = ({ name, lives, dependencies = () => ({}) }) =>
    pipe([
      () => name,
      callProp("split", "::"),
      ([target, Rule, Id]) => ({ Rule, Id }),
      getById({ lives }),
    ])();

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CloudWatchEvents.html#putRule-property
  const create = client.create({
    method: "putTargets",
    filterPayload: pipe([
      ({ Rule, EventBusName, ...otherProps }) => ({
        Rule,
        EventBusName,
        Targets: [otherProps],
      }),
    ]),
  });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CloudWatchEvents.html#putRule-property
  const update = client.update({
    method: "putTargets",
    //getById,
  });
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CloudWatchEvents.html#removeTargets-property
  const destroy = client.destroy({
    pickId: pipe([
      tap(({ Rule, EventBusName, Id }) => {
        assert(Rule);
        assert(EventBusName);
        assert(Id);
      }),
      ({ Rule, EventBusName, Id }) => ({ Ids: [Id], Rule, EventBusName }),
    ]),
    method: "removeTargets",
    //getById,
    ignoreErrorCodes,
  });

  const assignArnTarget = ({ dependencies }) =>
    pipe([
      assign({
        Arn: pipe([
          () => dependencies,
          keys,
          first,
          tap((key) => {
            assert(key);
          }),
          (key) =>
            pipe([
              () => dependencies[key].live,
              tap((params) => {
                assert(EventTargetDependencies[key]);
              }),
              EventTargetDependencies[key].buildArn({ config }),
              when(isEmpty, () => `Arn of ${key} not available yet`),
            ])(),
        ]),
      }),
    ]);

  const configDefault = async ({
    name,
    namespace,
    properties,
    dependencies: { rule, role, ...otherDeps },
  }) =>
    pipe([
      () => properties,
      defaultsDeep({
        EventBusName: getField(rule, "EventBusName"),
        Rule: getField(rule, "Name"),
      }),
      when(
        () => role,
        defaultsDeep({
          RoleArn: getField(role, "Arn"),
        })
      ),
      assignArnTarget({ dependencies: otherDeps }),
    ])();

  return {
    spec,
    findName,
    findId,
    create,
    update,
    destroy,
    getByName,
    getList,
    configDefault,
    findDependencies,
    managedByOther: managedByOther,
    cannotBeDeleted: managedByOther,
  };
};
