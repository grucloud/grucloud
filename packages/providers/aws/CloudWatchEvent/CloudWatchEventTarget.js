const assert = require("assert");
const { pipe, tap, get, eq, and, switchCase } = require("rubico");
const { defaultsDeep, callProp, find, when } = require("rubico/x");

const { getField } = require("@grucloud/core/ProviderCommon");
const { AwsClient } = require("../AwsClient");
const {
  createCloudWatchEvents,
  ignoreErrorCodes,
} = require("./CloudWatchEventCommon");

//TODO
const findId = get("live.Id");
const findName = pipe([
  tap((params) => {
    assert(true);
  }),
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

  const findTargetDependency = ({ type, group, live, lives }) => ({
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

  // findDependencies for CloudWatchEventRule
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
          tap((params) => {
            assert(true);
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
    findTargetDependency({ type: "Queue", group: "SQS", live, lives }),
    findTargetDependency({ type: "Topic", group: "SNS", live, lives }),
    findTargetDependency({
      type: "LogGroup",
      group: "CloudWatchLogs",
      live,
      lives,
    }),
    findTargetDependency({ type: "RestApi", group: "APIGateway", live, lives }),
    findTargetDependency({
      type: "EventBus",
      group: "CloudWatchEvents",
      live,
      lives,
    }),
    findTargetDependency({ type: "Task", group: "ECS", live, lives }),
    findTargetDependency({ type: "Function", group: "Lambda", live, lives }),
    findTargetDependency({
      type: "StateMachine",
      group: "StepFunctions",
      live,
      lives,
    }),
  ];

  const decorate = ({ parent }) =>
    pipe([
      tap((params) => {
        assert(parent);
        assert(parent.Name);
        assert(parent.EventBusName);
      }),
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
      pipe([
        tap((params) => {
          assert(Id);
        }),
        () => ({ lives }),
        getList,
        tap((params) => {
          assert(true);
        }),
        find(and([eq(get("Id"), Id)])),
        tap((params) => {
          assert(true);
        }),
      ])();

  const getByName = ({ name, lives, dependencies = () => ({}) }) =>
    pipe([
      () => name,
      callProp("split", "::"),
      ([target, Rule, Id]) => ({ Rule, Id }),
      tap((params) => {
        assert(true);
      }),

      getById({ lives }),
      tap((params) => {
        assert(true);
      }),
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
    // pickCreated:
    //   ({ payload }) =>
    //   () =>
    //     payload,
    //getById,
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

  const configDefault = async ({
    name,
    namespace,
    properties,
    dependencies: {
      rule,
      role,
      apiDestination,
      sqsQueue,
      snsTopic,
      sfnStateMachine,
      logGroup,
    },
  }) =>
    pipe([
      tap((params) => {
        assert(true);
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
      switchCase([
        // CloudWatch Events Api Destination
        () => apiDestination,
        defaultsDeep({
          RoleArn: getField(apiDestination, "ApiDestinationArn"),
        }),
        // SQS Queue
        () => sqsQueue,
        defaultsDeep({
          Arn: getField(sqsQueue, "Attributes.QueueArn"),
        }),
        // SNS Topic
        () => snsTopic,
        defaultsDeep({
          Arn: getField(snsTopic, "TopicArn"),
        }),
        // StepFunctions StateMachine
        () => sfnStateMachine,
        defaultsDeep({
          Arn: getField(sfnStateMachine, "stateMachineArn"),
        }),
        // Log Group
        () => logGroup,
        defaultsDeep({
          Arn: getField(logGroup, "arn"),
        }),
        // TODO complete all dependencies
        () => {
          assert(false, "TODO: implement me");
        },
      ]),
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
