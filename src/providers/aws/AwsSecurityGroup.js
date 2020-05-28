var AWS = require("aws-sdk");
const _ = require("lodash");
const assert = require("assert");
const logger = require("../../logger")({ prefix: "AwsSecurityGroup" });
const toString = (x) => JSON.stringify(x, null, 4);

module.exports = AwsSecurityGroup = ({ spec, config }) => {
  assert(spec);
  assert(config);
  const ec2 = new AWS.EC2();

  const getById = async ({ id }) => {
    assert(id);
    logger.debug(`getById ${toString({ id })}`);
    const {
      data: { items },
    } = list();
    //TODO
    /*
    const instance = items.find((item) => item.Instances[0].InstanceId === id);
    logger.debug(`getById result ${toString({ instance })}`);
    */
    return instance;
  };

  const getByName = async ({ name }) => {
    logger.info(`getByName ${name}`);
    const {
      data: { items },
    } = await list();
    //TODO
    const instance = items.find((item) => item.KeyName === name);
    logger.debug(`getByName result ${toString({ instance })}`);

    return instance;
  };

  const list = async () => {
    logger.debug(`list`);
    const ec2params = {};
    const securityGroups = await new Promise((resolve, reject) => {
      ec2.describeSecurityGroups(ec2params, (error, response) => {
        if (error) {
          return reject(err.message);
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

  return {
    type: "SecurityGroup",
    spec,
    getById,
    getByName,
    list,
  };
};
