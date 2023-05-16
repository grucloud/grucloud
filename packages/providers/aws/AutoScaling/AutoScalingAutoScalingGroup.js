const assert = require("assert");
const {
  map,
  pipe,
  tap,
  get,
  or,
  pick,
  assign,
  not,
  filter,
} = require("rubico");
const {
  defaultsDeep,
  isEmpty,
  callProp,
  unless,
  prepend,
  includes,
} = require("rubico/x");

const { hasKeyInTags, buildTags, findValueInTags } = require("../AwsCommon");
const { getField } = require("@grucloud/core/ProviderCommon");
const { getByNameCore, omitIfEmpty } = require("@grucloud/core/Common");
const { tagResource, untagResource, compare } = require("./AutoScalingCommon");

const ResourceType = "auto-scaling-group";

const filterTags = filter((tag) =>
  pipe([() => ["AmazonECSManaged"], not(includes(tag.Key))])()
);

const findId = () =>
  pipe([
    get("AutoScalingGroupARN"),
    tap((AutoScalingGroupARN) => {
      assert(AutoScalingGroupARN);
    }),
  ]);

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

exports.AutoScalingAutoScalingGroup = ({}) => ({
  type: "AutoScalingGroup",
  package: "auto-scaling",
  client: "AutoScaling",
  findName,
  findId,
  managedByOther,
  ignoreErrorCodes: ["ResourceNotFoundException"],
  dependencies: {
    subnets: {
      type: "Subnet",
      group: "EC2",
      list: true,
      dependencyIds: ({ lives, config }) =>
        pipe([get("VPCZoneIdentifier"), callProp("split", ",")]),
    },
    launchTemplate: {
      type: "LaunchTemplate",
      group: "EC2",
      dependencyIds:
        ({ lives, config }) =>
        (live) =>
          [
            pipe([() => live, get("LaunchTemplate.LaunchTemplateId")])(),
            pipe([
              () => live,
              get(
                "MixedInstancesPolicy.LaunchTemplate.LaunchTemplateSpecification.LaunchTemplateId"
              ),
            ])(),
          ],
    },
    launchConfiguration: {
      type: "LaunchConfiguration",
      group: "AutoScaling",
      dependencyId: ({ lives, config }) =>
        pipe([
          get("LaunchConfigurationName"),
          lives.getByName({
            providerName: config.providerName,
            type: "LaunchConfiguration",
            group: "AutoScaling",
          }),
          get("id"),
        ]),
    },
    serviceLinkedRole: {
      type: "Role",
      group: "IAM",
      dependencyId: ({ lives, config }) =>
        pipe([
          unless(
            includes("AWSServiceRoleForAutoScaling"),
            get("ServiceLinkedRoleARN")
          ),
        ]),
    },
  },
  omitProperties: [
    "AutoScalingGroupARN",
    "AvailabilityZones",
    "Instances",
    "CreatedTime",
    "SuspendedProcesses",
    "EnabledMetrics", //TODO
    "TerminationPolicies", //TODO
    "NewInstancesProtectedFromScaleIn", //TODO
    "LaunchTemplate.LaunchTemplateName",
    "TargetGroupARNs",
    "ServiceLinkedRoleARN",
    "VPCZoneIdentifier",
    "TrafficSources",
  ],
  propertiesDefault: {
    HealthCheckType: "EC2",
    DefaultCooldown: 300,
    HealthCheckGracePeriod: 300,
  },
  compare: compare({
    filterLive: () =>
      pipe([
        omitIfEmpty(["LoadBalancerNames"]),
        assign({ Tags: pipe([get("Tags"), filterTags]) }),
      ]),
  }),
  filterLive: () =>
    pick([
      "MinSize",
      "MaxSize",
      "DesiredCapacity",
      "DefaultCooldown",
      "HealthCheckType",
      "HealthCheckGracePeriod",
    ]),
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AutoScaling.html#getAutoScalingGroup-property
  getById: {
    pickId: pipe([
      tap(({ AutoScalingGroupName }) => {
        assert(AutoScalingGroupName);
      }),
      ({ AutoScalingGroupName }) => ({
        AutoScalingGroupNames: [AutoScalingGroupName],
      }),
    ]),
    method: "describeAutoScalingGroups",
    getField: "AutoScalingGroups",
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AutoScaling.html#describeAutoScalingGroups-property
  getList: {
    method: "describeAutoScalingGroups",
    getParam: "AutoScalingGroups",
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AutoScaling.html#createAutoScalingGroup-property
  create: {
    method: "createAutoScalingGroup",
    pickCreated:
      ({ payload }) =>
      () =>
        payload,
    shouldRetryOnExceptionMessages: ["Invalid IAM Instance Profile ARN"],
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AutoScaling.html#updateAutoScalingGroup-property
  update: {
    pickId,
    method: "updateAutoScalingGroup",
    filterParams: ({ payload, diff, live }) => pipe([() => payload])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AutoScaling.html#deleteAutoScalingGroup-property
  destroy: {
    pickId: pipe([
      pickId,
      defaultsDeep({
        ForceDelete: true,
      }),
    ]),
    method: "deleteAutoScalingGroup",
    ignoreErrorMessages: ["AutoScalingGroup name not found"],
    config: { retryCount: 12 * 15, retryDelay: 5e3 },
  },
  getByName: getByNameCore,
  tagger: ({ config }) => ({
    tagResource: tagResource({
      ResourceType,
      property: "AutoScalingGroupName",
    }),
    untagResource: untagResource({
      ResourceType,
      property: "AutoScalingGroupName",
    }),
  }),
  configDefault: ({
    name,
    namespace,
    properties: { Tags, ...otherProps },
    dependencies: {
      launchTemplate,
      launchConfiguration,
      subnets = [],
      serviceLinkedRole,
    },
    config,
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
    ])(),
});
