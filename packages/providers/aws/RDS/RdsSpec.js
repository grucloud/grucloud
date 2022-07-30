const assert = require("assert");
const {
  pipe,
  assign,
  map,
  omit,
  tap,
  get,
  pick,
  switchCase,
} = require("rubico");
const { defaultsDeep, callProp, when, pluck } = require("rubico/x");
const { replaceWithName } = require("@grucloud/core/Common");

const { findDependenciesSecret } = require("./RDSCommon");

const { isOurMinionFactory, compareAws } = require("../AwsCommon");
const { DBCluster } = require("./DBCluster");
const { DBInstance } = require("./DBInstance");
const { DBSubnetGroup } = require("./DBSubnetGroup");
const { DBProxy } = require("./DBProxy");
const { DBProxyTargetGroup } = require("./DBProxyTargetGroup");

const GROUP = "RDS";
const compareRDS = compareAws({});

const environmentVariables = [
  { path: "MasterUsername", suffix: "MASTER_USERNAME" },
  { path: "MasterUserPassword", suffix: "MASTER_USER_PASSWORD" },
];

const isAuroraEngine = pipe([get("Engine"), callProp("startsWith", "aurora")]);

// TODO
// When MultiAZ = true, here is the error:
// AutoMinorVersionUpgrade can only be specified for a Multi-AZ DB cluster. You can use CreateDBInstance to set AutoMinorVersionUpgrade for a DB instance in a different type of DB cluster.
// For now, omit omitAutoMinorVersionUpgrade
const omitAutoMinorVersionUpgrade = pipe([
  when(() => true /*not(get("MultiAZ"))*/, omit(["AutoMinorVersionUpgrade"])),
]);

const filterLiveDbInstance = pipe([
  when(
    get("DBClusterIdentifier"),
    omit([
      "PreferredBackupWindow",
      "IAMDatabaseAuthenticationEnabled",
      "MasterUsername",
      "EnabledCloudwatchLogsExports",
      "DeletionProtection", // Deletion Protection can only be applied on the Cluster level, not for individual instances
      "DBName",
      "BackupRetentionPeriod", // The requested DB Instance will be a member of a DB Cluster. Set backup retention period for the DB Cluster.
      "AllocatedStorage",
      "ScalingConfiguration",
    ])
  ),
]);

