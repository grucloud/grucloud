const assert = require("assert");
const { pipe, tap, get, assign, map } = require("rubico");
const { defaultsDeep } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
const { buildTags } = require("../AwsCommon");
const { replaceAccountAndRegion } = require("../AwsCommon");

const {
  Tagger,
  assignTags,
  dependenciesSnsAlarms,
} = require("./CloudWatchCommon");

const buildArn = () =>
  pipe([
    get("AlarmArn"),
    tap((arn) => {
      assert(arn);
    }),
  ]);

const decorate = ({ endpoint, config }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
    assignTags({ buildArn: buildArn(config), endpoint }),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CloudWatch.html
exports.CloudWatchCompositeAlarm = () => ({
  type: "CompositeAlarm",
  package: "cloudwatch",
  client: "CloudWatch",
  propertiesDefault: {
    ActionsEnabled: true,
    OKActions: [],
    InsufficientDataActions: [],
    AlarmActions: [],
  },
  omitProperties: [
    "AlarmArn",
    "AlarmConfigurationUpdatedTimestamp",
    "StateReason",
    "StateReasonData",
    "StateUpdatedTimestamp",
    "StateTransitionedTimestamp",
    "StateValue",
    "ActionsSuppressedBy",
    "ActionsSuppressedReason",
  ],
  inferName: () =>
    pipe([
      get("AlarmName"),
      tap((Name) => {
        assert(Name);
      }),
    ]),
  findName: () =>
    pipe([
      get("AlarmName"),
      tap((name) => {
        assert(name);
      }),
    ]),
  findId: () =>
    pipe([
      get("AlarmArn"),
      tap((id) => {
        assert(id);
      }),
    ]),
  ignoreErrorCodes: ["ResourceNotFoundException"],
  dependencies: {
    ...dependenciesSnsAlarms,
    metricAlarn: {
      type: "MetricAlarm",
      group: "CloudWatch",
      dependsOnTypeOnly: true,
    },
  },
  filterLive: ({ lives, providerConfig }) =>
    pipe([
      assign({
        AlarmActions: pipe([
          get("AlarmActions"),
          map(replaceAccountAndRegion({ providerConfig })),
        ]),
        OKActions: pipe([
          get("OKActions"),
          map(replaceAccountAndRegion({ providerConfig })),
        ]),
        InsufficientDataActions: pipe([
          get("InsufficientDataActions"),
          map(replaceAccountAndRegion({ providerConfig })),
        ]),
      }),
    ]),
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CloudWatch.html#describeAlarms-property
  getById: {
    method: "describeAlarms",
    pickId: pipe([
      tap(({ AlarmName }) => {
        assert(AlarmName);
      }),
      ({ AlarmName }) => ({
        AlarmNames: [AlarmName],
        AlarmTypes: ["CompositeAlarm"],
      }),
    ]),
    getField: "CompositeAlarms",
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CloudWatch.html#describeAlarms-property
  getList: {
    enhanceParams: () => () => ({ AlarmTypes: ["CompositeAlarm"] }),
    method: "describeAlarms",
    getParam: "CompositeAlarms",
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CloudWatch.html#putCompositeAlarm-property
  create: {
    method: "putCompositeAlarm",
    pickCreated: ({ payload }) => pipe([() => payload]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CloudWatch.html#putCompositeAlarm-property
  update: {
    method: "putCompositeAlarm",
    filterParams: ({ payload, diff, live }) => pipe([() => payload])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CloudWatch.html#deleteAlarms-property
  destroy: {
    method: "deleteAlarms",
    pickId: pipe([({ AlarmName }) => ({ AlarmNames: [AlarmName] })]),
  },
  getByName: getByNameCore,
  tagger: ({ config }) =>
    Tagger({
      buildArn: buildArn({ config }),
    }),
  configDefault: ({
    name,
    namespace,
    properties: { Tags, ...otherProps },
    dependencies: {},
    config,
  }) =>
    pipe([
      () => otherProps,
      defaultsDeep({
        Tags: buildTags({ name, config, namespace, UserTags: Tags }),
      }),
    ])(),
});
