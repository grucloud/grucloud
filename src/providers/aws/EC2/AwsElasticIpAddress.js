const assert = require("assert");
const AWS = require("aws-sdk");
const { get, pipe, filter, map } = require("rubico");
const { defaultsDeep, isEmpty } = require("rubico/x");

const logger = require("../../../logger")({ prefix: "AwsEip" });
const { tos } = require("../../../tos");
const { retryExpectOk } = require("../../Retry");
const { getByIdCore } = require("../AwsCommon");
const { getByNameCore, isUpByIdCore, isDownByIdCore } = require("../../Common");
const { findNameInTags } = require("../AwsCommon");
const { tagResource } = require("../AwsTagResource");
const { CheckAwsTags } = require("../AwsTagCheck");

module.exports = AwsElasticIpAddress = ({ spec, config }) => {
  assert(spec);
  assert(config);

  const ec2 = new AWS.EC2();

  const findName = findNameInTags;
  const findId = get("AllocationId");
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#describeAddresses-property
  const getList = async ({ params } = {}) => {
    logger.debug(`getList ${tos(params)}`);
    const { Addresses } = await ec2.describeAddresses(params).promise();
    logger.debug(`getList ${tos(Addresses)}`);

    return {
      total: Addresses.length,
      items: Addresses,
    };
  };

  const getByName = ({ name }) => getByNameCore({ name, getList, findName });
  const getById = getByIdCore({ fieldIds: "AllocationIds", getList });
  const isUpById = isUpByIdCore({ getById });
  const isDownById = isDownByIdCore({ getById });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#allocateAddress-property
  const create = async ({ name, payload }) => {
    assert(name);
    //assert(payload);

    logger.debug(`create elastic ip ${tos({ name, payload })}`);
    const { AllocationId } = await ec2.allocateAddress(payload).promise();
    logger.info(`created elastic ip ${AllocationId}`);

    await retryExpectOk({
      name: `isUpById: ${name} id: ${AllocationId}`,
      fn: () => isUpById({ id: AllocationId }),
      config,
    });

    await tagResource({
      config,
      name,
      resourceType: "eip",
      resourceId: AllocationId,
    });
    const eipLive = await getById({ id: AllocationId });

    assert(
      CheckAwsTags({
        config,
        tags: eipLive.Tags,
        name,
      }),
      `missing tag for ${name}`
    );

    return { id: AllocationId };
  };
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#releaseAddress-property
  const destroy = async ({ id, name }) => {
    logger.debug(`destroy elastic ip address ${tos({ name, id })}`);

    assert(!isEmpty(id), `destroy invalid id`);

    const eipLive = await getById({ id });

    assert(eipLive, `Cannot get elastic ip: ${id}`);

    const result = await ec2.releaseAddress({ AllocationId: id }).promise();
    logger.debug(`destroy vpc IN PROGRESS, ${tos({ name, id, result })}`);
    return result;
  };

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
  };
};
