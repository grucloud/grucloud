var AWS = require("aws-sdk");
const _ = require("lodash");
const assert = require("assert");
const logger = require("../../logger")({ prefix: "AwsClientKeyPair" });
const toString = (x) => JSON.stringify(x, null, 4);
const { getByNameCore, findNameCore } = require("../Common");

module.exports = AwsClientKeyPair = ({ spec, config }) => {
  assert(spec);
  assert(config);

  logger.info(`${toString(config)}`);

  const ec2 = new AWS.EC2();

  const findName = (item) => findNameCore({ item, field: "KeyName" });
  const getByName = ({ name }) => getByNameCore({ name, list, findName });

  const list = async () => {
    logger.debug(`list`);
    const { KeyPairs } = await ec2.describeKeyPairs().promise();
    logger.debug(`list ${toString(KeyPairs)}`);

    return {
      data: {
        total: KeyPairs.length,
        items: KeyPairs,
      },
    };
  };

  return {
    type: "KeyPair",
    spec,
    findName,
    getByName,
    list,
  };
};
