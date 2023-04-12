const assert = require("assert");
const { tap, pipe, map } = require("rubico");
const { defaultsDeep } = require("rubico/x");

const { compareAws } = require("../AwsCommon");
const { createAwsService } = require("../AwsService");

const GROUP = "LexModelsV2";

const tagsKey = "tags";
const compare = compareAws({ tagsKey, key: "key" });

const { LexModelsV2Bot } = require("./LexModelsV2Bot");
const { LexModelsV2BotAlias } = require("./LexModelsV2BotAlias");
const { LexModelsV2BotLocale } = require("./LexModelsV2BotLocale");
const { LexModelsV2Intent } = require("./LexModelsV2Intent");

module.exports = pipe([
  () => [
    //
    LexModelsV2Bot({}),
    LexModelsV2BotAlias({}),
    LexModelsV2BotLocale({}),
    LexModelsV2Intent({}),
  ],
  map(
    pipe([
      createAwsService,
      defaultsDeep({
        group: GROUP,
        compare: compare({}),
        tagsKey,
      }),
    ])
  ),
]);
