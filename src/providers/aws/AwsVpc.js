var AWS = require("aws-sdk");
const _ = require("lodash");
const assert = require("assert");
const logger = require("../../logger")({ prefix: "AwsVpc" });
const toString = (x) => JSON.stringify(x, null, 4);
const { getByNameCore, findNameCore } = require("../Common");

module.exports = AwsVpc = ({ spec, config }) => {
  assert(spec);
  assert(config);

  const ec2 = new AWS.EC2();

  //TODO check name
  const findName = (item) => findNameCore({ item, field: "Vpc" });
  const getByName = ({ name }) => getByNameCore({ name, list, findName });

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

  return {
    type: "Vpc",
    spec,
    getByName,
    list,
  };
};
