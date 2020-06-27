var AWS = require("aws-sdk");
const { defaultsDeep } = require("lodash/fp");
const assert = require("assert");
const { getByIdCore } = require("./AwsCommon");
const { retryExpectOk } = require("../Retry");
const { getField } = require("../ProviderCommon");

const {
  getByNameCore,
  findField,
  isUpByIdCore,
  isDownByIdCore,
} = require("../Common");
const logger = require("../../logger")({ prefix: "AwsSecurityGroup" });
const { tagResource } = require("./AwsTagResource");

const { tos } = require("../../tos");
module.exports = AwsSecurityGroup = ({ spec, config }) => {
  assert(spec);
  assert(config);
  const { managedByDescription } = config;
  const ec2 = new AWS.EC2();

  const findName = (item) => findField({ item, field: "GroupName" });
  const findId = (item) => {
    assert(item);
    const id = item.GroupId;
    assert(id);
    return id;
  };

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#describeSecurityGroups-property
  const list = async (params = {}) => {
    logger.debug(`list`);
    const securityGroups = await new Promise((resolve, reject) => {
      ec2.describeSecurityGroups(params, (error, response) => {
        if (error) {
          return reject(error.message);
        } else {
          logger.debug(`list ${tos(response)}`);
          resolve(response.SecurityGroups);
        }
      });
    });
    logger.debug(`list ${tos(securityGroups)}`);

    return {
      total: securityGroups.length,
      items: securityGroups,
    };
  };

  const getByName = ({ name }) => getByNameCore({ name, list, findName });
  const getById = getByIdCore({ fieldIds: "GroupIds", list });

  const isUpById = isUpByIdCore({ getById });
  const isDownById = isDownByIdCore({ getById });

  const cannotBeDeleted = (item) => {
    assert(item.GroupName);
    return item.GroupName === "default";
  };

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#createSecurityGroup-property
  const create = async ({ name, payload }) => {
    assert(name);
    assert(payload);

    const createParams = {
      Description: managedByDescription,
      GroupName: name,
      ...payload.create,
    };

    logger.debug(`create sg ${tos({ name, createParams, payload })}`);
    const { GroupId } = await ec2.createSecurityGroup(createParams).promise();
    logger.debug(`create GroupId ${tos(GroupId)}`);

    await retryExpectOk({
      name: `isUpById: ${name} id: ${GroupId}`,
      fn: () => isUpById({ id: GroupId }),
      isOk: (result) => result,
    });

    await tagResource({
      config,
      name,
      resourceType: "security-group",
      resourceId: GroupId,
    });

    //TODO empty ingress ?
    // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#authorizeSecurityGroupIngress-property
    const ingressParam = {
      GroupId,
      ...payload.ingress,
    };
    logger.debug(`create ingressParam ${tos({ ingressParam })}`);

    await ec2.authorizeSecurityGroupIngress(ingressParam).promise();

    logger.debug(`create sg DONE`);

    return { GroupId };
  };

  const destroy = async ({ id, name }) => {
    logger.debug(`destroy sg ${tos({ name, id })}`);
    assert(id);
    const result = await ec2.deleteSecurityGroup({ GroupId: id }).promise();
    logger.debug(`destroy sg IN PROGRESS, ${tos({ name, id, result })}`);
    return result;
  };
  const configDefault = async ({ name, properties, dependenciesLive }) => {
    logger.debug(
      `configDefault sg ${tos({ name, properties, dependenciesLive })}`
    );
    // TODO Need vpc name here in parameter
    const { vpc } = dependenciesLive;
    const config = defaultsDeep(properties, {
      create: {
        ...(vpc && { VpcId: getField(vpc, "VpcId") }),
      },
    });
    logger.debug(`configDefault sg ${name} result: ${tos(config)}`);
    return config;
  };

  return {
    type: "SecurityGroup",
    spec,
    findId,
    getByName,
    getById,
    findName,
    cannotBeDeleted,
    isUpById,
    isDownById,
    list,
    create,
    destroy,
    configDefault,
  };
};
