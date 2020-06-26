const AWS = require("aws-sdk");
const _ = require("lodash");
const assert = require("assert");
const logger = require("../../logger")({ prefix: "AwsClientEC2" });
const { getByNameCore, isUpByIdCore, isDownByIdCore } = require("../Common");
const { retryExpectOk } = require("../Retry");

const toString = (x) => JSON.stringify(x, null, 4);
const StateTerminated = ["terminated"];
const { KeyName, getByIdCore } = require("./AwsCommon");
const { getField } = require("../ProviderCommon");

module.exports = AwsClientEC2 = ({ spec, config }) => {
  assert(spec);
  assert(config);

  const { managedByKey, managedByValue, stageTagKey, stage } = config;
  assert(stage);

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

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#describeInstances-property
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
      total: items.length,
      items,
    };
  };

  const getByName = ({ name }) => getByNameCore({ name, list, findName });
  const getById = getByIdCore({ fieldIds: "InstanceIds", list });

  const getStateName = (instance) => {
    const state = instance.Instances[0].State.Name;
    logger.debug(`stateName ${state}`);
    return state;
  };

  const isUpById = isUpByIdCore({ states: ["running"], getStateName, getById });
  const isDownById = isDownByIdCore({
    states: StateTerminated,
    getStateName,
    getById,
  });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#runInstances-property
  const create = async ({ name, payload }) => {
    assert(name);
    assert(payload);
    logger.debug(`create ec2 ${toString({ name, payload })}`);
    const data = await ec2.runInstances(payload).promise();
    logger.debug(`create result ${toString(data)}`);
    const instance = data.Instances[0];
    const { InstanceId } = instance;
    await retryExpectOk({
      name: `isUpById: ${name} id: ${InstanceId}`,
      fn: () => isUpById({ id: InstanceId }),
      isOk: (result) => result,
    });

    return instance;
  };

  const destroy = async ({ id, name }) => {
    logger.debug(`destroy ec2 ${toString({ name, id })}`);
    if (_.isEmpty(id)) {
      throw Error(`destroy invalid id`);
    }

    const result = await ec2
      .terminateInstances({
        InstanceIds: [id],
      })
      .promise();

    logger.debug(`destroy ec2 in progress, ${toString({ name, id })}`);

    await retryExpectOk({
      name: `isDownById: ${name} id: ${id}`,
      fn: () => isDownById({ id }),
      isOk: (result) => result,
    });

    logger.debug(`destroy ec2 done, ${toString({ name, id, result })}`);
    return result;
  };
  const configDefault = async ({ name, properties, dependenciesLive }) => {
    logger.debug(`configDefault ${toString({ dependenciesLive })}`);
    const { keyPair, subnet, securityGroups = {} } = dependenciesLive;

    const buildNetworkInterfaces = () => [
      {
        AssociatePublicIpAddress: true,
        DeviceIndex: 0,
        ...(!_.isEmpty(securityGroups) && {
          Groups: _.map(securityGroups, (sg) => getField(sg, "GroupId")),
        }),
        SubnetId: getField(subnet, "SubnetId"),
      },
    ];
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
        ...(subnet && { NetworkInterfaces: buildNetworkInterfaces() }),
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
              {
                Key: stageTagKey,
                Value: stage,
              },
            ],
          },
        ],
      },
      ...(keyPair && { KeyName: keyPair.resource.name }),
    };
  };

  return {
    type: "Instance",
    spec,
    ec2,
    isUpById,
    isDownById,
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
