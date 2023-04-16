const assert = require("assert");
const { pipe, tap, get, pick } = require("rubico");
const { defaultsDeep, when } = require("rubico/x");

const { buildTags } = require("../AwsCommon");

const { Tagger } = require("./SESV2Common");

const buildArn =
  ({ config }) =>
  ({ EmailIdentity }) =>
    `arn:aws:ses:${
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
    }),
    defaultsDeep({ EmailIdentity: live.EmailIdentity }),
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
      tap((params) => {
        assert(true);
      }),
      get("EmailIdentity"),
      tap((id) => {
        assert(id);
      }),
    ]),
  dependencies: {
    configurationSet: {
      type: "ConfigurationSet",
      group: "SESV2",
      dependencyId: ({ lives, config }) => pipe([get("ConfigurationSetName")]),
    },
  },
  ignoreErrorCodes: ["NotFoundException"],
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SESV2.html#getEmailIdentity-property
  getById: {
    method: "getEmailIdentity",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SESV2.html#listEmailIdentitys-property
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
  },
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
