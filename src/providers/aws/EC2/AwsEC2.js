const assert = require("assert");
const AWS = require("aws-sdk");
const { map, transform, get, tap, pipe, filter, eq, not } = require("rubico");
const { defaultsDeep, isEmpty, first, pluck, flatten } = require("rubico/x");

const logger = require("../../../logger")({ prefix: "AwsEc2" });
const { getByNameCore, isUpByIdCore, isDownByIdCore } = require("../../Common");
const { retryCall } = require("../../Retry");
const { tos } = require("../../../tos");
const {
  Ec2New,
  getByIdCore,
  findNameInTags,
  buildTags,
} = require("../AwsCommon");
const { getField } = require("../../ProviderCommon");
const { CheckAwsTags } = require("../AwsTagCheck");

const StateRunning = "running";
const StateTerminated = "terminated";

module.exports = AwsEC2 = ({ spec, config }) => {
  assert(spec);
  assert(config);
  const clientConfig = { ...config, retryDelay: 5000, repeatCount: 1 };

  const ec2 = Ec2New(config);

  const findName = findNameInTags;

  const findId = get("InstanceId");

  const getStateName = get("State.Name");
  const isInstanceUp = eq(getStateName, StateRunning);
  const isInstanceDown = eq(getStateName, StateTerminated);

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#describeInstances-property

  const getList = ({ params } = {}) =>
    pipe([
      tap(() => {
        logger.info(`getList ec2 ${JSON.stringify(params)}`);
      }),
      () => ec2().describeInstances(params),
      get("Reservations"),
      pluck("Instances"),
      flatten,
      filter(not(isInstanceDown)),
      tap((items) => {
        logger.debug(`getList ec2 result: ${tos(items)}`);
      }),
      (items) => ({
        total: items.length,
        items,
      }),
      tap(({ total }) => {
        logger.info(`getList #ec2 ${total}`);
      }),
    ])();

  const getByName = ({ name }) => getByNameCore({ name, getList, findName });
  const getById = pipe([
    getByIdCore({ fieldIds: "InstanceIds", getList }),
    tap((obj) => {
      logger.debug(`getById ${tos(obj)}`);
    }),
  ]);

  const isUpById = isUpByIdCore({
    isInstanceUp,
    getById,
  });

  const isDownById = isDownByIdCore({
    isInstanceDown,
    getById,
  });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#runInstances-property
  const create = async ({ name, payload, dependencies: { eip } }) =>
    pipe([
      tap(() => {
        logger.info(`create ec2 ${tos({ name })}`);
        logger.debug(`create ec2 ${tos({ name, payload })}`);
        assert(name, "name");
        assert(payload, "payload");
      }),
      () => ec2().runInstances(payload),
      get("Instances"),
      first,
      get("InstanceId"),
      (id) =>
        retryCall({
          name: `ec2 isUpById: ${name} id: ${id}`,
          fn: () => isUpById({ name, id }),
          config: clientConfig,
        }),
      tap((instance) => {
        assert(instance, "instanceUp");
        assert(instance.Tags, "instanceUp.Tags");
        assert(
          CheckAwsTags({
            config,
            tags: instance.Tags,
            name,
          }),
          `missing tag for ${name}`
        );
      }),
      tap(({ InstanceId }) =>
        tap.if(
          () => eip,
          pipe([
            () => eip.getLive(),
            tap((eipLive) => {
              logger.debug(`create ec2, associating eip ${tos({ eipLive })}`);
              assert(eipLive, "eipLive");
            }),
            get("AllocationId"),
            tap((AllocationId) => {
              assert(AllocationId, "AllocationId");
            }),
            (AllocationId) =>
              ec2().associateAddress({
                AllocationId,
                InstanceId,
              }),
          ])
        )()
      ),
      tap((instance) => {
        logger.info(`created ec2 ${name}, ${instance.InstanceId}`);
      }),
    ])();
  const destroy = async ({ id, name }) =>
    pipe([
      tap(() => {
        logger.info(`destroy ec2  ${tos({ name, id })}`);
        assert(!isEmpty(id), `destroy invalid id`);
      }),
      () =>
        ec2().describeAddresses({
          Filters: [
            {
              Name: "instance-id",
              Values: [id],
            },
          ],
        }),
      get("Addresses"),
      first,
      tap.if(not(isEmpty), ({ AssociationId }) =>
        ec2().disassociateAddress({
          AssociationId,
        })
      ),
      () =>
        ec2().terminateInstances({
          InstanceIds: [id],
        }),
      () =>
        retryCall({
          name: `ec2 isDownById: ${name} id: ${id}`,
          fn: () => isDownById({ id }),
          config,
        }),
      tap(() => {
        logger.info(`destroyed ec2  ${tos({ name, id })}`);
      }),
    ])();

  const configDefault = async ({ name, properties, dependencies }) => {
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
          Tags: buildTags({ config, name }),
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
    findName,
    create,
    destroy,
    getList,
    configDefault,
    shouldRetryOnException: ({ error, name }) => {
      logger.debug(`shouldRetryOnException ${tos({ name, error })}`);
      const retry = error.message.includes(
        "iamInstanceProfile.name is invalid"
      );
      logger.debug(`shouldRetryOnException retry: ${retry}`);
      return retry;
    },
  };
};
