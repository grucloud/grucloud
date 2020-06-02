var AWS = require("aws-sdk");
const _ = require("lodash");
const assert = require("assert");
const { retryExpectOk } = require("../Retry");
const {
  getByNameCore,
  findNameCore,
  isUpCore,
  isDownCore,
} = require("../Common");
const logger = require("../../logger")({ prefix: "AwsSecurityGroup" });
const { tagResource } = require("./AwsTagResource");

const toString = (x) => JSON.stringify(x, null, 4);

module.exports = AwsSecurityGroup = ({ spec, config }) => {
  assert(spec);
  assert(config);
  const { managedByDescription } = config;
  const ec2 = new AWS.EC2();

  const findName = (item) => findNameCore({ item, field: "GroupName" });
  const getByName = ({ name }) => getByNameCore({ name, list, findName });
  const isUp = ({ name }) => isUpCore({ name, getByName });
  const isDown = ({ name }) => isDownCore({ name, getByName });

  const findId = (item) => {
    assert(item);
    const id = item.GroupId;
    assert(id);
    return id;
  };

  const list = async () => {
    logger.debug(`list`);
    const ec2params = {};
    const securityGroups = await new Promise((resolve, reject) => {
      ec2.describeSecurityGroups(ec2params, (error, response) => {
        if (error) {
          return reject(error.message);
        } else {
          logger.debug(`list ${toString(response)}`);
          resolve(response.SecurityGroups);
        }
      });
    });
    logger.debug(`list ${toString(securityGroups)}`);

    return {
      data: {
        total: securityGroups.length,
        items: securityGroups,
      },
    };
  };

  //https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#createSecurityGroup-property
  const create = async ({ name, payload }) => {
    assert(name);
    assert(payload);
    //assert(payload.create, "Missing create field");

    //TODO add tags
    const createParams = {
      Description: managedByDescription,
      GroupName: name,
      ...payload.create,
    };

    logger.debug(`create sg ${toString({ name, createParams, payload })}`);
    const { GroupId } = await ec2.createSecurityGroup(createParams).promise();
    logger.debug(`create GroupId ${toString(GroupId)}`);

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
    logger.debug(`create ingressParam ${toString({ ingressParam })}`);

    await ec2.authorizeSecurityGroupIngress(ingressParam).promise();

    logger.debug(`create sg DONE`);

    return { GroupId };
  };

  const destroy = async ({ id, name }) => {
    logger.debug(`destroy sg ${toString({ name, id })}`);

    if (_.isEmpty(id)) {
      throw Error(`destroy sg invalid id`);
    }

    await ec2.deleteSecurityGroup({ GroupId: id }).promise();
  };
  const configDefault = async ({ name, properties, dependenciesLive }) => {
    logger.debug(`configDefault ${toString({ dependenciesLive })}`);
    const { vpc } = dependenciesLive;
    const config = _.merge({
      create: { [vpc && "VpcId"]: _.get(vpc, "VpcId", "<<NA>>") },
      properties,
    });
    logger.debug(`configDefault ${name} result: ${toString(config)}`);
    return config;
  };

  return {
    type: "SecurityGroup",
    spec,
    findId,
    getByName,
    findName,
    isUp,
    isDown,
    list,
    create,
    destroy,
    configDefault,
  };
};
