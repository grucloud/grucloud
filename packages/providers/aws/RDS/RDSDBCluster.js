const assert = require("assert");
const { assign, map, pipe, tap, get, eq, pick, omit, or } = require("rubico");
const { defaultsDeep, pluck, when } = require("rubico/x");
const { omitIfEmpty } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");
const { getByNameCore } = require("@grucloud/core/Common");
const { buildTags, createEndpoint } = require("../AwsCommon");
const {
  Tagger,
  renameTagList,
  omitAllocatedStorage,
  findDependenciesSecret,
  omitUsernamePassword,
  omitAutoMinorVersionUpgrade,
  environmentVariables,
  assignManageMasterUserPassword,
} = require("./RDSCommon");

const { replaceWithName } = require("@grucloud/core/Common");

const ignoreErrorCodes = ["DBClusterNotFoundFault"];

const buildArn = () =>
  pipe([
    get("DBClusterArn"),
    tap((arn) => {
      assert(arn);
    }),
  ]);

const decorate = () =>
  pipe([
    renameTagList,
    omitIfEmpty(["AssociatedRoles"]),
    omitAllocatedStorage,
    ({ ScalingConfigurationInfo, ...other }) => ({
      ...other,
      ScalingConfiguration: ScalingConfigurationInfo,
    }),
    assignManageMasterUserPassword,
  ]);

const pickId = pipe([
  pick(["DBClusterIdentifier"]),
  tap(({ DBClusterIdentifier }) => {
    assert(DBClusterIdentifier);
  }),
]);

exports.RDSDBCluster = ({ compare }) => ({
  type: "DBCluster",
  package: "rds",
  client: "RDS",
  inferName: () => get("DBClusterIdentifier"),
  findName: () => get("DBClusterIdentifier"),
  findId: () => get("DBClusterIdentifier"),
  dependencies: {
    dbSubnetGroup: {
      type: "DBSubnetGroup",
      group: "RDS",
      excludeDefaultDependencies: true,
      dependencyId: ({ lives, config }) =>
        pipe([
          get("DBSubnetGroup"),
          lives.getByName({
            providerName: config.providerName,
            type: "DBSubnetGroup",
            group: "RDS",
          }),
          get("id"),
        ]),
    },
    globalCluster: {
      type: "GlobalCluster",
      group: "Neptune",
      dependencyId: ({ lives, config }) => get("GlobalClusterIdentifier"),
    },
    iamRoles: {
      type: "Role",
      group: "IAM",
      list: true,
      dependencyIds: ({ lives, config }) =>
        pipe([get("AssociatedRoles"), pluck("RoleArn")]),
    },
    kmsKey: {
      type: "Key",
      group: "KMS",
      excludeDefaultDependencies: true,
      dependencyId: ({ lives, config }) => get("KmsKeyId"),
    },
    securityGroups: {
      type: "SecurityGroup",
      group: "EC2",
      list: true,
      excludeDefaultDependencies: true,
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
    monitoringRole: {
      type: "Role",
      group: "IAM",
      dependencyId: ({ lives, config }) => get("MonitoringRoleArn"),
    },
  },
  omitProperties: [
    "SubnetIds",
    "VpcSecurityGroupIds",
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
    NetworkType: "IPV4",
  },
  ignoreErrorCodes,
  compare: compare({
    filterAll: () =>
      omit([
        "MultiAZ",
        "IAMDatabaseAuthenticationEnabled",
        "HttpEndpointEnabled",
        "DeletionProtection",
        "BackupRetentionPeriod",
        "MasterUsername",
        "MasterUserPassword",
      ]), //TODO kludge: updating HttpEndpointEnabled does not work
    filterLive: () => pipe([omitAutoMinorVersionUpgrade]),
  }),
  filterLive: ({ lives, providerConfig }) =>
    pipe([
      omitAutoMinorVersionUpgrade,
      when(
        get("AssociatedRoles"),
        assign({
          AssociatedRoles: pipe([
            get("AssociatedRoles"),
            map(
              pipe([
                get("RoleArn"),
                replaceWithName({
                  groupType: "IAM::Role",
                  path: "id",
                  providerConfig,
                  lives,
                }),
              ])
            ),
          ]),
        })
      ),
    ]),
  filterLiveExtra: () => pipe([omitUsernamePassword]),
  environmentVariables,
  getById: {
    pickId,
    method: "describeDBClusters",
    getField: "DBClusters",
    decorate,
  },
  getList: {
    method: "describeDBClusters",
    getParam: "DBClusters",
    decorate,
  },
  create: {
    pickCreated: () => get("DBCluster"),
    method: "createDBCluster",
    isInstanceUp: pipe([eq(get("Status"), "available")]),
    configIsUp: { retryCount: 40 * 12, retryDelay: 5e3 },
    postCreate: ({ resolvedDependencies: { secret }, config }) =>
      pipe([
        tap((params) => {
          assert(config);
        }),
        when(
          () => secret,
          pipe([
            tap(({ DBClusterIdentifier, Endpoint, Port }) => {
              assert(DBClusterIdentifier);
              assert(Endpoint);
              assert(Port);
              assert(secret.live.Name);
              assert(secret.live.SecretString);
            }),
            ({ DBClusterIdentifier, Endpoint, Port }) => ({
              SecretId: secret.live.Name,
              SecretString: JSON.stringify({
                ...secret.live.SecretString,
                DBClusterIdentifier,
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
  destroy: {
    pickId: pipe([pickId, defaultsDeep({ SkipFinalSnapshot: true })]),
    method: "deleteDBCluster",
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
      dbSubnetGroup,
      globalCluster,
      kmsKey,
      securityGroups,
      secret,
      monitoringRole,
    },
    config,
  }) =>
    pipe([
      () => otherProps,
      defaultsDeep({
        DBClusterIdentifier: name,
        Tags: buildTags({ config, namespace, name, UserTags: Tags }),
      }),
      when(
        () => dbSubnetGroup,
        assign({
          DBSubnetGroupName: () => dbSubnetGroup.config.DBSubnetGroupName,
        })
      ),
      when(
        () => globalCluster,
        defaultsDeep({
          GlobalClusterIdentifier: getField(
            globalCluster,
            "GlobalClusterIdentifier"
          ),
        })
      ),
      when(() => kmsKey, defaultsDeep({ KmsKeyId: getField(kmsKey, "Arn") })),
      when(
        () => monitoringRole,
        defaultsDeep({
          MonitoringRoleArn: getField(monitoringRole, "Arn"),
        })
      ),
      when(
        () => secret,
        defaultsDeep({
          MasterUsername: getField(secret, "SecretString.username"),
          MasterUserPassword: getField(secret, "SecretString.password"),
        })
      ),
      when(
        () => securityGroups,
        defaultsDeep({
          VpcSecurityGroupIds: pipe([
            () => securityGroups,
            map((securityGroup) => getField(securityGroup, "GroupId")),
          ])(),
        })
      ),
    ])(),
});
