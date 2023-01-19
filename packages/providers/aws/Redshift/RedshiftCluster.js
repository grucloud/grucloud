const assert = require("assert");
const { pipe, tap, get, pick, eq, map, assign, or, omit } = require("rubico");
const { defaultsDeep, when, first, pluck, find } = require("rubico/x");

const { getField } = require("@grucloud/core/ProviderCommon");

const { buildTags } = require("../AwsCommon");

const { Tagger } = require("./RedshiftCommon");

const pickId = pipe([pick(["ClusterIdentifier"])]);

const environmentVariables = [
  { path: "MasterUserPassword", suffix: "MASTER_USER_PASSWORD" },
];

// arn:aws:redshift:us-east-2:123456789:cluster:t1
const buildArn = ({ accountId, region }) =>
  pipe([
    tap(({ ClusterIdentifier }) => {
      assert(ClusterIdentifier);
      assert(region);
    }),
    ({ ClusterIdentifier }) =>
      `arn:aws:redshift:${region}:${accountId()}:cluster:${ClusterIdentifier}`,
  ]);

const decorate = ({ endpoint, config }) =>
  pipe([
    tap((params) => {
      assert(config);
    }),
    assign({ Arn: pipe([buildArn(config)]) }),
    when(
      eq(get("NumberOfNodes"), 1),
      pipe([
        omit(["NumberOfNodes"]),
        defaultsDeep({ ClusterType: "single-node" }),
      ])
    ),
    ({ AvailabilityZoneRelocationStatus, ...other }) => ({
      AvailabilityZoneRelocation:
        AvailabilityZoneRelocationStatus == "enabled" ? true : false,
      ...other,
    }),
  ]);

