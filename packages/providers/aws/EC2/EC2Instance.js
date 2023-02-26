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
  pick,
  any,
  fork,
} = require("rubico");
const {
  defaultsDeep,
  isEmpty,
  first,
  pluck,
  flatten,
  unless,
  includes,
  when,
  keys,
  forEach,
  find,
  size,
} = require("rubico/x");

const logger = require("@grucloud/core/logger")({ prefix: "AwsEc2" });
const { tos } = require("@grucloud/core/tos");
const { retryCall } = require("@grucloud/core/Retry");

const { getByNameCore } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");

const {
  omitIfEmpty,
  replaceWithName,
  differenceObject,
} = require("@grucloud/core/Common");

const {
  findNameInTags,
  buildTags,
  findValueInTags,
  findEksCluster,
  hasKeyInTags,
  compareAws,
} = require("../AwsCommon");

const {
  tagResource,
  untagResource,
  fetchImageIdFromDescription,
  imageDescriptionFromId,
  assignUserDataToBase64,
  getLaunchTemplateIdFromTags,
  buildAvailabilityZone,
} = require("./EC2Common");

const AttributesNoRestart = ["DisableApiStop", "DisableApiTermination"];
const AttributesNeedRestart = ["InstanceType", "UserData"];

const ignoreErrorCodes = ["InvalidInstanceID.NotFound"];

const StateRunning = "running";
const StateTerminated = "terminated";
const StateStopped = "stopped";

const getByIdFromLives =
  ({ lives, groupType }) =>
  (id) =>
    pipe([
      () => lives,
      find(and([eq(get("groupType"), groupType), eq(get("id"), id)])),
    ])();

