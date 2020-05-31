var AWS = require("aws-sdk");
const _ = require("lodash");
const assert = require("assert");
const { retryExpectOk } = require("../Retry");
const { getByNameCore, findNameCore } = require("../Common");

const logger = require("../../logger")({ prefix: "AwsSecurityGroup" });
const toString = (x) => JSON.stringify(x, null, 4);

module.exports = AwsSecurityGroup = ({ spec, config }) => {
  assert(spec);
  assert(config);
  const { managedByDescription } = config;
  const ec2 = new AWS.EC2();

  const findName = (item) => findNameCore({ item, field: "GroupName" });
  const getByName = ({ name }) => getByNameCore({ name, list, findName });

  //rename in findId
  const findId = (item) => {
    assert(item);
    const id = item.GroupId;
    assert(id);
    return id;
  };

  //TODO in common
  const getById = async ({ id }) => {
    assert(id);
    logger.debug(`getById ${toString({ id })}`);
    const {
      data: { items },
    } = list();
    const instance = items.find((item) => findId(item) === id);
    logger.debug(`getById result ${toString({ instance })}`);
    return instance;
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
    //assert(payload.create, "Missing create field");
    const createParams = {
      Description: managedByDescription,
      GroupName: name,
      ...payload.create,
    };

    logger.debug(`create sg ${toString({ name, createParams, payload })}`);
    const { GroupId } = await ec2.createSecurityGroup(createParams).promise();
    logger.debug(`create GroupId ${toString(GroupId)}`);

    //TODO empty ingress ?
    // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#authorizeSecurityGroupIngress-property
    const ingressParam = {
      GroupId,
      ...payload.ingress,
    };
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
  //TODO
  const configDefault = async ({ properties }) => properties;
  return {
    type: "SecurityGroup",
    spec,
    findId,
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
