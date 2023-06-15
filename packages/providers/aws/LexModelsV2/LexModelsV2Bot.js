const assert = require("assert");
const { pipe, tap, get, pick, assign } = require("rubico");
const { defaultsDeep, isIn, when, identity } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");
const { buildTagsObject } = require("@grucloud/core/Common");

const { Tagger, assignTags } = require("./LexModelsV2Common");

const assignArn = ({ config }) =>
  pipe([
    tap((params) => {
      assert(config);
    }),
    assign({
      arn: pipe([
        tap(({ botId }) => {
          assert(botId);
        }),
        ({ botId }) =>
          `arn:${config.partition}:lex:${
            config.region
          }:${config.accountId()}:bot/${botId}`,
      ]),
    }),
  ]);

const tagsToPayload = ({ tags, ...other }) => ({
  ...other,
  botTags: tags,
});

const buildArn = () =>
  pipe([
    get("arn"),
    tap((arn) => {
      assert(arn);
    }),
  ]);

const pickId = pipe([
  tap(({ botId }) => {
    assert(botId);
  }),
  pick(["botId"]),
]);

const decorate = ({ endpoint, config }) =>
  pipe([
    assignArn({ config }),
    assignTags({ buildArn: buildArn(config), endpoint }),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/LexModelsV2.html
exports.LexModelsV2Bot = () => ({
  type: "Bot",
  package: "lex-models-v2",
  client: "LexModelsV2",
  propertiesDefault: {},
  omitProperties: [
    "arn",
    "roleArn",
    "botStatus",
    "creationDateTime",
    "lastUpdatedDateTime",
    "botId",
  ],
  inferName: () =>
    pipe([
      get("botName"),
      tap((Name) => {
        assert(Name);
      }),
    ]),
  findName: () =>
    pipe([
      get("botName"),
      tap((name) => {
        assert(name);
      }),
    ]),
  findId: () =>
    pipe([
      get("botId"),
      tap((id) => {
        assert(id);
      }),
    ]),
  ignoreErrorCodes: ["ResourceNotFoundException", "AccessDeniedException"],
  dependencies: {
    iamRole: {
      type: "Role",
      group: "IAM",
      dependencyId: ({ lives, config }) => pipe([get("roleArn")]),
    },
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/LexModelsV2.html#describeBot-property
  getById: {
    method: "describeBot",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/LexModelsV2.html#listBots-property
  getList: {
    method: "listBots",
    getParam: "botSummaries",
    decorate: ({ getById }) => pipe([getById]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/LexModelsV2.html#createBot-property
  create: {
    filterPayload: tagsToPayload,
    method: "createBot",
    pickCreated: ({ payload }) => pipe([identity]),
    isInstanceUp: pipe([get("botStatus"), isIn(["Available"])]),
    isInstanceError: pipe([get("botStatus"), isIn(["Failed"])]),
    getErrorMessage: pipe([get("failureReasons", "Failed")]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/LexModelsV2.html#updateBot-property
  update: {
    method: "updateBot",
    filterParams: ({ payload, diff, live }) =>
      pipe([() => payload, tagsToPayload, defaultsDeep(pickId(live))])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/LexModelsV2.html#deleteBot-property
  destroy: {
    method: "deleteBot",
    pickId: pipe([pickId, defaultsDeep({ skipResourceInUseCheck: true })]),
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
    dependencies: { iamRole },
    config,
  }) =>
    pipe([
      () => otherProps,
      defaultsDeep({
        tags: buildTagsObject({ name, config, namespace, userTags: tags }),
      }),
      when(() => iamRole, assign({ roleArn: () => getField(iamRole, "Arn") })),
    ])(),
});
