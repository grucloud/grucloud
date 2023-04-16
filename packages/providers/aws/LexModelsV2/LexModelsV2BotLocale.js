const assert = require("assert");
const { pipe, tap, get, pick } = require("rubico");
const { defaultsDeep, isIn, identity, append } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");

const pickId = pipe([
  tap(({ botVersion, botId, localeId }) => {
    assert(botVersion);
    assert(botId);
    assert(localeId);
  }),
  pick(["botId", "botVersion", "localeId"]),
]);

const decorate = ({ endpoint, config, live }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/LexModelsV2.html
exports.LexModelsV2BotLocale = () => ({
  type: "BotLocale",
  package: "lex-models-v2",
  client: "LexModelsV2",
  propertiesDefault: {},
  omitProperties: [
    "botId",
    "creationDateTime",
    "failureReasons",
    "intentsCount",
    "botLocaleStatus",
    "lastUpdatedDateTime",
    "lastBuildSubmittedDateTime",
    "slotTypesCount",
    "botLocaleHistoryEvents",
    "recommendedActions",
    "localeName",
  ],
  inferName:
    ({ dependenciesSpec: { bot } }) =>
    ({ localeId }) =>
      pipe([
        tap((params) => {
          assert(bot);
          assert(localeId);
        }),
        () => `${bot}::${localeId}`,
      ])(),
  findName:
    ({ lives, config }) =>
    ({ botId, localeId }) =>
      pipe([
        tap((params) => {
          assert(botId);
          assert(localeId);
        }),
        () => botId,
        lives.getById({
          type: "Bot",
          group: "LexModelsV2",
          providerName: config.providerName,
        }),
        get("name"),
        tap((name) => {
          assert(name);
        }),
        append(`::${localeId}`),
      ])(),
  findId:
    () =>
    ({ botId, localeId }) =>
      pipe([() => `${botId}::${localeId}`])(),
  ignoreErrorCodes: ["ResourceNotFoundException", "AccessDeniedException"],
  dependencies: {
    bot: {
      type: "Bot",
      group: "LexModelsV2",
      parent: true,
      dependencyId: ({ lives, config }) =>
        pipe([
          get("botId"),
          tap((botId) => {
            assert(botId);
          }),
        ]),
    },
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/LexModelsV2.html#describeBotLocale-property
  getById: {
    method: "describeBotLocale",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/LexModelsV2.html#listBotLocales-property
  getList: ({ client, endpoint, getById, config }) =>
    pipe([
      () =>
        client.getListWithParent({
          parent: { type: "Bot", group: "LexModelsV2" },
          pickKey: pipe([
            tap(({ botId }) => {
              assert(botId);
            }),
            pick(["botId"]),
            defaultsDeep({ botVersion: "DRAFT" }),
          ]),
          method: "listBotLocales",
          getParam: "botLocaleSummaries",
          config,
          decorate: ({ parent }) =>
            pipe([
              tap(({}) => {
                assert(parent.botId);
              }),
              defaultsDeep(pick(["botId"])(parent)),
              defaultsDeep({ botVersion: "DRAFT" }),
              getById({}),
            ]),
        }),
    ])(),
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/LexModelsV2.html#createBotLocale-property
  create: {
    method: "createBotLocale",
    pickCreated: ({ payload }) => pipe([identity]),
    //isInstanceUp: pipe([get("botLocaleStatus"), isIn(["Available"])]),
    isInstanceError: pipe([get("botLocaleStatus"), isIn(["Failed"])]),
    // failureReasons
    // TODO postCreate buildBotLocale
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/LexModelsV2.html#updateBotLocale-property
  update: {
    method: "updateBotLocale",
    filterParams: ({ payload, diff, live }) =>
      pipe([() => payload, defaultsDeep(pickId(live))])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/LexModelsV2.html#deleteBotLocale-property
  destroy: {
    method: "deleteBotLocale",
    pickId,
  },
  getByName: getByNameCore,
  configDefault: ({
    name,
    namespace,
    properties: { ...otherProps },
    dependencies: { bot },
    config,
  }) =>
    pipe([
      tap((params) => {
        assert(bot);
      }),
      () => otherProps,
      defaultsDeep({ botId: getField(bot, "botId") }),
    ])(),
});
