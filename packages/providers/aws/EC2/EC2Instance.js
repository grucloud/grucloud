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
  and,
  switchCase,
  omit,
  assign,
} = require("rubico");
const {
  defaultsDeep,
  callProp,
  isEmpty,
  first,
  pluck,
  flatten,
  unless,
  find,
  includes,
  when,
  keys,
} = require("rubico/x");
const { AwsClient } = require("../AwsClient");
const { omitIfEmpty } = require("@grucloud/core/Common");

const logger = require("@grucloud/core/logger")({ prefix: "AwsEc2" });
const { getByNameCore, compare } = require("@grucloud/core/Common");
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
const {
  createEC2,
  tagResource,
  untagResource,
  findDependenciesVpc,
  fetchImageIdFromDescription,
  imageDescriptionFromId,
  assignUserDataToBase64,
} = require("./EC2Common");

const ignoreErrorCodes = ["InvalidInstanceID.NotFound"];

const StateRunning = "running";
const StateTerminated = "terminated";
const StateStopped = "stopped";

const configDefault =
  ({ config, ec2 }) =>
  ({
    name,
    namespace,
    properties: { Image, ...otherProperties },
    dependencies: {
      keyPair,
      subnets,
      securityGroups,
      iamInstanceProfile,
      launchTemplate,
    },
  }) =>
    pipe([
      tap((params) => {
        assert(ec2);
      }),
      () => Image,
      fetchImageIdFromDescription({ ec2 }),
      (ImageId) =>
        pipe([
          () => otherProperties,
          defaultsDeep({
            ImageId,
            TagSpecifications: [
              {
                ResourceType: "instance",
                Tags: buildTags({ config, namespace, name }),
              },
            ],
          }),
          // IamInstanceProfile
          when(
            () => iamInstanceProfile,
            assign({
              IamInstanceProfile: () => ({
                Arn: getField(iamInstanceProfile, "Arn"),
              }),
            })
          ),
          // Subnet
          when(
            and([
              () => subnets,
              pipe([
                () => launchTemplate,
                switchCase([
                  isEmpty,
                  () => false,
                  pipe([get("live.LaunchTemplateData.SecurityGroupIds")]),
                ]),
              ]),
            ]),
            assign({
              SubnetId: () => getField(subnets[0], "SubnetId"),
            })
          ),
          when(
            () => keyPair,
            assign({
              KeyName: () => keyPair.resource.name,
            })
          ),
          tap((params) => {
            assert(true);
          }),
        ])(),
    ])();

exports.configDefault = configDefault;

exports.EC2Instance = ({ spec, config }) => {
  const ec2 = createEC2(config);
  const client = AwsClient({ spec, config })(ec2);

  const { providerName } = config;
  assert(providerName);

  const managedByOther = or([
    hasKeyInTags({
      key: "eks:cluster-name",
    }),
    hasKeyInTags({
      key: "aws:autoscaling:groupName",
    }),
  ]);

  const findDependencies = ({ live, lives, config }) => [
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
      ids: [
        pipe([
          () =>
            lives.getByName({
              name: live.KeyName,
              type: "KeyPair",
              group: "EC2",
              providerName,
            }),
          get("id"),
        ])(),
      ],
    },
    {
      type: "LaunchTemplate",
      group: "EC2",
      ids: [
        pipe([
          () => live,
          get("Tags"),
          find(eq(get("Key"), "aws:ec2launchtemplate:id")),
          get("Value"),
        ])(),
      ],
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
  const decorate = ({ endpoint }) =>
    pipe([
      tap((params) => {
        assert(endpoint);
      }),
      assign({
        Image: imageDescriptionFromId({ ec2 }),
        UserData: pipe([
          ({ InstanceId }) => ({
            Attribute: "userData",
            InstanceId,
          }),
          ec2().describeInstanceAttribute,
          get("UserData.Value"),
          unless(isEmpty, (UserData) =>
            Buffer.from(UserData, "base64").toString()
          ),
        ]),
      }),
    ]);

  const getList = client.getList({
    method: "describeInstances",
    getParam: "Reservations",
    transformList: pipe([
      pluck("Instances"),
      flatten,
      filter(not(isInstanceTerminated)),
    ]),
    decorate,
  });

  const getByName = getByNameCore({ getList, findName });
  const getById = pipe([
    ({ InstanceId }) => ({ id: InstanceId }),
    getByIdCore({ fieldIds: "InstanceIds", getList }),
  ]);

  const isUpById = pipe([getById, isInstanceUp]);
  const isDownById = pipe([getById, isInstanceDown]);

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
    filterPayload: pipe([assignUserDataToBase64]),
    isInstanceUp,
    pickCreated: () =>
      pipe([
        tap(({ Instances }) => {
          assert(Instances);
        }),
        get("Instances"),
        first,
      ]),
    getById,
    config,
  });

  const destroy = client.destroy({
    pickId: ({ InstanceId }) => ({ InstanceIds: [InstanceId] }),
    method: "terminateInstances",
    getById,
    ignoreErrorCodes,
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
    configDefault: configDefault({ config, ec2 }),
    managedByOther,
    tagResource: tagResource({ endpoint: ec2 }),
    untagResource: untagResource({ endpoint: ec2 }),
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

//TODO use compareEC2
exports.compareEC2Instance = pipe([
  tap((xxx) => {
    assert(true);
  }),
  compare({
    //TODO remove
    filterAll: () => pipe([omit(["Tags"])]),
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
