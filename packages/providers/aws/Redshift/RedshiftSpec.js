const assert = require("assert");
const { tap, pipe, map, get, eq, omit } = require("rubico");
const { defaultsDeep, pluck, find } = require("rubico/x");

const { compareAws } = require("../AwsCommon");

const GROUP = "Redshift";
const tagsKey = "Tags";
const compare = compareAws({ tagsKey, key: "Key" });
const { RedshiftCluster } = require("./RedshiftCluster");
const {
  RedshiftClusterParameterGroup,
} = require("./RedshiftClusterParameterGroup");

const { RedshiftClusterSubnetGroup } = require("./RedshiftClusterSubnetGroup");

const environmentVariables = [
  { path: "MasterUserPassword", suffix: "MASTER_USER_PASSWORD" },
];

module.exports = pipe([
  () => [
    {
      type: "Cluster",
      Client: RedshiftCluster,
      environmentVariables,
      propertiesDefault: {
        AvailabilityZoneRelocationStatus: "disabled",
        PreferredMaintenanceWindow: "wed:04:30-wed:05:00",
        DBName: "dev",
        MasterUsername: "awsuser",
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
        "ClusterParameterGroups[].ParameterApplyStatus",
        "ResizeInfo",
        "VpcSecurityGroupIds", //TODO
        "TotalStorageCapacityInMegaBytes",
      ],
      inferName: () => get("ClusterIdentifier"),
      dependencies: {
        clusterSubnetGroup: {
          type: "ClusterSubnetGroup",
          group: GROUP,
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
            pipe([
              get("ClusterSecurityGroups"),
              pluck("ClusterSecurityGroupName"),
            ]),
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
                  () =>
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
    },
    {
      type: "ClusterParameterGroup",
      Client: RedshiftClusterParameterGroup,
      omitProperties: [],
      inferName: () => get("ParameterGroupName"),
    },
    {
      type: "ClusterSubnetGroup",
      Client: RedshiftClusterSubnetGroup,
      omitProperties: ["VpcId", "SubnetGroupStatus", "Subnets", "SubnetIds"],
      inferName: () => get("ClusterSubnetGroupName"),
      dependencies: {
        subnets: {
          type: "Subnet",
          group: "EC2",
          list: true,
          dependencyIds: ({ lives, config }) =>
            pipe([get("Subnets"), pluck("SubnetIdentifier")]),
        },
      },
    },
  ],
  map(
    defaultsDeep({
      group: GROUP,
      compare: compare({}),
      tagsKey,
    })
  ),
]);
