const { get, pipe, filter, map, tap, eq, switchCase, not } = require("rubico");
const { pluck, includes } = require("rubico/x");
const logger = require("@grucloud/core/logger")({
  prefix: "AwsNetworkAcl",
});
const { tos } = require("@grucloud/core/tos");
const {
  Ec2New,
  findNameInTagsOrId,
  shouldRetryOnException,
} = require("../AwsCommon");

exports.AwsNetworkAcl = ({ spec, config }) => {
  const ec2 = Ec2New(config);

  const findId = get("live.NetworkAclId");
  const findName = findNameInTagsOrId({ findId });
  const isDefault = get("live.IsDefault");
  const findDependencies = ({ live }) => [
    { type: "Vpc", group: "ec2", ids: [live.VpcId] },
    {
      type: "Subnet",
      group: "ec2",
      ids: pipe([() => live, get("Associations"), pluck("SubnetId")])(),
    },
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
      (items) => ({
        total: items.length,
        items,
      }),
      tap(({ total }) => {
        logger.info(`getList #nacl ${total}`);
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
