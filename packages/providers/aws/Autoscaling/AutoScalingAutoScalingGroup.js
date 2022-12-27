const assert = require("assert");
const { map, pipe, tap, get, or, pick, assign } = require("rubico");
const {
  defaultsDeep,
  isEmpty,
  callProp,
  unless,
  prepend,
} = require("rubico/x");

const { hasKeyInTags, buildTags, findValueInTags } = require("../AwsCommon");
const { getField } = require("@grucloud/core/ProviderCommon");
const { AwsClient } = require("../AwsClient");
const { getByNameCore, omitIfEmpty } = require("@grucloud/core/Common");
const {
  createAutoScaling,
  tagResource,
  untagResource,
} = require("./AutoScalingCommon");

const ResourceType = "auto-scaling-group";

const findId = () => get("AutoScalingGroupARN");

const pickId = pipe([
  pick(["AutoScalingGroupName"]),
  tap(({ AutoScalingGroupName }) => {
    assert(AutoScalingGroupName);
  }),
]);

const findNameEks = () =>
  pipe([
    findValueInTags({ key: "eks:nodegroup-name" }),
    unless(isEmpty, prepend("asg-")),
  ]);

const findName = (params) => (live) => {
  assert(params.lives);

  const fns = [findNameEks(params), get("AutoScalingGroupName")];
  for (fn of fns) {
    const name = fn(live);
    if (!isEmpty(name)) {
      return name;
    }
  }
};

const managedByOther = () =>
  or([
    hasKeyInTags({
      key: "eks:cluster-name",
    }),
    hasKeyInTags({
      key: "elasticbeanstalk:environment-id",
    }),
  ]);

// const findNamespace = pipe([
//   findNamespaceInTagsOrEksCluster({
//     config,
//     key: "eks:cluster-name",
//   }),
// ]);

const decorate = () =>
  pipe([
    assign({
      VPCZoneIdentifier: pipe([
        get("VPCZoneIdentifier"),
        callProp("split", ","),
        callProp("sort"),
        callProp("join", ","),
      ]),
    }),
    omitIfEmpty(["TrafficSources"]),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AutoScaling.html
exports.AutoScalingAutoScalingGroup = ({ spec, config }) => {
  const autoScaling = createAutoScaling(config);
  const client = AwsClient({ spec, config })(autoScaling);

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
    getById,
    pickCreated:
      ({ payload }) =>
      () =>
        payload,
    shouldRetryOnExceptionMessages: ["Invalid IAM Instance Profile ARN"],
  });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AutoScaling.html#updateAutoScalingGroup-property
  const update = client.update({
    pickId,
    method: "updateAutoScalingGroup",
    getById,
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
    findName,
    getByName,
    getById,
    findName,
    create,
    update,
    destroy,
    getList,
    configDefault,
    managedByOther,
    tagResource: tagResource({
      autoScaling,
      ResourceType,
      property: "AutoScalingGroupName",
    }),
    untagResource: untagResource({
      autoScaling,
      ResourceType,
      property: "AutoScalingGroupName",
    }),
  };
};
