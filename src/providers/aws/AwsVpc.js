var AWS = require("aws-sdk");
const _ = require("lodash");
const assert = require("assert");
const logger = require("../../logger")({ prefix: "AwsVpc" });
const toString = (x) => JSON.stringify(x, null, 4);

module.exports = AwsVpc = ({ spec, config }) => {
  assert(spec);
  assert(config);

  logger.info(`${toString(config)}`);

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
    const { Vpcs } = await ec2.describeVpcs().promise();
    logger.debug(`list ${toString(Vpcs)}`);

    return {
      data: {
        total: Vpcs.length,
        items: Vpcs,
      },
    };
  };

  return {
    type: "Vpc",
    spec,
    getById,
    getByName,
    list,
  };
};
