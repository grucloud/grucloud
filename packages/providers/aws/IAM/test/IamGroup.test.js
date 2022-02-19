const assert = require("assert");
const { AwsProvider } = require("../../AwsProvider");
const { pipe, tap } = require("rubico");

describe("IamGroup", async function () {
  let config;
  let provider;
  let group;

  before(async function () {
    provider = AwsProvider({ config });
    group = provider.getClient({
      groupType: "IAM::Group",
    });
    await provider.start();
  });
  it(
    "list",
    pipe([
      () => group.getList(),
      tap(({ items }) => {
        assert(Array.isArray(items));
      }),
    ])
  );
  it(
    "delete with invalid id",
    pipe([
      () =>
        group.destroy({
          live: {
            GroupName: "groupname",
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
        group.getByName({
          name: "invalid-group",
        }),
    ])
  );
});
