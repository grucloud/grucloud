const assert = require("assert");
const { pipe, tap, get, pick } = require("rubico");
const { defaultsDeep, isIn, when } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");

const pickId = pipe([
  tap(({ ScalingPlanName, ScalingPlanVersion }) => {
    assert(ScalingPlanName);
    assert(ScalingPlanVersion);
  }),
  pick(["ScalingPlanName", "ScalingPlanVersion"]),
]);

const decorate = ({ endpoint, config }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
    defaultsDeep({ ScalingPlanVersion: 1 }),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AutoScalingPlans.html
exports.AutoScalingPlansScalingPlan = () => ({
  type: "ScalingPlan",
  package: "auto-scaling-plans",
  client: "AutoScalingPlans",
  propertiesDefault: {},
  omitProperties: [
    "CreationTime",
    "StatusStartTime",
    "StatusMessage",
    "StatusCode",
    "ApplicationSource.CloudFormationStackARN",
  ],
  inferName: () =>
    pipe([
      get("ScalingPlanName"),
      tap((Name) => {
        assert(Name);
      }),
    ]),
  findName: () =>
    pipe([
      get("ScalingPlanName"),
      tap((name) => {
        assert(name);
      }),
    ]),
  findId: () =>
    pipe([
      get("ScalingPlanName"),
      tap((id) => {
        assert(id);
      }),
    ]),
  ignoreErrorCodes: ["ObjectNotFoundException"],
  dependencies: {
    cloudFormationStack: {
      type: "Stack",
      group: "CloudFormation",
      dependencyId: () =>
        pipe([get("ApplicationSource.CloudFormationStackARN")]),
    },
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AutoScalingPlans.html#describeScalingPlans-property
  getById: {
    method: "describeScalingPlans",
    getField: "ScalingPlans",
    pickId: pipe([
      ({ ScalingPlanName }) => ({ ScalingPlanNames: [ScalingPlanName] }),
    ]),
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AutoScalingPlans.html#describeScalingPlans-property
  getList: {
    method: "describeScalingPlans",
    getParam: "ScalingPlans",
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AutoScalingPlans.html#createScalingPlan-property
  create: {
    method: "createScalingPlan",
    pickCreated: ({ payload }) => pipe([() => payload]),
    isInstanceUp: pipe([get("StatusCode"), isIn(["Active"])]),
    isInstanceError: pipe([get("StatusCode"), isIn(["CreationFailed"])]),
    getErrorMessage: pipe([get("StatusMessage", "CreationFailed")]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AutoScalingPlans.html#updateScalingPlan-property
  update: {
    method: "updateScalingPlan",
    filterParams: ({ payload, diff, live }) =>
      pipe([() => payload, defaultsDeep(pickId(live))])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AutoScalingPlans.html#deleteScalingPlan-property
  destroy: {
    method: "deleteScalingPlan",
    pickId,
  },
  getByName: getByNameCore,
  configDefault: ({
    name,
    namespace,
    properties: { ...otherProps },
    dependencies: { cloudFormationStack },
    config,
  }) =>
    pipe([
      () => otherProps,
      defaultsDeep({}),
      when(
        () => cloudFormationStack,
        defaultsDeep({
          ApplicationSource: {
            CloudFormationStackARN: getField(cloudFormationStack, "Arn"),
          },
        })
      ),
    ])(),
});
