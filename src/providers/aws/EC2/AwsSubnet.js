const AWS = require("aws-sdk");
const { isEmpty } = require("rubico/x");
const assert = require("assert");
const logger = require("../../../logger")({ prefix: "AwsSn" });
const { getField } = require("../../ProviderCommon");
const { tos } = require("../../../tos");
const {
  getByNameCore,
  getByIdCore,
  isUpByIdCore,
  isDownByIdCore,
} = require("../../Common");
const { findNameInTags } = require("../AwsCommon");
const { tagResource } = require("../AwsTagResource");
const { CheckTagsEC2 } = require("../AwsTagCheck");

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

  const getByName = ({ name }) => getByNameCore({ name, getList, findName });
  const getById = ({ id }) => getByIdCore({ id, getList, findId });

  const isUpById = isUpByIdCore({ getById });
  const isDownById = isDownByIdCore({ getById });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#createSubnet-property
  const create = async ({ name, payload }) => {
    assert(name);
    assert(payload);
    logger.debug(`create subnet ${tos({ name, payload })}`);
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

    const subnet = await getById({ id: SubnetId });

    CheckTagsEC2({
      config,
      tags: subnet.Tags,
      name: name,
    });

    return { SubnetId };
  };
  const destroy = async ({ id, name }) => {
    logger.debug(`destroy subnet ${tos({ name, id })}`);

    if (isEmpty(id)) {
      throw Error(`destroy subnet invalid id`);
    }

    const result = await ec2.deleteSubnet({ SubnetId: id }).promise();
    return result;
  };
  const getList = async ({ params } = {}) => {
    logger.debug(`getList subnet ${tos(params)}`);
    const { Subnets } = await ec2.describeSubnets(params).promise();
    logger.debug(`getList subnet ${tos(Subnets)}`);

    return {
      total: Subnets.length,
      items: Subnets,
    };
  };

  const configDefault = async ({ name, properties, dependencies }) => {
    logger.debug(`configDefault ${tos({ dependencies })}`);
    // Need vpc name here in parameter
    const { vpc } = dependencies;
    const config = {
      ...(vpc && { VpcId: getField(vpc, "VpcId") }),
      ...properties,
    };
    logger.debug(`configDefault ${name} result: ${tos(config)}`);
    return config;
  };

  const cannotBeDeleted = ({ resource }) => {
    logger.debug(`cannotBeDeleted: DefaultForAz: ${resource.DefaultForAz}`);
    return resource.DefaultForAz;
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
    cannotBeDeleted,
    getList,
    create,
    destroy,
    configDefault,
  };
};
