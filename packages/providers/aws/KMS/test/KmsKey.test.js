const assert = require("assert");
const { AwsProvider } = require("../../AwsProvider");
const { pipe, tap } = require("rubico");

describe("KMSKey", async function () {
  let config;
  let provider;
  let key;

  before(async function () {
    provider = AwsProvider({ config });
    key = provider.getClient({ groupType: "KMS::Key" });
    await provider.start();
  });
  it(
    "list",
    pipe([
      () => key.getList(),
      tap(({ items }) => {
        assert(Array.isArray(items));
      }),
    ])
  );
  it(
    "delete with invalid id",
    pipe([
      () =>
        key.destroy({
          live: { KeyId: "12345" },
        }),
    ])
  );
  it(
    "getById with invalid id",
    pipe([
      () =>
        key.getById({
          KeyId: "124",
        }),
    ])
  );
  it(
    "getByName with invalid id",
    pipe([
      () =>
        key.getByName({
          name: "124",
        }),
    ])
  );
});
