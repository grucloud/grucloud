const assert = require("assert");
const { map, pipe, tap, get, eq, pick, switchCase, omit } = require("rubico");
const { defaultsDeep, isEmpty, pluck, when } = require("rubico/x");
const { getField } = require("@grucloud/core/ProviderCommon");
const { getByNameCore } = require("@grucloud/core/Common");
const { buildTags, createEndpoint } = require("../AwsCommon");

const { AwsClient } = require("../AwsClient");
const {
  createRDS,
  tagResource,
  untagResource,
  renameTagList,
  findDependenciesSecret,
} = require("./RDSCommon");

const findId = get("live.DBInstanceArn");
const pickId = pipe([pick(["DBInstanceIdentifier"])]);
const findName = get("live.DBInstanceIdentifier");
const isInstanceUp = pipe([eq(get("DBInstanceStatus"), "available")]);

exports.DBInstance = ({ spec, config }) => {
  const rds = createRDS(config);
  const client = AwsClient({ spec, config })(rds);
  const secretEndpoint = createEndpoint(
    "secrets-manager",
    "SecretsManager"
  )(config);

  // const findDependencies = ({ live, lives }) => [
  //   findDependenciesSecret({
  //     live,
  //     lives,
  //     config,
  //     secretField: "username",
  //     rdsUsernameField: "MasterUsername",
  //   }),
  //   {
  //     type: "DBCluster",
  //     group: "RDS",
  //     ids: [
  //       pipe([
  //         () => live,
  //         get("DBClusterIdentifier"),
  //         (name) =>
  //           lives.getByName({
  //             name,
  //             providerName: config.providerName,
  //             type: "DBCluster",
  //             group: "RDS",
  //           }),
  //         get("id"),
  //       ])(),
  //     ],
  //   },
  //   {
  //     type: "DBSubnetGroup",
  //     group: "RDS",
  //     ids: [
  //       pipe([
  //         () => live,
  //         get("DBSubnetGroup.DBSubnetGroupName"),
  //         (name) =>
  //           lives.getByName({
  //             name,
  //             providerName: config.providerName,
  //             type: "DBSubnetGroup",
  //             group: "RDS",
  //           }),
  //         get("id"),
  //       ])(),
  //     ],
  //   },
  //   {
  //     type: "SecurityGroup",
  //     group: "EC2",
  //     ids: pipe([get("VpcSecurityGroups"), pluck("VpcSecurityGroupId")])(live),
  //   },
  //   {
  //     type: "Role",
  //     group: "IAM",
  //     ids: [live.MonitoringRoleArn],
  //   },
  //   {
  //     type: "Key",
  //     group: "KMS",
  //     ids: [live.KmsKeyId],
  //   },
  // ];

  const decorate = () => pipe([renameTagList]);

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/RDS.html#describeDBInstances-property
  const getList = client.getList({
    method: "describeDBInstances",
    getParam: "DBInstances",
    decorate,
  });

  const getByName = getByNameCore({ getList, findName });

  const getById = client.getById({
    pickId,
    method: "describeDBInstances",
    getField: "DBInstances",
    ignoreErrorCodes: ["DBInstanceNotFound"],
    decorate,
  });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/RDS.html#createDBInstance-property
  const configDefault = ({
    name,
    namespace,
    properties: { Tags, ...otherProps },
    dependencies: {
      dbCluster,
      dbSubnetGroup,
      securityGroups,
      kmsKey,
      secret,
      monitoringRole,
    },
  }) =>
    pipe([
      () => otherProps,
      defaultsDeep({
        DBInstanceIdentifier: name,
        DBSubnetGroupName: dbSubnetGroup.config.DBSubnetGroupName,
        Tags: buildTags({ config, namespace, name, UserTags: Tags }),
      }),
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
          switchCase([
            () => secret,
            defaultsDeep({
              MasterUsername: getField(secret, "SecretString.username"),
              MasterUserPassword: getField(secret, "SecretString.password"),
            }),
            defaultsDeep({
              MasterUsername: () =>
                `process.env.${envVarName({
                  name,
                  suffix: "MasterUsername",
                })}`,
              MasterUserPassword: () =>
                `process.env.${envVarName({
                  name,
                  suffix: "MasterUserPassword",
                })}`,
            }),
          ]),
        ]),
      ]),
      when(
        () => monitoringRole,
        defaultsDeep({
          MonitoringRoleArn: getField(monitoringRole, "Arn"),
        })
      ),
    ])();

  const create = client.create({
    pickCreated: () => get("DBInstance"),
    method: "createDBInstance",
    getById,
    isInstanceUp,
    config: { ...config, retryCount: 100 },
    configIsUp: { ...config, retryCount: 500 },
    postCreate: ({ resolvedDependencies: { secret, dbCluster } }) =>
      pipe([
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
            secretEndpoint().putSecretValue,
          ])
        ),
      ]),
  });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/RDS.html#modifyDBInstance-property
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/RDS.html#describeValidDBInstanceModifications-property
  const update = client.update({
    pickId,
    method: "modifyDBInstance",
    extraParam: { ApplyImmediately: true },
    getById,
    config: { ...config, retryDelay: 10e3, retryCount: 200 },
  });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/RDS.html#deleteDBInstance-property
  const destroy = client.destroy({
    pickId,
    extraParam: {
      SkipFinalSnapshot: true,
    },
    method: "deleteDBInstance",
    getById,
    ignoreErrorCodes: [
      "DBInstanceNotFound",
      "InvalidDBInstanceStateFault",
      "InvalidDBInstanceState",
    ],
    config,
  });

  return {
    spec,
    findName,
    findId,
    create,
    update,
    destroy,
    getById,
    getByName,
    getList,
    configDefault,
    //findDependencies,
    tagResource: tagResource({ endpoint: rds }),
    untagResource: untagResource({ endpoint: rds }),
  };
};
