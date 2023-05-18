const assert = require("assert");
const { pipe, tap, get, pick, assign } = require("rubico");
const { defaultsDeep, first, keys, when } = require("rubico/x");
const { getByNameCore } = require("@grucloud/core/Common");

const { getField } = require("@grucloud/core/ProviderCommon");

const findId = () => pipe([get("filterName")]);

const findDependenciesSubscriptionFilter =
  ({ type, group }) =>
  ({ lives, config }) =>
  (live) =>
    pipe([
      () => live,
      get("destinationArn"),
      lives.getById({
        providerName: config.providerName,
        type,
        group,
      }),
      get("id"),
    ])();

const SubscriptionFilterDependencies = {
  lambdaFunction: {
    type: "Function",
    group: "Lambda",
    arn: "Configuration.FunctionArn",
    dependencyId: findDependenciesSubscriptionFilter({
      type: "Function",
      group: "Lambda",
    }),
  },
  kinesisStream: {
    type: "Stream",
    group: "Kinesis",
    arn: "StreamARN",
    dependencyId: findDependenciesSubscriptionFilter({
      type: "Stream",
      group: "Kinesis",
    }),
  },
  firehoseStream: {
    type: "DeliveryStream",
    group: "Firehose",
    arn: "DeliveryStreamARN",
    dependencyId: findDependenciesSubscriptionFilter({
      type: "DeliveryStream",
      group: "Firehose",
    }),
  },
};

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CloudWatchLogs.html
exports.CloudWatchLogsSubscriptionFilter = ({ compare }) => ({
  type: "SubscriptionFilter",
  package: "cloudwatch-logs",
  client: "CloudWatchLogs",
  ignoreErrorCodes: ["ResourceNotFoundException"],
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
  findName:
    () =>
    ({ logGroupName, filterName }) =>
      pipe([() => `${logGroupName}::${filterName}`])(),
  findId,
  compare: compare({
    filterAll: () => pipe([pick([])]),
  }),
  omitProperties: ["destinationArn", "roleArn", "logGroupName", "creationTime"],
  dependencies: {
    cloudWatchLogGroup: {
      type: "LogGroup",
      group: "CloudWatchLogs",
      parent: true,
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
    role: {
      type: "Role",
      group: "IAM",
      dependencyId: () => get("roleArn"),
    },
    ...SubscriptionFilterDependencies,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CloudWatchLogs.html#describeSubscriptionFilters-property
  getById: {
    method: "describeSubscriptionFilters",
    getField: "subscriptionFilters",
    pickId: pipe([
      ({ logGroupName, filterName }) => ({
        logGroupName,
        filterNamePrefix: filterName,
      }),
    ]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CloudWatchLogs.html#putSubscriptionFilter-property
  create: {
    method: "putSubscriptionFilter",
    pickCreated: ({ payload }) => pipe([() => payload]),
    // TODO
    // "Could not execute the lambda function. Make sure you have given CloudWatch Logs permission to execute your function.",
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CloudWatchLogs.html#deleteSubscriptionFilter-property
  destroy: {
    method: "deleteSubscriptionFilter",
    pickId: pipe([pick(["filterName", "logGroupName"])]),
  },
  getList: ({ client, endpoint, getById, config }) =>
    pipe([
      () =>
        client.getListWithParent({
          parent: { type: "LogGroup", group: "CloudWatchLogs" },
          pickKey: pipe([pick(["logGroupName"])]),
          method: "describeSubscriptionFilters",
          getParam: "subscriptionFilters",
          config,
          decorate: () =>
            pipe([
              tap((params) => {
                assert(true);
              }),
            ]),
        }),
    ])(),
  getByName: getByNameCore,
  configDefault: ({
    name,
    namespace,
    properties: { Tags, ...otherProps },
    dependencies: { cloudWatchLogGroup, role, ...otherDeps },
  }) =>
    pipe([
      tap((params) => {
        assert(cloudWatchLogGroup);
      }),
      () => otherProps,
      defaultsDeep({
        logGroupName: cloudWatchLogGroup.config.logGroupName,
      }),
      when(
        () => role,
        defaultsDeep({
          roleArn: getField(role, "Arn"),
        })
      ),
      assign({
        destinationArn: pipe([
          () => otherDeps,
          keys,
          first,
          (key) =>
            pipe([
              tap(() => {
                assert(key);
                assert(SubscriptionFilterDependencies[key].arn);
              }),
              () =>
                getField(
                  otherDeps[key],
                  SubscriptionFilterDependencies[key].arn
                ),
            ])(),
        ]),
      }),
    ])(),
});
