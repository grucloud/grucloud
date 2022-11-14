const assert = require("assert");
const { pipe, tap, get, pick, eq, assign } = require("rubico");
const { defaultsDeep, when } = require("rubico/x");

const { getField } = require("@grucloud/core/ProviderCommon");
const { getByNameCore } = require("@grucloud/core/Common");

const { buildTags, replaceAccountAndRegion } = require("../AwsCommon");

const { createAwsResource } = require("../AwsClient");

const { Tagger, assignClientToken } = require("./SchedulerCommon");

const buildArn = () =>
  pipe([
    get("Arn"),
    tap((arn) => {
      assert(arn);
    }),
  ]);

const pickId = pipe([
  tap(({ Name, GroupName }) => {
    assert(Name);
    //assert(GroupName);
  }),
  pick(["Name", "GroupName"]),
]);

const decorate = ({ endpoint }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
    // 13:21:58.620 error: AwsClient    getById Schedule name: ValidationException, message: 1 validation error detected: Value 'arn:aws:scheduler:us-east-1:840541460064:schedule/default/scheduleLambda' at 'resourceArn' failed to satisfy constraint: Member must satisfy regular expression pattern: arn:aws(-[a-z]+)?:scheduler:[a-z0-9\-]+:\d{12}:schedule-group\/[0-9a-zA-Z-_.]+, error: ValidationException: 1 validation error detected: Value 'arn:aws:scheduler:us-east-1:840541460064:schedule/default/scheduleLambda' at 'resourceArn' failed to satisfy constraint: Member must satisfy regular expression pattern: arn:aws(-[a-z]+)?:scheduler:[a-z0-9\-]+:\d{12}:schedule-group\/[0-9a-zA-Z-_.]+
    // assign({
    //   Tags: pipe([
    //     buildArn(),
    //     (ResourceArn) => ({
    //       ResourceArn,
    //     }),
    //     tap((params) => {
    //       assert(true);
    //     }),
    //     endpoint().listTagsForResource,
    //     tap((params) => {
    //       assert(true);
    //     }),
    //     get("Tags"),
    //   ]),
    // }),
  ]);

const model = ({ config }) => ({
  package: "scheduler",
  client: "Scheduler",
  ignoreErrorCodes: ["ResourceNotFoundException"],
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Scheduler.html#getSchedule-property
  getById: {
    method: "getSchedule",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Scheduler.html#listSchedules-property
  getList: {
    method: "listSchedules",
    getParam: "Schedules",
    decorate: ({ getById }) => pipe([getById]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Scheduler.html#createSchedule-property
  create: {
    method: "createSchedule",
    pickCreated: ({ payload }) => pipe([() => payload]),
    shouldRetryOnExceptionMessages: [
      "The execution role you provide must allow AWS EventBridge Scheduler to assume the role.",
    ],
    //
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Scheduler.html#updateSchedule-property
  update: {
    method: "updateSchedule",
    filterParams: ({ pickId, payload, diff, live }) => pipe([() => payload])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Scheduler.html#deleteSchedule-property
  destroy: {
    method: "deleteSchedule",
    pickId: pipe([pickId, assignClientToken]),
  },
});

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Scheduler.html
exports.SchedulerSchedule = ({ compare }) => ({
  type: "Schedule",
  propertiesDefault: { State: "ENABLED" },
  omitProperties: [
    "Arn",
    "CreationDate",
    "KmsKeyArn",
    "LastModificationDate",
    "Target.DeadLetterConfig.Arn",
    "Target.RoleArn",
  ],
  inferName: get("properties.Name"),
  // compare: compare({
  //   filterTarget: () => pipe([omit(["compare"])]),
  // }),
  filterLive: ({ lives, providerConfig }) =>
    pipe([
      assign({
        Target: pipe([
          get("Target"),
          assign({
            Arn: pipe([
              get("Arn"),
              replaceAccountAndRegion({
                providerConfig,
                lives,
              }),
            ]),
          }),
        ]),
      }),
    ]),
  dependencies: {
    iamRole: {
      type: "Role",
      group: "IAM",
      dependencyId: ({ lives, config }) => pipe([get("Target.RoleArn")]),
    },
    kmsKey: {
      type: "Key",
      group: "KMS",
      dependencyId: ({ lives, config }) => get("KmsKeyArn"),
    },
    scheduleGroup: {
      type: "ScheduleGroup",
      group: "Scheduler",
      excludeDefaultDependencies: true,
      dependencyId: ({ lives, config }) => get("GroupName"),
    },
    sqsQueueDeadLetter: {
      type: "Queue",
      group: "SQS",
      dependencyId: ({ lives, config }) => get("Target.DeadLetterConfig.Arn"),
    },
    codeBuildProjet: {
      type: "Project",
      group: "CodeBuild",
      dependencyId: ({ lives, config }) => get("Target.Arn"),
    },
    codePipeline: {
      type: "Pipeline",
      group: "CodePipeline",
      dependencyId: ({ lives, config }) => get("Target.Arn"),
    },
    ecsTask: {
      type: "Task",
      group: "ECS",
      dependencyId: ({ lives, config }) => get("Target.Arn"),
    },
    eventBus: {
      type: "EventBus",
      group: "CloudWatchEvents",
      dependencyId: ({ lives, config }) => get("Target.Arn"),
    },
    kinesisStream: {
      type: "Stream",
      group: "Kinesis",
      dependencyId: ({ lives, config }) => get("Target.Arn"),
    },
    lambdaFunction: {
      type: "Function",
      group: "Lambda",
      dependencyId: ({ lives, config }) => get("Target.Arn"),
    },
    sfnStateMachine: {
      type: "StateMachine",
      group: "StepFunctions",
      dependencyId: ({ lives, config }) => get("Target.Arn"),
    },
    sqsQueue: {
      type: "Queue",
      group: "SQS",
      dependencyId: ({ lives, config }) => get("Target.Arn"),
    },
    snsTopic: {
      type: "Topic",
      group: "SNS",
      dependencyId: ({ lives, config }) => get("Target.Arn"),
    },
  },
  Client: ({ spec, config }) =>
    createAwsResource({
      model: model({ config }),
      spec,
      config,
      findName: pipe([
        get("live"),
        get("Name"),
        tap((name) => {
          assert(name);
        }),
      ]),
      findId: pipe([
        get("live"),
        get("Name"),
        tap((id) => {
          assert(id);
        }),
      ]),
      getByName: getByNameCore,
      ...Tagger({ buildArn: buildArn(config) }),
      configDefault: ({
        name,
        namespace,
        properties: { Tags, ...otherProps },
        dependencies: { iamRole, kmsKey, sqsQueue, sqsQueueDeadLetter },
      }) =>
        pipe([
          () => otherProps,
          defaultsDeep({
            // TODO tagging is not working
            //Tags: buildTags({ name, config, namespace, UserTags: Tags }),
          }),
          when(
            () => iamRole,
            defaultsDeep({
              Target: {
                RoleArn: getField(iamRole, "Arn"),
              },
            })
          ),
          when(
            () => kmsKey,
            defaultsDeep({
              KmsKeyArn: getField(kmsKey, "Arn"),
            })
          ),
          when(
            () => sqsQueue,
            defaultsDeep({
              Target: {
                Arn: getField(sqsQueue, "Attributes.QueueArn"),
              },
            })
          ),
          when(
            () => sqsQueueDeadLetter,
            defaultsDeep({
              Target: {
                DeadLetterConfig: {
                  Arn: getField(sqsQueueDeadLetter, "Attributes.QueueArn"),
                },
              },
            })
          ),
        ])(),
    }),
});
