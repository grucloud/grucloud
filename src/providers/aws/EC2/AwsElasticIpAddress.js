const assert = require("assert");
const { get, pipe, tap, filter, map } = require("rubico");
const { defaultsDeep, isEmpty } = require("rubico/x");

const logger = require("../../../logger")({ prefix: "AwsEip" });
const { tos } = require("../../../tos");
const { retryCall } = require("../../Retry");
const { getByIdCore } = require("../AwsCommon");
const { getByNameCore, isUpByIdCore, isDownByIdCore } = require("../../Common");
const {
  Ec2New,
  findNameInTags,
  shouldRetryOnException,
} = require("../AwsCommon");
const { tagResource } = require("../AwsTagResource");
const { CheckAwsTags } = require("../AwsTagCheck");

module.exports = AwsElasticIpAddress = ({ spec, config }) => {
  assert(spec);
  assert(config);

  const ec2 = Ec2New(config);

  const findName = findNameInTags;
  const findId = get("AllocationId");
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#describeAddresses-property

  const getList = ({ params } = {}) =>
    pipe([
      tap(() => {
        logger.info(`getList eip ${JSON.stringify(params)}`);
      }),
      () => ec2().describeAddresses(params),
      get("Addresses"),
      tap((items) => {
        logger.debug(`getList iep result: ${tos(items)}`);
      }),
      (items) => ({
        total: items.length,
        items,
      }),
      tap(({ total }) => {
        logger.info(`getList #eip ${total}`);
      }),
    ])();

  const getByName = ({ name }) => getByNameCore({ name, getList, findName });
  const getById = getByIdCore({ fieldIds: "AllocationIds", getList });
  const isUpById = isUpByIdCore({ getById });
  const isDownById = isDownByIdCore({ getById });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#allocateAddress-property

  const create = async ({ payload, name }) =>
    pipe([
      tap(() => {
        logger.info(`create elastic ip address ${tos({ name })}`);
      }),
      () => ec2().allocateAddress(payload),
      get("AllocationId"),
      tap((AllocationId) =>
        pipe([
          () =>
            retryCall({
              name: `eip isUpById: ${name} id: ${AllocationId}`,
              fn: () => isUpById({ id: AllocationId }),
              config,
            }),
          () =>
            tagResource({
              config,
              name,
              resourceType: "eip",
              resourceId: AllocationId,
            }),
          () => getById({ id: AllocationId }),
          (eipLive) => {
            assert(
              CheckAwsTags({
                config,
                tags: eipLive.Tags,
                name,
              }),
              `missing tag for ${name}`
            );
          },
        ])()
      ),
      tap(() => {
        logger.info(`created elastic ip address ${tos({ name })}`);
      }),
      (AllocationId) => ({ id: AllocationId }),
    ])();

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#releaseAddress-property
  const destroy = async ({ id, name }) =>
    pipe([
      tap(() => {
        logger.debug(`destroy elastic ip address ${tos({ name, id })}`);
        assert(!isEmpty(id), `destroy invalid id`);
      }),
      () => ec2().releaseAddress({ AllocationId: id }),
      tap(() => {
        logger.debug(`destroyed elastic ip address ${tos({ name, id })}`);
      }),
    ])();

  const configDefault = async ({ properties }) =>
    defaultsDeep({ Domain: "Vpc" })(properties);

  return {
    type: "ElasticIpAddress",
    spec,
    findId,
    isUpById,
    isDownById,
    getByName,
    getById,
    findName,
    getList,
    create,
    destroy,
    configDefault,
    shouldRetryOnException,
  };
};
