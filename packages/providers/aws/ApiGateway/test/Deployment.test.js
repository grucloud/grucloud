const assert = require("assert");
const { AwsProvider } = require("../../AwsProvider");
const { ConfigLoader } = require("@grucloud/core/ConfigLoader");
const { tryCatch, pipe, tap } = require("rubico");
const { Deployment } = require("../Deployment");

describe("Api Gateway Deployment", async function () {
  let config;
  let provider;
  let deployment;

  before(async function () {
    try {
      config = ConfigLoader({ path: "../../../examples/multi" });
    } catch (error) {
      this.skip();
    }
    provider = AwsProvider({ config });
    deployment = provider.getClient({ groupType: "APIGateway::Deployment" });
    await provider.start();
  });
  it(
    "delete with invalid id",
    pipe([
      () =>
        deployment.destroy({
          live: { restApiId: "12345", id: "12345" },
        }),
    ])
  );
});
