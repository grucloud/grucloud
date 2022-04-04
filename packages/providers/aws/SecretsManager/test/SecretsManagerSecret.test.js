const assert = require("assert");
const { AwsProvider } = require("../../AwsProvider");
const { pipe, tap } = require("rubico");

describe("Secrets Manager Secret", async function () {
  let config;
  let provider;
  let secret;

  before(async function () {
    provider = AwsProvider({ config });
    secret = provider.getClient({ groupType: "SecretsManager::Secret" });
    await provider.start();
  });
  it(
    "list",
    pipe([
      () => secret.getList(),
      tap(({ items }) => {
        assert(Array.isArray(items));
      }),
    ])
  );
  it(
    "delete with invalid id",
    pipe([
      () =>
        secret.destroy({
          live: {
            Name: "my-secret",
          },
        }),
    ])
  );
  it(
    "getById with invalid id",
    pipe([
      () =>
        secret.getById({
          Name: "my-secret",
        }),
    ])
  );
  it(
    "getByName with invalid id",
    pipe([
      () =>
        secret.getByName({
          name: "idnonotexist",
        }),
    ])
  );
});
