const assert = require("assert");
const {
  map,
  transform,
  get,
  tap,
  pipe,
  filter,
  eq,
  not,
  tryCatch,
} = require("rubico");
const {
  defaultsDeep,
  isEmpty,
  first,
  pluck,
  flatten,
  forEach,
} = require("rubico/x");

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

exports.AwsEC2 = ({ spec, config }) => {
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
  const getById = getByIdCore({ fieldIds: "InstanceIds", getList });

  const isUpById = isUpByIdCore({
    isInstanceUp,
    getById,
  });

  const isDownById = isDownByIdCore({
    isInstanceDown,
    getById,
  });

  const volumesAttach = ({ InstanceId, volumes = [] }) =>
    pipe([
      tap(() => {
        logger.debug(
          `volumesAttach InstanceId: ${InstanceId}, #volumes: ${volumes.length}`
        );
      }),
      forEach(
        tryCatch(
          (volume) =>
            ec2().attachVolume({
              Device: volume.config.Device,
              InstanceId,
              VolumeId: volume.live.VolumeId,
            }),
          (error, volume) =>
            pipe([
              tap(() => {
                logger.error(
                  `error attaching volume ${volume}, error: ${tos(error)}`
                );
              }),
              () => ({ error, volume }),
            ])()
        )
      ),
      tap(() => {
        logger.debug(`volumes attached InstanceId: ${InstanceId}`);
      }),
    ])(volumes);

  const associateAddress = ({ InstanceId, eip }) =>
    pipe([
      tap(() => {
        logger.debug(`associateAddress InstanceId: ${InstanceId}`);
        assert(eip.live.AllocationId);
      }),
      () =>
        ec2().associateAddress({
          AllocationId: eip.live.AllocationId,
          InstanceId,
        }),
      tap(() => {
        logger.debug(`eip address associated, InstanceId: ${InstanceId}`);
      }),
    ])();

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#runInstances-property
  const create = async ({
    name,
    payload,
    resolvedDependencies: { volumes, eip },
  }) =>
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
      tap(({ InstanceId }) => volumesAttach({ InstanceId, volumes })),
      tap.if(
        () => eip,
        ({ InstanceId }) => associateAddress({ InstanceId, eip })
      ),
      tap(({ InstanceId }) => {
        logger.info(`created ec2 ${name}, InstanceId: ${InstanceId}`);
      }),
    ])();

  const disassociateAddress = ({ id }) =>
    pipe([
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
      tap((Addresses) => {
        logger.debug(`disassociateAddress ${tos({ Addresses })}`);
      }),
      first,
      tap.if(not(isEmpty), ({ AssociationId }) =>
        ec2().disassociateAddress({
          AssociationId,
        })
      ),
    ]);

  const volumesDetach = ({ id }) =>
    pipe([
      () =>
        ec2().describeVolumes({
          Filters: [
            {
              Name: "attachment.instance-id",
              Values: [id],
            },
            {
              Name: "tag-key",
              Values: [config.managedByKey],
            },
          ],
        }),
      get("Volumes"),
      tap((volumes) => {
        logger.info(`destroy ec2, detachVolume #volumes: ${volumes.length}`);
      }),
      map(
        tryCatch(
          ({ VolumeId }) => ec2().detachVolume({ VolumeId }),
          (error, volume) =>
            pipe([
              tap(() => {
                logger.error(
                  `error detaching volume ${volume}, error: ${JSON.stringify(
                    error
                  )}`
                );
              }),
              () => ({ error, volume }),
            ])()
        )
      ),
      tap((result) => {
        logger.info(`destroy ec2 volumes detached`);
      }),
    ]);

  const destroy = async ({ id, name }) =>
    pipe([
      tap(() => {
        logger.info(
          `destroy ec2  ${tos({
            name,
            id,
          })}`
        );
      }),
      disassociateAddress({ id }),
      volumesDetach({ id }),
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
    const { UserData, ...otherProperties } = properties;
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
      ...(UserData && {
        UserData: Buffer.from(UserData, "utf-8").toString("base64"),
      }),
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
