const AWS = require("aws-sdk");
const _ = require("lodash");
const assert = require("assert");
const logger = require("../../logger")({ prefix: "AwsSubnet" });
const { NotAvailable } = require("../ProviderCommon");
const toString = (x) => JSON.stringify(x, null, 4);
const {
  getByNameCore,
  getByIdCore,
  isUpCore,
  isDownCore,
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

  //TODO check state
  const isUp = ({ name }) => isUpCore({ name, getByName });
  const isDown = ({ id, name }) => isDownCore({ id, name, getById });

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

    await ec2.deleteSubnet({ SubnetId: id }).promise();
    logger.debug(`destroy subnet IN PROGRESS, ${toString({ name, id })}`);
  };

  const list = async () => {
    logger.debug(`list`);
    const { Subnets } = await ec2.describeSubnets().promise();
    logger.info(`list ${toString(Subnets)}`);

    return {
      data: {
        total: Subnets.length,
        items: Subnets,
      },
    };
  };

  const configDefault = async ({ name, properties, dependenciesLive }) => {
    logger.debug(`configDefault ${toString({ dependenciesLive })}`);
    // Need vpc name here in parameter
    const { vpc } = dependenciesLive;
    const config = {
      ...(vpc && { VpcId: _.get(vpc, "VpcId", NotAvailable) }),
      ...properties,
    };
    logger.debug(`configDefault ${name} result: ${toString(config)}`);
    return config;
  };

  return {
    type: "Subnet",
    spec,
    findId,
    getByName,
    getById,
    findName,
    cannotBeDeleted: () => false,
    list,
    create,
    destroy,
    configDefault,
    isUp,
    isDown,
  };
};
