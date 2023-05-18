const assert = require("assert");
const { pipe, tap, get, pick } = require("rubico");
const { defaultsDeep } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");

const pickId = pipe([
  tap(({ logGroupName, filterName }) => {
    assert(logGroupName);
    assert(filterName);
  }),
  pick(["logGroupName", "filterName"]),
]);

const decorate = ({ endpoint, config }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
  ]);

const findName =
  () =>
  ({ logGroupName, filterName }) =>
    pipe([
      tap((params) => {
        assert(logGroupName);
        assert(filterName);
      }),
      () => `${logGroupName}::${filterName}`,
    ])();

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CloudWatchLogs.html
exports.CloudWatchLogsMetricFilter = () => ({
  type: "MetricFilter",
  package: "cloudwatch-logs",
  client: "CloudWatchLogs",
  propertiesDefault: {},
  omitProperties: [],
  inferName:
    ({ dependenciesSpec: { cloudWatchLogGroup } }) =>
    ({ filterName }) =>
      pipe([
        tap((params) => {
          assert(cloudWatchLogGroup);
          assert(filterName);
        }),
        () => `${cloudWatchLogGroup}::${filterName}`,
      ])(),
  findName,
  findId: findName,
  ignoreErrorCodes: ["ResourceNotFoundException"],
  dependencies: {
    cloudWatchLogGroup: {
      type: "LogGroup",
      group: "CloudWatchLogs",
      parent: true,
      pathId: "logGroupName",
      dependencyId: ({ lives, config }) =>
        pipe([
          get("logGroupName"),
          lives.getByName({
            providerName: config.providerName,
            type: "LogGroup",
            group: "CloudWatchLogs",
          }),
          get("id"),
        ]),
    },
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CloudWatchLogs.html#describeMetricFilters-property
  getById: {
    method: "describeMetricFilters",
    getField: "metricFilters",
    pickId: pipe([
      ({ logGroupName, filterName }) => ({
        logGroupName,
        filterNamePrefix: filterName,
      }),
    ]),
    // TODO find exact destinationName
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CloudWatchLogs.html#describeMetricFilters-property
  getList: ({ client, endpoint, getById, config }) =>
    pipe([
      () =>
        client.getListWithParent({
          parent: { type: "LogGroup", group: "CloudWatchLogs" },
          pickKey: pipe([
            pick(["logGroupName"]),
            tap(({ logGroupName }) => {
              assert(logGroupName);
            }),
          ]),
          method: "describeMetricFilters",
          getParam: "metricFilters",
          config,
          decorate: () => pipe([decorate({ endpoint, config })]),
        }),
    ])(),
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CloudWatchLogs.html#putMetricFilter-property
  create: {
    method: "putMetricFilter",
    pickCreated: ({ payload }) => pipe([() => payload]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CloudWatchLogs.html#putMetricFilter-property
  update: {
    method: "putMetricFilter",
    filterParams: ({ payload, diff, live }) => pipe([() => payload])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CloudWatchLogs.html#deleteMetricFilter-property
  destroy: {
    method: "deleteMetricFilter",
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
