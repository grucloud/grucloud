const assert = require("assert");
const { pipe, tap, get, pick } = require("rubico");
const { defaultsDeep, when } = require("rubico/x");
const { updateResourceObject } = require("@grucloud/core/updateResourceObject");

const { buildTags } = require("../AwsCommon");

const { Tagger } = require("./SESV2Common");

const buildArn =
  ({ config }) =>
  ({ EmailIdentity }) =>
    `arn:${config.partition}:ses:${
      config.region
    }:${config.accountId()}:identity/${EmailIdentity}`;

const pickId = pipe([
  tap(({ EmailIdentity }) => {
    assert(EmailIdentity);
  }),
  pick(["EmailIdentity"]),
]);

const decorate = ({ endpoint, live }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
      assert(live.EmailIdentity);
    }),
    defaultsDeep({ EmailIdentity: live.EmailIdentity }),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SESV2.html#putEmailIdentityFeedbackAttributes-property
const putEmailIdentityFeedbackAttributes = ({ endpoint }) =>
  pipe([
    tap(({ EmailIdentity }) => {
      assert(endpoint);
      assert(EmailIdentity);
    }),
    ({ EmailIdentity, FeedbackForwardingStatus = false }) => ({
      EmailIdentity,
      EmailForwardingEnabled: FeedbackForwardingStatus,
    }),
    endpoint().putEmailIdentityFeedbackAttributes,
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SESV2.html#putEmailIdentityMailFromAttributes-property
const putEmailIdentityMailFromAttributes = ({ endpoint }) =>
  pipe([
    tap(({ EmailIdentity }) => {
      assert(endpoint);
      assert(EmailIdentity);
    }),
    ({ EmailIdentity, MailFromAttributes }) => ({
      EmailIdentity,
      ...MailFromAttributes,
    }),
    endpoint().putEmailIdentityMailFromAttributes,
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SESV2.html
exports.SESV2EmailIdentity = ({ compare }) => ({
  type: "EmailIdentity",
  package: "sesv2",
  client: "SESv2",
  propertiesDefault: {},
  omitProperties: [
    "VerificationStatus",
    "ConfigurationSetName",
    "DkimAttributes.Status",
    "MailFromAttributes.MailFromDomainStatus",
  ],
  inferName: () =>
    pipe([
      get("EmailIdentity"),
      tap((Name) => {
        assert(Name);
      }),
    ]),
  findName: () =>
    pipe([
      get("EmailIdentity"),
      tap((name) => {
        assert(name);
      }),
    ]),
  findId: () =>
    pipe([
      get("EmailIdentity"),
      tap((id) => {
        assert(id);
      }),
    ]),
  dependencies: {
    configurationSet: {
      type: "ConfigurationSet",
      group: "SESV2",
      dependencyId: ({ lives, config }) =>
        pipe([
          get("ConfigurationSetName"),
          tap((ConfigurationSetName) => {
            assert(ConfigurationSetName);
          }),
        ]),
    },
  },
  ignoreErrorCodes: ["NotFoundException"],
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SESV2.html#getEmailIdentity-property
  getById: {
    method: "getEmailIdentity",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SESV2.html#listEmailIdentities-property
  getList: {
    method: "listEmailIdentities",
    getParam: "EmailIdentities",
    decorate:
      ({ getById }) =>
      ({ IdentityName }) =>
        pipe([
          () => ({ EmailIdentity: IdentityName }),
          getById,
          defaultsDeep({ EmailIdentity: IdentityName }),
        ])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SESV2.html#createEmailIdentity-property
  create: {
    method: "createEmailIdentity",
    pickCreated: ({ payload }) => pipe([() => payload]),
    postCreate:
      ({ endpoint, payload, created }) =>
      (live) =>
        pipe([
          () => payload,
          putEmailIdentityFeedbackAttributes({ endpoint }),
          () => payload,
          putEmailIdentityMailFromAttributes({ endpoint }),
        ])(),
  },
  update:
    ({ endpoint, getById }) =>
    ({ payload, live, diff }) =>
      pipe([
        () => ({ payload, live, diff, endpoint }),
        updateResourceObject({
          path: "FeedbackForwardingStatus",
          onDeleted: putEmailIdentityFeedbackAttributes({ endpoint }),
          onAdded: putEmailIdentityFeedbackAttributes({ endpoint }),
          onUpdated: putEmailIdentityFeedbackAttributes({ endpoint }),
        }),
        updateResourceObject({
          path: "MailFromAttributes",
          onDeleted: putEmailIdentityFeedbackAttributes({ endpoint }),
          onAdded: putEmailIdentityFeedbackAttributes({ endpoint }),
          onUpdated: putEmailIdentityFeedbackAttributes({ endpoint }),
        }),
      ])(),

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SESV2.html#deleteEmailIdentity-property
  destroy: {
    method: "deleteEmailIdentity",
    pickId,
  },
  getByName: ({ getById }) =>
    pipe([({ name }) => ({ EmailIdentity: name }), getById({})]),
  tagger: ({ config }) =>
    Tagger({
      buildArn: buildArn({ config }),
    }),
  configDefault: ({
    name,
    namespace,
    properties: { Tags, ...otherProps },
    dependencies: { configurationSet },
    config,
  }) =>
    pipe([
      tap(() => {
        assert(configurationSet);
      }),
      () => otherProps,
      defaultsDeep({
        Tags: buildTags({ name, config, namespace, UserTags: Tags }),
      }),
      when(
        () => configurationSet,
        defaultsDeep({
          ConfigurationSetName: configurationSet.config.ConfigurationSetName,
        })
      ),
    ])(),
});
