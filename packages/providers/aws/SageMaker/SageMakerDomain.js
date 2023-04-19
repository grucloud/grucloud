const assert = require("assert");
const { pipe, tap, get, pick } = require("rubico");
const { defaultsDeep, isIn, identity } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
const { buildTags } = require("../AwsCommon");

const {
  Tagger,
  assignTags,
  ignoreErrorCodes,
  arnToId,
} = require("./SageMakerCommon");
const { getField } = require("@grucloud/core/ProviderCommon");

const buildArn = () =>
  pipe([
    get("DomainArn"),
    tap((arn) => {
      assert(arn);
    }),
  ]);

const pickId = pipe([
  tap(({ DomainId }) => {
    assert(DomainId);
  }),
  pick(["DomainId"]),
]);

const decorate = ({ endpoint, config }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
    assignTags({ buildArn: buildArn(config), endpoint }),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SageMaker.html
exports.SageMakerDomain = () => ({
  type: "Domain",
  package: "sagemaker",
  client: "SageMaker",
  propertiesDefault: {},
  omitProperties: [
    "DomainArn",
    "DomainId",
    "Status",
    "FailureReason",
    "CreationTime",
    "LastModifiedTime",
    "Url",
    "HomeEfsFileSystemId",
    "SingleSignOnManagedApplicationInstanceId",
    "SubnetIds",
    "VpcId",
    "KmsKeyId",
    // DefaultUserSettings
    "DefaultUserSettings.ExecutionRole",
    "DefaultUserSettings.SecurityGroups",
    "DefaultUserSettings.CanvasAppSettings.TimeSeriesForecastingSettings.AmazonForecastRoleArn",
    // DefaultUserSettings.KernelGatewayAppSettings
    "DefaultUserSettings.KernelGatewayAppSettings.LifecycleConfigArns",
    "DefaultUserSettings.KernelGatewayAppSettings.DefaultResourceSpec.SageMakerImageArn",
    "DefaultUserSettings.KernelGatewayAppSettings.DefaultResourceSpec.SageMakerImageVersionArn",
    "DefaultUserSettings.KernelGatewayAppSettings.DefaultResourceSpec.LifecycleConfigArn",
    "DefaultUserSettings.KernelGatewayAppSettings.CustomImages",
    // DefaultUserSettings.JupyterServerAppSettings
    "DefaultUserSettings.JupyterServerAppSettings.DefaultResourceSpec.SageMakerImageArn",
    "DefaultUserSettings.JupyterServerAppSettings.DefaultResourceSpec.SageMakerImageVersionArn",
    "DefaultUserSettings.JupyterServerAppSettings.DefaultResourceSpec.LifecycleConfigArn",
    "DefaultUserSettings.JupyterServerAppSettings.CustomImages",
    "DefaultUserSettings.JupyterServerAppSettings.LifecycleConfigArns",
    // DefaultUserSettings.RSessionAppSettings
    "DefaultUserSettings.RSessionAppSettings.DefaultResourceSpec.SageMakerImageArn",
    "DefaultUserSettings.RSessionAppSettings.DefaultResourceSpec.SageMakerImageVersionArn",
    "DefaultUserSettings.RSessionAppSettings.DefaultResourceSpec.LifecycleConfigArn",
    "DefaultUserSettings.RSessionAppSettings.CustomImages",
    // DefaultUserSettings.RStudioServerProAppSettings
    "DefaultUserSettings.RStudioServerProAppSettings.AccessStatus",
    // DefaultUserSettings.SharingSettings
    "DefaultUserSettings.SharingSettings.S3KmsKeyId",
    // DefaultUserSettings.TensorBoardAppSettings
    "DefaultUserSettings.TensorBoardAppSettings.DefaultResourceSpec.SageMakerImageArn",
    "DefaultUserSettings.TensorBoardAppSettings.DefaultResourceSpec.SageMakerImageVersionArn",
    "DefaultUserSettings.TensorBoardAppSettings.DefaultResourceSpec.LifecycleConfigArn",

    //DomainSettings
    "DomainSettings.SecurityGroupIds",
    "DomainSettings.RStudioServerProDomainSettings.DomainExecutionRoleArn",
    "DomainSettings.RStudioServerProDomainSettings.RStudioConnectUrl",
    "DomainSettings.RStudioServerProDomainSettings.RStudioPackageManagerUrl",
    "DomainSettings.RStudioServerProDomainSettings.DefaultResourceSpec.SageMakerImageArn",
    "DomainSettings.RStudioServerProDomainSettings.DefaultResourceSpec.SageMakerImageVersionArn",
    "DomainSettings.RStudioServerProDomainSettings.DefaultResourceSpec.LifecycleConfigArn",

    //DefaultSpaceSettings
    "DefaultSpaceSettings.ExecutionRole",
    "DefaultSpaceSettings.SecurityGroups",
    //DefaultSpaceSettings.KernelGatewayAppSettings
    "DefaultSpaceSettings.KernelGatewayAppSettings.DefaultResourceSpec.SageMakerImageArn",
    "DefaultSpaceSettings.KernelGatewayAppSettings.DefaultResourceSpec.SageMakerImageVersionArn",
    "DefaultSpaceSettings.KernelGatewayAppSettings.DefaultResourceSpec.LifecycleConfigArn",
    "DefaultSpaceSettings.KernelGatewayAppSettings.LifecycleConfigArns",
    //DefaultSpaceSettings.JupyterServerAppSettings
    "DefaultSpaceSettings.JupyterServerAppSettings.DefaultResourceSpec.SageMakerImageArn",
    "DefaultSpaceSettings.JupyterServerAppSettings.DefaultResourceSpec.SageMakerImageVersionArn",
    "DefaultSpaceSettings.JupyterServerAppSettings.DefaultResourceSpec.LifecycleConfigArn",
    "DefaultSpaceSettings.JupyterServerAppSettings.LifecycleConfigArns",
  ],
  inferName: () =>
    pipe([
      get("DomainName"),
      tap((Name) => {
        assert(Name);
      }),
    ]),
  findName: () =>
    pipe([
      get("DomainName"),
      tap((name) => {
        assert(name);
      }),
    ]),
  findId: () =>
    pipe([
      get("DomainId"),
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
      dependencyId: ({ lives, config }) => get("KmsKeyId"),
    },
    subnets: {
      type: "Subnet",
      group: "EC2",
      list: true,
      dependencyIds: ({ lives, config }) => get("SubnetIds"),
    },
    executionRoleUser: {
      type: "Role",
      group: "IAM",
      dependencyId: ({ lives, config }) =>
        get("DefaultUserSettings.ExecutionRole"),
    },
    securityGroupsUser: {
      type: "SecurityGroup",
      group: "EC2",
      list: true,
      dependencyIds: ({ lives, config }) =>
        get("DefaultUserSettings.SecurityGroups"),
    },
    executionRoleSpace: {
      type: "Role",
      group: "IAM",
      dependencyId: ({ lives, config }) =>
        get("DefaultSpaceSettings.ExecutionRole"),
    },
    securityGroupsSpace: {
      type: "SecurityGroup",
      group: "EC2",
      list: true,
      dependencyIds: ({ lives, config }) =>
        get("DefaultSpaceSettings.SecurityGroups"),
    },
    securityGroups: {
      type: "SecurityGroup",
      group: "EC2",
      list: true,
      dependencyIds: ({ lives, config }) =>
        get("DomainSettings.SecurityGroupIds"),
    },
    vpc: {
      type: "Vpc",
      group: "EC2",
      dependencyId: ({ lives, config }) => get("VpcId"),
    },
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SageMaker.html#describeDomain-property
  getById: {
    method: "describeDomain",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SageMaker.html#listDomains-property
  getList: {
    method: "listDomains",
    getParam: "Domains",
    decorate: ({ getById }) => pipe([getById]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SageMaker.html#createDomain-property
  create: {
    method: "createDomain",
    pickCreated: ({ payload }) => pipe([arnToId("domain")]),
    isInstanceUp: pipe([get("Status"), isIn(["InService"])]),
    isInstanceError: pipe([get("Status"), isIn(["Failed"])]),
    getErrorMessage: pipe([get("FailureReason", "Failed")]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SageMaker.html#updateDomain-property
  update: {
    method: "updateDomain",
    filterParams: ({ payload, diff, live }) =>
      pipe([() => payload, defaultsDeep(pickId(live))])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SageMaker.html#deleteDomain-property
  destroy: {
    method: "deleteDomain",
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
    dependencies: {
      executionRoleUser,
      executionRoleSpace,
      kmsKey,
      vpc,
      subnets,
      securityGroups,
      securityGroupsUser,
      securityGroupsSpace,
    },
    config,
  }) =>
    pipe([
      tap(() => {
        assert(vpc);
      }),
      () => otherProps,
      defaultsDeep({
        Tags: buildTags({ name, config, namespace, UserTags: Tags }),
        VpcId: getField(vpc, "VpcId"),
      }),
      when(
        () => kmsKey,
        defaultsDeep({
          KmsKeyId: getField(kmsKey, "Arn"),
        })
      ),
      when(
        () => executionRoleUser,
        defaultsDeep({
          DefaultUserSettings: {
            ExecutionRole: getField(executionRoleUser, "Arn"),
          },
        })
      ),
      when(
        () => securityGroupsUser,
        defaultsDeep({
          DefaultUserSettings: {
            SecurityGroups: pipe([
              () => securityGroupsUser,
              map((securityGroup) => getField(securityGroup, "GroupId")),
            ])(),
          },
        })
      ),
      when(
        () => executionRoleSpace,
        defaultsDeep({
          DefaultSpaceSettings: {
            ExecutionRole: getField(executionRoleSpace, "Arn"),
          },
        })
      ),
      when(
        () => securityGroupsSpace,
        defaultsDeep({
          DefaultSpaceSettings: {
            SecurityGroups: pipe([
              () => securityGroupsSpace,
              map((securityGroup) => getField(securityGroup, "GroupId")),
            ])(),
          },
        })
      ),
      when(
        () => subnets,
        defaultsDeep({
          SubnetIds: pipe([
            () => subnets,
            map((subnet) => getField(subnet, "SubnetId")),
          ])(),
        })
      ),
      when(
        () => securityGroups,
        defaultsDeep({
          DomainSettings: {
            SecurityGroupIds: pipe([
              () => securityGroups,
              map((securityGroup) => getField(securityGroup, "GroupId")),
            ])(),
          },
        })
      ),
    ])(),
});
