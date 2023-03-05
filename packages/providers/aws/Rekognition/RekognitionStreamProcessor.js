const assert = require("assert");
const { pipe, tap, get, pick, eq } = require("rubico");
const { defaultsDeep, when, identity } = require("rubico/x");

const {
  getByNameCore,
  omitIfEmpty,
  buildTagsObject,
} = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");

const { Tagger, assignTags } = require("./RekognitionCommon");

const buildArn = () =>
  pipe([
    get("StreamProcessorArn"),
    tap((arn) => {
      assert(arn);
    }),
  ]);

const pickId = pipe([
  tap(({ Name }) => {
    assert(Name);
  }),
  pick(["Name"]),
]);

const decorate = ({ endpoint, config }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
    omitIfEmpty(["RegionsOfInterest"]),
    assignTags({ buildArn: buildArn(config), endpoint }),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Rekognition.html
exports.RekognitionStreamProcessor = () => ({
  type: "StreamProcessor",
  package: "rekognition",
  client: "Rekognition",
  propertiesDefault: {},
  omitProperties: [
    "StreamProcessorArn",
    "Status",
    "RoleArn",
    "Input",
    "Output.KinesisDataStream",
    "NotificationChannel",
    "LastUpdateTimestamp",
    "CreationTimestamp",
  ],
  inferName: () =>
    pipe([
      get("Name"),
      tap((Name) => {
        assert(Name);
      }),
    ]),
  findName: () =>
    pipe([
      get("Name"),
      tap((name) => {
        assert(name);
      }),
    ]),
  findId: () =>
    pipe([
      get("StreamProcessorArn"),
      tap((id) => {
        assert(id);
      }),
    ]),
  dependencies: {
    iamRole: {
      type: "Role",
      group: "IAM",
      dependencyId: ({ lives, config }) => pipe([get("RoleArn")]),
    },
    kinesisStreamOutput: {
      type: "Stream",
      group: "Kinesis",
      dependencyId: ({ lives, config }) => get("Output.KinesisDataStream.Arn"),
    },
    kinesisVideoStreamInput: {
      type: "Stream",
      group: "KinesisVideo",
      dependencyId: ({ lives, config }) => get("Input.KinesisVideoStream.Arn"),
    },
    kmsKey: {
      type: "Key",
      group: "KMS",
      excludeDefaultDependencies: true,
      dependencyId: ({ lives, config }) => get("KmsKeyId"),
    },
    s3BucketOutput: {
      type: "Bucket",
      group: "S3",
      dependencyId: ({ lives, config }) =>
        pipe([get("Output.S3Destination.Bucket")]),
    },
    snsTopic: {
      type: "Topic",
      group: "SNS",
      dependencyId: ({ lives, config }) =>
        get("NotificationChannel.SNSTopicArn"),
    },
  },
  ignoreErrorCodes: ["ResourceNotFoundException"],
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Rekognition.html#describeStreamProcessor-property
  getById: {
    method: "describeStreamProcessor",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Rekognition.html#listStreamProcessors-property
  getList: {
    method: "listStreamProcessors",
    getParam: "StreamProcessors",
    decorate: ({ getById }) => pipe([getById]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Rekognition.html#createStreamProcessor-property
  create: {
    method: "createStreamProcessor",
    pickCreated: ({ payload }) => pipe([() => payload]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Rekognition.html#updateStreamProcessor-property
  update: {
    method: "updateStreamProcessor",
    filterParams: ({ payload, diff, live }) =>
      pipe([
        () => payload,
        defaultsDeep(pickId(live)),
        tap((params) => {
          assert(true);
        }),
      ])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Rekognition.html#deleteStreamProcessor-property
  destroy: {
    method: "deleteStreamProcessor",
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
    properties: { Tags, ...otherProps },
    dependencies: {
      iamRole,
      kmsKey,
      kinesisVideoStreamInput,
      kinesisStreamOutput,
      snsTopic,
    },
    config,
  }) =>
    pipe([
      tap(() => {
        assert(kinesisVideoStreamInput);
      }),
      () => otherProps,
      defaultsDeep({
        Tags: buildTagsObject({ name, config, namespace, userTags: Tags }),
        Input: {
          KinesisVideoStream: {
            Arn: getField(kinesisVideoStreamInput, "StreamARN"),
          },
        },
        RoleArn: getField(iamRole, "Arn"),
      }),
      when(
        () => kinesisStreamOutput,
        defaultsDeep({
          Output: {
            KinesisDataStream: {
              Arn: getField(kinesisStreamOutput, "StreamARN"),
            },
          },
        })
      ),
      when(
        () => kmsKey,
        defaultsDeep({
          KmsKeyId: getField(kmsKey, "Arn"),
        })
      ),
      when(
        () => snsTopic,
        defaultsDeep({
          NotificationChannel: {
            SNSTopicArn: getField(snsTopic, "Attributes.TopicArn"),
          },
        })
      ),
    ])(),
});
