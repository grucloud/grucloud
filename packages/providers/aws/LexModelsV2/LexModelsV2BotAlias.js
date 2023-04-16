const assert = require("assert");
const {
  pipe,
  tap,
  get,
  pick,
  eq,
  assign,
  map,
  and,
  or,
  not,
  filter,
  fork,
} = require("rubico");
const {
  defaultsDeep,
  isIn,
  first,
  pluck,
  callProp,
  when,
  isEmpty,
  unless,
  identity,
} = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
const { buildTagsObject } = require("@grucloud/core/Common");

const {
  Tagger,
  //assignTags,
} = require("./LexModelsV2Common");

const buildArn = () =>
  pipe([
    get("Arn"),
    tap((arn) => {
      assert(arn);
    }),
  ]);

const pickId = pipe([
  tap(({ botAliasId, botId }) => {
    assert(botAliasId);
    assert(botId);
  }),
  pick(["botId", "botAliasId"]),
]);

const decorate = ({ endpoint, config }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/LexModelsV2.html
exports.LexModelsV2BotAlias = () => ({
  type: "BotAlias",
  package: "lex-models-v2",
  client: "LexModelsV2",
  propertiesDefault: {},
  omitProperties: ["botId", "botAliasId", "botAliasStatus"],
  inferName: () =>
    pipe([
      get("botAliasName"),
      tap((Name) => {
        assert(Name);
      }),
    ]),
  findName: () =>
    pipe([
      get("botAliasName"),
      tap((name) => {
        assert(name);
      }),
    ]),
  findId: () =>
    pipe([
      get("botAliasId"),
      tap((id) => {
        assert(id);
      }),
    ]),
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
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/LexModelsV2.html#describeBotAlias-property
  getById: {
    method: "describeBotAlias",
    getField: "BotAlias",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/LexModelsV2.html#listBotAliass-property
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
          ]),
          method: "listBotAliases",
          getParam: "botAliasSummaries",
          config,
          decorate: ({ parent }) =>
            pipe([
              tap(({ botAliasId }) => {
                assert(botAliasId);
                assert(parent.botId);
              }),
              defaultsDeep(pick(["botId"])(parent)),
              getById({}),
              tap((params) => {
                assert(true);
              }),
            ]),
        }),
    ])(),
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/LexModelsV2.html#createBotAlias-property
  create: {
    method: "createBotAlias",
    pickCreated: ({ payload }) => pipe([identity]),
    isInstanceUp: pipe([get("botAliasStatus"), isIn(["Available"])]),
    isInstanceError: pipe([get("botAliasStatus"), isIn(["Failed"])]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/LexModelsV2.html#updateBotAlias-property
  update: {
    method: "updateBotAlias",
    filterParams: ({ payload, diff, live }) =>
      pipe([() => payload, defaultsDeep(pickId(live))])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/LexModelsV2.html#deleteBotAlias-property
  destroy: {
    method: "deleteBotAlias",
    pickId,
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
    dependencies: { bot },
    config,
  }) =>
    pipe([
      tap(() => {
        assert(bot);
      }),
      () => otherProps,
      defaultsDeep({
        tags: buildTagsObject({ name, config, namespace, userTags: tags }),
        botId: getField(bot, "botId"),
      }),
    ])(),
});
