const assert = require("assert");
const { pipe, tap, get, eq } = require("rubico");
const { defaultsDeep, when } = require("rubico/x");
const { getByNameCore } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");

const pickId = pipe([
  tap(({ name }) => {
    assert(name);
  }),
  ({ name }) => ({ DeliveryChannelName: name }),
]);

const decorate = ({ endpoint, config }) =>
  pipe([
    tap((params) => {
      assert(true);
    }),
  ]);

exports.ConfigDeliveryChannel = ({}) => ({
  type: "DeliveryChannel",
  package: "config-service",
  client: "ConfigService",
  inferName: () => get("name"),
  findName: () => pipe([get("name")]),
  findId: () => pipe([get("name")]),
  ignoreErrorCodes: ["NoSuchDeliveryChannelException"],
  propertiesDefault: {},
  omitProperties: ["s3BucketName", "snsTopicARN"],
  dependencies: {
    configurationRecorder: {
      type: "ConfigurationRecorder",
      group: "Config",
      dependencyId: ({ lives, config }) => pipe([get("name")]),
    },
    snsTopic: {
      type: "Topic",
      group: "SNS",
      dependencyId: ({ lives, config }) => pipe([get("snsTopicARN")]),
    },
    s3Bucket: {
      type: "Bucket",
      group: "S3",
      dependencyId: ({ lives, config }) => pipe([get("s3BucketName")]),
    },
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ConfigService.html#describeDeliveryChannels-property
  getById: {
    method: "describeDeliveryChannels",
    pickId: pipe([
      tap(({ name }) => {
        assert(name);
      }),
      ({ name }) => ({
        DeliveryChannelNames: [name],
      }),
    ]),
    getField: "DeliveryChannels",
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ConfigService.html#describeDeliveryChannels-property
  getList: {
    method: "describeDeliveryChannels",
    getParam: "DeliveryChannels",
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ConfigService.html#putDeliveryChannel-property
  create: {
    method: "putDeliveryChannel",
    filterPayload: pipe([(DeliveryChannel) => ({ DeliveryChannel })]),
    pickCreated: ({ payload }) => pipe([() => payload]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ConfigService.html#putDeliveryChannel-property
  update: {
    method: "putDeliveryChannel",
    filterParams: ({ payload, live }) => pipe([() => payload])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ConfigService.html#deleteDeliveryChannel-property
  destroy: {
    method: "deleteDeliveryChannel",
    pickId,
  },
  getByName: getByNameCore,
  configDefault: ({
    name,
    namespace,
    properties: { ...otherProps },
    dependencies: { snsTopic, s3Bucket },
    config,
  }) =>
    pipe([
      tap((params) => {
        assert(s3Bucket);
      }),
      () => otherProps,
      defaultsDeep({ s3BucketName: get("config.Name")(s3Bucket) }),
      when(
        () => snsTopic,
        defaultsDeep({
          snsTopicARN: getField(snsTopic, "Attributes.TopicArn"),
        })
      ),
    ])(),
});
