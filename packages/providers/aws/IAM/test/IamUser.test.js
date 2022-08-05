const assert = require("assert");
const { AwsProvider } = require("../../AwsProvider");
const { pipe, tap } = require("rubico");

describe("IamUser", async function () {
  let config;
  let provider;
  let user;

  before(async function () {
    provider = await AwsProvider({ config });
    user = provider.getClient({
      groupType: "IAM::User",
    });
    await provider.start();
  });
  it(
    "list",
    pipe([
      () => user.getList(),
      tap(({ items }) => {
        assert(Array.isArray(items));
      }),
    ])
  );
  it(
    "delete with invalid id",
    pipe([
      () =>
        user.destroy({
          live: {
            UserName: "username",
          },
        }),
    ])
  );
  it(
    "getByName with invalid id",
    pipe([
      () =>
        user.getByName({
          name: "invalid-user",
        }),
    ])
  );
});
