const assert = require("assert");
const { pipe, tap, get, pick, eq } = require("rubico");
const { defaultsDeep, identity } = require("rubico/x");
const { buildTagsObject } = require("@grucloud/core/Common");
const { getByNameCore } = require("@grucloud/core/Common");

const { Tagger } = require("./IvschatCommon");

const buildArn = () =>
  pipe([
    get("arn"),
    tap((arn) => {
      assert(arn);
    }),
  ]);

const pickId = pipe([
  ({ arn }) => ({ identifier: arn }),
  tap(({ identifier }) => {
    assert(identifier);
  }),
]);

const decorate = ({ endpoint }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Ivschat.html
exports.IvschatLoggingConfiguration = ({ compare }) => ({
  type: "LoggingConfiguration",
  package: "ivschat",
  client: "Ivschat",
  propertiesDefault: {},
  omitProperties: ["arn", "createTime", "id", "state", "updateTime"],
  inferName: () =>
    pipe([
      get("name"),
      tap((Name) => {
        assert(Name);
      }),
    ]),
  findName: () =>
    pipe([
      get("name"),
      tap((name) => {
        assert(name);
      }),
    ]),
  findId: () =>
    pipe([
      get("arn"),
      tap((id) => {
        assert(id);
      }),
    ]),
  dependencies: {
    logGroup: {
      type: "LogGroup",
      group: "CloudWatchLogs",
      dependencyId: ({ lives, config }) =>
        pipe([
          get("destinationConfiguration.cloudWatchLogs.logGroupName"),
          lives.getByName({
            type: "LogGroup",
            group: "CloudWatchLogs",
            providerName: config.providerName,
          }),
          get("id"),
        ]),
    },
    firehoseDeliveryStream: {
      type: "DeliveryStream",
      group: "Firehose",
      dependencyId: ({ lives, config }) =>
        pipe([
          get("destinationConfiguration.firehose.deliveryStreamName"),
          lives.getByName({
            type: "DeliveryStream",
            group: "Firehose",
            providerName: config.providerName,
          }),
          get("id"),
        ]),
    },
    s3Bucket: {
      type: "Bucket",
      group: "S3",
      dependencyId: ({ lives, config }) =>
        pipe([get("destinationConfiguration.s3.bucketName")]),
    },
  },
  ignoreErrorCodes: ["ResourceNotFoundException"],
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Ivschat.html#getLoggingConfiguration-property
  getById: {
    method: "getLoggingConfiguration",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Ivschat.html#listLoggingConfigurations-property
  getList: {
    method: "listLoggingConfigurations",
    getParam: "loggingConfigurations",
    decorate: ({ getById }) => pipe([getById]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Ivschat.html#createLoggingConfiguration-property
  create: {
    method: "createLoggingConfiguration",
    pickCreated: ({ payload }) => pipe([identity]),
    isInstanceUp: pipe([eq(get("state"), "ACTIVE")]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Ivschat.html#updateLoggingConfiguration-property
  update: {
    method: "updateLoggingConfiguration",
    filterParams: ({ payload, diff, live }) =>
      pipe([() => payload, defaultsDeep(pickId(live))])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Ivschat.html#deleteLoggingConfiguration-property
  destroy: {
    method: "deleteLoggingConfiguration",
    pickId,
  },
  getByName: getByNameCore,
  tagger: ({ config }) =>
    Tagger({
      buildArn: buildArn({ config }),
    }),
  configDefault: ({
    name,
    namespace,
    properties: { tags, ...otherProps },
    dependencies: {},
    config,
  }) =>
    pipe([
      () => otherProps,
      defaultsDeep({
        tags: buildTagsObject({ name, config, namespace, userTags: tags }),
      }),
    ])(),
});
