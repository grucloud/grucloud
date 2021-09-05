const assert = require("assert");
const { map, pipe, tap, get, eq, pick, assign } = require("rubico");
const { first, defaultsDeep, isEmpty, pluck, includes } = require("rubico/x");
const { getField } = require("@grucloud/core/ProviderCommon");
const logger = require("@grucloud/core/logger")({
  prefix: "DBInstance",
});
const { getByNameCore } = require("@grucloud/core/Common");
const { buildTags, shouldRetryOnException } = require("../AwsCommon");

const { AwsClient } = require("../AwsClient");

const findId = get("live.DBInstanceIdentifier");
const pickId = pick(["DBInstanceIdentifier"]);
const findName = findId;
const isInstanceUp = pipe([eq(get("DBInstanceStatus"), "available")]);

exports.DBInstance = ({ spec, config }) => {
  const client = AwsClient({ spec, config });

  const findDependencies = ({ live, lives }) => [
    {
      type: "DBSubnetGroup",
      group: "RDS",
      ids: [get("DBSubnetGroup.DBSubnetGroupName")(live)],
    },
    {
      type: "SecurityGroup",
      group: "EC2",
      ids: pipe([get("VpcSecurityGroups"), pluck("VpcSecurityGroupId")])(live),
    },
    {
      type: "Key",
      group: "KMS",
      ids: [live.KmsKeyId],
    },
  ];

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/RDS.html#describeDBInstances-property
  const getList = client.getList({
    method: "describeDBInstances",
    getParam: "DBInstances",
  });

  const getByName = getByNameCore({ getList, findName });

  const getById = client.getById({
    pickId,
    method: "describeDBInstances",
    getField: "DBInstances",
    ignoreErrorCodes: ["DBInstanceNotFound"],
  });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/RDS.html#createDBInstance-property
  const create = client.create({
    pickCreated: () => pick(["DBInstance"]),
    method: "createDBInstance",
    getById,
    isInstanceUp,
    config: { ...config, retryCount: 100 },
  });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/RDS.html#modifyDBInstance-property
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/RDS.html#describeValidDBInstanceModifications-property
  const update = client.update({
    pickId,
    method: "modifyDBInstance",
    filterParams: assign({ ApplyImmediately: () => true }),
    getById,
    config: { ...config, retryCount: 100 },
  });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/RDS.html#deleteDBInstance-property
  const destroy = client.destroy({
    pickId,
    extraParam: {
      SkipFinalSnapshot: true,
    },
    method: "deleteDBInstance",
    getById,
    ignoreError: ({ code }) =>
      pipe([
        () => ["DBInstanceNotFound", "InvalidDBInstanceStateFault"],
        includes(code),
      ]),
    config,
  });

  const configDefault = ({
    name,
    namespace,
    properties,
    dependencies: { dbSubnetGroup, securityGroups, kmsKey },
  }) =>
    pipe([
      tap(() => {
        assert(
          !isEmpty(properties.MasterUserPassword),
          "MasterUserPassword is empty"
        );
      }),
      () => properties,
      defaultsDeep({
        DBInstanceIdentifier: name,
        DBSubnetGroupName: dbSubnetGroup.config.DBSubnetGroupName,
        VpcSecurityGroupIds: map((sg) => getField(sg, "GroupId"))(
          securityGroups
        ),
        ...(kmsKey && { KmsKeyId: getField(kmsKey, "Arn") }),
        Tags: buildTags({ config, namespace, name }),
      }),
    ])();

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
    shouldRetryOnException,
    findDependencies,
  };
};
