const assert = require("assert");
const { get, pipe, tap, filter, map } = require("rubico");
const { defaultsDeep, isEmpty } = require("rubico/x");

const logger = require("../../../logger")({ prefix: "AwsEip" });
const { tos } = require("../../../tos");
const { retryCall } = require("../../Retry");
const { getByIdCore, buildTags } = require("../AwsCommon");
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
        logger.info(`create elastic ip address ${JSON.stringify({ name })}`);
        logger.debug(`eip payload ${tos({ payload })}`);
      }),
      () => ec2().allocateAddress(payload),
      get("AllocationId"),
      tap((AllocationId) =>
        retryCall({
          name: `eip isUpById: ${name} id: ${AllocationId}`,
          fn: () => isUpById({ id: AllocationId }),
          config,
        })
      ),
      tap(() => {
        logger.info(`created elastic ip address ${JSON.stringify({ name })}`);
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
      () =>
        retryCall({
          name: `destroy eip isDownById: ${name} id: ${id}`,
          fn: () => isDownById({ id }),
          config,
        }),
      tap(() => {
        logger.debug(`destroyed elastic ip address ${tos({ name, id })}`);
      }),
    ])();

  const configDefault = async ({ name, properties }) =>
    defaultsDeep({
      Domain: "Vpc",
      TagSpecifications: [
        {
          ResourceType: "elastic-ip",
          Tags: buildTags({ config, name }),
        },
      ],
    })(properties);

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
