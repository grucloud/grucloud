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
const { defaultsDeep, callProp, prepend, append } = require("rubico/x");
const { getByNameCore } = require("@grucloud/core/Common");

const { createAwsResource } = require("../AwsClient");

const { LogGroupNameManagedByOther } = require("./CloudWatchLogsCommon");

const LogStreamNameManagedByOther = [
  "eni-",
  "log_stream_created_by_aws_to_validate_log_delivery_subscriptions",
];
const findId = pipe([get("live.arn")]);

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

const managedByOther = pipe([
  get("live"),
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

const createModel = ({ config }) => ({
  package: "cloudwatch-logs",
  client: "CloudWatchLogs",
  ignoreErrorCodes: ["ResourceNotFoundException"],
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
});

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CloudWatchLogs.html
exports.CloudWatchLogStream = ({ spec, config }) =>
  createAwsResource({
    model: createModel({ config }),
    spec,
    config,
    managedByOther,
    findName: ({ live, lives }) =>
      pipe([
        () => live,
        logGroupNameFromArn,
        (logGroupName) => `${logGroupName}::${live.logStreamName}`,
      ])(),
    findId,
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
    getByName: getByNameCore,
    configDefault: ({
      name,
      namespace,
      properties: { Tags, ...otherProps },
      dependencies: { cloudWatchLogGroup },
    }) =>
      pipe([
        tap((params) => {
          assert(cloudWatchLogGroup);
        }),
        () => otherProps,
        defaultsDeep({ logGroupName: cloudWatchLogGroup.config.logGroupName }),
      ])(),
  });
