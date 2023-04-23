const assert = require("assert");
const { pipe, tap, get, eq, not, pick } = require("rubico");
const { defaultsDeep, when, identity, isIn } = require("rubico/x");

const { getField } = require("@grucloud/core/ProviderCommon");

const { getByNameCore, omitIfEmpty } = require("@grucloud/core/Common");

const { Tagger } = require("./EMRCommon");
const { buildTags } = require("../AwsCommon");

const isInstanceDown = pipe([
  get("Status.State"),
  isIn(["TERMINATED", "TERMINATED_WITH_ERRORS"]),
]);

const pickId = pipe([
  pick(["ClusterId"]),
  tap(({ ClusterId }) => {
    assert(ClusterId);
  }),
]);

const buildArn = () =>
  pipe([
    get("ClusterId"),
    tap((arn) => {
      assert(arn);
    }),
  ]);

const toClusterId = pipe([
  ({ Id, ...other }) => ({ ClusterId: Id, ...other }),
  tap(({ ClusterId }) => {
    assert(ClusterId);
  }),
]);

const decorate = ({ endpoint }) =>
  pipe([
    toClusterId,
    when(
      get("Ec2InstanceAttributes"),
      ({ Ec2InstanceAttributes, ...other }) => ({
        Instances: Ec2InstanceAttributes,
        ...other,
      })
    ),
    ({ PlacementGroups, ...other }) => ({
      PlacementGroupConfigs: PlacementGroups,
      ...other,
    }),
    omitIfEmpty([
      "Instances.AdditionalMasterSecurityGroups",
      "Instances.AdditionalSlaveSecurityGroups",
      "PlacementGroupConfigs",
      "KerberosAttributes",
      "Configurations",
    ]),
  ]);

