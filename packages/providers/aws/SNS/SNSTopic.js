const assert = require("assert");
const { pipe, tap, get, pick, assign, omit } = require("rubico");
const { defaultsDeep, callProp, last, when } = require("rubico/x");
const { getByNameCore } = require("@grucloud/core/Common");

const { buildTags } = require("../AwsCommon");
const { createAwsResource } = require("../AwsClient");
const { tagResource, untagResource } = require("./SNSCommon");
const { getField } = require("@grucloud/core/ProviderCommon");
const pickId = pipe([get("Attributes"), pick(["TopicArn"])]);

const decorate = ({ endpoint }) =>
  pipe([
    assign({
      Attributes: pipe([
        get("Attributes"),
        assign({
          Policy: pipe([get("Policy"), JSON.parse]),
          DeliveryPolicy: pipe([get("EffectiveDeliveryPolicy"), JSON.parse]),
        }),
        omit(["EffectiveDeliveryPolicy"]),
      ]),
      Tags: pipe([
        get("Attributes"),
        ({ TopicArn }) => ({
          ResourceArn: TopicArn,
        }),
        endpoint().listTagsForResource,
        get("Tags"),
      ]),
    }),
  ]);

const model = {
  package: "sns",
  client: "SNS",
  ignoreErrorCodes: ["NotFound", "NotFoundException"],
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SNS.html#getTopicAttributes-property
  getById: {
    method: "getTopicAttributes",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SNS.html#listTopics-property
  getList: {
    method: "listTopics",
    getParam: "Topics",
    decorate: ({ endpoint, getById }) =>
      pipe([({ TopicArn }) => ({ Attributes: { TopicArn } }), getById]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SNS.html#createTopic-property
  create: {
    method: "createTopic",
    filterPayload: pipe([
      assign({
        Attributes: pipe([
          get("Attributes"),
          assign({
            Policy: pipe([get("Policy"), JSON.stringify]),
            DeliveryPolicy: pipe([get("DeliveryPolicy"), JSON.stringify]),
          }),
        ]),
      }),
    ]),
    pickCreated: () => pipe([({ TopicArn }) => ({ Attributes: { TopicArn } })]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SNS.html#deleteTopic-property
  destroy: { method: "deleteTopic", pickId },
};

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SNS.html#removePermission-property
// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SNS.html#addPermission-property

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SNS.html
exports.SNSTopic = ({ spec, config }) =>
  createAwsResource({
    model,
    spec,
    config,
    findName: () =>
      pipe([get("Attributes.TopicArn"), callProp("split", ":"), last]),
    findId: () => pipe([get("Attributes.TopicArn")]),
    getByName: getByNameCore,
    tagResource: tagResource,
    untagResource: untagResource,
    configDefault: ({
      name,
      namespace,
      properties: { Tags, ...otherProps },
      dependencies: { kmsKey },
    }) =>
      pipe([
        () => otherProps,
        defaultsDeep({
          Name: name,
          Tags: buildTags({ name, config, namespace, UserTags: Tags }),
        }),
        when(
          () => kmsKey,
          defaultsDeep({
            Attributes: { KmsMasterKeyId: getField(kmsKey, "Arn") },
          })
        ),
      ])(),
  });
