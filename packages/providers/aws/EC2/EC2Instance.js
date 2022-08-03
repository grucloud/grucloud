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
} = require("rubico/x");
const { AwsClient } = require("../AwsClient");
const { omitIfEmpty } = require("@grucloud/core/Common");

const logger = require("@grucloud/core/logger")({ prefix: "AwsEc2" });
const { getByNameCore } = require("@grucloud/core/Common");
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
  compareAws,
} = require("../AwsCommon");
const { getField } = require("@grucloud/core/ProviderCommon");
const { hasKeyInTags } = require("../AwsCommon");
const {
  createEC2,
  tagResource,
  untagResource,
  fetchImageIdFromDescription,
  imageDescriptionFromId,
  assignUserDataToBase64,
  getLaunchTemplateIdFromTags,
} = require("./EC2Common");

const AttributesNoRestart = ["DisableApiStop", "DisableApiTermination"];
const AttributesNeedRestart = ["InstanceType", "UserData"];

const ignoreErrorCodes = ["InvalidInstanceID.NotFound"];

const StateRunning = "running";
const StateTerminated = "terminated";
const StateStopped = "stopped";

const configDefault =
  ({ config, ec2 }) =>
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
        DisableApiStop: pipe([
          ({ InstanceId }) => ({
            Attribute: "disableApiStop",
            InstanceId,
          }),
          ec2().describeInstanceAttribute,
          get("DisableApiStop.Value"),
        ]),
        DisableApiTermination: pipe([
          ({ InstanceId }) => ({
            Attribute: "disableApiTermination",
            InstanceId,
          }),
          ec2().describeInstanceAttribute,
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
            ec2().describeInstanceCreditSpecifications,
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

  const getList = client.getList({
    method: "describeInstances",
    getParam: "Reservations",
    transformListPre: () =>
      pipe([pluck("Instances"), flatten, filter(not(isInstanceTerminated))]),
    decorate,
  });

  const getByName = getByNameCore({ getList, findName });
  const getById = pipe([
    ({ InstanceId }) => ({ id: InstanceId }),
    getByIdCore({ fieldIds: "InstanceIds", getList }),
  ]);

  const isUpById = pipe([getById, isInstanceUp]);
  const isDownById = pipe([getById, isInstanceDown]);

  const updateAttributes = ({ InstanceId, updated, added }) =>
    pipe([
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
          ec2().modifyInstanceAttribute,
          tap((params) => {
            assert(true);
          }),
        ])()
      ),
      tap((params) => {
        assert(true);
      }),
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
          () => ({
            InstanceId,
            updated: diff.liveDiff.updated,
            added: diff.liveDiff.added,
          }),
          updateAttributes,
          () => instanceStart({ InstanceId }),
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
          updateAttributes,
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

exports.compareEC2Instance = pipe([
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
            (id) =>
              lives.getById({
                id,
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
