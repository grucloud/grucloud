const assert = require("assert");
const { assign, map, pipe, tap, get, eq, pick, omit } = require("rubico");
const { defaultsDeep, pluck, when } = require("rubico/x");

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

const ignoreErrorCodes = ["DBClusterNotFoundFault"];

const findId = get("live.DBClusterArn");
const pickId = pipe([pick(["DBClusterIdentifier"])]);
const findName = get("live.DBClusterIdentifier");
const isInstanceUp = pipe([eq(get("Status"), "available")]);

exports.DBCluster = ({ spec, config }) => {
  const rds = createRDS(config);
  const secretEndpoint = createEndpoint(
    "secrets-manager",
    "SecretsManager"
  )(config);

  const client = AwsClient({ spec, config })(rds);

  const decorate = () => pipe([renameTagList]);

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/RDS.html#describeDBClusters-property
  const getList = client.getList({
    method: "describeDBClusters",
    getParam: "DBClusters",
    decorate,
  });

  const getByName = getByNameCore({ getList, findName });

  const getById = client.getById({
    pickId,
    method: "describeDBClusters",
    getField: "DBClusters",
    ignoreErrorCodes,
    decorate,
  });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/RDS.html#createDBCluster-property
  const configDefault = async ({
    name,
    namespace,
    properties: { Tags, ...otherProps },
    dependencies: { dbSubnetGroup, securityGroups, secret, monitoringRole },
  }) =>
    pipe([
      () => otherProps,
      defaultsDeep({
        DBClusterIdentifier: name,
        Tags: buildTags({ config, namespace, name, UserTags: Tags }),
      }),
      when(
        () => securityGroups,
        defaultsDeep({
          VpcSecurityGroupIds: map((sg) => getField(sg, "GroupId"))(
            securityGroups
          ),
        })
      ),
      when(
        () => dbSubnetGroup,
        assign({
          DBSubnetGroupName: () => dbSubnetGroup.config.DBSubnetGroupName,
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
        () => monitoringRole,
        defaultsDeep({
          MonitoringRoleArn: getField(monitoringRole, "Arn"),
        })
      ),
    ])();

  const create = client.create({
    pickCreated: () => get("DBCluster"),
    method: "createDBCluster",
    getById,
    isInstanceUp,
    config: { ...config, retryCount: 100 },
    postCreate: ({ resolvedDependencies: { secret } }) =>
      pipe([
        when(
          () => secret,
          pipe([
            tap(({ DBClusterIdentifier, Endpoint, Port }) => {
              assert(DBClusterIdentifier);
              assert(Endpoint);
              assert(Port);
              assert(secret.live.Name);
              assert(secret.live.SecretString);
              assert(secretEndpoint().putSecretValue);
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
            secretEndpoint().putSecretValue,
          ])
        ),
      ]),
  });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/RDS.html#modifyDBCluster-property
  const update = client.update({
    pickId,
    method: "modifyDBCluster",
    getById,
  });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/RDS.html#deleteDBCluster-property
  const destroy = client.destroy({
    pickId,
    extraParam: {
      SkipFinalSnapshot: true,
    },
    method: "deleteDBCluster",
    getById,
    ignoreErrorCodes,
  });

  return {
    spec,
    findName,
    findId,
    getById,
    create,
    update,
    destroy,
    getByName,
    getList,
    configDefault,
    tagResource: tagResource({ endpoint: rds }),
    untagResource: untagResource({ endpoint: rds }),
  };
};
