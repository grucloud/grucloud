const AWS = require("aws-sdk");
const _ = require("lodash");
const assert = require("assert");
const { pipe, tryCatch } = require("rubico");
const { head, tap, props } = require("ramda");
const logger = require("../../logger")({ prefix: "AwsVpc" });
const tos = (x) => JSON.stringify(x, null, 4);
const { retryExpectOk } = require("../Retry");
const { getByIdCore } = require("./AwsCommon");
const {
  getByNameCore,
  isUpByNameCore,
  isUpByIdCore,
  isDownByIdCore,
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

  const list = async (params = {}) => {
    logger.debug(`list`);
    const { Vpcs } = await ec2.describeVpcs(params).promise();
    logger.info(`list ${tos(Vpcs)}`);

    return {
      data: {
        total: Vpcs.length,
        items: Vpcs,
      },
    };
  };

  const getByName = ({ name }) => getByNameCore({ name, list, findName });
  const isUpByName = ({ name }) => isUpByNameCore({ name, getByName });

  const getById = getByIdCore({ fieldIds: "VpcIds", list });

  const getStateName = (instance) => instance.State;

  const isUpById = isUpByIdCore({
    states: ["available"],
    getStateName,
    getById,
  });
  const isDownById = isDownByIdCore({ getById });

  const cannotBeDeleted = (item) => {
    assert(item.hasOwnProperty("IsDefault"));
    return item.IsDefault;
  };

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#createVpc-property
  const create = async ({ name, payload }) => {
    assert(name);
    assert(payload);
    logger.debug(`create vpc ${tos({ name, payload })}`);
    const {
      Vpc: { VpcId },
    } = await ec2.createVpc(payload).promise();
    logger.info(`create vpc ${VpcId}`);

    await retryExpectOk({
      name: `isUpById: ${name} id: ${VpcId}`,
      fn: () => isUpById({ id: VpcId }),
      isOk: (result) => result,
    });

    await tagResource({
      config,
      name,
      resourceType: "vpc",
      resourceId: VpcId,
    });
    return { VpcId };
  };
  const destroy = async ({ id, name }) => {
    logger.debug(`destroy vpc ${tos({ name, id })}`);

    if (_.isEmpty(id)) {
      throw Error(`destroy vpc invalid id`);
    }

    await ec2.deleteVpc({ VpcId: id }).promise();
    logger.debug(`destroy vpc IN PROGRESS, ${tos({ name, id })}`);
  };

  const configDefault = async ({ properties }) => properties;

  return {
    type: "Vpc",
    spec,
    findId,
    isUpById,
    isDownById,
    isUpByName,
    getByName,
    getById,
    findName,
    cannotBeDeleted,
    list,
    create,
    destroy,
    configDefault,
  };
};
