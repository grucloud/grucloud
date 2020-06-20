const AWS = require("aws-sdk");
const _ = require("lodash");
const assert = require("assert");
const logger = require("../../logger")({ prefix: "AwsSubnet" });
const { getField } = require("../ProviderCommon");
const toString = (x) => JSON.stringify(x, null, 4);
const {
  getByNameCore,
  getByIdCore,
  isUpByIdCore,
  isDownByIdCore,
} = require("../Common");
const { findNameInTags } = require("./AwsCommon");
const { tagResource } = require("./AwsTagResource");

module.exports = AwsSubnet = ({ spec, config }) => {
  assert(spec);
  assert(config);

  const ec2 = new AWS.EC2();

  const findName = findNameInTags;

  const findId = (item) => {
    assert(item);
    const id = item.SubnetId;
    assert(id);
    return id;
  };

  const getByName = ({ name }) => getByNameCore({ name, list, findName });
  const getById = ({ id }) => getByIdCore({ id, list, findId });

  const isUpById = isUpByIdCore({ getById });
  const isDownById = isDownByIdCore({ getById });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#createSubnet-property
  const create = async ({ name, payload }) => {
    assert(name);
    assert(payload);
    logger.debug(`create subnet ${toString({ name, payload })}`);
    const {
      Subnet: { SubnetId },
    } = await ec2.createSubnet(payload).promise();
    logger.info(`create subnet ${SubnetId}`);

    await tagResource({
      config,
      name,
      resourceType: "subnet",
      resourceId: SubnetId,
    });
    return { SubnetId };
  };
  const destroy = async ({ id, name }) => {
    logger.debug(`destroy subnet ${toString({ name, id })}`);

    if (_.isEmpty(id)) {
      throw Error(`destroy subnet invalid id`);
    }

    const result = await ec2.deleteSubnet({ SubnetId: id }).promise();
    logger.debug(
      `destroy subnet IN PROGRESS, ${toString({ name, id, result })}`
    );
    return result;
  };

  const list = async () => {
    logger.debug(`list`);
    const { Subnets } = await ec2.describeSubnets().promise();
    logger.info(`list ${toString(Subnets)}`);

    return {
      total: Subnets.length,
      items: Subnets,
    };
  };

  const configDefault = async ({ name, properties, dependenciesLive }) => {
    logger.debug(`configDefault ${toString({ dependenciesLive })}`);
    // Need vpc name here in parameter
    const { vpc } = dependenciesLive;
    const config = {
      ...(vpc && { VpcId: getField(vpc, "VpcId") }),
      ...properties,
    };
    logger.debug(`configDefault ${name} result: ${toString(config)}`);
    return config;
  };

  return {
    type: "Subnet",
    spec,
    findId,
    isUpById,
    isDownById,
    getByName,
    getById,
    findName,
    cannotBeDeleted: () => false,
    list,
    create,
    destroy,
    configDefault,
  };
};
