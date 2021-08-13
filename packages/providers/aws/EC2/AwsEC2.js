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
  omit,
  assign,
  any,
} = require("rubico");
const {
  defaultsDeep,
  isEmpty,
  first,
  pluck,
  flatten,
  size,
  find,
  includes,
  when,
} = require("rubico/x");

const { detailedDiff } = require("deep-object-diff");

const logger = require("@grucloud/core/logger")({ prefix: "AwsEc2" });
const {
  getByNameCore,
  isUpByIdCore,
  isDownByIdCore,
  convertError,
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
const { hasKeyInTags } = require("../AwsCommon");

const { CheckAwsTags } = require("../AwsTagCheck");

const StateRunning = "running";
const StateTerminated = "terminated";
const StateStopped = "stopped";

exports.AwsEC2 = ({ spec, config }) => {
  assert(spec);
  assert(config);
  const { providerName } = config;
  assert(providerName);
  const clientConfig = {
    ...config,
    retryCount: 100,
    retryDelay: 5e3,
    repeatCount: 1,
  };

  const ec2 = Ec2New(config);

  const managedByOther = hasKeyInTags({
    key: "eks:cluster-name",
  });

  const findDependencies = ({ live, lives }) => [
    {
      type: "Image",
      group: "ec2",
      ids: pipe([
        () => lives.getByType({ type: "Image", group: "ec2", providerName }),
        filter(eq(get("id"), live.ImageId)),
        pluck("id"),
      ])(),
    },
    {
      type: "KeyPair",
      group: "ec2",
      ids: filter(not(isEmpty))([live.KeyName]),
    },
    { type: "Vpc", group: "ec2", ids: [live.VpcId] },
    { type: "Subnet", group: "ec2", ids: [live.SubnetId] },
    {
      type: "Volume",
      group: "ec2",
      ids: pipe([
        () => live,
        get("BlockDeviceMappings"),
        pluck("Ebs.VolumeId"),
      ])(),
    },
    {
      type: "NetworkInterface",
      group: "ec2",
      ids: pipe([
        () => live,
        get("NetworkInterfaces"),
        pluck("NetworkInterfaceId"),
      ])(),
    },
    {
      type: "ElasticIpAddress",
      group: "ec2",
      ids: pipe([
        () => live,
        get("PublicIpAddress"),
        (PublicIpAddress) =>
          pipe([
            () =>
              lives.getByType({
                type: "ElasticIpAddress",
                group: "ec2",
                providerName,
              }),
            filter(eq(get("live.PublicIp"), PublicIpAddress)),
            pluck("id"),
          ])(),
      ])(),
    },
    {
      type: "SecurityGroup",
      group: "ec2",
      ids: pipe([() => live, get("SecurityGroups"), pluck("GroupId")])(),
    },
    {
      type: "InstanceProfile",
      group: "iam",
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
      () => item,
      findNameInTags,
      when(isEmpty, () => findEksName(item.live)),
    ])();

  const findId = get("live.InstanceId");

  const getStateName = get("State.Name");
  const isInstanceUp = eq(getStateName, StateRunning);
  const isInstanceTerminated = (instance) =>
    pipe([() => [StateTerminated], includes(getStateName(instance))])();
  const isInstanceDown = (instance) =>
    pipe([
      () => [StateTerminated, StateStopped],
      includes(getStateName(instance)),
    ])();
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
      filter(not(isInstanceTerminated)),
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

  const getByName = getByNameCore({ getList, findName });
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
      () => volumes,
      tap(() => {
        logger.debug(
          `volumesAttach InstanceId: ${InstanceId}, #volumes: ${size(volumes)}`
        );
      }),
      map((volume) =>
        tryCatch(
          () =>
            ec2().attachVolume({
              Device: volume.config.Device,
              InstanceId,
              VolumeId: volume.live.VolumeId,
            }),
          pipe([
            (error) => convertError({ error }),
            tap((error) => {
              logger.error(
                `error attaching volume ${volume}, error: ${tos(error)}`
              );
            }),
            (error) => ({ error, volume }),
          ])
        )()
      ),
      filter(get("error")),
      tap.if(not(isEmpty), (errors) => {
        throw Error(`cannot attach volume: ${tos(errors)}`);
      }),
      tap(() => {
        logger.debug(`volumes attached InstanceId: ${InstanceId}`);
      }),
    ])();

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

  const updateInstanceType = ({ InstanceId, updated }) =>
    pipe([
      () => updated,
      get("InstanceType"),
      tap.if(
        not(isEmpty),
        pipe([
          (Value) => ({ InstanceId, InstanceType: { Value } }),
          (params) => ec2().modifyInstanceAttribute(params),
        ])
      ),
    ])();

  const instanceStart = ({ InstanceId }) =>
    pipe([
      tap(() => {
        logger.info(`instanceStart ${tos(InstanceId)}`);
      }),
      () => ec2().startInstances({ InstanceIds: [InstanceId] }),
      () =>
        retryCall({
          name: `startInstances: ${InstanceId}`,
          fn: () => isUpById({ id: InstanceId }),
          config,
        }),
    ])();

  const instanceStop = ({ InstanceId }) =>
    pipe([
      tap(() => {
        logger.info(`instanceStop ${tos(InstanceId)}`);
      }),
      () => ec2().stopInstances({ InstanceIds: [InstanceId] }),
      () =>
        retryCall({
          name: `stopInstances: ${InstanceId}`,
          fn: () => isDownById({ id: InstanceId }),
          config,
        }),
    ])();

  const update = async ({
    name,
    payload,
    live: { InstanceId },
    diff,
    dependencies,
    resolvedDependencies,
  }) =>
    pipe([
      tap(() => {
        logger.info(`update ec2 ${tos({ name, InstanceId, diff })}`);
      }),
      () => diff,
      switchCase([
        get("updateNeedDestroy"),
        pipe([
          tap(() => {
            logger.info(`ec2 updateNeedDestroy ${name}`);
          }),
          () => destroy({ id: InstanceId }),
          () => create({ name, payload, resolvedDependencies }),
        ]),
        get("updateNeedRestart"),
        pipe([
          () => instanceStop({ InstanceId }),
          () =>
            updateInstanceType({
              InstanceId,
              updated: diff.liveDiff.updated,
            }),
          () => instanceStart({ InstanceId }),
        ]),
        () => {
          throw Error(
            `Either updateNeedDestroy or updateNeedRestart is required`
          );
        },
      ]),

      tap(() => {
        logger.info(`ec2 updated ${name}`);
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
    spec,
    findId,
    findDependencies,
    findNamespace,
    getByName,
    findName,
    create,
    update,
    destroyById,
    destroy,
    getList,
    configDefault,
    managedByOther,
  };
};

const isInOurCluster =
  ({ config }) =>
  ({ live, lives }) =>
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
      //logger.debug(`isOurMinionEC2Instance ${isOurMinion}`);
    }),
  ])();

