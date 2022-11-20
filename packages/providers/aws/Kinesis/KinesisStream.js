const assert = require("assert");
const { pipe, tap, get, omit, pick, eq } = require("rubico");
const { defaultsDeep } = require("rubico/x");
const { buildTags } = require("../AwsCommon");

const { createAwsResource } = require("../AwsClient");
const { tagResource, untagResource, assignTags } = require("./KinesisCommon");

const pickId = pipe([pick(["StreamName"])]);

const model = ({ config }) => ({
  package: "kinesis",
  client: "Kinesis",
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
});

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Kinesis.html
exports.KinesisStream = ({ spec, config }) =>
  createAwsResource({
    model: model({ config }),
    spec,
    config,
    findName: () => pipe([get("StreamName")]),
    findId: () => pipe([get("StreamARN")]),
    getByName: ({ getList, endpoint, getById }) =>
      pipe([({ name }) => ({ StreamName: name }), getById({})]),
    tagResource: tagResource,
    untagResource: untagResource,
    configDefault: ({ name, namespace, properties: { Tags, ...otherProps } }) =>
      pipe([
        () => otherProps,
        defaultsDeep({
          Tags: buildTags({ name, config, namespace, UserTags: Tags }),
        }),
      ])(),
  });
