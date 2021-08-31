const assert = require("assert");
const { AwsProvider } = require("../../AwsProvider");
const { ConfigLoader } = require("@grucloud/core/ConfigLoader");
const { tryCatch, pipe, tap } = require("rubico");
const { Authorizer } = require("../Authorizer");

describe("Api Gateway Authorizer V2", async function () {
  let config;
  let provider;
  let autorizer;

  before(async function () {
    try {
      config = ConfigLoader({ path: "../../../examples/multi" });
    } catch (error) {
      this.skip();
    }
    provider = AwsProvider({ config });
    autorizer = provider.getClient({ groupType: "ApiGatewayV2::Authorizer" });
    await provider.start();
  });
  after(async () => {});
  it(
    "delete with invalid id",
    pipe([
      () =>
        autorizer.destroy({
          live: { ApiId: "12345", AuthorizerId: "12345" },
        }),
    ])
  );
  it(
    "getByLive with invalid id",
    pipe([
      () =>
        autorizer.getByLive({
          live: { ApiId: "12345", AuthorizerId: "12345" },
        }),
    ])
  );
});
