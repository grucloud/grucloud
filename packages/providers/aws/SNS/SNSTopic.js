const assert = require("assert");
const { pipe, tap, get, pick, assign, omit } = require("rubico");
const { defaultsDeep, callProp, last } = require("rubico/x");
const { getByNameCore } = require("@grucloud/core/Common");

const { buildTags } = require("../AwsCommon");
const { createAwsResource } = require("../AwsClient");
const { tagResource, untagResource } = require("./SNSCommon");

const model = {
  package: "sns",
  client: "SNS",
  ignoreErrorCodes: ["NotFound"],
  getById: { method: "getTopicAttributes" },
  getList: { method: "listTopics", getParam: "Topics" },
  create: { method: "createTopic" },
  destroy: { method: "deleteTopic" },
};

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SNS.html#removePermission-property
// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SNS.html#addPermission-property

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SNS.html
exports.SNSTopic = ({ spec, config }) =>
  createAwsResource({
    model,
    spec,
    config,
    findName: pipe([
      get("live.Attributes.TopicArn"),
      callProp("split", ":"),
      last,
    ]),
    pickId: pipe([get("Attributes"), pick(["TopicArn"])]),
    findId: pipe([get("live.Attributes.TopicArn")]),
    //TODO
    //findDependencies: ({ live }) => [{ type: "Key", group: "KMS", ids: [live.KmsMasterKeyId] }],
    decorateList: ({ endpoint, getById }) =>
      pipe([
        tap((params) => {
          assert(getById);
          assert(endpoint);
        }),
        ({ TopicArn }) => ({ Attributes: { TopicArn } }),
        getById,
      ]),
    decorate: ({ endpoint }) =>
      pipe([
        assign({
          Attributes: pipe([
            get("Attributes"),
            assign({
              Policy: pipe([get("Policy"), JSON.parse]),
              DeliveryPolicy: pipe([
                get("EffectiveDeliveryPolicy"),
                JSON.parse,
              ]),
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
      ]),
    createFilterPayload: pipe([
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
    getByName: getByNameCore,
    tagResource: tagResource,
    untagResource: untagResource,
    configDefault: ({ name, namespace, properties: { Tags, ...otherProps } }) =>
      pipe([
        () => otherProps,
        defaultsDeep({
          Name: name,
          Tags: buildTags({ name, config, namespace, UserTags: Tags }),
        }),
      ])(),
  });
