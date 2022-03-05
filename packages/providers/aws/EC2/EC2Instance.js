const assert = require("assert");
const {
  map,
  get,
  tap,
  pipe,
  filter,
  eq,
  not,
  or,
  tryCatch,
  switchCase,
  omit,
  assign,
  fork,
  pick,
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
  keys,
} = require("rubico/x");
const { AwsClient } = require("../AwsClient");
const { omitIfEmpty } = require("@grucloud/core/Common");

const logger = require("@grucloud/core/logger")({ prefix: "AwsEc2" });
const {
  getByNameCore,
  convertError,
  compare,
} = require("@grucloud/core/Common");
const { retryCall } = require("@grucloud/core/Retry");
const { tos } = require("@grucloud/core/tos");
const {
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
const { createEC2, findDependenciesVpc } = require("./EC2Common");

const StateRunning = "running";
const StateTerminated = "terminated";
const StateStopped = "stopped";

const configDefault =
  ({ config, includeTags = true }) =>
  ({
    name,
    namespace,
    properties: { UserData, ...otherProperties },
    dependencies: {
      keyPair,
      subnet,
      securityGroups,
      iamInstanceProfile,
      image,
    },
  }) =>
    pipe([
      tap((params) => {
        assert(true);
      }),
      () => otherProperties,
      defaultsDeep({
        ...(UserData && {
          UserData: Buffer.from(UserData, "utf-8").toString("base64"),
        }),
        ...(image && { ImageId: getField(image, "ImageId") }),
        ...(iamInstanceProfile && {
          IamInstanceProfile: {
            Arn: getField(iamInstanceProfile, "Arn"),
          },
        }),
        ...(includeTags && {
          TagSpecifications: [
            {
              ResourceType: "instance",
              Tags: buildTags({ config, namespace, name }),
            },
          ],
        }),
        ...(keyPair && { KeyName: keyPair.resource.name }),
      }),
      // Subnet
      when(
        () => subnet,
        assign({
          SubnetId: () => getField(subnet, "SubnetId"),
        })
      ),
      // Security Groups
      when(
        () => securityGroups,
        assign({
          SecurityGroupIds: pipe([
            () => securityGroups,
            map((sg) => getField(sg, "GroupId")),
          ]),
        })
      ),
      tap((params) => {
        assert(true);
      }),
    ])();

exports.configDefault = configDefault;

exports.EC2Instance = ({ spec, config }) => {
  const ec2 = createEC2(config);
  const client = AwsClient({ spec, config })(ec2);

  const { providerName } = config;
  assert(providerName);
  const clientConfig = {
    ...config,
    retryCount: 100,
    retryDelay: 5e3,
    repeatCount: 1,
  };

  const managedByOther = or([
    hasKeyInTags({
      key: "eks:cluster-name",
    }),
    hasKeyInTags({
      key: "aws:autoscaling:groupName",
    }),
  ]);

  const findDependencies = ({ live, lives }) => [
    findDependenciesVpc({ live }),
    {
      type: "Image",
      group: "EC2",
      ids: pipe([
        () => lives.getByType({ type: "Image", group: "EC2", providerName }),
        filter(eq(get("id"), live.ImageId)),
        pluck("id"),
      ])(),
    },
    {
      type: "KeyPair",
      group: "EC2",
      ids: [live.KeyName],
    },
    { type: "Subnet", group: "EC2", ids: [live.SubnetId] },
    {
      type: "Volume",
      group: "EC2",
      ids: pipe([
        () => live,
        get("BlockDeviceMappings"),
        pluck("Ebs.VolumeId"),
      ])(),
    },
    {
      type: "NetworkInterface",
      group: "EC2",
      ids: pipe([
        () => live,
        get("NetworkInterfaces"),
        pluck("NetworkInterfaceId"),
      ])(),
    },
    {
      type: "ElasticIpAddress",
      group: "EC2",
      ids: pipe([
        () => live,
        get("PublicIpAddress"),
        (PublicIpAddress) =>
          pipe([
            () =>
              lives.getByType({
                type: "ElasticIpAddress",
                group: "EC2",
                providerName,
              }),
            filter(eq(get("live.PublicIp"), PublicIpAddress)),
            pluck("id"),
          ])(),
      ])(),
    },
    {
      type: "SecurityGroup",
      group: "EC2",
      ids: pipe([() => live, get("SecurityGroups"), pluck("GroupId")])(),
    },
    {
      type: "InstanceProfile",
      group: "IAM",
      ids: [pipe([() => live, get("IamInstanceProfile.Arn")])()],
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

  const findId = get("live.InstanceId");
  const pickId = pick(["InstanceId"]);

  const findName = (params) => {
    assert(params.live);
    assert(params.lives);

    const fns = [findNameInTags(), ({ live }) => findEksName(live), findId];
    for (fn of fns) {
      const name = fn(params);
      if (!isEmpty(name)) {
        return name;
      }
    }
  };

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

  const decorate = pipe([
    assign({
      UserData: pipe([
        ({ InstanceId }) => ({ Attribute: "userData", InstanceId }),
        ec2().describeInstanceAttribute,
        get("UserData.Value"),
      ]),
    }),
  ]);

  const getList = client.getList({
    method: "describeInstances",
    getParam: "Reservations",
    transformList: pipe([
      tap((params) => {
        assert(true);
      }),
      pluck("Instances"),
      flatten,
      filter(not(isInstanceTerminated)),
    ]),
    decorate: () => decorate,
  });

  const getByName = getByNameCore({ getList, findName });
  const getById = pipe([
    ({ InstanceId }) => ({ id: InstanceId }),
    getByIdCore({ fieldIds: "InstanceIds", getList }),
  ]);

  const isUpById = pipe([getById, isInstanceUp]);
  const isDownById = pipe([getById, isInstanceDown]);

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

  const updateInstanceType = ({ InstanceId, updated }) =>
    pipe([
      () => updated,
      get("InstanceType"),
      tap.if(
        not(isEmpty),
        pipe([
          (Value) => ({ InstanceId, InstanceType: { Value } }),
          ec2().modifyInstanceAttribute,
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
          fn: () => isUpById({ InstanceId }),
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
          fn: () => isDownById({ InstanceId }),
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
          () => destroy({ live: { InstanceId } }),
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
  const create = client.create({
    method: "runInstances",
    shouldRetryOnExceptionMessages: ["Invalid IAM Instance Profile ARN"],
    isInstanceUp,
    pickCreated: () =>
      pipe([
        tap(({ Instances }) => {
          assert(Instances);
        }),
        get("Instances"),
        first,
      ]),
    pickId,
    getById,
    postCreate:
      ({ resolvedDependencies: { volumes, eip } }) =>
      ({ InstanceId }) =>
        //TODO fork
        pipe([
          tap(() => {
            assert(InstanceId);
          }),
          tap(() => volumesAttach({ InstanceId, volumes })),
          tap.if(
            () => eip,
            () => associateAddress({ InstanceId, eip })
          ),
        ])(),
    config,
  });

  const disassociateAddress = ({ InstanceId }) =>
    pipe([
      tap(() => {
        assert(InstanceId);
      }),
      () => ({
        Filters: [
          {
            Name: "instance-id",
            Values: [InstanceId],
          },
        ],
      }),
      ec2().describeAddresses,
      get("Addresses"),
      tap((Addresses) => {
        logger.debug(`disassociateAddress ${tos({ Addresses })}`);
      }),
      first,
      //TODO multiple addresses ?
      tap.if(not(isEmpty), ({ AssociationId }) =>
        ec2().disassociateAddress({
          AssociationId,
        })
      ),
    ]);

  const volumesDetach = ({ InstanceId }) =>
    pipe([
      tap(() => {
        assert(InstanceId);
      }),
      () => ({
        Filters: [
          {
            Name: "attachment.instance-id",
            Values: [InstanceId],
          },
          {
            Name: "tag-key",
            Values: [config.managedByKey],
          },
        ],
      }),
      ec2().describeVolumes,
      get("Volumes"),
      tap((volumes) => {
        logger.info(`destroy ec2, detachVolume #volumes: ${size(volumes)}`);
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

  const destroy = client.destroy({
    preDestroy: pipe([
      get("live"),
      fork({ address: disassociateAddress, volume: volumesDetach }),
    ]),
    pickId: ({ InstanceId }) => ({ InstanceIds: [InstanceId] }),
    method: "terminateInstances",
    getById,
    ignoreErrorCodes: [],
    config,
  });

  return {
    spec,
    findId,
    findDependencies,
    findNamespace,
    getByName,
    findName,
    create,
    update,
    destroy,
    getList,
    configDefault: configDefault({ config }),
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
    () => item,
    or([isInOurCluster({ config: item.config }), isOurMinion]),
    tap((isOurMinion) => {
      //logger.debug(`isOurMinionEC2Instance ${isOurMinion}`);
    }),
  ])();

exports.compareEC2Instance = pipe([
  tap((xxx) => {
    assert(true);
  }),
  compare({
    filterAll: pipe([omit(["Tags"])]),
    filterTarget: () =>
      pipe([
        tap((params) => {
          assert(true);
        }),
        omit([
          "NetworkInterfaces",
          "TagSpecifications",
          "SubnetId",
          "SecurityGroupIds",
        ]),
      ]),
    filterLive: () =>
      pipe([
        tap((params) => {
          assert(true);
        }),
        omit([
          "PlatformDetails",
          "PrivateDnsNameOptions",
          "UsageOperation",
          "UsageOperationUpdateTime",

          "EnclaveOptions",
          "MetadataOptions",
          "Licenses",
          "HibernationOptions",
          "CapacityReservationSpecification",
          "CpuOptions",
          "VirtualizationType",
          "SourceDestCheck",
          "SecurityGroups",
          "RootDeviceType",
          "RootDeviceName",
          "NetworkInterfaces",
          "ElasticInferenceAcceleratorAssociations",
          "ElasticGpuAssociations",
          "Hypervisor",
          "EnaSupport",
          "EbsOptimized",
          "ClientToken",
          "BlockDeviceMappings",
          "Architecture",
          "VpcId",
          "SubnetId",
          "StateTransitionReason",
          "State",
          "PublicIpAddress",
          "PublicDnsName",
          "ProductCodes",
          "PrivateIpAddress",
          "PrivateDnsName",
          "Monitoring",
          "LaunchTime",
          "InstanceId",
          "AmiLaunchIndex",
          //"Placement",
          "IamInstanceProfile.Id",
        ]),
        omitIfEmpty(["UserData"]),
        tap((params) => {
          assert(true);
        }),
      ]),
  }),
  tap((diff) => {
    logger.debug(`compareEC2Instance ${tos(diff)}`);
  }),
  assign({
    updateNeedDestroy: pipe([
      get("liveDiff.updated"),
      keys,
      or([find((key) => includes(key)(["ImageId"]))]),
    ]),
    updateNeedRestart: pipe([
      get("liveDiff.updated"),
      keys,
      or([find((key) => includes(key)(["InstanceType"]))]),
    ]),
  }),
  tap((diff) => {
    logger.debug(`compareEC2Instance ${tos(diff)}`);
  }),
]);
