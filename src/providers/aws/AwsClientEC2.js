var AWS = require("aws-sdk");
const _ = require("lodash");
const assert = require("assert");
const logger = require("logger")({ prefix: "AwsClientEC2" });
const toString = (x) => JSON.stringify(x, null, 4);

module.exports = AwsClientEc2 = ({ spec, config }) => {
  assert(spec);
  assert(config);
  assert(config.region, "missing region");

  logger.info(`${toString(config)}`);

  AWS.config.apiVersions = {
    ec2: "2016-11-15",
  };

  AWS.config.update({ region: config.region });

  var ec2 = new AWS.EC2();

  const getById = async ({ id }) => {
    logger.debug(`getById ${toString({ id })}`);
    const {
      data: { items },
    } = list();
    // TODO check that

    const instance = items.find((item) => item.Instances[0].InstanceId === id);
    logger.debug(`getById result ${toString({ instance })}`);
    return instance;
  };

  const getByName = async ({ name }) => {
    logger.info(`getByName ${name}`);
    const {
      data: { items },
    } = await list();

    const findTagName = (tags = []) =>
      tags.find((tag) => tag.Key === "name" && tag.Value === name);

    const instance = items.find((item) => findTagName(item.Instances[0].Tags));
    logger.debug(`getByName result ${toString({ instance })}`);
    return instance?.Instances[0];
  };

  const create = async ({ name, payload }) => {
    assert(name);
    assert(payload);
    logger.debug(`create ${toString({ name, payload })}`);
    const data = await ec2.runInstances(params).promise();
    console.log(`create result ${toString(data)}`);
    return data.Instances[0];
  };

  const list = async () => {
    logger.debug(`list`);
    const data = await ec2.describeInstances().promise();
    console.log(toString(data));
    return {
      data: {
        total: data.Reservations.length,
        items: data.Reservations,
      },
    };
  };

  const destroy = async ({ id, name }) => {
    logger.debug(`destroy ${toString({ name, id })}`);
    if (_.isEmpty(id)) {
      throw Error(`destroy invalid id`);
    }

    await ec2
      .terminateInstances({
        InstanceIds: [id],
      })
      .promise();
  };

  return {
    spec,
    ec2,
    getById,
    getByName,
    create,
    destroy,
    list,
  };
};
