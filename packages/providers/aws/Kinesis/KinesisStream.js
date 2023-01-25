const assert = require("assert");
const { pipe, tap, get, omit, pick, eq, assign } = require("rubico");
const { defaultsDeep, size, when } = require("rubico/x");
const { buildTags, compareAws } = require("../AwsCommon");

const { tagResource, untagResource, assignTags } = require("./KinesisCommon");

const pickId = pipe([pick(["StreamName"])]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Kinesis.html
exports.KinesisStream = ({}) => ({
  type: "Stream",
  package: "kinesis",
  client: "Kinesis",
  inferName: () => get("StreamName"),
  findName: () => pipe([get("StreamName")]),
  findId: () => pipe([get("StreamARN")]),
  omitProperties: [
    "StreamARN",
    "StreamCreationTimestamp",
    "StreamStatus",
    "HasMoreShards",
    "Shards",
    "EnhancedMonitoring", // TODO
  ],
  propertiesDefault: { EncryptionType: "NONE", RetentionPeriodHours: 24 },
  compare: compareAws({ filterTarget: () => pipe([omit(["ShardCount"])]) }),
  filterLive: () =>
    pipe([
      when(
        eq(get("StreamModeDetails.StreamMode"), "PROVISIONED"),
        pipe([assign({ ShardCount: pipe([get("Shards"), size]) })])
      ),
    ]),
  getByName: ({ getList, endpoint, getById }) =>
    pipe([({ name }) => ({ StreamName: name }), getById({})]),
  ignoreErrorCodes: ["ResourceNotFoundException"],
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Kinesis.html#describeStream-property
  getById: {
    method: "describeStream",
    pickId,
    getField: "StreamDescription",
    decorate: ({ endpoint }) => pipe([assignTags({ endpoint })]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Kinesis.html#listStreams-property
  getList: {
    method: "listStreams",
    getParam: "StreamNames",
    decorate: ({ getById }) =>
      pipe([(name) => ({ StreamName: name }), getById]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Kinesis.html#createStream-property
  create: {
    method: "createStream",
    pickCreated: ({ payload }) => pipe([() => payload]),
    filterParams: pipe([omit(["EnhancedMonitoring"])]),
    isInstanceUp: eq(get("StreamStatus"), "ACTIVE"),
    postCreate:
      ({ endpoint }) =>
      (live) =>
        pipe([() => live, get("Tags"), tagResource({ endpoint })({ live })])(),
  },
  update: {
    method: "updateStream",
    filterParams: ({ payload, live }) =>
      pipe([() => payload, omit(["Tags"])])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Kinesis.html#deleteStream-property
  destroy: {
    method: "deleteStream",
    pickId,
    //EnforceConsumerDeletion
  },
  tagger: ({ config }) => ({ tagResource, untagResource }),
  configDefault: ({
    name,
    namespace,
    properties: { Tags, ...otherProps },
    config,
  }) =>
    pipe([
      () => otherProps,
      defaultsDeep({
        Tags: buildTags({ name, config, namespace, UserTags: Tags }),
      }),
    ])(),
});
