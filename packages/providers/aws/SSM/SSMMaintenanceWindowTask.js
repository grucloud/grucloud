const { getField } = require("@grucloud/core/ProviderCommon");
const assert = require("assert");
const {
  pipe,
  tap,
  get,
  set,
  pick,
  omit,
  switchCase,
  eq,
  map,
  assign,
  flatMap,
} = require("rubico");
const {
  defaultsDeep,
  pluck,
  find,
  when,
  unless,
  identity,
  isIn,
  append,
  prepend,
  callProp,
  last,
} = require("rubico/x");

const { replaceWithName } = require("@grucloud/core/Common");

const pickId = pipe([
  pick(["WindowId", "WindowTaskId"]),
  tap(({ WindowId, WindowTaskId }) => {
    assert(WindowId);
    assert(WindowTaskId);
  }),
]);

const decorateJsonPath = (path) =>
  pipe([
    tap((params) => {
      assert(path);
    }),
    when(
      get(path),
      set(
        path,
        pipe([get(path), Buffer.from, callProp("toString"), JSON.parse])
      )
    ),
  ]);

const stringifyJsonPath = (path) =>
  pipe([when(get(path), set(path, pipe([get(path), JSON.stringify])))]);

const stringifyBufferPath = (path) =>
  pipe([
    when(get(path), set(path, pipe([get(path), JSON.stringify, Buffer.from]))),
  ]);

const stringifyJson = pipe([
  stringifyJsonPath("TaskInvocationParameters.StepFunctions.Input"),
  stringifyBufferPath("TaskInvocationParameters.Lambda.Payload"),
]);

