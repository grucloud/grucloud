const assert = require("assert");
const { pipe, tap, get, pick } = require("rubico");
const { defaultsDeep, isIn } = require("rubico/x");

const { getField } = require("@grucloud/core/ProviderCommon");
const { getByNameCore } = require("@grucloud/core/Common");
const { buildTags } = require("../AwsCommon");

const { Tagger, assignTags, ignoreErrorCodes } = require("./SageMakerCommon");

const buildArn = () =>
  pipe([
    get("MonitoringScheduleArn"),
    tap((arn) => {
      assert(arn);
    }),
  ]);

const pickId = pipe([
  tap(({ MonitoringScheduleName }) => {
    assert(MonitoringScheduleName);
  }),
  pick(["MonitoringScheduleName"]),
]);

const decorate = ({ endpoint, config }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
    assignTags({ buildArn: buildArn(config), endpoint }),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SageMaker.html
exports.SageMakerMonitoringSchedule = () => ({
  type: "MonitoringSchedule",
  package: "sagemaker",
  client: "SageMaker",
  propertiesDefault: {},
  omitProperties: [
    "MonitoringScheduleArn",
    "CreationTime",
    "LastModifiedTime",
    "MonitoringScheduleStatus",
    "FailureReason",
    "LastMonitoringExecutionSummary",
  ],
  inferName: () =>
    pipe([
      get("MonitoringScheduleName"),
      tap((Name) => {
        assert(Name);
      }),
    ]),
  findName: () =>
    pipe([
      get("MonitoringScheduleName"),
      tap((name) => {
        assert(name);
      }),
    ]),
  findId: () =>
    pipe([
      get("MonitoringScheduleArn"),
      tap((id) => {
        assert(id);
      }),
    ]),
  ignoreErrorCodes,
  dependencies: {
    jobDefinition: {
      type: "DataQualityJobDefinition",
      group: "SageMaker",
      dependencyId: ({ lives, config }) =>
        get("MonitoringScheduleConfig.MonitoringJobDefinitionName"),
    },
    endpoint: {
      type: "Endpoint",
      group: "SageMaker",
      dependencyId: ({ lives, config }) => get("EndpointName"),
    },
    kmsKey: {
      type: "Key",
      group: "KMS",
      excludeDefaultDependencies: true,
      dependencyId: ({ lives, config }) =>
        get(
          "MonitoringScheduleConfig.MonitoringJobDefinition.MonitoringOutputConfig.KmsKeyId"
        ),
    },
    kmsKeyVolume: {
      type: "Key",
      group: "KMS",
      excludeDefaultDependencies: true,
      dependencyId: ({ lives, config }) =>
        get("JobResources.ClusterConfig.VolumeKmsKeyId"),
    },
    iamRole: {
      type: "Role",
      group: "IAM",
      dependencyId: ({ lives, config }) =>
        get("MonitoringScheduleConfig.MonitoringJobDefinition.RoleArn"),
    },
    subnets: {
      type: "Subnet",
      group: "EC2",
      list: true,
      dependencyIds: ({ lives, config }) =>
        get(
          "MonitoringScheduleConfig.MonitoringJobDefinition.NetworkConfig.VpcConfig.Subnets"
        ),
    },
    securityGroups: {
      type: "SecurityGroup",
      group: "EC2",
      list: true,
      dependencyIds: ({ lives, config }) =>
        get(
          "MonitoringScheduleConfig.MonitoringJobDefinition.NetworkConfig.VpcConfig.SecurityGroupIds"
        ),
    },
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SageMaker.html#describeMonitoringSchedule-property
  getById: {
    method: "describeMonitoringSchedule",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SageMaker.html#listMonitoringSchedules-property
  getList: {
    method: "listMonitoringSchedules",
    getParam: "MonitoringScheduleSummaries",
    decorate: ({ getById }) => pipe([getById]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SageMaker.html#createMonitoringSchedule-property
  create: {
    method: "createMonitoringSchedule",
    pickCreated: ({ payload }) => pipe([() => payload]),
    isInstanceUp: pipe([get("MonitoringScheduleStatus"), isIn(["Scheduled"])]),
    isInstanceError: pipe([get("MonitoringScheduleStatus"), isIn(["Failed"])]),
    getErrorMessage: pipe([get("FailureReason", "Failed")]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SageMaker.html#updateMonitoringSchedule-property
  update: {
    method: "updateMonitoringSchedule",
    filterParams: ({ payload, diff, live }) => pipe([() => payload])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SageMaker.html#deleteMonitoringSchedule-property
  destroy: {
    method: "deleteMonitoringSchedule",
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
    dependencies: { iamRole, kmsKey },
    config,
  }) =>
    pipe([
      () => otherProps,
      defaultsDeep({
        Tags: buildTags({ name, config, namespace, UserTags: Tags }),
        MonitoringScheduleConfig: {
          MonitoringJobDefinition: getField(iamRole, "Arn"),
        },
      }),
      when(
        () => kmsKey,
        defaultsDeep({
          MonitoringScheduleConfig: {
            MonitoringJobDefinition: {
              MonitoringOutputConfig: { KmsKeyId: getField(kmsKey, "Arn") },
            },
          },
        })
      ),
      when(
        () => subnets,
        defaultsDeep({
          MonitoringScheduleConfig: {
            MonitoringJobDefinition: {
              NetworkConfig: {
                VpcConfig: {
                  Subnets: pipe([
                    () => subnets,
                    map((subnet) => getField(subnet, "SubnetId")),
                  ])(),
                },
              },
            },
          },
        })
      ),
      when(
        () => securityGroups,
        defaultsDeep({
          MonitoringScheduleConfig: {
            MonitoringJobDefinition: {
              NetworkConfig: {
                VpcConfig: {
                  SecurityGroupIds: pipe([
                    () => securityGroups,
                    map((securityGroup) => getField(securityGroup, "GroupId")),
                  ])(),
                },
              },
            },
          },
        })
      ),
    ])(),
});
