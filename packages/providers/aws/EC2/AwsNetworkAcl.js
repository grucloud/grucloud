const { get, pipe, tap } = require("rubico");
const { pluck } = require("rubico/x");
const logger = require("@grucloud/core/logger")({
  prefix: "AwsNetworkAcl",
});
const { tos } = require("@grucloud/core/tos");
const {
  Ec2New,
  findNameInTagsOrId,
  shouldRetryOnException,
} = require("../AwsCommon");
const { AwsClient } = require("../AwsClient");

exports.AwsNetworkAcl = ({ spec, config }) => {
  const client = AwsClient({ spec, config });
  const ec2 = Ec2New(config);

  const findId = get("live.NetworkAclId");
  const findName = findNameInTagsOrId({ findId });
  const isDefault = get("live.IsDefault");

  // findDependencies for NetworkAcl
  const findDependencies = ({ live }) => [
    findDependenciesVpc({ live }),
    findDependenciesSubnet({ live }),
  ];

  const getList = ({ params } = {}) =>
    pipe([
      tap(() => {
        logger.info(`getList nacl ${JSON.stringify(params)}`);
      }),
      () => ec2().describeNetworkAcls(params),
      get("NetworkAcls"),
      tap((items) => {
        logger.debug(`getList nacl result: ${tos(items)}`);
      }),
    ])();

  return {
    spec,
    findId,
    isDefault,
    findName,
    findDependencies,
    getList,
    shouldRetryOnException,
  };
};
