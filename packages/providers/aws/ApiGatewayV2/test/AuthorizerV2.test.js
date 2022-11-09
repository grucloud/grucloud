const assert = require("assert");
const { AwsProvider } = require("../../AwsProvider");
const { pipe, tap } = require("rubico");

describe("Api Gateway Authorizer V2", async function () {
  let config;
  let provider;
  let autorizer;

  before(async function () {
    provider = await AwsProvider({ config });
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
        autorizer.getById({})({
          ApiId: "12345",
          AuthorizerId: "12345",
        }),
    ])
  );
});
