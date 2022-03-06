const assert = require("assert");
const { AwsProvider } = require("../../AwsProvider");
const { pipe } = require("rubico");

describe("EcrRegistry", async function () {
  let config;
  let provider;
  let registry;

  before(async function () {
    provider = AwsProvider({ config });
    registry = provider.getClient({
      groupType: "ECR::Registry",
    });
    await provider.start();
  });
  it("list", pipe([() => registry.getList()]));
});
