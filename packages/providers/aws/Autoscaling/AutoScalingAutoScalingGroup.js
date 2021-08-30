const assert = require("assert");
const {
  map,
  pipe,
  tap,
  tryCatch,
  get,
  or,
  pick,
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
  unless,
  prepend,
} = require("rubico/x");

const logger = require("@grucloud/core/logger")({ prefix: "AutoScalingGroup" });
const { retryCall } = require("@grucloud/core/Retry");

const { tos } = require("@grucloud/core/tos");
const {
  AutoScalingNew,
  shouldRetryOnException,
  findNamespaceInTagsOrEksCluster,
  hasKeyInTags,
  buildTags,
  findValueInTags,
} = require("../AwsCommon");
const { getField } = require("@grucloud/core/ProviderCommon");
const { AwsClient } = require("../AwsClient");

const findId = get("live.AutoScalingGroupARN");
const pickId = pick(["AutoScalingGroupName"]);

const findNameEks = pipe([
  tap((params) => {
    assert(true);
  }),
  get("live"),
  findValueInTags({ key: "eks:nodegroup-name" }),
  unless(isEmpty, prepend("asg-")),
]);

const findName = (params) => {
  const fns = [findNameEks, get("live.AutoScalingGroupName")];
  for (fn of fns) {
    const name = fn(params);
    if (!isEmpty(name)) {
      return name;
    }
  }
};

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AutoScaling.html
exports.AutoScalingAutoScalingGroup = ({ spec, config }) => {
  const autoScaling = AutoScalingNew(config);

  const client = AwsClient({
    type: spec.type,
    config,
    endpointName: "AutoScaling",
  });

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
    {
      type: "LaunchTemplate",
      group: "ec2",
      ids: [
        pipe([() => live, get("LaunchTemplate.LaunchTemplateId")])(),
        pipe([
          () => live,
          get(
            "MixedInstancesPolicy.LaunchTemplate.LaunchTemplateSpecification.LaunchTemplateId"
          ),
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

  const decorate = assign({
    VPCZoneIdentifier: pipe([
      get("VPCZoneIdentifier"),
      callProp("split", ","),
      callProp("sort"),
      callProp("join", ","),
    ]),
  });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AutoScaling.html#describeAutoScalingGroups-property
  const getList = client.getList({
    method: "describeAutoScalingGroups",
    getParam: "AutoScalingGroups",
    decorate,
  });

  const getById = client.getById({
    pickId: ({ AutoScalingGroupName }) => ({
      AutoScalingGroupNames: [AutoScalingGroupName],
    }),
    method: "describeAutoScalingGroups",
    getField: "AutoScalingGroups",
  });

  const getByName = ({ name }) => getById({ AutoScalingGroupName: name });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AutoScaling.html#createAutoScalingGroup-property
  const create = client.create({
    pickCreated: (payload) => () => pipe([() => payload, pickId])(),
    method: "createAutoScalingGroup",
    getById,
    config,
  });

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
    ])();

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AutoScaling.html#deleteAutoScalingGroup-property
  const destroy = client.destroy({
    pickId,
    extraParam: {
      ForceDelete: true,
    },
    method: "deleteAutoScalingGroup",
    getById,
    ignoreError: pipe([
      get("message"),
      includes("AutoScalingGroup name not found"),
    ]),
    config: { retryCount: 12 * 15, retryDelay: 5e3 },
  });

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
