const assert = require("assert");
const { pipe, tap } = require("rubico");

const { awsResourceTest } = require("../../AwsResourceTester");

describe("LexModelsV2", async function () {
  it("Bot", () =>
    pipe([
      () => ({
        groupType: "LexModelsV2::Bot",
        livesNotFound: ({ config }) => [{ botId: "b123" }],
      }),
      awsResourceTest,
    ])());
  it("BotAlias", () =>
    pipe([
      () => ({
        groupType: "LexModelsV2::BotAlias",
        livesNotFound: ({ config }) => [{ botId: "b123", botAliasId: "ba123" }],
      }),
      awsResourceTest,
    ])());
  it("BotLocale", () =>
    pipe([
      () => ({
        groupType: "LexModelsV2::BotLocale",
        livesNotFound: ({ config }) => [
          { botId: "b123", botVersion: "$LATEST", localeId: "en_GB" },
        ],
      }),
      awsResourceTest,
    ])());
  it("Intent", () =>
    pipe([
      () => ({
        groupType: "LexModelsV2::Intent",
        livesNotFound: ({ config }) => [
          {
            botId: "b123",
            intentId: "i123",
            botVersion: "DRAFT",
            localeId: "en_GB",
          },
        ],
      }),
      awsResourceTest,
    ])());
  it.skip("SlotType", () =>
    pipe([
      () => ({
        groupType: "LexModelsV2::SlotType",
        livesNotFound: ({ config }) => [{}],
      }),
      awsResourceTest,
    ])());
});
