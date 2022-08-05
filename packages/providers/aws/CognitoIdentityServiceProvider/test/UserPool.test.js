const assert = require("assert");
const { AwsProvider } = require("../../AwsProvider");
const { pipe, tap } = require("rubico");

describe("UserPool", async function () {
  let config;
  let provider;
  let userPool;

  before(async function () {
    provider = await AwsProvider({ config });
    userPool = provider.getClient({
      groupType: "CognitoIdentityServiceProvider::UserPool",
    });
    await provider.start();
  });
  it(
    "list",
    pipe([
      () => userPool.getList(),
      tap(({ items }) => {
        assert(Array.isArray(items));
      }),
    ])
  );
  it(
    "delete with invalid id",
    pipe([
      () =>
        userPool.destroy({
          live: { Id: "up_12345" },
        }),
    ])
  );
  it(
    "getById with invalid id",
    pipe([
      () =>
        userPool.getById({
          Id: "up_12345",
        }),
    ])
  );
  it(
    "getByName with invalid id",
    pipe([
      () =>
        userPool.getByName({
          name: "124",
        }),
    ])
  );
});
