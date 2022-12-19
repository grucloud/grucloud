const assert = require("assert");
const { map, pipe, tap, get, eq, pick, switchCase, omit } = require("rubico");
const { defaultsDeep, when } = require("rubico/x");
const { getField } = require("@grucloud/core/ProviderCommon");
const { getByNameCore } = require("@grucloud/core/Common");
const { buildTags, createEndpoint } = require("../AwsCommon");

const { AwsClient } = require("../AwsClient");
const {
  createRDS,
  tagResource,
  untagResource,
  renameTagList,
  omitAllocatedStorage,
} = require("./RDSCommon");

const findId = () => get("DBInstanceArn");
const pickId = pipe([pick(["DBInstanceIdentifier"])]);
const findName = () => get("DBInstanceIdentifier");
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

const decorate = ({ endpoint }) =>
  pipe([renameTagList, omitStorageThroughput, omitAllocatedStorage]);

exports.DBInstance = ({ spec, config }) => {
  const rds = createRDS(config);
  const client = AwsClient({ spec, config })(rds);
  const secretEndpoint = createEndpoint(
    "secrets-manager",
    "SecretsManager"
  )(config);

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
    ignoreErrorCodes,
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
      kmsKey,
      monitoringRole,
      secret,
      securityGroups,
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
    filterParams: ({ payload, diff, live }) =>
      pipe([
        () => payload,
        defaultsDeep({ ApplyImmediately: true }),
        defaultsDeep(pickId(live)),
        tap((params) => {
          assert(true);
        }),
        // The specified DB instance is already in the target DB subnet group
        omit(["DBSubnetGroupName"]),
      ])(),
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
    ignoreErrorCodes,
    config,
  });

  return {
    spec,
    findName,
    findId,
    getById,
    create,
    update,
    destroy,
    getById,
    getByName,
    getList,
    configDefault,
    tagResource: tagResource({ endpoint: rds }),
    untagResource: untagResource({ endpoint: rds }),
  };
};
