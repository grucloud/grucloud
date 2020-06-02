const AWS = require("aws-sdk");
const _ = require("lodash");
const assert = require("assert");
const logger = require("../../logger")({ prefix: "AwsVpc" });
const toString = (x) => JSON.stringify(x, null, 4);
const {
  getByNameCore,
  getByIdCore,
  isUpCore,
  isDownCore,
} = require("../Common");
const { findNameInTags } = require("./AwsCommon");
const { tagResource } = require("./AwsTagResource");

module.exports = AwsVpc = ({ spec, config }) => {
  assert(spec);
  assert(config);

  const ec2 = new AWS.EC2();

  const findName = findNameInTags;
  const findId = (item) => {
    assert(item);
    const id = item.VpcId;
    assert(id);
    return id;
  };

  const getByName = ({ name }) => getByNameCore({ name, list, findName });
  const getById = ({ id }) => getByIdCore({ id, list, findId });

  const isUp = ({ name }) => isUpCore({ name, getByName });
  const isDown = ({ id, name }) => isDownCore({ id, name, getById });

  const cannotBeDeleted = (item) => {
    assert(item.hasOwnProperty("IsDefault"));
    return item.IsDefault;
  };

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#createVpc-property
  const create = async ({ name, payload }) => {
    assert(name);
    assert(payload);
    logger.debug(`create vpc ${toString({ name, payload })}`);
    const {
      Vpc: { VpcId },
    } = await ec2.createVpc(payload).promise();
    logger.info(`create vpc ${VpcId}`);

    await tagResource({
      config,
      name,
      resourceType: "vpc",
      resourceId: VpcId,
    });
    return { VpcId };
  };
  const destroy = async ({ id, name }) => {
    logger.debug(`destroy vpc ${toString({ name, id })}`);

    if (_.isEmpty(id)) {
      throw Error(`destroy vpc invalid id`);
    }

    await ec2.deleteVpc({ VpcId: id }).promise();
    logger.debug(`destroy vpc IN PROGRESS, ${toString({ name, id })}`);
  };

  const list = async () => {
    logger.debug(`list`);
    const { Vpcs } = await ec2.describeVpcs().promise();
    logger.info(`list ${toString(Vpcs)}`);

    return {
      data: {
        total: Vpcs.length,
        items: Vpcs,
      },
    };
  };
  const configDefault = async ({ properties }) => properties;

  return {
    type: "Vpc",
    spec,
    findId,
    getByName,
    getById,
    findName,
    cannotBeDeleted,
    list,
    create,
    destroy,
    configDefault,
    isUp,
    isDown,
  };
};