const filterTarget = ({ target }) =>
  pipe([
    () => target,
    omit(["NetworkInterfaces", "TagSpecifications", "MinCount", "MaxCount"]),
  ])();

const filterLive = ({ live }) =>
  pipe([
    () => live, //
    omit(["NetworkInterfaces"]),
  ])();

exports.compareEC2Instance = pipe([
  tap((xxx) => {
    assert(true);
  }),
  assign({
    target: filterTarget,
    live: filterLive,
  }),
  ({ target, live }) => ({
    targetDiff: pipe([
      () => detailedDiff(target, live),
      omit(["added", "deleted"]),
    ])(),
    liveDiff: pipe([
      () => detailedDiff(live, target),
      omit(["added", "deleted"]),
    ])(),
  }),
  tap((diff) => {
    logger.debug(`compareEC2Instance ${tos(diff)}`);
  }),
  assign({
    updateNeedDestroy: pipe([
      get("liveDiff.updated"),
      Object.keys,
      or([find((key) => includes(key)(["ImageId"]))]),
    ]),
    updateNeedRestart: pipe([
      get("liveDiff.updated"),
      Object.keys,
      or([find((key) => includes(key)(["InstanceType"]))]),
    ]),
  }),
  tap((diff) => {
    logger.debug(`compareEC2Instance ${tos(diff)}`);
  }),
]);
