const assert = require("assert");
const { pipe, tap } = require("rubico");

const { awsResourceTest } = require("../../AwsResourceTester");

describe("Lex", async function () {
  it.skip("Bot", () =>
    pipe([
      () => ({
        groupType: "Lex::Bot",
        livesNotFound: ({ config }) => [{}],
      }),
      awsResourceTest,
    ])());
  it.skip("BotAlias", () =>
    pipe([
      () => ({
        groupType: "Lex::BotAlias",
        livesNotFound: ({ config }) => [{}],
      }),
      awsResourceTest,
    ])());
  it.skip("Intent", () =>
    pipe([
      () => ({
        groupType: "Lex::Intent ",
        livesNotFound: ({ config }) => [{}],
      }),
      awsResourceTest,
    ])());
  it.skip("SlotType", () =>
    pipe([
      () => ({
        groupType: "Lex::SlotType",
        livesNotFound: ({ config }) => [{}],
      }),
      awsResourceTest,
    ])());
});
