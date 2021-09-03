const assert = require("assert");
const { AwsProvider } = require("../../AwsProvider");
const { ConfigLoader } = require("@grucloud/core/ConfigLoader");
const { pipe, tap } = require("rubico");

describe("CloudWatchEventRule", async function () {
  let config;
  let provider;
  let rule;

  before(async function () {
    try {
      config = ConfigLoader({ path: "../../../examples/multi" });
    } catch (error) {
      this.skip();
    }
    provider = AwsProvider({ config });
    rule = provider.getClient({ groupType: "CloudWatchEvents::Rule" });
    await provider.start();
  });
  it(
    "delete with invalid id",
    pipe([
      () =>
        rule.destroy({
          live: { Name: "12345" },
        }),
    ])
  );
  it(
    "getByName with invalid id",
    pipe([
      () =>
        rule.getByName({
          name: "124",
        }),
    ])
  );
});
