const { get, pipe, filter, map, tap, eq, switchCase, not } = require("rubico");

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

  const findId = get("NetworkAclId");

  const findName = (item) => findNameInTagsOrId({ item, findId });

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
    type: "NetworkAcl",
    spec,
    findId,
    findName,
    getList,
    shouldRetryOnException,
  };
};
