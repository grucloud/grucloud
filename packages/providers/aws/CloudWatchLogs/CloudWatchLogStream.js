const assert = require("assert");
const {
  pipe,
  tap,
  get,
  pick,
  fork,
  switchCase,
  any,
  map,
  or,
} = require("rubico");
const { defaultsDeep, callProp, prepend, find } = require("rubico/x");
const { getByNameCore } = require("@grucloud/core/Common");

const { LogGroupNameManagedByOther } = require("./CloudWatchLogsCommon");

const LogStreamNameManagedByOther = [
  "eni-",
  "log_stream_created_by_aws_to_validate_log_delivery_subscriptions",
];
const findId = () => pipe([get("arn")]);

const logGroupNameFromArn = pipe([
  get("arn"),
  callProp("split", ":"),
  (arr) => arr[6],
]);

const logStreamNameFromArn = pipe([
  get("arn"),
  callProp("split", ":"),
  (arr) => arr[8],
  tap((logStreamName) => {
    assert(logStreamName);
  }),
]);

const managedByOther = () =>
  pipe([
    or([
      ({ logStreamName }) =>
        pipe([
          () => LogStreamNameManagedByOther,
          any((prefix) => logStreamName.includes(prefix)),
        ])(),
      ({ arn }) =>
        pipe([
          () => LogGroupNameManagedByOther,
          map(prepend("log-group:")),
          any((prefix) => arn.includes(prefix)),
        ])(),
    ]),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CloudWatchLogs.html
exports.CloudWatchLogStream = ({ compare }) => ({
  type: "LogStream",
  package: "cloudwatch-logs",
  client: "CloudWatchLogs",
  ignoreErrorCodes: ["ResourceNotFoundException"],
  omitProperties: [],
  managedByOther,
  inferName:
    ({ dependenciesSpec: { cloudWatchLogGroup } }) =>
    ({ logStreamName }) =>
      pipe([
        tap((params) => {
          assert(cloudWatchLogGroup);
          assert(logStreamName);
        }),
        () => `${cloudWatchLogGroup}::${logStreamName}`,
      ])(),
  findName:
    ({ lives }) =>
    (live) =>
      pipe([
        () => live,
        logGroupNameFromArn,
        (logGroupName) => `${logGroupName}::${live.logStreamName}`,
      ])(),
  findId,
  ignoreResource: () => () => true,
  compare: compare({
    filterAll: () => pipe([pick([])]),
  }),
  filterLive: () => pipe([pick(["logStreamName"])]),
  dependencies: {
    cloudWatchLogGroup: {
      type: "LogGroup",
      group: "CloudWatchLogs",
      parent: true,
      dependencyId:
        ({ lives, config }) =>
        (live) =>
          pipe([
            lives.getByType({
              providerName: config.providerName,
              type: "LogGroup",
              group: "CloudWatchLogs",
            }),
            find(pipe([({ id }) => live.arn.includes(id)])),
            get("id"),
          ])(),
    },
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CloudWatchLogs.html#describeLogStreams-property
  getById: {
    method: "describeLogStreams",
    getField: "logStreams",
    pickId: pipe([
      switchCase([
        get("arn"),
        fork({
          logGroupName: pipe([logGroupNameFromArn]),
          logStreamNamePrefix: pipe([logStreamNameFromArn]),
        }),
        ({ logGroupName, logStreamName }) => ({
          logGroupName,
          logStreamNamePrefix: logStreamName,
        }),
      ]),
    ]),
  },
  getList: ({ client, endpoint, getById, config }) =>
    pipe([
      () =>
        client.getListWithParent({
          parent: { type: "LogGroup", group: "CloudWatchLogs" },
          pickKey: pipe([pick(["logGroupName"])]),
          method: "describeLogStreams",
          getParam: "logStreams",
          config,
        }),
    ])(),
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CloudWatchLogs.html#createLogStream-property
  create: {
    method: "createLogStream",
    pickCreated: ({ payload }) => pipe([() => payload]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CloudWatchLogs.html#deleteLogStream-property
  destroy: {
    method: "deleteLogStream",
    pickId: pipe([
      tap((params) => {
        assert(true);
      }),
      fork({
        logGroupName: pipe([logGroupNameFromArn]),
        logStreamName: pipe([logStreamNameFromArn]),
      }),
    ]),
  },
  getByName: getByNameCore,
  configDefault: ({
    name,
    namespace,
    properties: { Tags, ...otherProps },
    dependencies: { cloudWatchLogGroup },
    config,
  }) =>
    pipe([
      tap((params) => {
        assert(cloudWatchLogGroup);
      }),
      () => otherProps,
      defaultsDeep({ logGroupName: cloudWatchLogGroup.config.logGroupName }),
    ])(),
});
