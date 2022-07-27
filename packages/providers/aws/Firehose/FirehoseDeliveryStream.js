const assert = require("assert");
const { pipe, tap, get, omit, pick, eq } = require("rubico");
const { defaultsDeep } = require("rubico/x");
const { buildTags } = require("../AwsCommon");

const { createAwsResource } = require("../AwsClient");
const { tagResource, untagResource, assignTags } = require("./FirehoseCommon");

const pickId = pipe([pick(["DeliveryStreamName"])]);

const model = ({ config }) => ({
  package: "firehose",
  client: "Firehose",
  ignoreErrorCodes: ["ResourceNotFoundException"],
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Firehose.html#describeDeliveryStream-property
  getById: {
    method: "describeDeliveryStream",
    pickId,
    getField: "DeliveryStreamDescription",
    decorate: ({ endpoint }) => pipe([assignTags({ endpoint })]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Firehose.html#listDeliveryStreams-property
  getList: {
    method: "listDeliveryStreams",
    getParam: "DeliveryStreamNames",
    decorate: ({ getById }) =>
      pipe([(name) => ({ DeliveryStreamName: name }), getById]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Firehose.html#createDeliveryStream-property
  create: {
    method: "createDeliveryStream",
    pickCreated: ({ payload }) => pipe([() => payload]),
    //filterParams: pipe([omit(["EnhancedMonitoring"])]),
    isInstanceUp: eq(get("DeliveryStreamStatus"), "ACTIVE"),
    getErrorMessage: get("FailureDescription", "error"),
    // postCreate:
    //   ({ endpoint }) =>
    //   (live) =>
    //     pipe([() => live, get("Tags"), tagResource({ endpoint })({ live })])(),
  },
  update: {
    method: "updateDeliveryStream",
    filterParams: ({ payload, live }) =>
      pipe([() => payload, omit(["Tags"])])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Firehose.html#deleteDeliveryStream-property
  destroy: {
    method: "deleteDeliveryStream",
    pickId,
    // AllowForceDelete ?
  },
});

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Firehose.html
exports.FirehoseDeliveryStream = ({ spec, config }) =>
  createAwsResource({
    model: model({ config }),
    spec,
    config,
    findName: pipe([get("live.DeliveryStreamName")]),
    findId: pipe([get("live.DeliveryStreamARN")]),
    getByName: ({ getList, endpoint, getById }) =>
      pipe([({ name }) => ({ DeliveryStreamName: name }), getById]),
    tagResource: tagResource,
    untagResource: untagResource,
    configDefault: ({
      name,
      namespace,
      properties: { Tags, ...otherProps },
      dependencies: { kinesisStream, s3BucketDestination, kmsKey },
    }) =>
      pipe([
        () => otherProps,
        defaultsDeep({
          Tags: buildTags({ name, config, namespace, UserTags: Tags }),
        }),
        when(() => kmsKey, defaultsDeep({})),
      ])(),
  });
