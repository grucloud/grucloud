var AWS = require("aws-sdk");
const _ = require("lodash");
const assert = require("assert");
const { retryExpectOk } = require("../Retry");

const logger = require("../../logger")({ prefix: "AwsSecurityGroup" });
const toString = (x) => JSON.stringify(x, null, 4);
const { toTagName } = require("./AwsTags");
module.exports = AwsSecurityGroup = ({ spec, config }) => {
  assert(spec);
  assert(config);
  const { tag } = config;
  const ec2 = new AWS.EC2();

  //rename in findId
  const toId = (item) => {
    assert(item);
    const id = item.GroupId;
    assert(id);
    return id;
  };

  const getById = async ({ id }) => {
    assert(id);
    logger.debug(`getById ${toString({ id })}`);
    const {
      data: { items },
    } = list();
    const instance = items.find((item) => toId(item) === id);
    logger.debug(`getById result ${toString({ instance })}`);
    return instance;
  };

  const getByName = async ({ name }) => {
    logger.info(`getByName ${name}`);
    assert(name);
    const {
      data: { items },
    } = await list();
    const instance = items.find((item) => item.GroupName === name);
    logger.debug(`getByName result ${toString({ instance })}`);

    return instance;
  };

  const findName = (item) => {
    assert(item);
    const { GroupName } = item;
    if (GroupName) {
      return GroupName;
    } else {
      throw Error(`cannot find name in ${toString(item)}`);
    }
  };
  //TODO add in common
  const isUp = async ({ name }) => {
    logger.info(`isUp ${name}`);
    const up = !!(await getByName({ name }));
    logger.info(`isUp ${name} ${up ? "UP" : "NOT UP"}`);
    return up;
  };
  //TODO add in common
  const isDown = async ({ name }) => {
    logger.info(`isDown ${name}`);
    const down = !(await getByName({ name }));
    logger.info(`isDown ${name} ${down ? "DOWN" : "NOT DOWN"}`);
    return down;
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
    const params = {
      Description: toTagName(name, tag),
      GroupName: name,
      //TODO
      //TODO Tags
      //VpcId: 'STRING_VALUE'
    };

    logger.debug(`createSecurityGroup ${toString({ name, params, payload })}`);

    const { GroupId } = await ec2.createSecurityGroup(params).promise();
    logger.debug(`create GroupId ${toString(GroupId)}`);

    // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#authorizeSecurityGroupIngress-property
    const ingressParam = {
      GroupId,
      ...payload,
    };
    logger.debug(`ingressParam ${toString(ingressParam)}`);
    try {
      await ec2.authorizeSecurityGroupIngress(ingressParam).promise();
    } catch (error) {
      logger.error(`authorizeSecurityGroupIngress error ${toString(error)}`);
      throw Error;
    }
    logger.debug(`authorizeSecurityGroupIngress`);

    return { GroupId };
  };

  const destroy = async ({ id, name }) => {
    logger.debug(`destroy sg ${toString({ name, id })}`);

    if (_.isEmpty(id)) {
      throw Error(`destroy invalid id`);
    }

    await ec2.deleteSecurityGroup({ GroupId: id }).promise();
  };
  //TODO
  const configDefault = async ({ properties }) => properties;
  return {
    type: "SecurityGroup",
    spec,
    toId,
    getById,
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
