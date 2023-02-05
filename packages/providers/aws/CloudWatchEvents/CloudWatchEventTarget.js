const assert = require("assert");
const {
  pipe,
  tap,
  get,
  pick,
  assign,
  or,
  and,
  eq,
  omit,
  any,
} = require("rubico");
const {
  defaultsDeep,
  first,
  callProp,
  when,
  isEmpty,
  unless,
  keys,
  find,
} = require("rubico/x");

const { getField } = require("@grucloud/core/ProviderCommon");

const { ignoreErrorCodes } = require("./CloudWatchEventCommon");

const ignoreArns = [
  "arn:aws:auditmanager",
  "arn:aws:autoscaling",
  "arn:aws:inspector2",
  "arn:aws:schemas",
];

const managedByOther = () =>
  pipe([
    get("Arn"),
    (arn) =>
      pipe([() => ignoreArns, any((ignoreArn) => arn.startsWith(ignoreArn))])(),
  ]);

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

const findTargetDependency =
  ({ type, group }) =>
  ({ config, lives }) =>
    pipe([
      get("Arn"),
      tap((Arn) => {
        assert(Arn);
      }),
      lives.getById({
        type,
        group,
        providerName: config.providerName,
      }),
    ]);

const EventTargetDependencies = {
  // rule: {
  //   type: "Rule",
  //   group: "CloudWatchEvents",
  //   parent: true,
  //   dependencyId: findTargetDependency({
  //     type: "Rule",
  //     group: "CloudWatchEvents",
  //   }),
  // },
  // role: {
  //   type: "Role",
  //   group: "IAM",
  //   dependencyId: findTargetDependency({
  //     type: "Role",
  //     group: "IAM",
  //   }),
  // },
  //TODO https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CloudWatchEvents.html#putTargets-property
  apiDestination: {
    type: "ApiDestination",
    group: "CloudWatchEvents",
    buildArn: () => get("ApiDestinationArn"),
    dependencyId: findTargetDependency({
      type: "ApiDestination",
      group: "CloudWatchEvents",
    }),
  },
  logGroup: {
    type: "LogGroup",
    group: "CloudWatchLogs",
    buildArn: () => get("arn"),
    dependencyId: findTargetDependency({
      type: "LogGroup",
      group: "CloudWatchLogs",
    }),
  },
  sqsQueue: {
    type: "Queue",
    group: "SQS",
    buildArn: () => get("Attributes.QueueArn"),
    dependencyId: findTargetDependency({
      type: "Queue",
      group: "SQS",
    }),
  },
  snsTopic: {
    type: "Topic",
    group: "SNS",
    buildArn: () => get("TopicArn"),
    dependencyId: findTargetDependency({
      type: "Topic",
      group: "SNS",
    }),
  },
  apiGatewayRest: {
    type: "RestApi",
    group: "APIGateway",
    buildArn:
      () =>
      ({ id }) =>
        `arn:aws:apigateway:${config.region}::/restapis/${id}`,
    dependencyId: findTargetDependency({
      type: "RestApi",
      group: "APIGateway",
    }),
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
    dependencyId: findTargetDependency({
      type: "EventBus",
      group: "CloudWatchEvents",
    }),
  },
  ecsTask: {
    type: "Task",
    group: "ECS",
    buildArn: () => get("taskArn"),
    dependencyId: findTargetDependency({
      type: "Task",
      group: "ECS",
    }),
  },
  lambdaFunction: {
    type: "Function",
    group: "Lambda",
    buildArn: () => get("Configuration.FunctionArn"),
    dependencyId: findTargetDependency({
      type: "Function",
      group: "Lambda",
    }),
  },
  sfnStateMachine: {
    type: "StateMachine",
    group: "StepFunctions",
    buildArn: () => get("stateMachineArn"),
    dependencyId: findTargetDependency({
      type: "StateMachine",
      group: "StepFunctions",
    }),
  },
  codePipeline: {
    type: "Pipeline",
    group: "CodePipeline",
    buildArn: () => get("metadata.pipelineArn"),
    dependencyId: findTargetDependency({
      type: "Pipeline",
      group: "CodePipeline",
    }),
  },
  codeBuildProject: {
    type: "Project",
    group: "CodeBuild",
    buildArn: () => get("arn"),
    dependencyId: findTargetDependency({
      type: "Project",
      group: "CodeBuild",
    }),
  },
};

const buildArn = () =>
  pipe([
    get("Arn"),
    tap((arn) => {
      assert(arn);
    }),
  ]);

const decorate = ({ endpoint, parent }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
      assert(parent);
    }),
    defaultsDeep({ Rule: parent.Name, EventBusName: parent.EventBusName }),
  ]);

