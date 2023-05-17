const assert = require("assert");
const { pipe, tap, get, pick, map } = require("rubico");
const { defaultsDeep, when } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
const { buildTags } = require("../AwsCommon");
const { getField } = require("@grucloud/core/ProviderCommon");

const { Tagger, assignTags, ignoreErrorCodes } = require("./SageMakerCommon");

const buildArn = () =>
  pipe([
    get("JobDefinitionArn"),
    tap((arn) => {
      assert(arn);
    }),
  ]);

const pickId = pipe([
  tap(({ JobDefinitionName }) => {
    assert(JobDefinitionName);
  }),
  pick(["JobDefinitionName"]),
]);

const decorate = ({ endpoint, config }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
    assignTags({ buildArn: buildArn(config), endpoint }),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SageMaker.html
exports.SageMakerDataQualityJobDefinition = () => ({
  type: "DataQualityJobDefinition",
  package: "sagemaker",
  client: "SageMaker",
  propertiesDefault: {},
  omitProperties: [
    "DataQualityJobDefinitionArn",
    "CreationTime",
    "LastModifiedTime",
    "DataQualityJobOutputConfig.MonitoringOutputs.KmsKeyId",
    "JobResources.ClusterConfig.VolumeKmsKeyId",
    "NetworkConfig.VpcConfig.Subnets",
    "NetworkConfig.VpcConfig.SecurityGroupIds",
    "RoleArn",
  ],
  inferName: () =>
    pipe([
      get("JobDefinitionName"),
      tap((Name) => {
        assert(Name);
      }),
    ]),
  findName: () =>
    pipe([
      get("JobDefinitionName"),
      tap((name) => {
        assert(name);
      }),
    ]),
  findId: () =>
    pipe([
      get("JobDefinitionName"),
      tap((id) => {
        assert(id);
      }),
    ]),
  ignoreErrorCodes,
  dependencies: {
    kmsKey: {
      type: "Key",
      group: "KMS",
      excludeDefaultDependencies: true,
      dependencyId: ({ lives, config }) =>
        get("DataQualityJobOutputConfig.MonitoringOutputs.KmsKeyId"),
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
      dependencyId: ({ lives, config }) => get("RoleArn"),
    },
    // TODO SageMaker endpoint via data_quality_job_input
    // TOSO S3Bucket via data_quality_job_output_config monitoring_outputs s3_output
    subnets: {
      type: "Subnet",
      group: "EC2",
      list: true,
      dependencyIds: ({ lives, config }) =>
        get("NetworkConfig.VpcConfig.Subnets"),
    },
    securityGroups: {
      type: "SecurityGroup",
      group: "EC2",
      list: true,
      dependencyIds: ({ lives, config }) =>
        get("NetworkConfig.VpcConfig.SecurityGroupIds"),
    },
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SageMaker.html#describeDataQualityJobDefinition-property
  getById: {
    method: "describeDataQualityJobDefinition",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SageMaker.html#listDataQualityJobDefinitions-property
  getList: {
    method: "listDataQualityJobDefinitions",
    getParam: "JobDefinitionSummaries",
    decorate: ({ getById }) =>
      pipe([
        ({ MonitoringJobDefinitionName }) => ({
          JobDefinitionName: MonitoringJobDefinitionName,
        }),
        getById,
      ]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SageMaker.html#createDataQualityJobDefinition-property
  create: {
    method: "createDataQualityJobDefinition",
    pickCreated: ({ payload }) => pipe([() => payload]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SageMaker.html#updateDataQualityJobDefinition-property
  update: {
    method: "updateDataQualityJobDefinition",
    filterParams: ({ payload, diff, live }) => pipe([() => payload])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SageMaker.html#deleteDataQualityJobDefinition-property
  destroy: {
    method: "deleteDataQualityJobDefinition",
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
    dependencies: { iamRole, kmsKey, kmsKeyVolume, subnets, securityGroups },
    config,
  }) =>
    pipe([
      tap(() => {
        assert(iamRole);
      }),
      () => otherProps,
      defaultsDeep({
        Tags: buildTags({ name, config, namespace, UserTags: Tags }),
        RoleArn: getField(iamRole, "Arn"),
      }),
      when(
        () => kmsKey,
        defaultsDeep({
          DataQualityJobOutputConfig: {
            MonitoringOutputs: { KmsKeyId: getField(kmsKey, "Arn") },
          },
        })
      ),
      when(
        () => kmsKeyVolume,
        defaultsDeep({
          JobResources: {
            ClusterConfig: { VolumeKmsKeyId: getField(kmsKeyVolume, "Arn") },
          },
        })
      ),
      when(
        () => subnets,
        defaultsDeep({
          NetworkConfig: {
            VpcConfig: {
              Subnets: pipe([
                () => subnets,
                map((subnet) => getField(subnet, "SubnetId")),
              ])(),
            },
          },
        })
      ),
      when(
        () => securityGroups,
        defaultsDeep({
          NetworkConfig: {
            VpcConfig: {
              SecurityGroupIds: pipe([
                () => securityGroups,
                map((securityGroup) => getField(securityGroup, "GroupId")),
              ])(),
            },
          },
        })
      ),
    ])(),
});
