const AWS = require("aws-sdk");
const { map, transform, get, tap, pipe, filter } = require("rubico");
const { defaultsDeep, isEmpty, first, pluck, flatten } = require("rubico/x");

const assert = require("assert");
const logger = require("../../../logger")({ prefix: "AwsEc2" });
const { getByNameCore, isUpByIdCore, isDownByIdCore } = require("../../Common");
const { retryExpectOk, retryCall } = require("../../Retry");

const { tos } = require("../../../tos");
const StateTerminated = ["terminated"];
const { KeyName, getByIdCore, findNameInTags } = require("../AwsCommon");
const { getField } = require("../../ProviderCommon");
const { CheckTagsEC2 } = require("../AwsTagCheck");

module.exports = AwsEC2 = ({ spec, config }) => {
  assert(spec);
  assert(config);
  const clientConfig = { ...config, retryDelay: 2000, repeatCount: 1 };

  const { managedByKey, managedByValue, stageTagKey, stage } = config;
  assert(stage);

  const ec2 = new AWS.EC2();

  const findName = (item) => findNameInTags(item);

  const findId = (item) => {
    assert(item);
    const id = item.InstanceId;
    assert(id);
    return id;
  };

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#describeInstances-property

  const getList = pipe([
    tap(({ params } = {}) => {
      logger.debug(`getList ${tos(params)}`);
    }),
    ({ params } = {}) => ec2.describeInstances(params).promise(),
    get("Reservations"),
    tap((obj) => {
      logger.debug(`getList ${tos(obj)}`);
    }),
    pluck("Instances"),
    flatten,
    tap((obj) => {
      logger.debug(`getList ${tos(obj)}`);
    }),
    filter((instance) => !StateTerminated.includes(instance.State.Name)),
    tap((obj) => {
      logger.debug(`getList ${tos(obj)}`);
    }),
    (items) => ({
      total: items.length,
      items,
    }),
  ]);

  const getByName = ({ name }) => getByNameCore({ name, getList, findName });
  const getById = pipe([
    getByIdCore({ fieldIds: "InstanceIds", getList }),
    tap((obj) => {
      logger.debug(`getById ${tos(obj)}`);
    }),
  ]);

  const getStateName = (instance) => {
    const { InstanceId, State } = instance;
    assert(InstanceId);
    assert(State);
    const state = State.Name;
    logger.debug(`InstanceId ${InstanceId}, stateName ${state} `);
    return state;
  };

  const isInstanceUp = (instance) => {
    return ["running"].includes(getStateName(instance));
  };

  const isInstanceDown = (instance) => {
    return StateTerminated.includes(getStateName(instance));
  };

  const isUpById = isUpByIdCore({ isInstanceUp, getById });

  const isDownById = isDownByIdCore({
    isInstanceDown,
    getById,
  });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#runInstances-property
  const create = async ({ name, payload, dependencies }) => {
    assert(name);
    assert(payload);
    logger.debug(`create ${tos({ name, payload })}`);
    const data = await ec2.runInstances(payload).promise();
    logger.debug(`create result ${tos(data)}`);
    const instance = data.Instances[0];
    const { InstanceId } = instance;

    const instanceUp = await retryCall({
      name: `isUpById: ${name} id: ${InstanceId}`,
      fn: () => isUpById({ id: InstanceId }),
      isExpectedResult: (result) => result,
      ...clientConfig,
    });

    assert(instanceUp.Tags);

    CheckTagsEC2({
      config,
      tags: instanceUp.Tags,
      name,
    });

    const { eip } = dependencies;
    if (eip) {
      const eipLive = await eip.getLive();
      logger.debug(`create, associating eip ${tos({ eipLive })}`);
      assert(eipLive);
      const { AllocationId } = eipLive;
      assert(AllocationId);
      const paramsAssociate = {
        AllocationId,
        InstanceId,
      };
      await ec2.associateAddress(paramsAssociate).promise();
      logger.debug(`create, eip associated`);
    }

    return instance;
  };

  const destroy = async ({ id, name }) => {
    logger.debug(`destroy ${tos({ name, id })}`);
    assert(!isEmpty(id), `destroy invalid id`);

    const result = await ec2
      .terminateInstances({
        InstanceIds: [id],
      })
      .promise();

    const { Addresses } = await ec2
      .describeAddresses({
        Filters: [
          {
            Name: "instance-id",
            Values: [id],
          },
        ],
      })
      .promise();

    const address = Addresses[0];
    if (address) {
      await ec2.disassociateAddress({
        AssociationId: address.AssociationId,
      });
    }

    logger.debug(`destroy in progress, ${tos({ name, id })}`);

    await retryExpectOk({
      name: `isDownById: ${name} id: ${id}`,
      fn: () => isDownById({ id }),
      config,
    });

    logger.debug(`destroy done, ${tos({ name, id, result })}`);
    return result;
  };
  const configDefault = async ({ name, properties, dependencies }) => {
    logger.debug(`configDefault ${tos({ dependencies })}`);
    const {
      keyPair,
      subnet,
      securityGroups = {},
      iamInstanceProfile,
    } = dependencies;
    const { VolumeSize, ...otherProperties } = properties;
    const buildNetworkInterfaces = () => [
      {
        AssociatePublicIpAddress: true,
        DeviceIndex: 0,
        ...(!isEmpty(securityGroups) && {
          Groups: transform(
            map((sg) => [getField(sg, "GroupId")]),
            () => []
          )(securityGroups),
        }),
        SubnetId: getField(subnet, "SubnetId"),
      },
    ];
    return defaultsDeep({
      BlockDeviceMappings: [
        {
          DeviceName: "/dev/sdh",
          Ebs: {
            VolumeSize: properties.VolumeSize,
          },
        },
      ],
      ...(subnet && { NetworkInterfaces: buildNetworkInterfaces() }),
      ...(iamInstanceProfile && {
        IamInstanceProfile: {
          Name: getField(iamInstanceProfile, "InstanceProfileName"),
        },
      }),
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
      ...(keyPair && { KeyName: keyPair.resource.name }),
    })(otherProperties);
  };

  return {
    type: "EC2",
    spec,
    isUpById,
    isDownById,
    findId,
    getByName,
    getById,
    cannotBeDeleted: () => false,
    findName,
    create,
    destroy,
    getList,
    configDefault,
    shouldRetryOnException: (error) => {
      logger.debug(`shouldRetryOnException ${tos(error)}`);
      const retry = error.message.includes(
        "iamInstanceProfile.name is invalid"
      );
      logger.debug(`shouldRetryOnException retry: ${retry}`);
      return retry;
    },
  };
};
