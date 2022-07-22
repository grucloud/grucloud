const assert = require("assert");
const { pipe, tap, get, pick, not, map, filter, assign } = require("rubico");
const {
  defaultsDeep,
  values,
  unless,
  isEmpty,
  first,
  keys,
  when,
} = require("rubico/x");
const { getByNameCore } = require("@grucloud/core/Common");

const { createAwsResource } = require("../AwsClient");
const { getField } = require("@grucloud/core/ProviderCommon");

const findId = pipe([get("live.filterName")]);

const SubscriptionFilterDependencies = {
  lambdaFunction: {
    type: "Function",
    group: "Lambda",
    arn: "Configuration.FunctionArn",
  },
  kinesisStream: { type: "Stream", group: "Kinesis", arn: "StreamARN" },
  //TODO
  //firehoseStream: { type: "Stream", group: "Firehose", arn: "TODO" },
};

exports.SubscriptionFilterDependencies = SubscriptionFilterDependencies;

const findDependenciesSubscriptionFilter = ({ live, lives, config }) =>
  pipe([
    () => SubscriptionFilterDependencies,
    values,
    map(({ type, group }) =>
      pipe([
        () =>
          lives.getById({
            id: live.destinationArn,
            providerName: config.providerName,
            type,
            group,
          }),
        get("id"),
        unless(isEmpty, (id) => ({ type, group, ids: [id] })),
      ])()
    ),
    filter(not(isEmpty)),
  ])();

const createModel = ({ config }) => ({
  package: "cloudwatch-logs",
  client: "CloudWatchLogs",
  ignoreErrorCodes: ["ResourceNotFoundException"],
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
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CloudWatchLogs.html#deleteSubscriptionFilter-property
  destroy: {
    method: "deleteSubscriptionFilter",
    pickId: pipe([pick(["filterName", "logGroupName"])]),
  },
});

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CloudWatchLogs.html
exports.CloudWatchSubscriptionFilter = ({ spec, config }) =>
  createAwsResource({
    model: createModel({ config }),
    spec,
    config,
    findDependencies: ({ live, lives }) => [
      {
        type: "LogGroup",
        group: "CloudWatchLogs",
        ids: [
          pipe([
            () =>
              lives.getByName({
                name: live.logGroupName,
                providerName: config.providerName,
                type: "LogGroup",
                group: "CloudWatchLogs",
              }),
            get("id"),
          ])(),
        ],
      },
      {
        type: "Role",
        group: "IAM",
        ids: [live.roleArn],
      },
      ...findDependenciesSubscriptionFilter({ live, lives, config }),
    ],
    findName: ({ live, lives }) =>
      pipe([() => `${live.logGroupName}::${live.filterName}`])(),
    findId,
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
        defaultsDeep({ logGroupName: cloudWatchLogGroup.config.logGroupName }),
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