exports.RedshiftCluster = ({ compare }) => ({
  type: "Cluster",
  package: "redshift",
  client: "Redshift",
  ignoreErrorCodes: ["ClusterNotFound", "ClusterNotFoundFault"],
  findName: () => pipe([get("ClusterIdentifier")]),
  findId: () => pipe([get("ClusterIdentifier")]),
  environmentVariables,
  propertiesDefault: {
    AvailabilityZoneRelocation: false,
    PreferredMaintenanceWindow: "wed:04:30-wed:05:00",
    AutomatedSnapshotRetentionPeriod: 1,
    ManualSnapshotRetentionPeriod: -1,
    DeferredMaintenanceWindows: [],
    MaintenanceTrackName: "current",
    IamRoles: [],
    Encrypted: false,
    PubliclyAccessible: false,
    AllowVersionUpgrade: true,
  },
  compare: compare({ filterTarget: () => omit(["MasterUserPassword"]) }),
  omitProperties: [
    "Arn",
    "ElasticResizeNumberOfNodeOptions",
    "ClusterStatus",
    "ClusterAvailabilityStatus",
    "ModifyStatus",
    "Endpoint",
    "ClusterCreateTime",
    "ClusterSecurityGroups",
    "VpcSecurityGroups",
    "KmsKeyId",
    "PendingModifiedValues",
    "RestoreStatus",
    "DataTransferProgress",
    "HsmStatus",
    "ClusterSnapshotCopyStatus",
    "ClusterPublicKey",
    "ClusterNodes",
    "PendingActions",
    "SnapshotScheduleIdentifier",
    "SnapshotScheduleState",
    "ClusterNamespaceArn",
    "AquaConfiguration",
    "DefaultIamRoleArn",
    "ReservedNodeExchangeStatus",
    "VpcId",
    "AvailabilityZone",
    "ClusterVersion",
    "ClusterRevisionNumber",
    "NextMaintenanceWindowStartTime",
    // TODO remove all ClusterParameterGroups ?
    "ClusterParameterGroups[].ParameterApplyStatus",
    "ResizeInfo",
    "VpcSecurityGroupIds", //TODO
    "TotalStorageCapacityInMegaBytes",
  ],
  inferName: () => get("ClusterIdentifier"),
  dependencies: {
    clusterSubnetGroup: {
      type: "ClusterSubnetGroup",
      group: "Redshift",
      excludeDefaultDependencies: true,
      dependencyId: ({ lives, config }) => get("ClusterSubnetGroupName"),
    },
    clusterParameterGroups: {
      type: "ClusterParameterGroup",
      group: "Redshift",
      list: true,
      dependencyIds: ({ lives, config }) =>
        pipe([get("ClusterParameterGroups"), pluck("ParameterGroupName")]),
    },
    clusterSecurityGroups: {
      type: "SecurityGroup",
      group: "EC2",
      list: true,
      dependencyIds: ({ lives, config }) =>
        pipe([get("ClusterSecurityGroups"), pluck("ClusterSecurityGroupName")]),
    },
    elasticIp: {
      type: "ElasticIpAddress",
      group: "EC2",
      dependencyId: ({ lives, config }) =>
        pipe([
          tap((params) => {
            assert(true);
          }),
          get("ElasticIpStatus.ElasticIp"),
          (ElasticIp) =>
            pipe([
              lives.getByType({
                type: "ElasticIpAddress",
                group: "EC2",
                providerName: config.providerName,
              }),
              find(eq(get("live.PublicIp"), ElasticIp)),
              get("id"),
            ])(),
        ]),
    },
    iamRoles: {
      type: "Role",
      group: "IAM",
      list: true,
      dependencyIds: ({ lives, config }) =>
        pipe([get("IamRoles"), pluck("IamRoleArn")]),
    },
    kmsKey: {
      type: "Key",
      group: "KMS",
      dependencyId: ({ lives, config }) => get("KmsKeyId"),
    },
    vpcSecurityGroups: {
      type: "SecurityGroup",
      group: "EC2",
      list: true,
      dependencyIds: ({ lives, config }) =>
        pipe([get("VpcSecurityGroups"), pluck("VpcSecurityGroupId")]),
    },
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Redshift.html#describeClusters-property
  getById: {
    method: "describeClusters",
    getField: "Clusters",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Redshift.html#describeClusters-property
  getList: {
    method: "describeClusters",
    getParam: "Clusters",
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Redshift.html#createCluster-property
  create: {
    method: "createCluster",
    filterPayload: pipe([
      ({ ClusterParameterGroups, ...other }) => ({
        ClusterParameterGroupName: pipe([
          () => ClusterParameterGroups,
          first,
          get("ParameterGroupName"),
        ])(),
        ...other,
      }),
    ]),
    pickCreated: ({ payload }) => pipe([get("Cluster")]),
    isInstanceUp: pipe([eq(get("ClusterAvailabilityStatus"), "Available")]),
    isInstanceError: pipe([eq(get("ClusterAvailabilityStatus"), "Failed")]),
    getErrorMessage: get("ClusterAvailabilityStatus", "error"),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Redshift.html#deleteCluster-property
  destroy: {
    method: "deleteCluster",
    pickId,
    extraParam: { SkipFinalClusterSnapshot: true },
  },
  getByName: ({ getList, endpoint, getById }) =>
    pipe([
      ({ name }) => ({
        ClusterIdentifier: name,
      }),
      getById({}),
    ]),
  tagger: ({ config }) =>
    Tagger({
      buildArn: buildArn({ config }),
    }),
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Redshift.html#modifyCluster-property
  update:
    ({ endpoint }) =>
    async ({ pickId, payload, diff, live }) =>
      pipe([
        tap((params) => {
          assert(endpoint);
        }),
        () => diff,
        tap.if(
          or([
            get("liveDiff.updated.NumberOfNodes"),
            get("liveDiff.updated.NodeType"),
          ]),
          pipe([
            () => payload,
            pick([
              "NumberOfNodes",
              "NodeType",
              "ClusterIdentifier",
              "AvailabilityZoneRelocation",
            ]),
            endpoint().modifyCluster,
          ])
        ),
        tap.if(
          or([get("liveDiff.updated.AvailabilityZoneRelocation")]),
          pipe([
            () => payload,
            pick(["ClusterIdentifier", "AvailabilityZoneRelocation"]),
            endpoint().modifyCluster,
          ])
        ),
      ])(),
  configDefault: ({
    name,
    namespace,
    properties: { Tags, ...otherProps },
    dependencies: {
      clusterSubnetGroup,
      clusterParameterGroups,
      elasticIp,
      kmsKey,
      iamRoles,
      vpcSecurityGroups,
    },
    config,
  }) =>
    pipe([
      () => otherProps,
      defaultsDeep({
        Tags: buildTags({
          name,
          config,
          namespace,
          userTags: Tags,
        }),
      }),
      when(
        () => clusterParameterGroups,
        assign({
          ClusterParameterGroups: pipe([
            () => clusterParameterGroups,
            map((clusterParameterGroup) => ({
              ParameterGroupName: getField(
                clusterParameterGroup,
                "ParameterGroupName"
              ),
            })),
          ]),
        })
      ),
      when(
        () => clusterSubnetGroup,
        assign({
          ClusterSubnetGroupName: () =>
            clusterSubnetGroup.config.ClusterSubnetGroupName,
        })
      ),
      when(
        () => elasticIp,
        defaultsDeep({ ElasticIp: getField(elasticIp, "PublicIp") })
      ),
      when(() => kmsKey, defaultsDeep({ KmsKeyId: getField(kmsKey, "Arn") })),
      when(
        () => iamRoles,
        assign({
          IamRoles: pipe([
            () => iamRoles,
            map((role) => getField(role, "Arn")),
          ]),
        })
      ),
      when(
        () => vpcSecurityGroups,
        assign({
          VpcSecurityGroupIds: pipe([
            () => vpcSecurityGroups,
            map((sg) => getField(sg, "GroupId")),
          ]),
        })
      ),
    ])(),
});
