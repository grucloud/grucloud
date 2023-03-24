const assert = require("assert");
const { pipe, tap, get, pick } = require("rubico");
const { defaultsDeep, when, identity } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");

const pickId = pipe([
  tap(({ PlatformApplicationArn }) => {
    assert(PlatformApplicationArn);
  }),
  pick(["PlatformApplicationArn"]),
]);

const decorate = ({ endpoint, config }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SNS.html
exports.SNSPlatformApplication = () => ({
  type: "PlatformApplication",
  package: "sns",
  client: "SNS",
  propertiesDefault: {},
  omitProperties: [
    "PlatformApplicationArn",
    "Attributes.SuccessFeedbackRoleArn",
    "Attributes.FailureFeedbackRoleArn",
    "Attributes.EventEndpointCreated",
    "Attributes.EventEndpointUpdated",
    "Attributes.EventEndpointDeleted",
    "Attributes.EventDeliveryFailure",
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
      get("PlatformApplicationArn"),
      tap((id) => {
        assert(id);
      }),
    ]),
  environmentVariables: [
    {
      path: "Attributes.PlatformCredential",
      suffix: "PLATFORM_CREDENTIAL",
    },
    { path: "Attributes.PlatformPrincipal", suffix: "PLATFORM_PRINCIPAL" },
  ],
  dependencies: {
    iamRoleSuccessFeedback: {
      type: "Role",
      group: "IAM",
      dependencyId: ({ lives, config }) =>
        pipe([get("Attributes.SuccessFeedbackRoleArn")]),
    },
    iamRoleFailureFeedback: {
      type: "Role",
      group: "IAM",
      dependencyId: ({ lives, config }) =>
        pipe([get("Attributes.FailureFeedbackRoleArn")]),
    },
    snsTopicCreated: {
      type: "Topic",
      group: "SNS",
      dependencyId: ({ lives, config }) =>
        pipe([get("Attributes.EventEndpointCreated")]),
    },
    snsTopicDeleted: {
      type: "Topic",
      group: "SNS",
      dependencyId: ({ lives, config }) =>
        pipe([get("Attributes.EventEndpointDeleted")]),
    },
    snsTopicUpdated: {
      type: "Topic",
      group: "SNS",
      dependencyId: ({ lives, config }) =>
        pipe([get("Attributes.EventEndpointUpdated")]),
    },
    snsTopicFailure: {
      type: "Topic",
      group: "SNS",
      dependencyId: ({ lives, config }) =>
        pipe([get("Attributes.EventDeliveryFailure")]),
    },
  },
  ignoreErrorCodes: ["NotFoundException"],
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SNS.html#getPlatformApplication-property
  getById: {
    method: "getPlatformApplicationAttributes",
    pickId,
    decorate: ({ live }) => pipe([defaultsDeep(pickId(live))]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SNS.html#listPlatformApplications-property
  getList: {
    method: "listPlatformApplications",
    getParam: "PlatformApplications",
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SNS.html#createPlatformApplication-property
  create: {
    method: "createPlatformApplication",
    pickCreated: ({ payload }) => pipe([identity]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SNS.html#updatePlatformApplication-property
  update: {
    method: "setPlatformApplicationAttributes",
    filterParams: ({ payload, diff, live }) =>
      pipe([() => payload, defaultsDeep(pickId(live))])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SNS.html#deletePlatformApplication-property
  destroy: {
    method: "deletePlatformApplication",
    pickId,
  },
  getByName: getByNameCore,
  configDefault: ({
    name,
    namespace,
    properties: { ...otherProps },
    dependencies: {
      iamRoleSuccessFeedback,
      iamRoleFailureFeedback,
      snsTopicCreated,
      snsTopicDeleted,
      snsTopicUpdated,
    },
    config,
  }) =>
    pipe([
      () => otherProps,
      defaultsDeep({}), //
      when(
        () => iamRoleSuccessFeedback,
        defaultsDeep({
          Attributes: {
            SuccessFeedbackRoleArn: getField(iamRoleSuccessFeedback, "Arn"),
          },
        })
      ),
      when(
        () => iamRoleFailureFeedback,
        defaultsDeep({
          Attributes: {
            FailureFeedbackRoleArn: getField(iamRoleFailureFeedback, "Arn"),
          },
        })
      ),
      when(
        () => snsTopicCreated,
        defaultsDeep({
          Attributes: {
            EventEndpointCreated: getField(
              snsTopicCreated,
              "Attributes.TopicArn"
            ),
          },
        })
      ),
      when(
        () => snsTopicDeleted,
        defaultsDeep({
          Attributes: {
            EventEndpointDeleted: getField(
              snsTopicDeleted,
              "Attributes.TopicArn"
            ),
          },
        })
      ),
      when(
        () => snsTopicUpdated,
        defaultsDeep({
          Attributes: {
            EventEndpointUpdated: getField(
              snsTopicUpdated,
              "Attributes.TopicArn"
            ),
          },
        })
      ),
      when(
        () => snsTopicFailure,
        defaultsDeep({
          Attributes: {
            EventDeliveryFailure: getField(
              snsTopicFailure,
              "Attributes.TopicArn"
            ),
          },
        })
      ),
    ])(),
});
