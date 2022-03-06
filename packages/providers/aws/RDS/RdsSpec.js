const assert = require("assert");
const { pipe, assign, map, omit, tap, get, pick } = require("rubico");
const { defaultsDeep } = require("rubico/x");
const { compareAws } = require("../AwsCommon");

const { isOurMinionFactory, isOurMinion } = require("../AwsCommon");
const { DBCluster } = require("./DBCluster");
const { DBInstance } = require("./DBInstance");
const { DBSubnetGroup } = require("./DBSubnetGroup");

const GROUP = "RDS";

const environmentVariables = [
  { path: "MasterUsername", suffix: "MASTER_USERNAME" },
  { path: "MasterUserPassword", suffix: "MASTER_USER_PASSWORD" },
];

module.exports = () =>
  map(assign({ group: () => GROUP }))([
    {
      type: "DBSubnetGroup",
      Client: DBSubnetGroup,
      isOurMinion,
      compare: compareAws({
        filterAll: pipe([omit(["Tags"])]),
        filterTarget: () => pipe([omit(["SubnetIds"])]),
        filterLive: () =>
          pipe([
            omit(["VpcId", "SubnetGroupStatus", "Subnets", "DBSubnetGroupArn"]),
          ]),
      }),
      filterLive: () => pick(["DBSubnetGroupDescription"]),
      dependencies: {
        subnets: { type: "Subnet", group: "EC2", list: true },
      },
    },
    {
      type: "DBCluster",
      Client: DBCluster,
      dependencies: {
        dbSubnetGroup: { type: "DBSubnetGroup", group: "RDS" },
        securityGroups: { type: "SecurityGroup", group: "EC2", list: true },
        key: {
          type: "Key",
          group: "KMS",
        },
      },
      isOurMinion: isOurMinionFactory({ tags: "TagList" }),
      compare: compareAws({
        filterAll: pipe([omit(["SubnetIds", "Tags"])]),
        filterTarget: () =>
          pipe([
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
                SecondsBeforeTimeout: 300,
                TimeoutAction: "RollbackCapacityChange",
              },
              AutoMinorVersionUpgrade: false,
            }),
          ]),
        filterLive: () =>
          pipe([
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
      filterLive: () =>
        pipe([
          pick([
            "DatabaseName",
            "Engine",
            "EngineVersion",
            "EngineMode",
            "Port",
            "ScalingConfigurationInfo",
            "PreferredBackupWindow",
            "PreferredMaintenanceWindow",
          ]),
          assign({ ScalingConfiguration: get("ScalingConfigurationInfo") }),
          omit(["ScalingConfigurationInfo"]),
        ]),
      environmentVariables,
    },
    {
      type: "DBInstance",
      Client: DBInstance,
      dependencies: {
        dbSubnetGroup: { type: "DBSubnetGroup", group: "RDS" },
        securityGroups: { type: "SecurityGroup", group: "EC2", list: true },
      },
      propertiesDefault: {
        ProcessorFeatures: [],
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
        ProcessorFeatures: [],
        DeletionProtection: false,
        AssociatedRoles: [],
        CustomerOwnedIpEnabled: false,
        BackupTarget: "region",
      },
      isOurMinion: isOurMinionFactory({ tags: "TagList" }),
      compare: compareAws({
        filterAll: omit(["TagList"]),
        filterTarget: () =>
          pipe([
            tap((params) => {
              assert(true);
            }),
            omit([
              "MasterUserPassword",
              "VpcSecurityGroupIds",
              "DBSubnetGroupName", //TODO
              "Tags",
            ]),
          ]),
        filterLive: () =>
          pipe([
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
      filterLive: () =>
        pick([
          "DBInstanceClass",
          "Engine",
          "EngineVersion",
          "AllocatedStorage",
          "MaxAllocatedStorage",
          "PubliclyAccessible",
          "PreferredBackupWindow",
          "PreferredMaintenanceWindow",
          "BackupRetentionPeriod",
        ]),
      environmentVariables,
    },
  ]);
