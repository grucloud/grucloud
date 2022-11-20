const assert = require("assert");
const { pipe, tap, or, get, omit, filter, eq, assign } = require("rubico");
const { defaultsDeep, pluck, callProp, find } = require("rubico/x");

const { buildTags } = require("../AwsCommon");
const { createAwsResource } = require("../AwsClient");
const { tagResource, untagResource } = require("./CloudWatchCommon");

const buildArn = () => pipe([get("AlarmArn")]);

const findDependencyDimension =
  ({ type, group, dimensionId }) =>
  ({ lives, config }) =>
    pipe([
      get("Dimensions"),
      filter(eq(get("Name"), dimensionId)),
      pluck("Value"),
      (id) =>
        pipe([
          () =>
            lives.getByType({
              type,
              group,
              providerName: config.providerName,
            }),
          find(pipe([get("id"), callProp("endsWith", id)])),
          get("id"),
        ])(),
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

exports.AlarmDependenciesDimensions = AlarmDependenciesDimensions;

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

const model = ({ config }) => ({
  package: "cloudwatch",
  client: "CloudWatch",
  ignoreErrorCodes: ["ResourceNotFoundException"],
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
});

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CloudWatch.html
exports.CloudWatchMetricAlarm = ({ spec, config }) =>
  createAwsResource({
    model: model({ config }),
    spec,
    config,
    findName: () => pipe([get("AlarmName")]),
    findId: () => pipe([get("AlarmArn")]),
    managedByOther,
    getByName: ({ getList, endpoint, getById }) =>
      pipe([({ name }) => ({ AlarmName: name }), getById({})]),
    tagResource: tagResource({
      buildArn: buildArn(config),
    }),
    untagResource: untagResource({
      buildArn: buildArn(config),
    }),
    configDefault: ({ name, namespace, properties: { Tags, ...otherProps } }) =>
      pipe([
        () => otherProps,
        defaultsDeep({
          AlarmName: name,
          Tags: buildTags({ name, config, namespace, UserTags: Tags }),
        }),
      ])(),
  });