const configDefault =
  ({}) =>
  ({
    name,
    namespace,
    properties: { Tags, Image, ...otherProperties },
    dependencies: {
      keyPair,
      subnets,
      securityGroups,
      iamInstanceProfile,
      launchTemplate,
      placementGroup,
    },
    config,
  }) =>
    pipe([
      tap((params) => {
        assert(config);
      }),
      () => Image,
      fetchImageIdFromDescription({ config }),
      (ImageId) =>
        pipe([
          () => otherProperties,
          defaultsDeep({
            ImageId,
            TagSpecifications: [
              {
                ResourceType: "instance",
                Tags: buildTags({ config, namespace, name, UserTags: Tags }),
              },
            ],
          }),
          // Placement Group
          when(
            () => placementGroup,
            defaultsDeep({
              Placement: {
                GroupName: getField(placementGroup, "GroupName"),
              },
            })
          ),
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

const pickId = pipe([
  tap(({ InstanceId }) => {
    assert(InstanceId);
  }),
  ({ InstanceId }) => ({ InstanceIds: [InstanceId] }),
  tap((params) => {
    assert(true);
  }),
]);

const managedByOther = ({ lives, config }) =>
  or([
    // TODO refactor
    hasKeyInTags({
      key: "aws:cloud9:environment",
    }),
    hasKeyInTags({
      key: "eks:cluster-name",
    }),
    hasKeyInTags({
      key: "aws:autoscaling:groupName",
    }),
  ]);

// const findNamespace = findNamespaceInTagsOrEksCluster({
//   config,
//   key: "eks:cluster-name",
// });

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

const findId = () => get("InstanceId");

const findName = (params) => (live) => {
  assert(live);
  assert(params.lives);

  const fns = [findNameInTags(), findEksName, findId(params)];
  for (fn of fns) {
    const name = fn(live);
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
const decorate = ({ endpoint, config }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
    assign({
      Image: imageDescriptionFromId({ config }),
    }),
    assign({
      UserData: pipe([
        ({ InstanceId }) => ({
          Attribute: "userData",
          InstanceId,
        }),
        endpoint().describeInstanceAttribute,
        get("UserData.Value"),
        unless(isEmpty, (UserData) =>
          Buffer.from(UserData, "base64").toString()
        ),
      ]),
      DisableApiStop: pipe([
        ({ InstanceId }) => ({
          Attribute: "disableApiStop",
          InstanceId,
        }),
        endpoint().describeInstanceAttribute,
        get("DisableApiStop.Value"),
      ]),
      DisableApiTermination: pipe([
        ({ InstanceId }) => ({
          Attribute: "disableApiTermination",
          InstanceId,
        }),
        endpoint().describeInstanceAttribute,
        get("DisableApiTermination.Value"),
      ]),
      // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#describeInstanceCreditSpecifications-property
    }),
    when(
      ({ InstanceType }) =>
        pipe([
          () => ["t2", "t3"],
          any((type) => InstanceType.startsWith(type)),
        ])(),
      assign({
        CreditSpecification: pipe([
          ({ InstanceId }) => ({
            InstanceIds: [InstanceId],
          }),
          endpoint().describeInstanceCreditSpecifications,
          get("InstanceCreditSpecifications"),
          first,
          pick(["CpuCredits"]),
        ]),
      })
    ),
    when(
      not(eq(get("CreditSpecification.CpuCredits"), "unlimited")),
      omit(["CreditSpecification"])
    ),
    tap((params) => {
      assert(true);
    }),
  ]);

const updateAttributes =
  ({ endpoint }) =>
  ({ InstanceId, updated, added }) =>
    pipe([
      tap((params) => {
        assert(endpoint);
      }),
      () => ({ ...updated, ...added }),
      Object.entries,
      filter(([key]) =>
        pipe([
          () => [...AttributesNeedRestart, ...AttributesNoRestart],
          includes(key),
        ])()
      ),
      forEach(([key, Value]) =>
        pipe([
          () => Value,
          when(
            () => key === "UserData",
            (Value) => Buffer.from(Value, "utf-8")
          ),
          (Value) => ({ InstanceId, [key]: { Value } }),
          endpoint().modifyInstanceAttribute,
          tap((params) => {
            assert(true);
          }),
        ])()
      ),
      tap((params) => {
        assert(true);
      }),
    ])();

const instanceStart =
  ({ endpoint, getById }) =>
  ({ InstanceId }) =>
    pipe([
      tap(() => {
        assert(endpoint);
        logger.info(`instanceStart ${tos(InstanceId)}`);
      }),
      () => ({ InstanceIds: [InstanceId] }),
      endpoint().startInstances,
      () =>
        retryCall({
          name: `startInstances: ${InstanceId}`,
          fn: pipe([() => ({ InstanceId }), getById({}), isInstanceUp]),
        }),
    ])();

const instanceStop =
  ({ endpoint, getById }) =>
  ({ InstanceId }) =>
    pipe([
      tap(() => {
        logger.info(`instanceStop ${tos(InstanceId)}`);
        assert(endpoint);
      }),
      () => endpoint().stopInstances({ InstanceIds: [InstanceId] }),
      () =>
        retryCall({
          name: `stopInstances: ${InstanceId}`,
          fn: pipe([() => ({ InstanceId }), getById({}), isInstanceDown]),
        }),
    ])();

const isInOurCluster = ({ config, lives }) =>
  pipe([
    findEksCluster({ lives, config, key: "eks:cluster-name" }),
    tap((cluster) => {
      assert(true);
    }),
  ]);

exports.isOurMinionEC2Instance =
  ({ lives, config }) =>
  (live) =>
    pipe([
      () => live,
      or([
        isInOurCluster({ lives, config }) /*isOurMinion({ lives, config })*/,
      ]),
      tap((isOurMinion) => {
        //logger.debug(`isOurMinionEC2Instance ${isOurMinion}`);
      }),
    ])();

const compare = pipe([
  tap((params) => {
    assert(true);
  }),
  compareAws({
    getTargetTags: pipe([get("TagSpecifications"), first, get("Tags")]),
    omitTargetKey: "TagSpecifications",
  })({
    filterAll: () =>
      pipe([
        omit(["Tags"]),
        omit([
          "NetworkInterfaces",
          "TagSpecifications",
          "SubnetId",
          "SecurityGroupIds",
          "Image",
        ]),
      ]),
    //TODO
    filterTarget: ({ propertiesDefault }) =>
      pipe([defaultsDeep(propertiesDefault), omit(["LaunchTemplate"])]),
    filterLive: ({ propertiesDefault, lives, config }) =>
      pipe([
        tap((params) => {
          assert(propertiesDefault);
          assert(lives);
          assert(config);
        }),
        omit(["StateReason"]),
        defaultsDeep(propertiesDefault),
        when(getLaunchTemplateIdFromTags, (live) =>
          pipe([
            () => live,
            getLaunchTemplateIdFromTags,
            lives.getById({
              type: "LaunchTemplate",
              group: "EC2",
              providerName: config.providerName,
            }),
            get("live.LaunchTemplateData"),
            pick(["InstanceType", "UserData", "KeyName", "ImageId"]),
            keys,
            (omitProps) => pipe([() => live, omit(omitProps)])(),
          ])()
        ),
        omitIfEmpty(["UserData"]),
        tap((params) => {
          assert(true);
        }),
      ]),
  }),
  tap((diff) => {
    //logger.debug(`compareEC2Instance ${tos(diff)}`);
  }),
  assign({
    updateNeedDestroy: pipe([
      get("liveDiff.updated"),
      keys,
      //TODO
      any((key) => pipe([() => ["ImageId"], includes(key)])()),
    ]),
    updateNeedRestart: pipe([
      get("liveDiff"),
      ({ updated, added }) => ({ ...updated, ...added }),
      keys,
      any((key) => pipe([() => AttributesNeedRestart, includes(key)])()),
    ]),
    updateNoRestart: pipe([
      get("liveDiff"),
      ({ updated, added }) => ({ ...updated, ...added }),
      keys,
      any((key) => pipe([() => AttributesNoRestart, includes(key)])()),
    ]),
  }),
  tap((diff) => {
    assert(true);
  }),
]);

const omitNetworkInterfacesForDefaultSubnetAndSecurityGroup = ({ lives }) =>
  pipe([
    tap((params) => {
      assert(lives);
    }),
    get("NetworkInterfaces"),
    and([
      eq(size, 1),
      pipe([
        first,
        and([
          // default subnet ?
          pipe([
            get("SubnetId"),
            getByIdFromLives({ lives, groupType: "EC2::Subnet" }),
            tap((params) => {
              assert(true);
            }),
            get("isDefault"),
          ]),
          // only one default security group ?
          pipe([
            get("Groups"),
            and([
              eq(size, 1),
              pipe([
                first,
                get("GroupId"),
                getByIdFromLives({ lives, groupType: "EC2::SecurityGroup" }),
                get("isDefault"),
              ]),
            ]),
          ]),
        ]),
      ]),
    ]),
  ]);

const getLaunchTemplateVersionFromTags = pipe([
  get("Tags"),
  find(eq(get("Key"), "aws:ec2launchtemplate:version")),
  get("Value"),
]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html
exports.EC2Instance = () => ({
  type: "Instance",
  package: "EC2",
  client: "EC2",
  findName,
  findId,
  ignoreErrorCodes,
  managedByOther,
  omitProperties: [
    "KeyName",
    "PublicIpAddress",
    "AmiLaunchIndex",
    "ImageId",
    "InstanceId",
    "VpcId",
    "LaunchTime",
    "PrivateDnsName",
    "PrivateIpAddress",
    "ProductCodes",
    "PublicDnsName",
    "State",
    "StateTransitionReason",
    "SubnetId",
    "Architecture",
    "ClientToken",
    "IamInstanceProfile",
    "SecurityGroups",
    "PlatformDetails",
    "UsageOperation",
    "UsageOperationUpdateTime",
    "RootDeviceName",
    "RootDeviceType",
    "PrivateDnsNameOptions",
    "MetadataOptions.State",
    "BlockDeviceMappings",
    "VirtualizationType",
    "Hypervisor",
    "CpuOptions",
    "StateReason",
    "Placement.GroupId",
  ],
  propertiesDefault: {
    DisableApiStop: false,
    DisableApiTermination: false,
    MaxCount: 1,
    MinCount: 1,
    Placement: { GroupName: "", Tenancy: "default" },
    Monitoring: {
      State: "disabled",
    },
    EbsOptimized: false,
    EnaSupport: true,
    SourceDestCheck: true,
    // The t2.micro instance type does not support specifying CpuOptions.
    // CpuOptions: {
    //   CoreCount: 1,
    //   ThreadsPerCore: 1,
    // },
    CapacityReservationSpecification: {
      CapacityReservationPreference: "open",
    },
    HibernationOptions: {
      Configured: false,
    },
    MetadataOptions: {
      HttpTokens: "optional",
      HttpPutResponseHopLimit: 1,
      HttpEndpoint: "enabled",
      HttpProtocolIpv6: "disabled",
      InstanceMetadataTags: "disabled",
    },
    EnclaveOptions: {
      Enabled: false,
    },
    MaintenanceOptions: {
      AutoRecovery: "default",
    },
  },
  filterLive:
    ({ lives, providerConfig }) =>
    (live) =>
      pipe([
        () => live,
        differenceObject(
          pipe([
            () => live,
            getLaunchTemplateIdFromTags,
            getByIdFromLives({ lives, groupType: "EC2::LaunchTemplate" }),
            get("live.LaunchTemplateData"),
          ])()
        ),
        tap((params) => {
          assert(true);
        }),
        switchCase([
          or([
            pipe([
              getLaunchTemplateIdFromTags,
              getByIdFromLives({ lives, groupType: "EC2::LaunchTemplate" }),
              get("live.LaunchTemplateData.SecurityGroupIds"),
            ]),
            omitNetworkInterfacesForDefaultSubnetAndSecurityGroup({
              lives,
            }),
          ]),
          omit(["NetworkInterfaces"]),
          assign({
            NetworkInterfaces: pipe([
              get("NetworkInterfaces"),
              map((networkInterface) =>
                pipe([
                  () => networkInterface,
                  when(
                    get("Description"),
                    assign({ Description: get("Description") })
                  ),
                  fork({
                    DeviceIndex: get("Attachment.DeviceIndex"),
                    Groups: pipe([
                      get("Groups"),
                      map(
                        pipe([
                          get("GroupId"),
                          replaceWithName({
                            groupType: "EC2::SecurityGroup",
                            path: "id",
                            providerConfig,
                            lives,
                          }),
                        ])
                      ),
                    ]),
                    SubnetId: pipe([
                      get("SubnetId"),
                      replaceWithName({
                        groupType: "EC2::Subnet",
                        path: "id",
                        providerConfig,
                        lives,
                      }),
                    ]),
                  }),
                ])()
              ),
            ]),
          }),
        ]),
        when(
          getLaunchTemplateIdFromTags,
          assign({
            LaunchTemplate: pipe([
              fork({
                LaunchTemplateId: pipe([
                  getLaunchTemplateIdFromTags,
                  replaceWithName({
                    groupType: "EC2::LaunchTemplate",
                    path: "id",
                    providerConfig,
                    lives,
                  }),
                ]),
                Version: getLaunchTemplateVersionFromTags,
              }),
            ]),
          })
        ),
        assign({
          Placement: pipe([
            get("Placement"),
            assign({
              AvailabilityZone: buildAvailabilityZone,
            }),
          ]),
        }),
        tap((params) => {
          assert(true);
        }),
      ])(),
  compare,
  dependencies: {
    subnets: {
      type: "Subnet",
      group: "EC2",
      //TODO no list
      list: true,
      dependencyId: ({ lives, config }) => get("SubnetId"),
    },
    keyPair: {
      type: "KeyPair",
      group: "EC2",
      dependencyId: ({ lives, config }) =>
        pipe([
          get("KeyName"),
          lives.getByName({
            type: "KeyPair",
            group: "EC2",
            providerName: config.providerName,
          }),
          get("id"),
        ]),
    },
    iamInstanceProfile: {
      type: "InstanceProfile",
      group: "IAM",
      dependencyId: ({ lives, config }) => get("IamInstanceProfile.Arn"),
    },
    securityGroups: {
      type: "SecurityGroup",
      group: "EC2",
      list: true,
      dependencyIds: ({ lives, config }) =>
        pipe([get("SecurityGroups"), pluck("GroupId")]),
    },
    launchTemplate: {
      type: "LaunchTemplate",
      group: "EC2",
      dependencyId: ({ lives, config }) => getLaunchTemplateIdFromTags,
    },
    placementGroup: {
      type: "PlacementGroup",
      group: "EC2",
      dependencyId: ({ lives, config }) =>
        pipe([
          get("Placement.GroupName"),
          lives.getByName({
            type: "PlacementGroup",
            group: "EC2",
            providerName: config.providerName,
          }),
          get("id"),
        ]),
    },
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#getInstance-property
  getById: {
    method: "describeInstances",
    getField: "Reservations",
    pickId,
    decorate: ({ endpoint, config }) =>
      pipe([get("Instances"), first, decorate({ endpoint, config })]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#listInstances-property
  getList: {
    method: "describeInstances",
    getParam: "Reservations",
    transformListPre: () =>
      pipe([pluck("Instances"), flatten, filter(not(isInstanceTerminated))]),
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#createInstance-property
  create: {
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
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#updateInstance-property
  update:
    ({ endpoint, getById, create, destroy }) =>
    async ({
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
          assert(create);
          assert(destroy);
        }),
        () => diff,
        switchCase([
          get("updateNeedDestroy"),
          pipe([
            tap(() => {
              logger.info(`ec2 updateNeedDestroy ${name}`);
            }),
            () => ({ live: { InstanceId } }),
            destroy,
            () => ({ name, payload, resolvedDependencies }),
            create,
          ]),
          get("updateNeedRestart"),
          pipe([
            () => ({ InstanceId }),
            instanceStop({ endpoint, getById }),
            () => ({
              InstanceId,
              updated: diff.liveDiff.updated,
              added: diff.liveDiff.added,
            }),
            updateAttributes({ endpoint }),
            () => ({ InstanceId }),
            instanceStart({ endpoint, getById }),
          ]),
          get("updateNoRestart"),
          pipe([
            tap(() => {
              logger.info(`ec2 updateNoRestart ${name}`);
            }),
            () => ({
              InstanceId,
              updated: diff.liveDiff.updated,
              added: diff.liveDiff.added,
            }),
            updateAttributes({ endpoint }),
          ]),
          () => {
            throw Error(
              `Either updateNeedDestroy or updateNeedRestart or updateNoRestart is required`
            );
          },
        ]),
        tap(() => {
          logger.info(`ec2 updated ${name}`);
        }),
      ])(),
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#deleteInstance-property
  destroy: {
    pickId,
    method: "terminateInstances",
    isInstanceDown,
  },
  getByName: getByNameCore,
  tagger: () => ({ tagResource, untagResource }),
  configDefault: configDefault({}),
});
