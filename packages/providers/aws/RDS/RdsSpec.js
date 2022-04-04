const assert = require("assert");
const { pipe, assign, map, omit, tap, get, pick, not } = require("rubico");
const { defaultsDeep, callProp, when } = require("rubico/x");
const { compareAws } = require("../AwsCommon");

const { isOurMinionFactory } = require("../AwsCommon");
const { DBCluster } = require("./DBCluster");
const { DBInstance } = require("./DBInstance");
const { DBSubnetGroup } = require("./DBSubnetGroup");

const GROUP = "RDS";
const compareRDS = compareAws({});

const environmentVariables = [
  { path: "MasterUsername", suffix: "MASTER_USERNAME" },
  { path: "MasterUserPassword", suffix: "MASTER_USER_PASSWORD" },
];
const isAuroraEngine = pipe([get("Engine"), callProp("startsWith", "aurora")]);
const omitAutoMinorVersionUpgrade = when(
  not(get("MultiAZ")),
  omit(["AutoMinorVersionUpgrade"])
);
module.exports = pipe([
  () => [
    {
      type: "DBSubnetGroup",
      Client: DBSubnetGroup,
      omitProperties: [
        "SubnetIds",
        "VpcId",
        "SubnetGroupStatus",
        "Subnets",
        "DBSubnetGroupArn",
      ],
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
        secret: { type: "Secret", group: "SecretsManager" },
      },
      omitProperties: [
        "DBClusterIdentifier",
        "SubnetIds",
        "VpcSecurityGroupIds",
        "MasterUserPassword",
        "DBSubnetGroupName",
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
      ],
      propertiesDefault: {
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
      },
      compare: compareRDS({
        filterAll: () => omit(["HttpEndpointEnabled"]), //TODO kludge: updating HttpEndpointEnabled does not work
        filterTarget: () =>
          pipe([
            when(
              isAuroraEngine,
              defaultsDeep({
                AllocatedStorage: 1,
              })
            ),
          ]),
        filterLive: () =>
          pipe([
            assign({ ScalingConfiguration: get("ScalingConfigurationInfo") }),
            omitAutoMinorVersionUpgrade,
          ]),
      }),
      filterLive: () =>
        pipe([
          assign({ ScalingConfiguration: get("ScalingConfigurationInfo") }),
          omit(["ScalingConfigurationInfo"]),
          omitAutoMinorVersionUpgrade,
          when(isAuroraEngine, omit(["AllocatedStorage"])),
        ]),
      environmentVariables,
    },
    {
      type: "DBInstance",
      Client: DBInstance,
      dependencies: {
        dbSubnetGroup: { type: "DBSubnetGroup", group: "RDS" },
        securityGroups: { type: "SecurityGroup", group: "EC2", list: true },
        secret: { type: "Secret", group: "SecretsManager" },
      },
      propertiesDefault: {
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
        DeletionProtection: false,
        AssociatedRoles: [],
        CustomerOwnedIpEnabled: false,
        BackupTarget: "region",
      },
      omitProperties: [
        "MasterUserPassword",
        "VpcSecurityGroupIds",
        "DBSubnetGroupName", //TODO
        "VpcSecurityGroupIds",
        "VpcSecurityGroups",
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
      ],
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
  ],
  map(
    defaultsDeep({
      group: GROUP,
      compare: compareRDS({}),
      isOurMinion: isOurMinionFactory({ tags: "TagList" }),
    })
  ),
]);
