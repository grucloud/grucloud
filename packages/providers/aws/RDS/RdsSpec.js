const assert = require("assert");
const {
  pipe,
  assign,
  map,
  omit,
  tap,
  get,
  pick,
  not,
  switchCase,
} = require("rubico");
const { defaultsDeep, callProp, when } = require("rubico/x");
const { replaceWithName } = require("@grucloud/core/Common");

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
      "DeletionProtection",
      "DBName",
      "BackupRetentionPeriod",
      "AllocatedStorage",
      "EnablePerformanceInsights",
      "ScalingConfiguration",
    ])
  ),
]);

module.exports = pipe([
  () => [
    {
      type: "DBProxy",
      Client: DBProxy,
      omitProperties: [
        "DBProxyArn",
        "DBProxyName",
        "VpcSubnetIds",
        "VpcSecurityGroupIds",
        "RoleArn",
        "VpcId",
        "CreatedDate",
        "UpdatedDate",
        "Status",
      ],
      filterLive: ({ lives }) =>
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
                        (SecretArn) => ({ Id: SecretArn, lives }),
                        replaceWithName({
                          groupType: "SecretsManager::Secret",
                          pathLive: "id",
                          path: "id",
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
        subnets: { type: "Subnet", group: "EC2", list: true },
        securityGroups: { type: "SecurityGroup", group: "EC2", list: true },
        secret: { type: "Secret", group: "SecretsManager", list: true },
        role: { type: "Role", group: "IAM" },
      },
    },
    {
      type: "DBProxyTargetGroup",
      Client: DBProxyTargetGroup,
      omitProperties: ["DBClusterIdentifiers"],
      filterLive: ({ lives }) =>
        pipe([
          tap((params) => {
            assert(true);
          }),
        ]),
      dependencies: {
        dbProxy: { type: "DBProxy", group: "RDS" },
        dbClusters: { type: "DBCluster", group: "RDS", list: true },
        dbInstances: { type: "DBInstance", group: "RDS", list: true },
      },
    },
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
      ignoreResource: () => pipe([get("isDefault")]),
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
        monitoringRole: { type: "Role", group: "IAM" },
      },
      omitProperties: [
        "DBClusterIdentifier",
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
      ],
      propertiesDefault: {
        BackupRetentionPeriod: 1,
        MultiAZ: false,
        Port: 5432,
        StorageEncrypted: true,
        //IAMDatabaseAuthenticationEnabled: false,
        DeletionProtection: false,
        HttpEndpointEnabled: false,
        CopyTagsToSnapshot: false,
        CrossAccountClone: false,
      },
      compare: compareRDS({
        filterAll: () =>
          omit([
            "MultiAZ",
            "IAMDatabaseAuthenticationEnabled",
            "HttpEndpointEnabled",
          ]), //TODO kludge: updating HttpEndpointEnabled does not work
        filterTarget: () =>
          pipe([
            switchCase([
              isAuroraEngine,
              defaultsDeep({
                AllocatedStorage: 1,
              }),
            ]),
            defaultsDeep({
              ScalingConfiguration: {
                AutoPause: true,
                SecondsUntilAutoPause: 300,
                SecondsBeforeTimeout: 300,
                TimeoutAction: "RollbackCapacityChange",
              },
            }),
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
            defaultsDeep({
              ScalingConfiguration: {
                AutoPause: true,
                SecondsUntilAutoPause: 300,
                SecondsBeforeTimeout: 300,
                TimeoutAction: "RollbackCapacityChange",
              },
            }),
          ]),
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
        dbCluster: { type: "DBCluster", group: "RDS" },
        monitoringRole: { type: "Role", group: "IAM" },
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
      ],
      compare: compareRDS({
        filterAll: () => filterLiveDbInstance,
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