const decorate = ({ endpoint }) =>
  pipe([
    ({ Type, ...other }) => ({ TaskType: Type, ...other }),
    unless(get("Targets"), omit(["MaxErrors", "MaxConcurrency"])),
    decorateJsonPath("TaskInvocationParameters.StepFunctions.Input"),
    decorateJsonPath("TaskInvocationParameters.Lambda.Payload"),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SSM.html
exports.SSMMaintenanceWindowTask = () => ({
  type: "MaintenanceWindowTask",
  package: "ssm",
  client: "SSM",
  findName:
    ({ lives, config }) =>
    ({ Name, WindowId }) =>
      pipe([
        () => WindowId,
        lives.getById({
          type: "MaintenanceWindow",
          group: "SSM",
          providerName: config.providerName,
        }),
        get("name"),
        tap((name) => {
          assert(name);
        }),
        append(`::${Name}`),
      ])(),
  findId: () =>
    pipe([
      get("WindowTaskId"),
      tap((id) => {
        assert(id);
      }),
    ]),
  inferName: ({ dependenciesSpec: { maintenanceWindow } }) =>
    pipe([get("Name"), prepend(`${maintenanceWindow}::`)]),
  propertiesDefault: { Enabled: true },
  omitProperties: [
    "WindowTaskId",
    "WindowId",
    "ServiceRoleArn",
    "TaskInvocationParameters.RunCommand.ServiceRoleArn",
    "TaskInvocationParameters.RunCommand.NotificationConfig.NotificationArn",
  ],
  ignoreErrorCodes: ["DoesNotExistException"],
  dependencies: {
    alarms: {
      type: "MetricAlarm",
      group: "CloudWatch",
      list: true,
      dependencyIds: ({ lives, config }) =>
        pipe([
          get("AlarmConfiguration.Alarms"),
          pluck("Name"),
          map(
            lives.getByName({
              type: "MetricAlarm",
              group: "CloudWatch",
              providerName: config.providerName,
            })
          ),
        ]),
    },
    document: {
      type: "Document",
      group: "SSM",
      dependencyId: () => get("TaskArn"),
    },
    iamRoleService: {
      type: "Role",
      group: "IAM",
      dependencyId: () => get("ServiceRoleArn"),
    },
    iamRoleSnsTopic: {
      type: "Role",
      group: "IAM",
      dependencyId: () =>
        get("TaskInvocationParameters.RunCommand.ServiceRoleArn"),
    },
    lambdaFunction: {
      type: "Function",
      group: "Lambda",
      dependencyId: () => get("TaskArn"),
    },
    maintenanceWindow: {
      type: "MaintenanceWindow",
      group: "SSM",
      parent: true,
      dependencyId: () => get("WindowId"),
    },
    maintenanceWindowTargets: {
      type: "MaintenanceWindowTarget",
      group: "SSM",
      parent: true,
      list: true,
      dependencyIds: () =>
        pipe([get("Targets"), flatMap(pipe([get("Values", [])]))]),
    },
    sfnStateMachine: {
      type: "StateMachine",
      group: "StepFunctions",
      dependencyId: ({ lives, config }) => get("TaskArn"),
    },
    snsTopic: {
      type: "Topic",
      group: "SNS",
      dependencyId: ({ lives, config }) =>
        get(
          "TaskInvocationParameters.RunCommand.NotificationConfig.NotificationArn"
        ),
    },
    s3Bucket: {
      type: "Bucket",
      group: "S3",
      dependencyId: ({ lives, config }) =>
        get("TaskInvocationParameters.RunCommand.OutputS3BucketName"),
    },
  },
  filterLive: ({ lives, providerConfig }) =>
    pipe([
      unless(
        pipe([get("TaskType"), isIn(["AUTOMATION", "RUN_COMMAND"])]),
        omit(["TaskArn"])
      ),
      when(
        get("Targets"),
        assign({
          Targets: pipe([
            get("Targets"),
            map(
              assign({
                Values: pipe([
                  get("Values", []),
                  tap((params) => {
                    assert(true);
                  }),
                  map(
                    replaceWithName({
                      groupType: "SSM::MaintenanceWindowTarget",
                      path: "id",
                      pathLive: "live.WindowTargetId",
                      providerConfig,
                      lives,
                    })
                  ),
                ]),
              })
            ),
          ]),
        })
      ),
    ]),
  getById: {
    pickId,
    method: "getMaintenanceWindowTask",
    decorate,
  },
  getList: ({ client, endpoint, getById, config }) =>
    pipe([
      () =>
        client.getListWithParent({
          parent: { type: "MaintenanceWindow", group: "SSM" },
          pickKey: pipe([
            pick(["WindowId"]),
            tap(({ WindowId }) => {
              assert(WindowId);
            }),
          ]),
          method: "describeMaintenanceWindowTasks",
          getParam: "Tasks",
          config,
          decorate: () => pipe([getById({})]),
        }),
    ])(),
  create: {
    method: "registerTaskWithMaintenanceWindow",
    filterPayload: pipe([stringifyJson]),
    pickCreated: ({ payload }) =>
      pipe([defaultsDeep({ WindowId: payload.WindowId })]),
  },
  update: {
    method: "updateMaintenanceWindowTask",
    filterParams: ({ payload, diff, live }) =>
      pipe([() => payload, defaultsDeep(pickId(live)), stringifyJson])(),
  },
  destroy: { method: "deregisterTaskFromMaintenanceWindow", pickId },
  getByName:
    ({ getById, endpoint }) =>
    ({ name, lives, config, resolvedDependencies: { maintenanceWindow } }) =>
      pipe([
        () => ({
          WindowId: maintenanceWindow.live.WindowId,
        }),
        endpoint().describeMaintenanceWindowTasks,
        get("Tasks"),
        find(
          eq(get("Name"), pipe([() => name, callProp("split", "::"), last])())
        ),
      ])(),
  configDefault: ({
    name,
    namespace,
    properties: { Tags, ...otherProps },
    dependencies: {
      document,
      iamRoleService,
      iamRoleSnsTopic,
      maintenanceWindow,
      lambdaFunction,
      sfnStateMachine,
      snsTopic,
    },
    config,
  }) =>
    pipe([
      () => otherProps,
      defaultsDeep({ WindowId: getField(maintenanceWindow, "WindowId") }),
      switchCase([
        () => document,
        defaultsDeep({ TaskArn: getField(document, "Arn") }),
        () => lambdaFunction,
        defaultsDeep({
          TaskArn: getField(lambdaFunction, "Configuration.FunctionArn"),
        }),
        () => sfnStateMachine,
        defaultsDeep({ TaskArn: getField(sfnStateMachine, "stateMachineArn") }),
        defaultsDeep({
          TaskArn: getField(lambdaFunction, "Configuration.FunctionArn"),
        }),
        identity,
      ]),
      when(
        () => iamRoleService,
        defaultsDeep({ ServiceRoleArn: getField(iamRoleService, "Arn") })
      ),
      when(
        () => snsTopic,
        defaultsDeep({
          TaskInvocationParameters: {
            RunCommand: {
              NotificationConfig: {
                NotificationArn: getField(snsTopic, "Attributes.TopicArn"),
              },
            },
          },
        })
      ),
      when(
        () => iamRoleSnsTopic,
        defaultsDeep({
          TaskInvocationParameters: {
            RunCommand: {
              ServiceRoleArn: getField(iamRoleSnsTopic, "Arn"),
            },
          },
        })
      ),
    ])(),
});
