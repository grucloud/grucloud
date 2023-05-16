const assert = require("assert");
const { pipe, tap, get, pick, eq } = require("rubico");
const { defaultsDeep, find, isEmpty, unless } = require("rubico/x");

const { getByNameCore, omitIfEmpty } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");

const pickId = pipe([
  tap(({ AutoScalingGroupName, PolicyName }) => {
    assert(AutoScalingGroupName);
    assert(PolicyName);
  }),
  pick(["AutoScalingGroupName", "PolicyName"]),
]);

const decorate = ({ endpoint, config }) =>
  pipe([
    tap((params) => {
      //assert(config);
    }),
    omitIfEmpty(["StepAdjustments"]),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AutoScaling.html
exports.AutoScalingPolicy = () => ({
  type: "Policy",
  package: "auto-scaling",
  client: "AutoScaling",
  propertiesDefault: {},
  omitProperties: ["Alarms", "PolicyARN"],
  inferName: () =>
    pipe([
      get("PolicyName"),
      tap((Name) => {
        assert(Name);
      }),
    ]),
  findName: () =>
    pipe([
      get("PolicyName"),
      tap((name) => {
        assert(name);
      }),
    ]),
  findId: () =>
    pipe([
      get("PolicyARN"),
      tap((id) => {
        assert(id);
      }),
    ]),
  ignoreErrorCodes: ["ValidationError"],
  dependencies: {
    autoScalingGroup: {
      type: "AutoScalingGroup",
      group: "AutoScaling",
      pathId: "AutoScalingGroupName",
      required: true,
      parent: true,
      dependencyId: ({ lives, config }) =>
        pipe([
          get("AutoScalingGroupName"),
          lives.getByName({
            providerName: config.providerName,
            type: "AutoScalingGroup",
            group: "AutoScaling",
          }),
          get("id"),
          tap((id) => {
            assert(id);
          }),
        ]),
    },
    // LoadBalancer
    // TargetGroup TargetTrackingConfiguration.PredefinedMetricSpecification.ResourceLabel in the form of app/my-alb/778d41231b141a0f/targetgroup/my-alb-target-group/943f017f100becff
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AutoScaling.html#getPolicy-property
  getById: {
    method: "describePolicies",
    pickId,
    decorate: ({ live, config, endpoint }) =>
      pipe([
        tap(() => {
          assert(live.PolicyName);
        }),
        get("ScalingPolicies"),
        find(eq(get("PolicyName"), live.PolicyName)),
        unless(isEmpty, decorate({ endpoint, config })),
      ]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AutoScaling.html#describePolicies-property
  getList: ({ client, endpoint, getById, config }) =>
    pipe([
      () =>
        client.getListWithParent({
          parent: { type: "AutoScalingGroup", group: "AutoScaling" },
          pickKey: pipe([
            pick(["AutoScalingGroupName"]),
            tap(({ AutoScalingGroupName }) => {
              assert(AutoScalingGroupName);
            }),
          ]),
          method: "describePolicies",
          getParam: "ScalingPolicies",
          config,
          decorate: ({ parent }) => pipe([decorate({})]),
        }),
    ])(),
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AutoScaling.html#putScalingPolicy-property
  create: {
    method: "putScalingPolicy",
    pickCreated: ({ payload }) => pipe([() => payload]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AutoScaling.html#putScalingPolicy-property
  update: {
    method: "putScalingPolicy",
    filterParams: ({ payload, diff, live }) => pipe([() => payload])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AutoScaling.html#deletePolicy-property
  destroy: {
    method: "deletePolicy",
    pickId,
  },
  getByName: getByNameCore,
  configDefault: ({
    name,
    namespace,
    properties: { ...otherProps },
    dependencies: { autoScalingGroup },
    config,
  }) =>
    pipe([
      tap(() => {
        assert(autoScalingGroup);
      }),
      () => otherProps,
      defaultsDeep({
        AutoScalingGroupName: getField(
          autoScalingGroup,
          "AutoScalingGroupName"
        ),
      }),
    ])(),
});
