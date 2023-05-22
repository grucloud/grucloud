const assert = require("assert");
const { pipe, tap, get, pick, eq } = require("rubico");
const { defaultsDeep, find } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
const { buildTags } = require("../AwsCommon");

const { Tagger } = require("./CodePipelineCommon");

const buildArn = () =>
  pipe([
    get("arn"),
    tap((arn) => {
      assert(arn);
    }),
  ]);

const definitionToWebhook = pipe([
  tap(({ definition }) => {
    assert(definition);
  }),
  ({ definition, ...other }) => ({ webhook: definition, ...other }),
]);

const decorate = ({ endpoint, config }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
    definitionToWebhook,
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CodePipeline.html
exports.CodePipelineWebhook = () => ({
  type: "Webhook",
  package: "codepipeline",
  client: "CodePipeline",
  propertiesDefault: {},
  omitProperties: ["arn", "lastTriggered", "errorCode", "errorMessage", "url"],
  inferName: () =>
    pipe([
      get("webhook.name"),
      tap((Name) => {
        assert(Name);
      }),
    ]),
  findName: () =>
    pipe([
      get("webhook.name"),
      tap((name) => {
        assert(name);
      }),
    ]),
  findId: () =>
    pipe([
      get("arn"),
      tap((id) => {
        assert(id);
      }),
    ]),
  environmentVariables: [
    {
      path: "webhook.authenticationConfiguration.SecretToken",
      suffix: "SECRET_TOKEN",
    },
  ],
  ignoreErrorCodes: ["ResourceNotFoundException"],
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CodePipeline.html#listWebhooks-property
  getById: {
    method: "listWebhooks",
    pickId: () => ({}),
    decorate: ({ live }) =>
      pipe([
        tap((params) => {
          assert(live.webhook.name);
        }),
        get("webhooks"),
        find(eq(get("name"), live.webhook.name)),
      ]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CodePipeline.html#listWebhooks-property
  getList: {
    method: "listWebhooks",
    getParam: "webhooks",
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CodePipeline.html#putWebhook-property
  create: {
    method: "putWebhook",
    pickCreated: ({ payload }) => pipe([() => payload]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CodePipeline.html#putWebhook-property
  update: {
    method: "putWebhook",
    filterParams: ({ payload, diff, live }) => pipe([() => payload])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CodePipeline.html#deleteWebhook-property
  destroy: {
    method: "deleteWebhook",
    pickId: pipe([
      get("webhook"),
      pick(["name"]),
      tap(({ name }) => {
        assert(name);
      }),
    ]),
  },
  getByName: getByNameCore,
  tagger: ({ config }) =>
    Tagger({
      buildArn: buildArn({ config }),
    }),
  configDefault: ({
    name,
    namespace,
    properties: { tags, ...otherProps },
    dependencies: {},
    config,
  }) =>
    pipe([
      () => otherProps,
      defaultsDeep({
        tags: buildTags({
          name,
          config,
          namespace,
          UserTags: tags,
          key: "key",
          value: "value",
        }),
      }),
    ])(),
});
