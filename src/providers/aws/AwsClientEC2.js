const AWS = require("aws-sdk");
const _ = require("lodash");
const assert = require("assert");
const logger = require("../../logger")({ prefix: "AwsClientEC2" });
const { getByNameCore } = require("../Common");
const toString = (x) => JSON.stringify(x, null, 4);
const StateTerminated = ["terminated"];
const { KeyName, findNameInTags } = require("./AwsCommon");

module.exports = AwsClientEC2 = ({ spec, config }) => {
  assert(spec);
  assert(config);
  const { managedByKey, managedByValue } = config;

  const ec2 = new AWS.EC2();
  //TODO
  //const findName = (item) => findNameInTags(item.Instances[0]);
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

  const findId = (item) => {
    assert(item);
    const id = item.Instances[0].InstanceId;
    assert(id);
    return id;
  };
  const getByName = ({ name }) => getByNameCore({ name, list, findName });
  const getById = ({ id }) => getByIdCore({ id, list, findId });

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
    logger.debug(`create ec2 ${toString({ name, payload })}`);
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

    logger.debug(`destroy ec2 in progress, ${toString({ name, id })}`);
  };
  const configDefault = async ({ name, properties, dependenciesLive }) => {
    logger.debug(`configDefault ${toString({ dependenciesLive })}`);
    const { keyPair, securityGroups = {} } = dependenciesLive;
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
    getByName,
    getById,
    cannotBeDeleted: () => false,
    findName,
    create,
    destroy,
    list,
    configDefault,
  };
};
