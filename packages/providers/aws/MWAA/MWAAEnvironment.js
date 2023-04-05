const assert = require("assert");
const { pipe, tap, get, pick, map, assign } = require("rubico");
const { defaultsDeep, isIn, callProp, when } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");
const { buildTagsObject } = require("@grucloud/core/Common");
const { replaceAccountAndRegion } = require("../AwsCommon");

const { Tagger } = require("./MWAACommon");

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

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/MWAA.html
exports.MWAAEnvironment = () => ({
  type: "Environment",
  package: "mwaa",
  client: "MWAA",
  propertiesDefault: {},
  omitProperties: [
    "Arn",
    "NetworkConfiguration",
    "CreatedAt",
    "ExecutionRoleArn",
    "LastUpdate",
    "KmsKey",
    "Status",
    "WebserverUrl",
    "LoggingConfiguration.DagProcessingLogs.CloudWatchLogGroupArn",
    "LoggingConfiguration.Scheduler.CloudWatchLogGroupArn",
    "LoggingConfiguration.TaskLogs.CloudWatchLogGroupArn",
    "LoggingConfiguration.WebserverLogs.CloudWatchLogGroupArn",
    "LoggingConfiguration.WorkerLogs.CloudWatchLogGroupArn",
    "WeeklyMaintenanceWindowStart",
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
  ignoreErrorCodes: ["ResourceNotFoundException"],
  dependencies: {
    cloudWatchLogGroupDagProcessing: {
      type: "LogGroup",
      group: "CloudWatchLogs",
      dependencyId: ({ lives, config }) =>
        get("LoggingConfiguration.DagProcessingLogs.CloudWatchLogGroupArn"),
    },
    cloudWatchLogGroupScheduler: {
      type: "LogGroup",
      group: "CloudWatchLogs",
      dependencyId: ({ lives, config }) =>
        get("LoggingConfiguration.Scheduler.CloudWatchLogGroupArn"),
    },
    cloudWatchLogGroupTask: {
      type: "LogGroup",
      group: "CloudWatchLogs",
      dependencyId: ({ lives, config }) =>
        get("LoggingConfiguration.TaskLogs.CloudWatchLogGroupArn"),
    },
    cloudWatchLogGroupWebserver: {
      type: "LogGroup",
      group: "CloudWatchLogs",
      dependencyId: ({ lives, config }) =>
        get("LoggingConfiguration.WebserverLogs.CloudWatchLogGroupArn"),
    },
    cloudWatchLogGroupWorker: {
      type: "LogGroup",
      group: "CloudWatchLogs",
      dependencyId: ({ lives, config }) =>
        get("LoggingConfiguration.WorkerLogs.CloudWatchLogGroupArn"),
    },
    iamRoleExecution: {
      type: "Role",
      group: "IAM",
      dependencyId: ({ lives, config }) => pipe([get("ExecutionRoleArn")]),
    },
    iamRoleService: {
      type: "Role",
      group: "IAM",
      dependencyId: ({ lives, config }) => pipe([get("ServiceRoleArn")]),
    },
    kmsKey: {
      type: "Key",
      group: "KMS",
      excludeDefaultDependencies: true,
      dependencyId: ({ lives, config }) => get("KmsKey"),
    },
    securityGroups: {
      type: "SecurityGroup",
      group: "EC2",
      list: true,
      dependencyIds: ({ lives, config }) =>
        pipe([get("NetworkConfiguration.SecurityGroupIds")]),
    },
    subnets: {
      type: "Subnet",
      group: "EC2",
      list: true,
      dependencyIds: ({ lives, config }) =>
        pipe([
          get("NetworkConfiguration.SubnetIds"),
          tap((ids) => {
            assert(ids);
          }),
        ]),
    },
    s3BucketSource: {
      type: "Bucket",
      group: "S3",
      dependencyId: ({ lives, config }) =>
        pipe([
          get("SourceBucketArn"),
          callProp("replace", "arn:aws:s3:::", ""),
        ]),
    },
  },
  filterLive: ({ lives, providerConfig }) =>
    pipe([
      assign({
        ServiceRoleArn: pipe([
          get("ServiceRoleArn"),
          replaceAccountAndRegion({
            providerConfig,
            lives,
          }),
        ]),
      }),
    ]),
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/MWAA.html#getEnvironment-property
  getById: {
    method: "getEnvironment",
    getField: "Environment",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/MWAA.html#listEnvironments-property
  getList: {
    method: "listEnvironments",
    getParam: "Environments",
    decorate: ({ getById }) => pipe([(Name) => ({ Name }), getById]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/MWAA.html#createEnvironment-property
  create: {
    method: "createEnvironment",
    pickCreated: ({ payload }) => pipe([() => payload]),
    isInstanceUp: pipe([get("Status"), isIn(["AVAILABLE"])]),
    isInstanceError: pipe([get("Status"), isIn(["CREATE_FAILED"])]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/MWAA.html#updateEnvironment-property
  update: {
    method: "updateEnvironment",
    filterParams: ({ payload, diff, live }) =>
      pipe([() => payload, defaultsDeep(pickId(live))])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/MWAA.html#deleteEnvironment-property
  destroy: {
    method: "deleteEnvironment",
    pickId,
    isInstanceUp: pipe([get("Status"), isIn(["DELETED"])]),
    shouldRetryOnExceptionMessages: [
      "Environments with CREATING status must complete previous operation before initiating a new operation",
      "Environments with DELETING status must complete previous operation before initiating a new operation",
    ],
    ignoreErrorMessages: ["Environments with DELETED status cannot be deleted"],
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
      cloudWatchLogGroupDagProcessing,
      cloudWatchLogGroupScheduler,
      cloudWatchLogGroupTask,
      cloudWatchLogGroupWebserver,
      cloudWatchLogGroupWorker,
      iamRoleExecution,
      kmsKey,
      securityGroups,
      subnets,
    },
    config,
  }) =>
    pipe([
      () => otherProps,
      defaultsDeep({
        Tags: buildTagsObject({ name, config, namespace, userTags: Tags }),
        ExecutionRoleArn: getField(iamRoleExecution, "Arn"),
        NetworkConfiguration: {
          SecurityGroupIds: pipe([
            () => securityGroups,
            map((securityGroup) => getField(securityGroup, "GroupId")),
          ])(),
          SubnetIds: pipe([
            () => subnets,
            map((subnet) => getField(subnet, "SubnetId")),
          ])(),
        },
      }),
      when(
        () => kmsKey,
        defaultsDeep({
          KmsKey: getField(kmsKey, "Arn"),
        })
      ),
    ])(),
});
