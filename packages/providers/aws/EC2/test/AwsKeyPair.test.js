const assert = require("assert");
const { AwsProvider } = require("../../AwsProvider");
const { pipe, tap } = require("rubico");

describe("EC2 KeyPair", async function () {
  let config;
  let provider;
  let keyPair;

  before(async function () {
    provider = await AwsProvider({ config });
    keyPair = provider.getClient({
      groupType: "EC2::KeyPair",
    });
    await provider.start();
  });
  it(
    "list",
    pipe([
      () => keyPair.getList(),
      tap(({ items }) => {
        assert(Array.isArray(items));
      }),
    ])
  );
  it(
    "delete with invalid id",
    pipe([
      () =>
        keyPair.destroy({
          live: {
            KeyName: "my-key",
          },
        }),
      tap((params) => {
        assert(true);
      }),
    ])
  );
  it(
    "getByName with invalid id",
    pipe([
      () =>
        keyPair.getByName({
          name: "invalid-keyPair-id",
        }),
    ])
  );
});
