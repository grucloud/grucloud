const assert = require("assert");
const { AwsProvider } = require("../../AwsProvider");
const { ConfigLoader } = require("@grucloud/core/ConfigLoader");
const { tryCatch, pipe, tap } = require("rubico");
const { Resource } = require("../Resource");

describe.only("Api Gateway Resource", async function () {
  let config;
  let provider;
  let resource;

  before(async function () {
    try {
      config = ConfigLoader({ path: "../../../examples/multi" });
    } catch (error) {
      this.skip();
    }
    provider = AwsProvider({ config });
    resource = Resource({ config: provider.config });
    await provider.start();
  });
  after(async () => {});
  it(
    "delete with invalid id",
    pipe([
      () =>
        resource.destroy({
          live: { restApiId: "12345", id: "12345" },
        }),
    ])
  );
});
