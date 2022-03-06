const assert = require("assert");
const { AwsProvider } = require("../../AwsProvider");
const { pipe } = require("rubico");

describe.skip("Api Gateway Model", async function () {
  let config;
  let provider;
  let model;

  before(async function () {
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