const findName = () => pipe([({ Id, Rule }) => `target::${Rule}::${Id}`]);

const assignArnTarget = ({ dependencies, config }) =>
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

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CloudWatchEvent.html
exports.CloudWatchEventTarget = () => ({
  type: "Target",
  package: "cloudwatch-events",
  client: "CloudWatchEvents",
  inferName:
    ({ dependenciesSpec: { rule } }) =>
    ({ Id }) =>
      pipe([
        tap((params) => {
          assert(Id);
          assert(rule);
        }),
        () => `target::${rule}::${Id}`,
      ])(),
  findName,
  findId: () =>
    pipe([
      get("Arn"),
      tap((id) => {
        assert(id);
      }),
    ]),
  managedByOther: managedByOther,
  cannotBeDeleted: managedByOther,
  ignoreErrorCodes,
  propertiesDefault: {},
  omitProperties: ["EventBusName", "Rule", "RoleArn", "Arn"],
  filterLive: () =>
    pipe([
      tap((params) => {
        assert(true);
      }),
      unless(
        pipe([get("Arn"), callProp("startsWith", "arn:aws:autoscaling")]),
        omit(["Arn"])
      ),
    ]),
  dependencies: {
    rule: {
      type: "Rule",
      group: "CloudWatchEvents",
      parent: true,
      dependencyId: ({ lives, config }) =>
        pipe([
          get("Rule"),
          lives.getByName({
            type: "Rule",
            group: "CloudWatchEvents",
            providerName: config.providerName,
          }),
          get("id"),
        ]),
    },
    role: {
      type: "Role",
      group: "IAM",
      dependencyId: ({ lives, config }) => get("RoleArn"),
    },
    //TODO https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CloudWatchEvents.html#putTargets-property
    ...EventTargetDependencies,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CloudWatchEvents.html#listTargetsByRule-property
  getById: {
    method: "listTargetsByRule",
    pickId: pipe([
      tap(({ Rule, EventBusName }) => {
        assert(Rule);
        assert(EventBusName);
      }),
      pick(["Rule", "EventBusName"]),
    ]),
    decorate: ({ live: { Id } }) =>
      pipe([
        tap((params) => {
          assert(Id);
        }),
        get("Targets"),
        find(and([eq(get("Id"), Id)])),
      ]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CloudWatchEvent.html#listTargets-property
  getList: ({ client, endpoint, getById, config }) =>
    pipe([
      () =>
        client.getListWithParent({
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
          decorate: ({ endpoint, parent }) =>
            pipe([
              tap((params) => {
                assert(endpoint);
                assert(parent.Name);
                assert(parent.EventBusName);
              }),
              defaultsDeep({
                Rule: parent.Name,
                EventBusName: parent.EventBusName,
              }),
            ]),
        }),
    ])(),
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CloudWatchEvent.html#createTarget-property
  create: {
    method: "putTargets",
    filterPayload: pipe([
      ({ Rule, EventBusName, ...otherProps }) => ({
        Rule,
        EventBusName,
        Targets: [otherProps],
      }),
    ]),
    pickCreated: ({ payload }) =>
      pipe([
        () => payload,
        tap((params) => {
          assert(true);
        }),
      ]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CloudWatchEvent.html#updateTarget-property
  update: {
    method: "putTargets",
    filterParams: ({ payload, diff, live }) => pipe([() => payload])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CloudWatchEvent.html#deleteTarget-property
  destroy: {
    pickId: pipe([
      tap(({ Rule, EventBusName, Id }) => {
        assert(Rule);
        assert(EventBusName);
        assert(Id);
      }),
      ({ Rule, EventBusName, Id }) => ({ Ids: [Id], Rule, EventBusName }),
    ]),
    method: "removeTargets",
  },
  getByName:
    ({ getById }) =>
    ({ name, lives, config, resolvedDependencies: { rule } }) =>
      pipe([
        tap((params) => {
          assert(rule);
        }),
        () => name,
        callProp("split", "::"),
        tap(([target, Rule, Id]) => {
          assert(Rule);
          assert(Id);
        }),
        ([target, Rule, Id]) => ({
          EventBusName: rule.live.EventBusName,
          Rule,
          Id,
        }),
        getById({ lives, config }),
      ])(),
  configDefault: ({
    name,
    namespace,
    properties,
    dependencies: { rule, role, ...otherDeps },
    config,
  }) =>
    pipe([
      tap((params) => {
        assert(rule);
      }),
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
      unless(
        () => isEmpty(otherDeps),
        assignArnTarget({ dependencies: otherDeps, config })
      ),
    ])(),
});
