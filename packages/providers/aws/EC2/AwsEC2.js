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
  and,
  tryCatch,
  switchCase,
  or,
} = require("rubico");
const {
  defaultsDeep,
  isEmpty,
  first,
  pluck,
  flatten,
  forEach,
  find,
  identity,
} = require("rubico/x");

const logger = require("@grucloud/core/logger")({ prefix: "AwsEc2" });
const {
  getByNameCore,
  isUpByIdCore,
  isDownByIdCore,
} = require("@grucloud/core/Common");
const { retryCall } = require("@grucloud/core/Retry");
const { tos } = require("@grucloud/core/tos");
const {
  Ec2New,
  getByIdCore,
  findNameInTags,
  buildTags,
  findValueInTags,
  findNamespaceInTagsOrEksCluster,
  isOurMinion,
  findEksCluster,
} = require("../AwsCommon");
const { getField } = require("@grucloud/core/ProviderCommon");
const { CheckAwsTags } = require("../AwsTagCheck");

const StateRunning = "running";
const StateTerminated = "terminated";

exports.AwsEC2 = ({ spec, config }) => {
  assert(spec);
  assert(config);
  const { providerName } = config;
  assert(providerName);
  const clientConfig = { ...config, retryDelay: 5000, repeatCount: 1 };

  const ec2 = Ec2New(config);

  const findDependencies = ({ live, lives }) => [
    {
      type: "Image",
      ids: [
        pipe([
          tap((xxx) => {
            assert(true);
          }),
          () => lives.getByType({ type: "Image", providerName }),
          get("resources"),
          tap((xxx) => {
            assert(true);
          }),
          filter(eq(get("id"), live.ImageId)),
          tap((xxx) => {
            assert(true);
          }),
          pluck("id"),
          tap((xxx) => {
            assert(true);
          }),
        ])(),
      ],
    },
    { type: "KeyPair", ids: filter(not(isEmpty))([live.KeyName]) },
    { type: "Vpc", ids: [live.VpcId] },
    { type: "Subnet", ids: [live.SubnetId] },
    {
      type: "Volume",
      ids: pipe([
        () => live,
        get("BlockDeviceMappings"),
        pluck("Ebs.VolumeId"),
      ])(),
    },
    {
      type: "NetworkInterface",
      ids: pipe([
        () => live,
        get("NetworkInterfaces"),
        pluck("NetworkInterfaceId"),
      ])(),
    },
    {
      type: "SecurityGroup",
      ids: pipe([() => live, get("SecurityGroups"), pluck("GroupId")])(),
    },
    {
      type: "IamInstanceProfile",
      ids: pipe([
        () => live,
        get("IamInstanceProfile.Arn"),
        (arn) => [arn],
        filter(not(isEmpty)),
      ])(),
    },
  ];

  const findNamespace = findNamespaceInTagsOrEksCluster({
    config,
    key: "eks:cluster-name",
  });

  const findEksName = (live) =>
    pipe([
      () => live,
      findValueInTags({ key: "eks:nodegroup-name" }),
      switchCase([
        isEmpty,
        () => undefined,
        (nodegroupName) => `${nodegroupName}::${live.InstanceId}`,
      ]),
    ])();

  const findName = (item) =>
    pipe([
      findNameInTags,
      switchCase([isEmpty, () => findEksName(item), (name) => name]),
    ])(item);

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

  const shouldRetryOnExceptionCreate = ({ error, name }) =>
    pipe([
      tap(() => {
        logger.error(
          `ec2 shouldRetryOnExceptionCreate ${tos({ name, error })}`
        );
      }),
      () => error.message.includes("iamInstanceProfile.name is invalid"),
      tap((retry) => {
        logger.error(`ec2 shouldRetryOnExceptionCreate retry: ${retry}`);
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
      () =>
        retryCall({
          name: `ec2 runInstances: ${name}`,
          fn: () => ec2().runInstances(payload),
          shouldRetryOnException: shouldRetryOnExceptionCreate,
          config,
        }),
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

  const destroyById = async ({ id, name }) =>
    pipe([
      tap(() => {
        logger.info(
          `destroy ec2  ${tos({
            name,
            id,
          })}`
        );
        assert(id, "destroyById missing id");
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
  //By live
  const destroy = destroyById;

  const configDefault = async ({
    name,
    namespace,
    properties,
    dependencies,
  }) => {
    const {
      keyPair,
      subnet,
      securityGroups = {},
      iamInstanceProfile,
      image,
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
      ...(image && { ImageId: getField(image, "ImageId") }),
      ...(subnet && { NetworkInterfaces: buildNetworkInterfaces() }),
      ...(iamInstanceProfile && {
        IamInstanceProfile: {
          Name: getField(iamInstanceProfile, "InstanceProfileName"),
        },
      }),
      TagSpecifications: [
        {
          ResourceType: "instance",
          Tags: buildTags({ config, namespace, name }),
        },
      ],
      ...(keyPair && { KeyName: keyPair.resource.name }),
    })(otherProperties);
  };

  return {
    type: "EC2",
    spec,
    findId,
    findDependencies,
    findNamespace,
    getByName,
    findName,
    create,
    destroyById,
    destroy,
    getList,
    configDefault,
  };
};

const isInOurCluster = ({ config }) => ({ live, lives }) =>
  pipe([
    () => ({ live, lives }),
    findEksCluster({ config, key: "eks:cluster-name" }),
    tap((cluster) => {
      assert(true);
    }),
  ])();

exports.isOurMinionEC2Instance = (item) =>
  pipe([
    tap(() => {
      assert(true);
    }),
    () => item,
    or([isInOurCluster({ config: item.config }), isOurMinion]),
    tap((isOurMinion) => {
      logger.debug(`isOurMinionEC2Instance ${isOurMinion}`);
    }),
  ])();
