const assert = require("assert");
const { pipe, tap, get, pick, assign } = require("rubico");
const { defaultsDeep } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");

const pickId = pipe([
  tap(({ AutoScalingGroupName, ScheduledActionName }) => {
    assert(AutoScalingGroupName);
    assert(ScheduledActionName);
  }),
  pick(["AutoScalingGroupName", "ScheduledActionName"]),
]);

const decorate = ({ endpoint, config }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
  ]);
// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AutoScaling.html
exports.AutoScalingScheduledAction = () => ({
  type: "ScheduledAction",
  package: "auto-scaling",
  client: "AutoScaling",
  propertiesDefault: {},
  omitProperties: ["Time", "ScheduledActionARN", "StartTime"],
  inferName:
    ({ dependenciesSpec: { autoScalingGroup } }) =>
    ({ ScheduledActionName }) =>
      pipe([
        tap((params) => {
          assert(autoScalingGroup);
          assert(ScheduledActionName);
        }),
        () => `${autoScalingGroup}::${ScheduledActionName}`,
      ])(),
  findName:
    () =>
    ({ AutoScalingGroupName, ScheduledActionName }) =>
      pipe([
        tap(() => {
          assert(AutoScalingGroupName);
          assert(ScheduledActionName);
        }),
        () => `${AutoScalingGroupName}::${ScheduledActionName}`,
      ])(),
  findId: () =>
    pipe([
      get("ScheduledActionARN"),
      tap((id) => {
        assert(id);
      }),
    ]),
  ignoreErrorCodes: ["ResourceNotFoundException", "ValidationError"],
  dependencies: {
    autoScalingGroup: {
      type: "AutoScalingGroup",
      group: "AutoScaling",
      pathId: "AutoScalingGroupName",
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
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AutoScaling.html#describeScheduledActions-property
  getById: {
    method: "describeScheduledActions",
    getField: "ScheduledUpdateGroupActions",
    pickId: pipe([
      tap(({ ScheduledActionName }) => {
        assert(ScheduledActionName);
      }),
      ({ ScheduledActionName }) => ({
        ScheduledActionNames: [ScheduledActionName],
      }),
    ]),
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AutoScaling.html#describeScheduledActions-property
  getList: {
    method: "describeScheduledActions",
    getParam: "ScheduledUpdateGroupActions",
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AutoScaling.html#putScheduledUpdateGroupAction-property
  create: {
    method: "putScheduledUpdateGroupAction",
    pickCreated: ({ payload }) => pipe([() => payload]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AutoScaling.html#putScheduledUpdateGroupAction-property
  update: {
    method: "putScheduledUpdateGroupAction",
    filterParams: ({ payload, diff, live }) =>
      pipe([() => payload, defaultsDeep(pickId(live))])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AutoScaling.html#deleteScheduledAction-property
  destroy: {
    method: "deleteScheduledAction",
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
      assign({
        StartTime: pipe([() => new Date(Date.now() + 2 * 60e3)]),
      }),
    ])(),
});
