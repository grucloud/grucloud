const assert = require("assert");
const { AwsProvider } = require("../../AwsProvider");
const { ConfigLoader } = require("@grucloud/core/ConfigLoader");
const { pipe } = require("rubico");
const { EcrRegistry } = require("../EcrRegistry");

describe("EcrRegistry", async function () {
  let config;
  let provider;
  let registry;

  before(async function () {
    try {
      config = ConfigLoader({ path: "../../../examples/multi" });
    } catch (error) {
      this.skip();
    }
    provider = AwsProvider({ config });
    registry = EcrRegistry({ config: provider.config });
    await provider.start();
  });
  it("list", pipe([() => registry.getList()]));
});
