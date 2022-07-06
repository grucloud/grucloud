const assert = require("assert");
const { pipe, tap, get, omit, filter, eq, assign } = require("rubico");
const { defaultsDeep, pluck, callProp } = require("rubico/x");

const { buildTags } = require("../AwsCommon");
const { createAwsResource } = require("../AwsClient");
const { tagResource, untagResource } = require("./CloudWatchCommon");

const AlarmDependenciesDimensions = {
  ec2Instance: { type: "Instance", group: "EC2" },
  appSyncGraphqlApi: { type: "GraphqlApi", group: "AppSync" },
};

exports.AlarmDependenciesDimensions = AlarmDependenciesDimensions;

const decorate = ({ endpoint }) =>
  pipe([
    assign({
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
    findName: pipe([get("live.AlarmName")]),
    findId: pipe([get("live.AlarmArn")]),
    findDependencies: ({ live, lives }) => [
      {
        type: "Topic",
        group: "SNS",
        ids: pipe([
          () => live,
          get("AlarmActions"),
          filter(callProp("startsWith", "arn:aws:sns")),
        ])(),
      },
      {
        type: "GraphqlApi",
        group: "AppSync",
        ids: pipe([
          () => live,
          get("Dimensions"),
          filter(eq(get("Name"), "GraphQLAPIId")),
          pluck("Value"),
        ])(),
      },
      {
        type: "Instance",
        group: "EC2",
        ids: pipe([
          () => live,
          get("Dimensions"),
          filter(eq(get("Name"), "InstanceId")),
          pluck("Value"),
        ])(),
      },
    ],
    getByName: ({ getList, endpoint, getById }) =>
      pipe([({ name }) => ({ AlarmName: name }), getById]),
    tagResource: tagResource,
    untagResource: untagResource,
    configDefault: ({ name, namespace, properties: { Tags, ...otherProps } }) =>
      pipe([
        () => otherProps,
        defaultsDeep({
          AlarmName: name,
          Tags: buildTags({ name, config, namespace, UserTags: Tags }),
        }),
      ])(),
  });
