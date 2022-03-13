const assert = require("assert");
const { map, pipe, tap, get, eq, pick, omit } = require("rubico");
const { defaultsDeep, pluck } = require("rubico/x");

const { getField } = require("@grucloud/core/ProviderCommon");
const { getByNameCore } = require("@grucloud/core/Common");
const { buildTags } = require("../AwsCommon");
const { AwsClient } = require("../AwsClient");
const {
  createRDS,
  tagResource,
  untagResource,
  renameTagList,
} = require("./RDSCommon");

const ignoreErrorCodes = ["DBClusterNotFoundFault"];

const findId = get("live.DBClusterArn");
const pickId = pipe([
  tap(({ DBClusterIdentifier }) => {
    assert(DBClusterIdentifier);
  }),
  pick(["DBClusterIdentifier"]),
]);
const findName = get("live.DBClusterIdentifier");
const isInstanceUp = pipe([eq(get("Status"), "available")]);

exports.DBCluster = ({ spec, config }) => {
  const rds = createRDS(config);
  const client = AwsClient({ spec, config })(rds);

  const findDependencies = ({ live, lives }) => [
    {
      type: "DBSubnetGroup",
      group: "RDS",
      ids: [
        pipe([
          () => live,
          get("DBSubnetGroup"),
          (name) =>
            lives.getByName({
              name,
              providerName: config.providerName,
              type: "DBSubnetGroup",
              group: "RDS",
            }),
          get("id"),
        ])(),
      ],
    },
    {
      type: "SecurityGroup",
      group: "EC2",
      ids: pipe([
        () => live,
        get("VpcSecurityGroups"),
        pluck("VpcSecurityGroupId"),
      ])(),
    },
    {
      type: "Key",
      group: "KMS",
      ids: [get("KmsKeyId")(live)],
    },
  ];

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/RDS.html#describeDBClusters-property
  const getList = client.getList({
    method: "describeDBClusters",
    getParam: "DBClusters",
    decorate: () => pipe([renameTagList]),
  });

  const getByName = getByNameCore({ getList, findName });

  const getById = client.getById({
    pickId,
    method: "describeDBClusters",
    getField: "DBClusters",
    ignoreErrorCodes,
  });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/RDS.html#createDBCluster-property
  const configDefault = async ({
    name,
    namespace,
    properties: { Tags, ...otherProps },
    dependencies: { dbSubnetGroup, securityGroups },
  }) =>
    pipe([
      () => otherProps,
      defaultsDeep({
        DBClusterIdentifier: name,
        DBSubnetGroupName: dbSubnetGroup.config.DBSubnetGroupName,
        VpcSecurityGroupIds: map((sg) => getField(sg, "GroupId"))(
          securityGroups
        ),
        Tags: buildTags({ config, namespace, name, UserTags: Tags }),
      }),
    ])();

  const create = client.create({
    pickCreated: () => get("DBCluster"),
    method: "createDBCluster",
    getById,
    isInstanceUp,
    config: { ...config, retryCount: 100 },
  });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/RDS.html#modifyDBCluster-property
  const update = client.update({
    pickId,
    method: "modifyDBCluster",
    filterParams: () => pipe([omit(["Tags"])]),
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
    create,
    update,
    destroy,
    getByName,
    getList,
    configDefault,
    findDependencies,
    tagResource: tagResource({ rds }),
    untagResource: untagResource({ rds }),
  };
};
