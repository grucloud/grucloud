const assert = require("assert");
const { pipe, tap, get, pick, eq, and } = require("rubico");
const { defaultsDeep, find } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");

const pickId = pipe([
  tap(({ Source, Destination, Metric, Statistic }) => {
    assert(Source);
    assert(Destination);
    assert(Metric);
    assert(Statistic);
  }),
  pick(["Source", "Destination", "Metric", "Statistic"]),
]);

const decorate = ({ endpoint, config }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
  ]);

const findId = () =>
  pipe([
    tap(({ Source, Destination }) => {
      assert(Source);
      assert(Destination);
    }),
    ({
      Source,
      Destination,
      Metric = "aggregate-latency",
      Statistic = "p50",
    }) => `${Source}::${Destination}::${Metric}::${Statistic}`,
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html
exports.EC2NetworkPerformanceMetricSubscription = () => ({
  type: "NetworkPerformanceMetricSubscription",
  package: "ec2",
  client: "EC2",
  region: "us-west-2",
  propertiesDefault: {
    Metric: "aggregate-latency",
    Statistic: "p50",
    Period: "five-minutes",
  },
  omitProperties: [],
  inferName: findId,
  findName: findId,
  findId,
  ignoreErrorCodes: ["ResourceNotFoundException"],
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#describeAwsNetworkPerformanceMetricSubscriptions-property
  getById: {
    method: "describeAwsNetworkPerformanceMetricSubscriptions",
    pickId,
    decorate: ({ live }) =>
      pipe([
        get("Subscriptions"),
        find(
          and([
            eq(get("Source"), live.Source),
            eq(get("Destination"), live.Destination),
            eq(get("Metric"), live.Metric),
            eq(get("Statistic"), live.Statistic),
          ])
        ),
      ]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#describeAwsNetworkPerformanceMetricSubscriptions-property
  getList: {
    method: "describeAwsNetworkPerformanceMetricSubscriptions",
    getParam: "Subscriptions",
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#createNetworkPerformanceMetricSubscription-property
  create: {
    method: "enableAwsNetworkPerformanceMetricSubscription",
    pickCreated: ({ payload }) => pipe([() => payload]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#updateNetworkPerformanceMetricSubscription-property
  //   update:
  //     ({ endpoint, getById }) =>
  //     ({ payload, live, diff }) =>
  //       pipe([
  //         () => payload,
  //         switchCase([
  //           isDisabled,
  //           endpoint().enableAwsNetworkPerformanceMetricSubscription,
  //           endpoint().disableAwsNetworkPerformanceMetricSubscription,
  //         ]),
  //       ])(),
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#deleteNetworkPerformanceMetricSubscription-property
  destroy: {
    method: "disableAwsNetworkPerformanceMetricSubscription",
    pickId,
  },
  getByName: getByNameCore,
  configDefault: ({
    name,
    namespace,
    properties: { ...otherProps },
    dependencies: {},
    config,
  }) => pipe([() => otherProps, defaultsDeep({})])(),
});