module.exports = pipe([
  () => [
    {
      type: "DBProxy",
      Client: DBProxy,
      inferName: get("properties.DBProxyName"),
      omitProperties: [
        "DBProxyArn",
        "VpcSubnetIds",
        "VpcSecurityGroupIds",
        "RoleArn",
        "VpcId",
        "CreatedDate",
        "UpdatedDate",
        "Status",
        "Endpoint",
      ],
      filterLive: ({ lives, providerConfig }) =>
        pipe([
          tap((params) => {
            assert(true);
          }),
          when(
            get("Auth"),
            assign({
              Auth: pipe([
                get("Auth"),
                map(
                  when(
                    get("SecretArn"),
                    assign({
                      SecretArn: pipe([
                        get("SecretArn"),
                        replaceWithName({
                          groupType: "SecretsManager::Secret",
                          pathLive: "id",
                          path: "id",
                          providerConfig,
                          lives,
                        }),
                      ]),
                    })
                  )
                ),
              ]),
            })
          ),
          tap((params) => {
            assert(true);
          }),
        ]),
      dependencies: {
        subnets: {
          type: "Subnet",
          group: "EC2",
          list: true,
          dependencyIds: ({ lives, config }) => get("VpcSubnetIds"),
        },
        securityGroups: {
          type: "SecurityGroup",
          group: "EC2",
          list: true,
          dependencyIds: ({ lives, config }) => get("VpcSecurityGroupIds"),
        },
        secrets: {
          type: "Secret",
          group: "SecretsManager",
          list: true,
          dependencyIds: ({ lives, config }) =>
            pipe([get("Auth"), pluck("SecretArn")]),
        },
        role: {
          type: "Role",
          group: "IAM",
          dependencyId: ({ lives, config }) => get("RoleArn"),
        },
      },
    },
    {
      type: "DBProxyTargetGroup",
      Client: DBProxyTargetGroup,
      inferName: get("properties.TargetGroupName"),
      omitProperties: [
        "DBClusterIdentifiers",
        "TargetGroupArn",
        "Status",
        "CreatedDate",
      ],
      filterLive: ({ lives }) =>
        pipe([
          tap((params) => {
            assert(true);
          }),
        ]),
      dependencies: {
        dbProxy: {
          type: "DBProxy",
          group: "RDS",
          parent: true,
          dependencyId: ({ lives, config }) =>
            pipe([
              get("DBProxyName"),
              (name) =>
                lives.getByName({
                  name,
                  type: "DBProxy",
                  group: "RDS",
                  providerName: config.providerName,
                }),
              get("id"),
            ]),
        },
        dbClusters: {
          type: "DBCluster",
          group: "RDS",
          list: true,
          dependencyIds: ({ lives, config }) => get("DBClusterIdentifiers"),
        },
        dbInstances: {
          type: "DBInstance",
          group: "RDS",
          list: true,
          dependencyIds: ({ lives, config }) => get("DBInstanceIdentifiers"),
        },
      },
    },
    {
      type: "DBSubnetGroup",
      Client: DBSubnetGroup,
      inferName: get("properties.DBSubnetGroupName"),
      omitProperties: [
        "SubnetIds",
        "VpcId",
        "SubnetGroupStatus",
        "Subnets",
        "DBSubnetGroupArn",
      ],
      propertiesDefault: { SupportedNetworkTypes: ["IPV4"] },
      ignoreResource: () => pipe([get("isDefault")]),
      filterLive: () => pick(["DBSubnetGroupName", "DBSubnetGroupDescription"]),
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
    {
      type: "DBCluster",
      Client: DBCluster,
      inferName: get("properties.DBClusterIdentifier"),
      dependencies: {
        dbSubnetGroup: {
          type: "DBSubnetGroup",
          group: "RDS",
          dependencyId: ({ lives, config }) =>
            pipe([
              get("DBSubnetGroup"),
              (name) =>
                lives.getByName({
                  name,
                  providerName: config.providerName,
                  type: "DBSubnetGroup",
                  group: "RDS",
                }),
              get("id"),
            ]),
        },
        securityGroups: {
          type: "SecurityGroup",
          group: "EC2",
          list: true,
          dependencyIds: ({ lives, config }) =>
            pipe([get("VpcSecurityGroups"), pluck("VpcSecurityGroupId")]),
        },
        key: {
          type: "Key",
          group: "KMS",
          dependencyId: ({ lives, config }) => get("KmsKeyId"),
        },
        secret: {
          type: "Secret",
          group: "SecretsManager",
          dependencyId: findDependenciesSecret({
            secretField: "username",
            rdsUsernameField: "MasterUsername",
          }),
        },
        monitoringRole: {
          type: "Role",
          group: "IAM",
          dependencyId: ({ lives, config }) => get("MonitoringRoleArn"),
        },
      },
      omitProperties: [
        "SubnetIds",
        "VpcSecurityGroupIds",
        "MasterUserPassword",
        "DBSubnetGroupName",
        "Capacity",
        "ScalingConfigurationInfo", //TODO
        "AvailabilityZones",
        "DBClusterParameterGroup",
        "DBSubnetGroup",
        "Status",
        "EarliestRestorableTime",
        "Endpoint",
        "CustomEndpoints",
        "LatestRestorableTime",
        "DBClusterOptionGroupMemberships",
        "BacktrackConsumedChangeRecords",
        "ReadReplicaIdentifiers",
        "DBClusterMembers",
        "VpcSecurityGroups",
        "HostedZoneId",
        "KmsKeyId",
        "DbClusterResourceId",
        "DBClusterArn",
        "AssociatedRoles",
        "ClusterCreateTime",
        "EnabledCloudwatchLogsExports", // TODO Check
        "ActivityStreamStatus",
        "DomainMemberships",
        "EarliestBacktrackTime",
        "ReaderEndpoint",
      ],
      propertiesDefault: {
        MultiAZ: false,
        Port: 5432,
        StorageEncrypted: true,
        CopyTagsToSnapshot: false,
        CrossAccountClone: false,
      },
      compare: compareRDS({
        filterAll: () =>
          omit([
            "MultiAZ",
            "IAMDatabaseAuthenticationEnabled",
            "HttpEndpointEnabled",
            "DeletionProtection",
            "BackupRetentionPeriod",
            "MasterUsername",
          ]), //TODO kludge: updating HttpEndpointEnabled does not work
        filterTarget: () =>
          pipe([
            switchCase([
              isAuroraEngine,
              defaultsDeep({
                AllocatedStorage: 1,
              }),
              defaultsDeep({}),
            ]),
          ]),
        filterLive: () =>
          pipe([
            assign({ ScalingConfiguration: get("ScalingConfigurationInfo") }),
            omitAutoMinorVersionUpgrade,
          ]),
      }),
      filterLive: () =>
        pipe([
          when(
            get("ScalingConfigurationInfo"),
            pipe([
              assign({ ScalingConfiguration: get("ScalingConfigurationInfo") }),
              omit(["ScalingConfigurationInfo"]),
            ])
          ),
          omitAutoMinorVersionUpgrade,
          switchCase([
            isAuroraEngine,
            omit(["AllocatedStorage"]),
            defaultsDeep({}),
          ]),
        ]),
      environmentVariables,
    },
    {
      type: "DBInstance",
      Client: DBInstance,
      inferName: get("properties.DBInstanceIdentifier"),
      dependencies: {
        dbSubnetGroup: {
          type: "DBSubnetGroup",
          group: "RDS",
          dependencyId: ({ lives, config }) =>
            pipe([
              get("DBSubnetGroup.DBSubnetGroupName"),
              (name) =>
                lives.getByName({
                  name,
                  providerName: config.providerName,
                  type: "DBSubnetGroup",
                  group: "RDS",
                }),
              get("id"),
            ]),
        },
        securityGroups: {
          type: "SecurityGroup",
          group: "EC2",
          list: true,
          dependencyIds: ({ lives, config }) =>
            pipe([get("VpcSecurityGroups"), pluck("VpcSecurityGroupId")]),
        },
        secret: {
          type: "Secret",
          group: "SecretsManager",
          dependencyId: findDependenciesSecret({
            secretField: "username",
            rdsUsernameField: "MasterUsername",
          }),
        },
        key: {
          type: "Key",
          group: "KMS",
          dependencyId: ({ lives, config }) => get("KmsKeyId"),
        },
        dbCluster: {
          type: "DBCluster",
          group: "RDS",
          dependencyId: ({ lives, config }) =>
            pipe([
              get("DBClusterIdentifier"),
              (name) =>
                lives.getByName({
                  name,
                  providerName: config.providerName,
                  type: "DBCluster",
                  group: "RDS",
                }),
              get("id"),
            ]),
        },
        monitoringRole: {
          type: "Role",
          group: "IAM",
          dependencyId: ({ lives, config }) => get("MonitoringRoleArn"),
        },
      },
      propertiesDefault: {
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
        AssociatedRoles: [],
        CustomerOwnedIpEnabled: false,
        BackupTarget: "region",
      },
      omitProperties: [
        "PromotionTier", //TODO check
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
        "EnhancedMonitoringResourceArn",
        "KmsKeyId",
        "MonitoringRoleArn",
        "PerformanceInsightsKMSKeyId",
        "NetworkType", //TODO
      ],
      compare: compareRDS({
        filterAll: () =>
          pipe([filterLiveDbInstance, omit(["EnablePerformanceInsights"])]),
      }),
      filterLive: () =>
        pipe([
          tap((params) => {
            assert(true);
          }),
          switchCase([
            isAuroraEngine,
            omit(["AllocatedStorage"]),
            defaultsDeep({
              BackupRetentionPeriod: 1,
              DeletionProtection: false,
            }),
          ]),
          // AWS weirdness/absurdities:
          // PerformanceInsightsEnabled is returned by listing but
          // EnablePerformanceInsights is used for creating.
          when(
            get("PerformanceInsightsEnabled"),
            defaultsDeep({ EnablePerformanceInsights: true })
          ),
          filterLiveDbInstance,
        ]),
      environmentVariables: pipe([
        () => environmentVariables,
        defaultsDeep({ handledByResource: true }),
      ])(),
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
