const assert = require("assert");
const { pipe, tap, get, omit, pick, eq, filter, map } = require("rubico");
const { defaultsDeep, pluck, flatten, callProp } = require("rubico/x");
const { buildTags } = require("../AwsCommon");

const { createAwsResource } = require("../AwsClient");
const { tagResource, untagResource, assignTags } = require("./FirehoseCommon");

const pickId = pipe([
  pick(["DeliveryStreamName"]),
  tap(({ DeliveryStreamName }) => {
    assert(DeliveryStreamName);
  }),
]);

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
    findDependencies: ({ live, lives }) => [
      {
        type: "Stream",
        group: "Kinesis",
        //TODO
        ids: [live.GlobalNetworkId],
      },
      {
        type: "Bucket",
        group: "S3",
        ids: [
          ...pipe([
            () => live,
            get("Destinations"),
            pluck("S3DestinationDescription"),
            pluck("BucketARN"),
            map(callProp("replace", "arn:aws:s3:::", "")),
          ])(),
          ...pipe([
            () => live,
            get("Destinations"),
            pluck(
              "ExtendedS3DestinationDescription.S3BackupDescription.BucketARN"
            ),
            map(callProp("replace", "arn:aws:s3:::", "")),
          ])(),
        ],
      },
      {
        type: "Role",
        group: "IAM",
        //TODO
        ids: pipe([
          () => live,
          get("Destinations"),
          tap((params) => {
            assert(true);
          }),
          pluck("S3DestinationDescription"),
          tap((params) => {
            assert(true);
          }),
          pluck("RoleARN"),
          tap((params) => {
            assert(true);
          }),
        ])(),
      },
      {
        type: "Function",
        group: "Lambda",
        ids: pipe([
          () => live,
          get("Destinations"),
          pluck("ExtendedS3DestinationDescription"),
          pluck("ProcessingConfiguration"),
          pluck("Processors"),
          flatten,
          pluck("Parameters"),
          flatten,
          filter(eq(get("ParameterName"), "LambdaArn")),
          pluck("ParameterValue"),
          map(callProp("replace", ":$LATEST", "")),
        ])(),
      },
      {
        type: "LogStream",
        group: "CloudWatchLogs",
        ids: pipe([
          () => live,
          get("Destinations"),
          pluck("ExtendedS3DestinationDescription"),
          tap((params) => {
            assert(true);
          }),
          pluck("CloudWatchLoggingOptions"),
          tap((params) => {
            assert(true);
          }),
          map(
            pipe([
              tap(({ LogGroupName, LogStreamName }) => {
                assert(LogGroupName);
                assert(LogStreamName);
              }),
              ({ LogGroupName, LogStreamName }) =>
                lives.getByName({
                  name: `${LogGroupName}::${LogStreamName}`,
                  providerName: config.providerName,
                  type: "LogStream",
                  group: "CloudWatchLogs",
                }),
              tap((params) => {
                assert(true);
              }),

              get("id"),
            ])
          ),
        ])(),
      },
      {
        type: "Key",
        group: "KMS",
        ids: [
          pipe([
            () => live,
            get("DeliveryStreamEncryptionConfiguration.KeyARN"),
          ])(),
        ],
      },
    ],
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
