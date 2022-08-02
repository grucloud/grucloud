const assert = require("assert");
const { AwsProvider } = require("../../AwsProvider");
const { pipe, tap } = require("rubico");

describe("AppSynGraphqlApi", async function () {
  let config;
  let provider;
  let graphqlApi;

  before(async function () {
    provider = await AwsProvider({ config });
    graphqlApi = provider.getClient({ groupType: "AppSync::GraphqlApi" });
    await provider.start();
  });

  it("getList", pipe([() => graphqlApi.getList({})]));
  it(
    "delete with invalid id",
    pipe([
      () =>
        graphqlApi.destroy({
          live: { apiId: "12345" },
        }),
    ])
  );
  it(
    "getById with invalid id",
    pipe([
      () =>
        graphqlApi.getById({
          apiId: "12345",
        }),
    ])
  );
  it(
    "getByName with invalid id",
    pipe([
      () =>
        graphqlApi.getByName({
          name: "124",
        }),
    ])
  );
});
