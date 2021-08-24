const assert = require("assert");
const {
  map,
  pipe,
  tap,
  tryCatch,
  get,
  or,
  eq,
  not,
  switchCase,
  omit,
  assign,
} = require("rubico");
const {
  defaultsDeep,
  pluck,
  isEmpty,
  first,
  includes,
  callProp,
} = require("rubico/x");

const logger = require("@grucloud/core/logger")({ prefix: "AutoScalingGroup" });
const { retryCall } = require("@grucloud/core/Retry");

const { tos } = require("@grucloud/core/tos");
const {
  AutoScalingNew,
  shouldRetryOnException,
  findNameInTags,
  findNamespaceInTagsOrEksCluster,
  hasKeyInTags,
  buildTags,
} = require("../AwsCommon");
const { getField } = require("@grucloud/core/ProviderCommon");

const findId = get("live.AutoScalingGroupARN");

const findName = (params) => {
  const fns = [findNameInTags({ findId }), get("live.AutoScalingGroupName")];
  for (fn of fns) {
    const name = fn(params);
    if (!isEmpty(name)) {
      return name;
    }
  }
  assert(false, "should have a name");
};

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AutoScaling.html
exports.AwsAutoScalingGroup = ({ spec, config }) => {
  const autoScaling = AutoScalingNew(config);

  const managedByOther = or([
    hasKeyInTags({
      key: "eks:cluster-name",
    }),
  ]);

  const findDependencies = ({ live, lives }) => [
    {
      type: "LaunchConfiguration",
      group: "autoscaling",
      ids: [
        pipe([
          () => live,
          tap((params) => {
            assert(true);
          }),
          get("LaunchConfigurationName"),
          (name) =>
            lives.getByName({
              name,
              providerName: config.providerName,
              type: "LaunchConfiguration",
              group: "autoscaling",
            }),
          get("id"),
        ])(),
      ],
    },
    { type: "TargetGroup", group: "elb", ids: live.TargetGroupARNs },
    {
      type: "Instance",
      group: "ec2",
      ids: pipe([() => live, get("Instances"), pluck("InstanceId")])(),
    },
    {
      type: "Subnet",
      group: "ec2",
      ids: pipe([
        () => live,
        get("VPCZoneIdentifier"),
        callProp("split", ","),
      ])(),
    },
    { type: "Role", group: "iam", ids: [live.ServiceLinkedRoleARN] },
  ];

  const findNamespace = pipe([
    tap((params) => {
      assert(true);
    }),
    findNamespaceInTagsOrEksCluster({
      config,
      key: "eks:cluster-name",
    }),
  ]);

  const describeAutoScalingGroups = (params = {}) =>
    pipe([
      () => params,
      autoScaling().describeAutoScalingGroups,
      get("AutoScalingGroups"),
      map(
        assign({
          VPCZoneIdentifier: pipe([
            get("VPCZoneIdentifier"),
            callProp("split", ","),
            callProp("sort"),
            callProp("join", ","),
          ]),
        })
      ),
    ])();

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AutoScaling.html#describeAutoScalingGroups-property
  const getList = () =>
    pipe([
      tap(() => {
        logger.info(`getList autoscaling group`);
      }),
      describeAutoScalingGroups,
      tap((params) => {
        assert(true);
      }),
    ])();

  const getByName = ({ name }) =>
    pipe([
      tap(() => {
        logger.info(`getByName ${tos(name)}`);
      }),
      () => ({
        AutoScalingGroupNames: [name],
      }),
      describeAutoScalingGroups,
      first,
      tap((result) => {
        logger.debug(`getByName: ${name}, result: ${tos(result)}`);
      }),
    ])();

  const isUpByName = pipe([getByName, not(isEmpty)]);
  const isDownByName = pipe([getByName, isEmpty]);

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AutoScaling.html#createAutoScalingGroup-property
  const create = ({ payload, name, namespace }) =>
    pipe([
      tap(() => {
        assert(true);
      }),
      () => payload,
      autoScaling().createAutoScalingGroup,
      tap(() =>
        retryCall({
          name: `createAutoScalingGroup isUpById: ${name}`,
          fn: () => isUpByName({ name }),
        })
      ),
    ])();

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AutoScaling.html#updateAutoScalingGroup-property
  const update = ({ name, payload, diff, live }) =>
    pipe([
      tap(() => {
        logger.info(`updateAutoScalingGroup: ${name}`);
        logger.debug(tos({ payload, diff, live }));
      }),
      () => payload,
      omit(["TargetGroupARNs", "Tags"]),
      autoScaling().updateAutoScalingGroup,
      tap(() => {
        logger.info(`updated authorizer ${name}`);
      }),
    ])();

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AutoScaling.html#deleteAutoScalingGroup-property
  const destroy = ({ live, lives }) =>
    pipe([
      () => live,
      get("AutoScalingGroupName"),
      (AutoScalingGroupName) =>
        pipe([
          tap(() => {
            logger.info(`destroy autoscaling group ${AutoScalingGroupName}`);
          }),
          tryCatch(
            pipe([
              () => ({ AutoScalingGroupName, ForceDelete: true }),
              tap((params) => {
                assert(true);
              }),
              autoScaling().deleteAutoScalingGroup,
              tap((params) => {
                assert(true);
              }),
              tap(() =>
                retryCall({
                  name: `isDownByName: ${AutoScalingGroupName}`,
                  fn: () => isDownByName({ name: AutoScalingGroupName }),
                  config,
                })
              ),
            ]),
            (error, params) =>
              pipe([
                tap(() => {
                  assert(true);
                }),
                () => error,
                switchCase([
                  pipe([
                    get("message"),
                    includes("AutoScalingGroup name not found"),
                  ]),
                  () => false,
                  (error) => {
                    throw Error(error.message);
                  },
                ]),
              ])()
          ),
        ])(),
    ])();

  const configDefault = ({
    name,
    namespace,
    properties: { Tags, ...otherProps },
    dependencies: {
      launchTemplate,
      launchConfiguration,
      subnets = [],
      targetGroups = [],
      serviceRole,
    },
  }) =>
    pipe([
      () => otherProps,
      tap(() => {
        assert(
          launchTemplate || launchConfiguration,
          "missing 'launchTemplate' or 'launchConfiguration' dependency"
        );
        assert(Array.isArray(subnets), "missing 'subnets' dependency");
      }),
      defaultsDeep({
        AutoScalingGroupName: name,
        MinSize: 0,
        MaxSize: 1,
        ...(launchConfiguration && {
          LaunchConfigurationName: getField(
            launchConfiguration,
            "LaunchConfigurationName"
          ),
        }),
        ...(launchTemplate && {
          LaunchTemplate: {
            LaunchTemplateId: getField(launchTemplate, "LaunchTemplateId"),
          },
        }),
        TargetGroupARNs: pipe([
          () => targetGroups,
          map((targetGroup) => getField(targetGroup, "TargetGroupArn")),
        ])(),
        ...(serviceRole && {
          ServiceLinkedRoleARN: getField(serviceRole, "Arn"),
        }),
        VPCZoneIdentifier: pipe([
          () => subnets,
          map((subnet) => getField(subnet, "SubnetId")),
          callProp("sort"),
          callProp("join", ","),
        ])(),
        Tags: buildTags({ config, namespace, name, UserTags: Tags }),
      }),
      tap((params) => {
        assert(true);
      }),
    ])();

  return {
    spec,
    findId,
    findDependencies,
    findNamespace,
    findName,
    getByName,
    findName,
    create,
    update,
    destroy,
    getList,
    configDefault,
    shouldRetryOnException,
    managedByOther,
  };
};
