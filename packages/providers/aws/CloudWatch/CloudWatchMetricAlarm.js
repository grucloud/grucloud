const assert = require("assert");
const {
  pipe,
  tap,
  or,
  get,
  omit,
  filter,
  eq,
  assign,
  switchCase,
} = require("rubico");
const {
  defaultsDeep,
  pluck,
  callProp,
  find,
  unless,
  isEmpty,
  values,
} = require("rubico/x");

const { buildTags, replaceAccountAndRegion } = require("../AwsCommon");
const { Tagger } = require("./CloudWatchCommon");
const { replaceWithName } = require("@grucloud/core/Common");

const buildArn = () => pipe([get("AlarmArn")]);

const replaceDimension =
  ({ providerConfig, lives }) =>
  ({ Name, Value, ...other }) =>
    pipe([
      () => AlarmDependenciesDimensions,
      values,
      find(eq(get("dimensionId"), Name)),
      switchCase([
        isEmpty,
        () => ({ Value }),
        ({ type, group }) => ({
          Value: replaceWithName({
            groupType: `${group}::${type}`,
            providerConfig,
            lives,
            path: "id",
          })(Value),
        }),
      ]),
      defaultsDeep({ Name, ...other }),
    ])();

const findDependencyDimension =
  ({ type, group, dimensionId }) =>
  ({ lives, config }) =>
    pipe([
      get("Dimensions"),
      filter(eq(get("Name"), dimensionId)),
      pluck("Value"),
      unless(isEmpty, (id) =>
        pipe([
          lives.getByType({
            type,
            group,
            providerName: config.providerName,
          }),
          find(pipe([get("id"), callProp("endsWith", id)])),
          get("id"),
        ])()
      ),
    ]);

const AlarmDependenciesDimensions = {
  ec2Instance: {
    type: "Instance",
    group: "EC2",
    dimensionId: "InstanceId",
    dependencyId: findDependencyDimension({
      type: "Instance",
      group: "EC2",
      dimensionId: "InstanceId",
    }),
  },
  appSyncGraphqlApi: {
    type: "GraphqlApi",
    group: "AppSync",
    dimensionId: "GraphQLAPIId",
    dependencyId: findDependencyDimension({
      type: "GraphqlApi",
      group: "AppSync",
      dimensionId: "GraphQLAPIId",
    }),
  },
  route53HealhCheck: {
    type: "HealthCheck",
    group: "Route53",
    dimensionId: "HealthCheckId",
    dependencyId: findDependencyDimension({
      type: "HealthCheck",
      group: "Route53",
      dimensionId: "HealthCheckId",
    }),
  },
};

const managedByOther = () =>
  pipe([
    or([
      pipe([
        get("AlarmDescription", ""),
        callProp("startsWith", "DO NOT EDIT OR DELETE"),
      ]),
      pipe([get("AlarmName", ""), callProp("startsWith", "awseb-")]),
    ]),
  ]);

const decorate = ({ endpoint }) =>
  pipe([
    assign({
      AlarmActions: pipe([
        get("AlarmActions", []),
        callProp("sort", (a, b) => a.localeCompare(b)),
      ]),
      Tags: pipe([
        ({ AlarmArn }) => ({ ResourceARN: AlarmArn }),
        endpoint().listTagsForResource,
        get("Tags"),
      ]),
    }),
  ]);

const model = ({ config }) => ({});

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CloudWatch.html
exports.CloudWatchMetricAlarm = ({ spec, config }) => ({
  type: "MetricAlarm",
  package: "cloudwatch",
  client: "CloudWatch",
  inferName: () => get("AlarmName"),
  findName: () => pipe([get("AlarmName")]),
  findId: () => pipe([get("AlarmArn")]),
  managedByOther,
  ignoreErrorCodes: ["ResourceNotFoundException"],
  omitProperties: [
    "AlarmArn",
    "AlarmConfigurationUpdatedTimestamp",
    "StateValue",
    "StateReason",
    "StateReasonData",
    "StateUpdatedTimestamp",
    "StateTransitionedTimestamp",
  ],
  dependencies: {
    snsTopic: {
      type: "Topic",
      group: "SNS",
      dependencyId: ({ lives, config }) =>
        pipe([
          get("AlarmActions"),
          find(callProp("startsWith", "arn:aws:sns")),
        ]),
    },
    ...AlarmDependenciesDimensions,
  },
  propertiesDefault: {
    ActionsEnabled: true,
    OKActions: [],
    InsufficientDataActions: [],
    AlarmActions: [],
  },
  filterLive: ({ lives, providerConfig }) =>
    pipe([
      assign({
        AlarmActions: pipe([
          get("AlarmActions"),
          map(replaceAccountAndRegion({ providerConfig })),
        ]),
        Dimensions: pipe([
          get("Dimensions"),
          map(pipe([replaceDimension({ providerConfig, lives })])),
        ]),
      }),
      tap((params) => {
        assert(true);
      }),
    ]),
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CloudWatch.html#describeAlarms-property
  getById: {
    method: "describeAlarms",
    pickId: ({ AlarmName }) => ({
      AlarmNames: [AlarmName],
      AlarmTypes: ["MetricAlarm"],
    }),
    getField: "MetricAlarms",
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CloudWatch.html#describeAlarms-property
  getList: {
    method: "describeAlarms",
    getParam: "MetricAlarms",
    enhanceParams: () => () => ({ AlarmTypes: ["MetricAlarm"] }),
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CloudWatch.html#putMetricAlarm-property
  create: {
    method: "putMetricAlarm",
    pickCreated: ({ payload }) => pipe([() => payload]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CloudWatch.html#putMetricAlarm-property
  update: {
    method: "putMetricAlarm",
    filterParams: ({ payload, live }) =>
      pipe([() => payload, omit(["Tags"])])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CloudWatch.html#deleteAlarms-property
  destroy: {
    method: "deleteAlarms",
    pickId: pipe([({ AlarmName }) => ({ AlarmNames: [AlarmName] })]),
  },
  getByName: ({ getList, endpoint, getById }) =>
    pipe([({ name }) => ({ AlarmName: name }), getById({})]),
  tagger: ({ config }) =>
    Tagger({
      buildArn: buildArn({ config }),
    }),
  configDefault: ({
    name,
    namespace,
    properties: { Tags, ...otherProps },
    config,
  }) =>
    pipe([
      () => otherProps,
      defaultsDeep({
        AlarmName: name,
        Tags: buildTags({ name, config, namespace, UserTags: Tags }),
      }),
    ])(),
});
