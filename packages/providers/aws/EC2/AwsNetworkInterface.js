const { get, pipe, filter, map, tap, eq, switchCase, not } = require("rubico");
const { defaultsDeep, isEmpty, first, identity } = require("rubico/x");
const assert = require("assert");

const logger = require("@grucloud/core/logger")({
  prefix: "AwsNetworkInterface",
});
const { tos } = require("@grucloud/core/tos");
const {
  Ec2New,
  findNameInTagsOrId,
  shouldRetryOnException,
} = require("../AwsCommon");

exports.AwsNetworkInterface = ({ spec, config }) => {
  const ec2 = Ec2New(config);

  const findId = get("NetworkInterfaceId");

  const findName = (item) => findNameInTagsOrId({ item, findId });

  const getList = ({ params } = {}) =>
    pipe([
      tap(() => {
        logger.info(`getList network interfaces ${JSON.stringify(params)}`);
      }),
      () => ec2().describeNetworkInterfaces(params),
      get("NetworkInterfaces"),
      tap((items) => {
        logger.debug(`getList network interfaces result: ${tos(items)}`);
      }),
      (items) => ({
        total: items.length,
        items,
      }),
      tap(({ total }) => {
        logger.info(`getList #network interfaces ${total}`);
      }),
    ])();

  return {
    type: "NetworkInterface",
    spec,
    findId,
    findName,
    getList,
    shouldRetryOnException,
  };
};
