const AWS = require("aws-sdk");
const _ = require("lodash");
const assert = require("assert");
const logger = require("../../logger")({ prefix: "AwsClientEC2" });
const { getByNameCore } = require("../Common");
const toString = (x) => JSON.stringify(x, null, 4);
const StateTerminated = ["terminated"];
const KeyName = "Name";

module.exports = AwsClientEC2 = ({ spec, config }) => {
  assert(spec);
  assert(config);
  const { managedByKey, managedByValue } = config;

  //TODO move to provider
  AWS.config.apiVersions = {
    ec2: "2016-11-15",
  };

  const ec2 = new AWS.EC2();

  const findName = (item) => {
    assert(item);
    assert(item.Instances);
    const tag = item.Instances[0].Tags.find((tag) => tag.Key === KeyName);
    if (tag?.Value) {
      logger.debug(`findName ${toString({ name: tag.Value, item })}`);
      return tag.Value;
    } else {
      throw Error(`cannot find name in ${toString(item)}`);
    }
  };

  const getByName = ({ name }) => getByNameCore({ name, list, findName });

  const findId = (item) => {
    assert(item);
    const id = item.Instances[0].InstanceId;
    assert(id);
    return id;
  };

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

  const getStateName = (instance) => {
    const state = instance.Instances[0].State.Name;
    logger.debug(`stateName ${state}`);
    return state;
  };

  const isUp = async ({ name }) => {
    logger.debug(`isUp ${name}`);
    assert(name);
    let up = false;
    const instance = await getByName({ name });
    if (instance) {
      up = ["running"].includes(getStateName(instance));
    }
    logger.info(`isUp ${name} ${up ? "UP" : "NOT UP"}`);
    return up;
  };

  const isDown = async ({ name }) => {
    logger.debug(`isDown ec2 ${name}`);
    assert(name);
    let down = false;
    const instance = await getByName({ name });
    if (!instance) {
      down = true;
    } else {
      down = StateTerminated.includes(getStateName(instance));
    }
    logger.info(`isDown ec2 ${name} ${down ? "DOWN" : "NOT DOWN"}`);
    return down;
  };

  const create = async ({ name, payload }) => {
    assert(name);
    assert(payload);
    logger.debug(`create ${toString({ name, payload })}`);
    const data = await ec2.runInstances(payload).promise();
    logger.debug(`create result ${toString(data)}`);
    return data.Instances[0];
  };

  const list = async () => {
    logger.debug(`list`);
    const data = await ec2.describeInstances().promise();
    logger.debug(`list ${toString(data)}`);
    const items = data.Reservations.filter(
      (reservation) =>
        !StateTerminated.includes(reservation.Instances[0].State.Name)
    );
    logger.debug(`list filtered: ${toString(items)}`);
    return {
      data: {
        total: items.length,
        items,
      },
    };
  };

  const destroy = async ({ id, name }) => {
    logger.debug(`destroy ec2 ${toString({ name, id })}`);
    if (_.isEmpty(id)) {
      throw Error(`destroy invalid id`);
    }

    await ec2
      .terminateInstances({
        InstanceIds: [id],
      })
      .promise();
  };
  const configDefault = async ({ name, properties, dependenciesLive }) => {
    const { keyPair, securityGroups = {} } = dependenciesLive;
    logger.debug(`configDefault ${toString({ dependenciesLive })}`);

    return {
      ...{
        BlockDeviceMappings: [
          {
            DeviceName: "/dev/sdh",
            Ebs: {
              VolumeSize: properties.VolumeSize,
            },
          },
        ],
        ImageId: properties.ImageId, // Ubuntu 20.04
        InstanceType: properties.InstanceType,
        MaxCount: properties.MaxCount,
        MinCount: properties.MinCount,
        //TODO subnet
        //SubnetId: "subnet-6e7f829e",
        TagSpecifications: [
          {
            ResourceType: "instance",
            Tags: [
              {
                Key: KeyName,
                Value: name,
              },
              {
                Key: managedByKey,
                Value: managedByValue,
              },
            ],
          },
        ],
      },
      [keyPair && "KeyName"]: keyPair.KeyName,
      [!_.isEmpty(securityGroups) && "SecurityGroupIds"]: _.map(
        securityGroups,
        (sg) => _.get(sg, "GroupId", "<<NA>>")
      ),
    };
  };

  return {
    type: "Instance",
    spec,
    ec2,
    isUp,
    isDown,
    findId,
    getById,
    getByName,
    findName,
    create,
    destroy,
    list,
    configDefault,
  };
};
