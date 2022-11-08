const assert = require("assert");
const { AwsProvider } = require("../../AwsProvider");
const { pipe, tap } = require("rubico");

describe("ConfigConfigRule", async function () {
  let config;
  let provider;
  let rule;

  before(async function () {
    provider = await AwsProvider({ config });
    rule = provider.getClient({
      groupType: "Config::ConfigRule",
    });
    await provider.start();
  });
  after(async () => {});
  it(
    "list",
    pipe([
      () => rule.getList(),
      tap((params) => {
        assert(true);
      }),
    ])
  );
  it("delete with invalid id", () =>
    pipe([
      () => ({
        live: {
          ConfigRuleName: "b123",
        },
      }),
      rule.destroy,
    ])());
  it("getById with invalid id", () =>
    pipe([
      () => ({
        ConfigRuleName: "b123",
      }),
      tap((params) => {
        assert(true);
      }),
      rule.getById,
    ])());
});
