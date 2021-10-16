const assert = require("assert");
const { AwsProvider } = require("../../AwsProvider");
const { ConfigLoader } = require("@grucloud/core/ConfigLoader");
const { pipe, tap } = require("rubico");

describe("Api GatewayV2 Stage", async function () {
  let config;
  let provider;
  let stage;

  before(async function () {
    try {
      config = ConfigLoader({ path: "../../../examples/multi" });
    } catch (error) {
      this.skip();
    }
    provider = AwsProvider({ config });
    stage = provider.getClient({ groupType: "ApiGatewayV2::Stage" });
    await provider.start();
  });
  after(async () => {});
  it(
    "delete with invalid id",
    pipe([
      () =>
        stage.destroy({
          live: { ApiId: "12345", StageName: "12345" },
        }),
    ])
  );
  it(
    "getById with invalid id",
    pipe([() => stage.getById({ ApiId: "12345", StageName: "12345" })])
  );
});
