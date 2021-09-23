const assert = require("assert");
const { pipe, assign, map, omit, tap, get } = require("rubico");
const { defaultsDeep } = require("rubico/x");
const { compare } = require("@grucloud/core/Common");

const { isOurMinionFactory, isOurMinion } = require("../AwsCommon");
const { DBCluster } = require("./DBCluster");
const { DBInstance } = require("./DBInstance");
const { DBSubnetGroup } = require("./DBSubnetGroup");

const GROUP = "RDS";

module.exports = () =>
  map(assign({ group: () => GROUP }))([
    {
      type: "DBSubnetGroup",
      dependsOn: ["EC2::Subnet"],
      Client: DBSubnetGroup,
      isOurMinion,
      compare: compare({
        filterAll: pipe([omit(["Tags"])]),
        filterTarget: pipe([omit(["SubnetIds"])]),
        filterLive: pipe([
          omit(["VpcId", "SubnetGroupStatus", "Subnets", "DBSubnetGroupArn"]),
        ]),
      }),
    },
    {
      type: "DBCluster",
      dependsOn: ["RDS::DBSubnetGroup", "EC2::SecurityGroup", "KMS::Key"],
      Client: DBCluster,
      isOurMinion: isOurMinionFactory({ tags: "TagList" }),
      compare: compare({
        filterAll: pipe([omit(["SubnetIds", "Tags"])]),
        filterTarget: pipe([
          omit([
            "VpcSecurityGroupIds",
            "MasterUserPassword",
            "DBSubnetGroupName",
          ]),
          defaultsDeep({
            AllocatedStorage: 1,
            BackupRetentionPeriod: 1,
            MultiAZ: false,
            Port: 5432,
            StorageEncrypted: true,
            IAMDatabaseAuthenticationEnabled: false,
            DeletionProtection: false,
            HttpEndpointEnabled: false,
            CopyTagsToSnapshot: false,
            CrossAccountClone: false,
            ScalingConfiguration: {
              AutoPause: true,
              SecondsUntilAutoPause: 300,
              TimeoutAction: "RollbackCapacityChange",
            },
          }),
        ]),
        filterLive: pipe([
          assign({ ScalingConfiguration: get("ScalingConfigurationInfo") }),
          omit([
            "TagList",
            "Capacity",
            "ScalingConfigurationInfo",
            "AvailabilityZones",
            "DBClusterParameterGroup",
            "DBSubnetGroup",
            "Status",
            "EarliestRestorableTime",
            "Endpoint",
            "CustomEndpoints",
            "LatestRestorableTime",
            "DBClusterOptionGroupMemberships",
            "ReadReplicaIdentifiers",
            "DBClusterMembers",
            "VpcSecurityGroups",
            "HostedZoneId",
            "KmsKeyId",
            "DbClusterResourceId",
            "DBClusterArn",
            "AssociatedRoles",
            "ClusterCreateTime",
            "EnabledCloudwatchLogsExports",
            "ActivityStreamStatus",
            "DomainMemberships",
            "TagList",
          ]),
        ]),
      }),
    },
    {
      type: "DBInstance",
      dependsOn: [
        "RDS::DBSubnetGroup",
        "RDS::DBCluster",
        "EC2::InternetGateway",
        "EC2::SecurityGroup",
        "EC2::NetworkInterface",
      ],
      Client: DBInstance,
      isOurMinion: isOurMinionFactory({ tags: "TagList" }),
      compare: compare({
        filterAll: omit(["TagList"]),
        filterTarget: pipe([
          tap((params) => {
            assert(true);
          }),
          defaultsDeep({
            BackupRetentionPeriod: 1,
            DBSecurityGroups: [],
            MultiAZ: false,
            AutoMinorVersionUpgrade: true,
            StorageType: "gp2",
            DbInstancePort: 0,
            StorageEncrypted: false,
            DomainMemberships: [],
            CopyTagsToSnapshot: false,
            MonitoringInterval: 0,
            IAMDatabaseAuthenticationEnabled: false,
            PerformanceInsightsEnabled: false,
            EnabledCloudwatchLogsExports: [],
            ProcessorFeatures: [],
            DeletionProtection: false,
            AssociatedRoles: [],
            DBInstanceAutomatedBackupsReplications: [],
            CustomerOwnedIpEnabled: false,
          }),
          omit([
            "MasterUserPassword",
            "VpcSecurityGroupIds",
            "DBSubnetGroupName", //TODO
            "Tags",
          ]),
        ]),
        filterLive: pipe([
          tap((params) => {
            assert(true);
          }),
          omit([
            "VpcSecurityGroupIds",
            "VpcSecurityGroups",
            "DBSubnetGroupName", //TODO
            "DBInstanceStatus",
            "Endpoint",
            "InstanceCreateTime",
            "DBParameterGroups",
            "AvailabilityZone",
            "DBSubnetGroup",
            "PendingModifiedValues",
            "LatestRestorableTime",
            "ReadReplicaDBInstanceIdentifiers",
            "ReadReplicaDBClusterIdentifiers",
            "LicenseModel",
            "OptionGroupMemberships",
            "StatusInfos",
            "DbiResourceId",
            "CACertificateIdentifier",
            "DBInstanceArn",
            "ActivityStreamStatus",
          ]),
        ]),
      }),
    },
  ]);
