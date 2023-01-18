const assert = require("assert");
const { pipe, tap, get, eq } = require("rubico");
const { defaultsDeep, when } = require("rubico/x");
const { getByNameCore } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");

const { createAwsResource } = require("../AwsClient");

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

const model = ({ config }) => ({
  package: "config-service",
  client: "ConfigService",
  ignoreErrorCodes: ["NoSuchDeliveryChannelException"],
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
});

exports.ConfigDeliveryChannel = ({ spec, config }) =>
  createAwsResource({
    model: model({ config }),
    spec,
    config,
    findName: () => pipe([get("name")]),
    findId: () => pipe([get("name")]),
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
        defaultsDeep({ s3BucketName: s3Bucket.config.Name }),
        when(
          () => snsTopic,
          defaultsDeep({
            snsTopicARN: getField(snsTopic, "Attributes.TopicArn"),
          })
        ),
      ])(),
  });
