const assert = require("assert");
const { pipe, tap, get, pick, map } = require("rubico");
const {
  defaultsDeep,
  prepend,
  groupBy,
  values,
  pluck,
  flatten,
  when,
  isEmpty,
} = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");

const pickId = pipe([
  tap(({ AutoScalingGroupName, TopicARN }) => {
    assert(AutoScalingGroupName);
    assert(TopicARN);
  }),
  pick(["AutoScalingGroupName", "TopicARN"]),
]);

const decorate = ({ endpoint, config }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
  ]);

const formatNotificationConfigurations = pipe([
  get("NotificationConfigurations"),
  groupBy("AutoScalingGroupName"),
  map.entries(([AutoScalingGroupName, resources]) => [
    AutoScalingGroupName,
    pipe([
      () => resources,
      groupBy("TopicARN"),
      map.entries(([TopicARN, resources]) => [
        TopicARN,
        pipe([
          () => resources,
          pluck("NotificationType"),
          (NotificationTypes) => ({
            AutoScalingGroupName,
            TopicARN,
            NotificationTypes,
          }),
        ])(),
      ]),
      values,
    ])(),
  ]),
  values,
  flatten,
  tap((params) => {
    assert(true);
  }),
]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AutoScaling.html
exports.AutoScalingNotification = () => ({
  type: "Notification",
  package: "auto-scaling",
  client: "AutoScaling",
  propertiesDefault: {},
  omitProperties: [],
  inferName:
    ({ dependenciesSpec: { autoScalingGroup, snsTopic } }) =>
    () =>
      pipe([
        tap(() => {
          assert(autoScalingGroup);
          assert(snsTopic);
        }),
        () => `${autoScalingGroup}::${snsTopic}`,
      ])(),
  findName:
    ({ lives, config }) =>
    ({ AutoScalingGroupName, TopicARN }) =>
      pipe([
        tap(() => {
          assert(AutoScalingGroupName);
          assert(TopicARN);
        }),
        () => TopicARN,
        lives.getById({
          type: "Topic",
          group: "SNS",
          providerName: config.providerName,
        }),
        get("name", TopicARN),
        prepend(`${AutoScalingGroupName}::`),
      ])(),
  findId: () =>
    pipe([
      get("AutoScalingGroupName"),
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
    snsTopic: {
      type: "Topic",
      group: "SNS",
      pathId: "TopicARN",
      required: true,
      dependencyId: ({ lives, config }) =>
        pipe([
          get("TopicARN"),
          tap((TopicARN) => {
            assert(TopicARN);
          }),
        ]),
    },
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AutoScaling.html#describeNotificationConfigurations-property
  getById: {
    method: "describeNotificationConfigurations",
    pickId: pipe([
      tap(({ AutoScalingGroupName }) => {
        assert(AutoScalingGroupName);
      }),
      ({ AutoScalingGroupName }) => ({
        AutoScalingGroupNames: [AutoScalingGroupName],
      }),
    ]),
    decorate: () =>
      pipe([formatNotificationConfigurations, when(isEmpty, () => undefined)]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AutoScaling.html#describeNotificationConfigurations-property
  getList: ({ endpoint }) =>
    pipe([
      endpoint().describeNotificationConfigurations,
      formatNotificationConfigurations,
    ]),
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AutoScaling.html#putNotificationConfiguration-property
  create: {
    method: "putNotificationConfiguration",
    pickCreated: ({ payload }) => pipe([() => payload]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AutoScaling.html#updateNotification-property
  update: {
    method: "putNotificationConfiguration",
    filterParams: ({ payload, diff, live }) => pipe([() => payload])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AutoScaling.html#deleteNotificationConfiguration-property
  destroy: {
    method: "deleteNotificationConfiguration",
    pickId,
  },
  getByName: getByNameCore,
  configDefault: ({
    name,
    namespace,
    properties: { ...otherProps },
    dependencies: { autoScalingGroup, snsTopic },
    config,
  }) =>
    pipe([
      tap((params) => {
        assert(autoScalingGroup);
        assert(snsTopic);
      }),
      () => otherProps,
      defaultsDeep({
        AutoScalingGroupName: autoScalingGroup.config.AutoScalingGroupName,
        TopicARN: getField(snsTopic, "Attributes.TopicArn"),
      }),
    ])(),
});
