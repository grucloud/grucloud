const assert = require("assert");
const { pipe, tap, get, assign } = require("rubico");
const { defaultsDeep, when } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");
const { replaceAccountAndRegion } = require("../AwsCommon");

const { ignoreErrorCodes } = require("./FMSCommon");

const pickId = pipe([() => ({})]);

const decorate = ({ endpoint, config }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
  ]);

const findName = () => () => "default";

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/FMS.html
exports.FMSNotificationChannel = () => ({
  type: "NotificationChannel",
  package: "fms",
  client: "FMS",
  propertiesDefault: {},
  omitProperties: ["SnsTopicArn"],
  inferName: findName,
  findName,
  findId: findName,
  ignoreErrorCodes,
  dependencies: {
    iamRole: {
      type: "Role",
      group: "IAM",
      dependencyId: ({ lives, config }) =>
        pipe([
          get("SnsRoleName"),
          tap((SnsRoleName) => {
            assert(SnsRoleName);
          }),
        ]),
    },
    snsTopic: {
      type: "Topic",
      group: "SNS",
      dependencyId: ({ lives, config }) =>
        pipe([
          get("SnsTopicArn"),
          tap((SnsTopicArn) => {
            assert(SnsTopicArn);
          }),
        ]),
    },
  },
  filterLive: ({ providerConfig, lives }) =>
    pipe([
      assign({
        SnsRoleName: pipe([
          get("SnsRoleName"),
          replaceAccountAndRegion({
            providerConfig,
            lives,
          }),
        ]),
      }),
    ]),
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/FMS.html#getNotificationChannel-property
  getById: {
    method: "getNotificationChannel",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/FMS.html#listNotiputNotificationChannelficationChannels-property
  getList: {
    method: "getNotificationChannel",
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/FMS.html#putNotificationChannel-property
  create: {
    method: "putNotificationChannel",
    pickCreated: ({ payload }) => pipe([() => payload]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/FMS.html#putNotificationChannel-property
  update: {
    method: "putNotificationChannel",
    filterParams: ({ payload, diff, live }) => pipe([() => payload])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/FMS.html#deleteNotificationChannel-property
  destroy: {
    method: "deleteNotificationChannel",
    pickId,
  },
  getByName: getByNameCore,
  configDefault: ({
    name,
    namespace,
    properties: { ...otherProps },
    dependencies: { iamRole, snsTopic },
    config,
  }) =>
    pipe([
      tap(() => {
        assert(snsTopic);
      }),
      () => otherProps,
      defaultsDeep({
        SnsTopicArn: getField(snsTopic, "Attributes.TopicArn"),
      }),
      when(
        () => iamRole,
        defaultsDeep({
          SnsRoleName: getField(iamRole, "Arn"),
        })
      ),
    ])(),
});
