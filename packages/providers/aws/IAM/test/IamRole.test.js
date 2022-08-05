const assert = require("assert");
const { AwsProvider } = require("../../AwsProvider");
const { pipe, tap } = require("rubico");

describe("IamRole", async function () {
  let config;
  let provider;
  let role;

  before(async function () {
    provider = await AwsProvider({ config });
    role = provider.getClient({
      groupType: "IAM::Role",
    });
    await provider.start();
  });
  it(
    "list",
    pipe([
      () => role.getList(),
      tap(({ items }) => {
        assert(Array.isArray(items));
      }),
    ])
  );
  it(
    "delete with invalid id",
    pipe([
      () =>
        role.destroy({
          live: {
            RoleName: "rolename",
          },
        }),
    ])
  );
  it(
    "getByName with invalid id",
    pipe([
      () =>
        role.getByName({
          name: "invalid-role",
        }),
    ])
  );
});
