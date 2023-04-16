const assert = require("assert");
const { pipe, tap, get, pick, assign, eq } = require("rubico");
const { defaultsDeep, identity } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");

const managedByOther = () => pipe([eq(get("intentName"), "FallbackIntent")]);

const assignArn = ({ config }) =>
  pipe([
    assign({
      arn: pipe([
        tap(({ intentId }) => {
          assert(intentId);
        }),
        ({ intentId }) =>
          `arn:aws:lex:${
            config.region
          }:${config.accountId()}:intent/${intentId}`,
      ]),
    }),
  ]);

const pickId = pipe([
  tap(({ botId, intentId, localeId }) => {
    assert(botId);
    assert(intentId);
    assert(localeId);
  }),
  pick(["botId", "botVersion", "intentId", "localeId"]),
]);

const decorate = ({ endpoint, config, live }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
    assignArn({ config }),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/LexModelsV2.html
exports.LexModelsV2Intent = () => ({
  type: "Intent",
  package: "lex-models-v2",
  client: "LexModelsV2",
  propertiesDefault: {},
  omitProperties: [
    "intentId",
    "creationDateTime",
    "localeId",
    "botId",
    "botVersion",
    "lastUpdatedDateTime",
    "arn",
  ],
  inferName: () =>
    pipe([
      get("intentName"),
      tap((Name) => {
        assert(Name);
      }),
    ]),
  findName: () =>
    pipe([
      get("intentName"),
      tap((name) => {
        assert(name);
      }),
    ]),
  findId: () =>
    pipe([
      get("intentId"),
      tap((id) => {
        assert(id);
      }),
    ]),
  managedByOther,
  cannotBeDeleted: managedByOther,
  ignoreErrorCodes: ["ResourceNotFoundException", "AccessDeniedException"],
  dependencies: {
    botLocale: {
      type: "BotLocale",
      group: "LexModelsV2",
      parent: true,
      dependencyId:
        ({ lives, config }) =>
        ({ botId, localeId }) =>
          pipe([
            tap(() => {
              assert(botId);
              assert(localeId);
            }),
            () => `${botId}::${localeId}`,
          ])(),
    },
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/LexModelsV2.html#describeIntent-property
  getById: {
    method: "describeIntent",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/LexModelsV2.html#listIntents-property
  getList: ({ client, endpoint, getById, config }) =>
    pipe([
      () =>
        client.getListWithParent({
          parent: { type: "BotLocale", group: "LexModelsV2" },
          pickKey: pipe([pick(["botId", "botVersion", "localeId"])]),
          method: "listIntents",
          getParam: "intentSummaries",
          config,
          decorate: ({ parent }) =>
            pipe([
              tap((params) => {
                assert(parent.botId);
                assert(parent.botVersion);
                assert(parent.localeId);
              }),
              defaultsDeep(pick(["botId", "botVersion", "localeId"])(parent)),
              getById({}),
            ]),
        }),
    ])(),
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/LexModelsV2.html#createIntent-property
  create: {
    method: "createIntent",
    pickCreated: ({ payload }) => pipe([identity]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/LexModelsV2.html#updateIntent-property
  update: {
    method: "updateIntent",
    filterParams: ({ payload, diff, live }) =>
      pipe([() => payload, defaultsDeep(pickId(live))])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/LexModelsV2.html#deleteIntent-property
  destroy: {
    method: "deleteIntent",
    pickId,
  },
  getByName: getByNameCore,
  configDefault: ({
    name,
    namespace,
    properties: { ...otherProps },
    dependencies: { botLocale },
    config,
  }) =>
    pipe([
      tap((params) => {
        assert(botLocale);
      }),
      () => otherProps,
      defaultsDeep({
        botId: getField(botLocale, "botId"),
        localeId: getField(botLocale, "localeId"),
      }),
    ])(),
});
