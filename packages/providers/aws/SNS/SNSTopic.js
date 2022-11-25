const assert = require("assert");
const { pipe, tap, get, pick, assign, omit, and, eq } = require("rubico");
const { defaultsDeep, callProp, last, when, size } = require("rubico/x");
const { getByNameCore } = require("@grucloud/core/Common");
const { assignPolicyAccountAndRegion } = require("../AwsCommon");

const { buildTags } = require("../AwsCommon");
const { tagResource, untagResource } = require("./SNSCommon");
const { getField } = require("@grucloud/core/ProviderCommon");
const pickId = pipe([get("Attributes"), pick(["TopicArn"])]);

// TODO managedByOther "Attributes.Owner",

const omitDefaultPolicy = pipe([
  when(
    and([
      eq(get("Policy.Id"), "__default_policy_ID"),
      eq(pipe([get("Policy.Statement"), size]), 1),
    ]),
    omit(["Policy"])
  ),
]);

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

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SNS.html#removePermission-property
// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SNS.html#addPermission-property

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SNS.html

exports.SNSTopic = ({ compare }) => ({
  type: "Topic",
  package: "sns",
  client: "SNS",
  ignoreErrorCodes: ["NotFound", "NotFoundException"],
  findName: () =>
    pipe([
      get("Attributes.TopicArn"),
      callProp("split", ":"),
      last,
      tap((name) => {
        assert(name);
      }),
    ]),
  findId: () =>
    pipe([
      get("Attributes.TopicArn"),
      tap((id) => {
        assert(id);
      }),
    ]),
  dependencies: {
    kmsKey: {
      type: "Key",
      group: "KMS",
      dependencyId: ({ lives, config }) => get("Attributes.KmsMasterKeyId"),
    },
  },
  omitProperties: [
    "Name",
    "Attributes.TopicArn",
    "Attributes.Owner",
    "Attributes.SubscriptionsPending",
    "Attributes.SubscriptionsDeleted",
    "Attributes.SubscriptionsConfirmed",
  ],
  propertiesDefault: {
    Attributes: {
      DisplayName: "",
      DeliveryPolicy: {
        http: {
          defaultHealthyRetryPolicy: {
            minDelayTarget: 20,
            maxDelayTarget: 20,
            numRetries: 3,
            numMaxDelayRetries: 0,
            numNoDelayRetries: 0,
            numMinDelayRetries: 0,
            backoffFunction: "linear",
          },
          disableSubscriptionOverrides: false,
        },
      },
      LambdaSuccessFeedbackSampleRate: "0",
      FirehoseSuccessFeedbackSampleRate: "0",
      SQSSuccessFeedbackSampleRate: "0",
      HTTPSuccessFeedbackSampleRate: "0",
      ApplicationSuccessFeedbackSampleRate: "0",
    },
  },
  compare: compare({
    filterLive: () =>
      pipe([
        assign({
          Attributes: pipe([get("Attributes"), omitDefaultPolicy]),
        }),
      ]),
  }),
  filterLive: ({ providerConfig, lives }) =>
    pipe([
      assign({
        Attributes: pipe([
          get("Attributes"),
          assign({
            Policy: pipe([
              get("Policy"),
              assignPolicyAccountAndRegion({ providerConfig, lives }),
            ]),
          }),
          omitDefaultPolicy,
        ]),
      }),
    ]),
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
  getByName: getByNameCore,
  tagResource: tagResource,
  untagResource: untagResource,
  configDefault: ({
    name,
    namespace,
    properties: { Tags, ...otherProps },
    dependencies: { kmsKey },
    config,
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
