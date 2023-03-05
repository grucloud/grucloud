const assert = require("assert");
const {
  map,
  pipe,
  tap,
  get,
  eq,
  pick,
  switchCase,
  omit,
  or,
  assign,
} = require("rubico");
const { defaultsDeep, when, pluck, first } = require("rubico/x");
const { getField } = require("@grucloud/core/ProviderCommon");
const { getByNameCore, omitIfEmpty } = require("@grucloud/core/Common");
const { buildTags, createEndpoint } = require("../AwsCommon");

const {
  Tagger,
  renameTagList,
  omitAllocatedStorage,
  assignManageMasterUserPassword,
  findDependenciesSecret,
  isAuroraEngine,
  omitUsernamePassword,
  omitDBClusterParameterGroupDefault,
} = require("./RDSCommon");

const managedByOther = ({ lives, config }) =>
  pipe([
    get("DBClusterIdentifier"),
    lives.getById({
      type: "DBCluster",
      group: "RDS",
      providerName: config.providerName,
    }),
    get("live.MultiAZ"),
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

const buildArn = () =>
  pipe([
    get("DBInstanceArn"),
    tap((arn) => {
      assert(arn);
    }),
  ]);

const pickId = pipe([
  pick(["DBInstanceIdentifier"]),
  tap(({ DBInstanceIdentifier }) => {
    assert(DBInstanceIdentifier);
  }),
]);
const isInstanceUp = pipe([eq(get("DBInstanceStatus"), "available")]);

const ignoreErrorCodes = [
  "DBInstanceNotFound",
  "DBInstanceNotFoundFault",
  "InvalidDBInstanceStateFault",
  "InvalidDBInstanceState",
];

const omitStorageThroughput = when(
  eq(get("StorageThroughput"), 0),
  omit(["StorageThroughput"])
);

const assignDBParameterGroupName = assign({
  DBClusterParameterGroup: pipe([
    get("DBParameterGroups"),
    first,
    get("DBParameterGroupName"),
  ]),
});
const assignOptionGroup = pipe([
  assign({
    OptionGroupName: pipe([
      get("OptionGroupMemberships"),
      first,
      get("OptionGroupName"),
    ]),
  }),
  omitIfEmpty(["OptionGroupName"]),
]);

const decorate = ({ endpoint }) =>
  pipe([
    //
    renameTagList,
    omitStorageThroughput,
    omitAllocatedStorage,
    assignManageMasterUserPassword,
    assignDBParameterGroupName,
    omitDBClusterParameterGroupDefault,
    assignOptionGroup,
  ]);

exports.RDSDBInstance = ({ compare }) => ({
  type: "DBInstance",
  package: "rds",
  client: "RDS",
  inferName: () => get("DBInstanceIdentifier"),
  findName: () => get("DBInstanceIdentifier"),
  findId: () => get("DBInstanceArn"),
  managedByOther,
  cannotBeDeleted: managedByOther,
  dependencies: {
    dbClusterParameterGroup: {
      type: "DBClusterParameterGroup",
      group: "RDS",
      excludeDefaultDependencies: true,
      dependencyId: ({ lives, config }) =>
        pipe([
          get("DBClusterParameterGroup"),
          lives.getByName({
            providerName: config.providerName,
            type: "DBClusterParameterGroup",
            group: "RDS",
          }),
          get("id"),
        ]),
    },
    dbSubnetGroup: {
      type: "DBSubnetGroup",
      group: "RDS",
      dependencyId: ({ lives, config }) =>
        pipe([
          get("DBSubnetGroup.DBSubnetGroupName"),
          lives.getByName({
            providerName: config.providerName,
            type: "DBSubnetGroup",
            group: "RDS",
          }),
          get("id"),
        ]),
    },
    optionGroup: {
      type: "OptionGroup",
      group: "RDS",
      dependencyId: ({ lives, config }) => pipe([get("OptionGroupName")]),
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
      excludeDefaultDependencies: true,
      dependencyId: findDependenciesSecret({
        secretField: "username",
        rdsUsernameField: "MasterUsername",
      }),
    },
    kmsKey: {
      type: "Key",
      group: "KMS",
      excludeDefaultDependencies: true,
      dependencyId: ({ lives, config }) => get("KmsKeyId"),
    },
    dbCluster: {
      type: "DBCluster",
      group: "RDS",
      dependencyId: ({ lives, config }) =>
        pipe([
          get("DBClusterIdentifier"),
          lives.getByName({
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
  ignoreErrorCodes,
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
    //"MasterUserPassword",
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
    "CertificateDetails",
  ],
  compare: compare({
    filterAll: () =>
      pipe([
        filterLiveDbInstance,
        omit(["EnablePerformanceInsights", "MasterUserPassword"]),
      ]),
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
  filterLiveExtra: () => pipe([omitUsernamePassword]),
  environmentVariables: [
    {
      path: "MasterUsername",
      suffix: "MASTER_USERNAME",
      rejectEnvironmentVariable: () => pipe([or([get("DBClusterIdentifier")])]),
    },
    {
      path: "MasterUserPassword",
      suffix: "MASTER_USER_PASSWORD",
      rejectEnvironmentVariable: () =>
        pipe([
          or([get("ManageMasterUserPassword"), get("DBClusterIdentifier")]),
        ]),
    },
  ],
  getById: {
    pickId,
    method: "describeDBInstances",
    getField: "DBInstances",
    decorate,
  },
  getList: {
    method: "describeDBInstances",
    getParam: "DBInstances",
    decorate,
  },
  create: {
    pickCreated: () => get("DBInstance"),
    method: "createDBInstance",
    isInstanceUp,
    configIsUp: { retryCount: 40 * 12, retryDelay: 5e3 },
    postCreate: ({ resolvedDependencies: { secret, dbCluster }, config }) =>
      pipe([
        tap((params) => {
          assert(config);
        }),
        when(
          () => secret && !dbCluster,
          pipe([
            tap(({ DBInstanceIdentifier, Endpoint, Port }) => {
              assert(DBInstanceIdentifier);
              assert(Endpoint);
              assert(Port);
              assert(secret.live.Name);
              assert(secret.live.SecretString);
            }),
            ({ DBInstanceIdentifier, Endpoint, Port }) => ({
              SecretId: secret.live.Name,
              SecretString: JSON.stringify({
                ...secret.live.SecretString,
                DBInstanceIdentifier,
                host: Endpoint,
                port: Port,
              }),
            }),
            createEndpoint("secrets-manager", "SecretsManager")(config)()
              .putSecretValue,
          ])
        ),
      ]),
  },
  update: {
    method: "modifyDBInstance",
    filterParams: ({ payload, diff, live }) =>
      pipe([
        () => payload,
        defaultsDeep({ ApplyImmediately: true }),
        defaultsDeep(pickId(live)),
        // The specified DB instance is already in the target DB subnet group
        omit(["DBSubnetGroupName"]),
      ])(),
    isInstanceUp,
    shouldRetryOnExceptionCodes: ["InvalidDBInstanceState"],
    configIsUp: { retryCount: 40 * 12, retryDelay: 5e3 },
  },
  destroy: {
    pickId: pipe([pickId, defaultsDeep({ SkipFinalSnapshot: true })]),
    method: "deleteDBInstance",
    shouldRetryOnExceptionCodes: ["InvalidDBInstanceState"],
    ignoreErrorMessages: [
      "Deleting cluster instances isn't supported for DB engine postgres",
    ],
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
      dbCluster,
      dbClusterParameterGroup,
      dbSubnetGroup,
      kmsKey,
      monitoringRole,
      secret,
      securityGroups,
    },
    config,
  }) =>
    pipe([
      () => otherProps,
      defaultsDeep({
        DBInstanceIdentifier: name,
        Tags: buildTags({ config, namespace, name, UserTags: Tags }),
      }),
      when(
        () => dbClusterParameterGroup,
        assign({
          DBClusterParameterGroup: () =>
            dbClusterParameterGroup.config.DBClusterParameterGroupName,
        })
      ),
      when(
        () => dbSubnetGroup,
        defaultsDeep({
          DBSubnetGroupName: dbSubnetGroup.config.DBSubnetGroupName,
        })
      ),
      when(() => kmsKey, defaultsDeep({ KmsKeyId: getField(kmsKey, "Arn") })),
      switchCase([
        () => dbCluster,
        // Remove DBName, security group and password when cluster is set
        pipe([omit("DBName")]),
        pipe([
          defaultsDeep({
            VpcSecurityGroupIds: map((sg) => getField(sg, "GroupId"))(
              securityGroups
            ),
          }),
          when(
            () => secret,
            defaultsDeep({
              MasterUsername: getField(secret, "SecretString.username"),
              MasterUserPassword: getField(secret, "SecretString.password"),
            })
          ),
        ]),
      ]),
      when(
        () => monitoringRole,
        defaultsDeep({
          MonitoringRoleArn: getField(monitoringRole, "Arn"),
        })
      ),
    ])(),
});
