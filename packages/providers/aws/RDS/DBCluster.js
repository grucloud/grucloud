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
} = require("./RDSCommon");

const { replaceWithName } = require("@grucloud/core/Common");

const ignoreErrorCodes = ["DBClusterNotFoundFault", ""];

const buildArn = () =>
  pipe([
    get("DBClusterIdentifier"),
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
  ]);

const pickId = pipe([
  pick(["DBClusterIdentifier"]),
  tap(({ DBClusterIdentifier }) => {
    assert(DBClusterIdentifier);
  }),
]);

exports.DBCluster = ({ compare }) => ({
  type: "DBCluster",
  package: "rds",
  client: "RDS",
  inferName: () => get("DBClusterIdentifier"),
  findName: () => get("DBClusterIdentifier"),
  findId: () => get("DBClusterArn"),
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

// exports.DBClusterXX = ({ spec, config }) => {
//   const rds = createRDS(config);

//   const client = AwsClient({ spec, config })(rds);

//   // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/RDS.html#describeDBClusters-property
//   const getList = client.getList({
//     method: "describeDBClusters",
//     getParam: "DBClusters",
//     decorate,
//   });

//   const getByName = getByNameCore({ getList, findName });

//   const getById = client.getById({
//     pickId,
//     method: "describeDBClusters",
//     getField: "DBClusters",
//     ignoreErrorCodes,
//     decorate,
//   });

//   // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/RDS.html#createDBCluster-property
//   const configDefault = async ({
//     name,
//     namespace,
//     properties: { Tags, ...otherProps },
//     dependencies: {
//       dbSubnetGroup,
//       globalCluster,
//       kmsKey,
//       securityGroups,
//       secret,
//       monitoringRole,
//     },
//   }) =>
//     pipe([
//       () => otherProps,
//       defaultsDeep({
//         DBClusterIdentifier: name,
//         Tags: buildTags({ config, namespace, name, UserTags: Tags }),
//       }),
//       when(
//         () => dbSubnetGroup,
//         assign({
//           DBSubnetGroupName: () => dbSubnetGroup.config.DBSubnetGroupName,
//         })
//       ),
//       when(
//         () => globalCluster,
//         defaultsDeep({
//           GlobalClusterIdentifier: getField(
//             globalCluster,
//             "GlobalClusterIdentifier"
//           ),
//         })
//       ),
//       when(() => kmsKey, defaultsDeep({ KmsKeyId: getField(kmsKey, "Arn") })),
//       when(
//         () => monitoringRole,
//         defaultsDeep({
//           MonitoringRoleArn: getField(monitoringRole, "Arn"),
//         })
//       ),
//       when(
//         () => secret,
//         defaultsDeep({
//           MasterUsername: getField(secret, "SecretString.username"),
//           MasterUserPassword: getField(secret, "SecretString.password"),
//         })
//       ),
//       when(
//         () => securityGroups,
//         defaultsDeep({
//           VpcSecurityGroupIds: pipe([
//             () => securityGroups,
//             map((securityGroup) => getField(securityGroup, "GroupId")),
//           ])(),
//         })
//       ),
//     ])();

//   const create = client.create({
//     pickCreated: () => get("DBCluster"),
//     method: "createDBCluster",
//     getById,
//     isInstanceUp,
//     config: { ...config, retryCount: 100 },
//     postCreate: ({ resolvedDependencies: { secret } }) =>
//       pipe([
//         when(
//           () => secret,
//           pipe([
//             tap(({ DBClusterIdentifier, Endpoint, Port }) => {
//               assert(DBClusterIdentifier);
//               assert(Endpoint);
//               assert(Port);
//               assert(secret.live.Name);
//               assert(secret.live.SecretString);
//               assert(secretEndpoint().putSecretValue);
//             }),
//             ({ DBClusterIdentifier, Endpoint, Port }) => ({
//               SecretId: secret.live.Name,
//               SecretString: JSON.stringify({
//                 ...secret.live.SecretString,
//                 DBClusterIdentifier,
//                 host: Endpoint,
//                 port: Port,
//               }),
//             }),
//             secretEndpoint().putSecretValue,
//           ])
//         ),
//       ]),
//   });

//   // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/RDS.html#modifyDBCluster-property
//   const update = client.update({
//     pickId,
//     method: "modifyDBCluster",
//     getById,
//   });

//   // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/RDS.html#deleteDBCluster-property
//   const destroy = client.destroy({
//     pickId,
//     extraParam: {
//       SkipFinalSnapshot: true,
//     },
//     method: "deleteDBCluster",
//     getById,
//     ignoreErrorCodes,
//   });

//   return {
//     spec,
//     findName,
//     findId,
//     getById,
//     create,
//     update,
//     destroy,
//     getByName,
//     getList,
//     configDefault,
//     tagResource: tagResource({ endpoint: rds }),
//     untagResource: untagResource({ endpoint: rds }),
//   };
// };
