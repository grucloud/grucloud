const assert = require("assert");
const { AwsProvider } = require("../../AwsProvider");
const { ConfigLoader } = require("@grucloud/core/ConfigLoader");
const { pipe } = require("rubico");

describe("Api Gateway Model", async function () {
  let config;
  let provider;
  let model;

  before(async function () {
    try {
      config = ConfigLoader({ path: "../../../examples/multi" });
    } catch (error) {
      this.skip();
    }
    provider = AwsProvider({ config });
    model = provider.getClient({ groupType: "APIGateway::Model" });
    await provider.start();
  });
  after(async () => {});
  it(
    "delete with invalid id",
    pipe([
      () =>
        model.destroy({
          live: { restApiId: "12345", name: "12345" },
        }),
    ])
  );
  it(
    "getById with invalid id",
    pipe([
      () =>
        model.getById({
          restApiId: "12345",
          name: "12345",
        }),
    ])
  );
});
