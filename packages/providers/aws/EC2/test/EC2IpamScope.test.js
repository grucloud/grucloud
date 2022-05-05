const assert = require("assert");
const { AwsProvider } = require("../../AwsProvider");
const { pipe, tap } = require("rubico");

describe("EC2 IpamScope", async function () {
  let config;
  let provider;
  let ipamScope;

  before(async function () {
    provider = AwsProvider({ config });
    ipamScope = provider.getClient({
      groupType: "EC2::IpamScope",
    });
    await provider.start();
  });
  it(
    "list",
    pipe([
      () => ipamScope.getList(),
      tap(({ items }) => {
        assert(Array.isArray(items));
      }),
    ])
  );
  it(
    "delete with invalid id",
    pipe([
      () =>
        ipamScope.destroy({
          live: {
            IpamScopeId: "ipam-scope-xxxxxxxxxxxxxxxxx",
          },
        }),
    ])
  );
  it(
    "getById with invalid id",
    pipe([
      () =>
        ipamScope.getById({
          IpamScopeId: "ipam-scope-xxxxxxxxxxxxxxxxx",
        }),
    ])
  );
  it(
    "getByName with invalid id",
    pipe([
      () =>
        ipamScope.getByName({
          name: "a123",
        }),
    ])
  );
});