exports.EMRCluster = ({}) => ({
  type: "Cluster",
  package: "emr",
  client: "EMR",
  inferName: () =>
    pipe([
      get("Name"),
      tap((Name) => {
        assert(Name);
      }),
    ]),
  findName: () => pipe([get("Name")]),
  findId: () => pipe([get("ClusterId")]),
  ignoreErrorCodes: [
    "ResourceNotFoundException",
    "ValidationException",
    "InvalidRequestException",
  ],
  omitProperties: [
    "ClusterId",
    "Status",
    "Timeline",
    "ClusterArn",
    "OutpostArn",
    "NormalizedInstanceHours",
    "LogUri",
    "LogEncryptionKmsKeyId",
    "RequestedAmiVersion",
    "RunningAmiVersion",
    "ServiceRole",
    "Instances.EmrManagedMasterSecurityGroup",
    "Instances.EmrManagedSlaveSecurityGroup",
    "Instances.Ec2SubnetId",
    "Instances.ServiceAccessSecurityGroup",
  ],
  propertiesDefault: {},
  dependencies: {
    ec2KeyPair: {
      type: "KeyPair",
      group: "EC2",
      dependencyId: ({ lives, config }) =>
        pipe([
          get("Instances.Ec2KeyName"),
          lives.getByName({
            type: "KeyPair",
            group: "EC2",
            providerName: config.providerName,
          }),
          get("id"),
        ]),
    },
    iamInstanceProfile: {
      type: "InstanceProfile",
      group: "IAM",
      dependencyId: ({ lives, config }) =>
        pipe([
          get("Instances.IamInstanceProfile"),
          lives.getByName({
            type: "InstanceProfile",
            group: "IAM",
            providerName: config.providerName,
          }),
          get("id"),
        ]),
    },
    iamAutoScalingRole: {
      type: "Role",
      group: "IAM",
      dependencyId: ({ lives, config }) => pipe([get("AutoScalingRole")]),
    },
    iamJobFlowRole: {
      type: "Role",
      group: "IAM",
      dependencyId: ({ lives, config }) => pipe([get("JobFlowRole")]),
    },
    iamServiceRole: {
      type: "Role",
      group: "IAM",
      dependencyId: ({ lives, config }) => pipe([get("ServiceRole")]),
    },
    kmsKey: {
      type: "Key",
      group: "KMS",
      excludeDefaultDependencies: true,
      dependencyId: ({ lives, config }) => get("LogEncryptionKmsKeyId"),
    },
    securityGroupMaster: {
      type: "SecurityGroup",
      group: "EC2",
      dependencyId: ({ lives, config }) =>
        get("Instances.EmrManagedMasterSecurityGroup"),
    },
    securityGroupSlave: {
      type: "SecurityGroup",
      group: "EC2",
      dependencyId: ({ lives, config }) =>
        get("Instances.EmrManagedSlaveSecurityGroup"),
    },
    securityGroupServiceAccess: {
      type: "SecurityGroup",
      group: "EC2",
      dependencyId: ({ lives, config }) =>
        get("Instances.ServiceAccessSecurityGroup"),
    },
    subnet: {
      type: "Subnet",
      group: "EC2",
      dependencyId: ({ lives, config }) => get("Instances.Ec2SubnetId"),
    },
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EMR.html#describeCluster-property
  getById: {
    method: "describeCluster",
    getField: "Cluster",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EMR.html#listClusters-property
  getList: {
    method: "listClusters",
    getParam: "Clusters",
    filterResource: not(isInstanceDown),
    decorate: ({ getById }) => pipe([toClusterId, getById]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EMR.html#runJobFlow-property
  create: {
    method: "runJobFlow",
    pickCreated: ({ payload }) => pipe([identity]),
    isInstanceUp: pipe([eq(get("Status.State"), "RUNNING")]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EMR.html#modifyCluster-property
  update: {
    method: "modifyCluster",
    filterParams: ({ payload, live }) =>
      pipe([() => payload, defaultsDeep(pickId(live))])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EMR.html#terminateJobFlows-property
  destroy: {
    method: "terminateJobFlows",
    pickId: pipe([
      tap(({ ClusterId }) => {
        assert(ClusterId);
      }),
      ({ ClusterId }) => ({ JobFlowIds: [ClusterId] }),
    ]),
    isInstanceDown,
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
      iamAutoScalingRole,
      iamJobFlowRole,
      iamServiceRole,
      kmsKey,
      subnet,
      securityGroupMaster,
      securityGroupSlave,
      securityGroupServiceAccess,
    },
    config,
  }) =>
    pipe([
      tap(() => {
        assert(iamServiceRole);
      }),
      () => otherProps,
      defaultsDeep({
        ServiceRole: getField(iamServiceRole, "Arn"),
        Tags: buildTags({
          name,
          config,
          namespace,
          UserTags: Tags,
        }),
      }),
      when(
        () => iamJobFlowRole,
        defaultsDeep({
          JobFlowRole: getField(iamJobFlowRole, "Arn"),
        })
      ),
      when(
        () => iamAutoScalingRole,
        defaultsDeep({
          AutoScalingRole: getField(iamAutoScalingRole, "Arn"),
        })
      ),
      when(
        () => kmsKey,
        defaultsDeep({
          LogEncryptionKmsKeyId: getField(kmsKey, "Arn"),
        })
      ),
      when(
        () => subnet,
        defaultsDeep({
          Instances: {
            Ec2SubnetId: getField(subnet, "SubnetId"),
          },
        })
      ),
      when(
        () => securityGroupMaster,
        defaultsDeep({
          Instances: {
            EmrManagedMasterSecurityGroup: getField(
              securityGroupMaster,
              "GroupId"
            ),
          },
        })
      ),
      when(
        () => securityGroupSlave,
        defaultsDeep({
          Instances: {
            EmrManagedSlaveSecurityGroup: getField(
              securityGroupSlave,
              "GroupId"
            ),
          },
        })
      ),
      when(
        () => securityGroupServiceAccess,
        defaultsDeep({
          Instances: {
            ServiceAccessSecurityGroup: getField(
              securityGroupServiceAccess,
              "GroupId"
            ),
          },
        })
      ),
    ])(),
});
