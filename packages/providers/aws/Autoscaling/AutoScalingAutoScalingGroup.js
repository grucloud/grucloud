const assert = require("assert");
const { map, pipe, tap, get, or, pick, assign } = require("rubico");
const {
  defaultsDeep,
  pluck,
  isEmpty,
  includes,
  callProp,
  unless,
  prepend,
} = require("rubico/x");

const {
  findNamespaceInTagsOrEksCluster,
  hasKeyInTags,
  buildTags,
  findValueInTags,
} = require("../AwsCommon");
const { getField } = require("@grucloud/core/ProviderCommon");
const { AwsClient } = require("../AwsClient");
const { getByNameCore } = require("@grucloud/core/Common");
const { createAutoScaling } = require("./AutoScalingCommon");

const findId = get("live.AutoScalingGroupARN");
const pickId = pick(["AutoScalingGroupName"]);

const findNameEks = pipe([
  tap((params) => {
    assert(true);
  }),
  get("live"),
  tap((live) => {
    assert(live);
  }),
  findValueInTags({ key: "eks:nodegroup-name" }),
  unless(isEmpty, prepend("asg-")),
]);

const findName = (params) => {
  assert(params.live);
  assert(params.lives);

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
  const autoScaling = createAutoScaling(config);
  const client = AwsClient({ spec, config })(autoScaling);

  const managedByOther = or([
    hasKeyInTags({
      key: "eks:cluster-name",
    }),
  ]);

  const findDependencies = ({ live, lives }) => [
    {
      type: "LaunchConfiguration",
      group: "AutoScaling",
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
              group: "AutoScaling",
            }),
          get("id"),
        ])(),
      ],
    },
    {
      type: "LaunchTemplate",
      group: "EC2",
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
    {
      type: "Instance",
      group: "EC2",
      ids: pipe([() => live, get("Instances"), pluck("InstanceId")])(),
    },
    {
      type: "Subnet",
      group: "EC2",
      ids: pipe([
        () => live,
        get("VPCZoneIdentifier"),
        callProp("split", ","),
      ])(),
    },
    { type: "Role", group: "IAM", ids: [live.ServiceLinkedRoleARN] },
  ];

  const findNamespace = pipe([
    findNamespaceInTagsOrEksCluster({
      config,
      key: "eks:cluster-name",
    }),
  ]);

  const decorate = () =>
    assign({
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
    decorate,
  });

  const getByName = getByNameCore({ getList, findName });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AutoScaling.html#createAutoScalingGroup-property
  const create = client.create({
    method: "createAutoScalingGroup",
    pickId,
    getById,
    config,
    shouldRetryOnExceptionMessages: ["Invalid IAM Instance Profile ARN"],
  });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AutoScaling.html#updateAutoScalingGroup-property
  const update = client.update({
    pickId,
    method: "updateAutoScalingGroup",
    getById,
    config,
  });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AutoScaling.html#deleteAutoScalingGroup-property
  const destroy = client.destroy({
    pickId,
    extraParam: {
      ForceDelete: true,
    },
    method: "deleteAutoScalingGroup",
    getById,
    ignoreErrorMessages: ["AutoScalingGroup name not found"],
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
      serviceLinkedRole,
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
        ...(serviceLinkedRole && {
          ServiceLinkedRoleARN: getField(serviceLinkedRole, "Arn"),
        }),
        VPCZoneIdentifier: pipe([
          () => subnets,
          map((subnet) => getField(subnet, "SubnetId")),
          callProp("sort"),
          callProp("join", ","),
        ])(),
        Tags: buildTags({ config, namespace, name, UserTags: Tags }),
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
    managedByOther,
  };
};
