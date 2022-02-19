const assert = require("assert");
const { AwsProvider } = require("../../AwsProvider");
const { pipe, tap } = require("rubico");

describe("EKSCluster", async function () {
  let config;
  let provider;
  let cluster;

  before(async function () {
    provider = AwsProvider({ config });
    cluster = provider.getClient({ groupType: "EKS::Cluster" });
    await provider.start();
  });
  it(
    "list",
    pipe([
      () => cluster.getList(),
      tap(({ items }) => {
        assert(Array.isArray(items));
      }),
    ])
  );
  it(
    "delete with invalid id",
    pipe([
      () =>
        cluster.destroy({
          live: { name: "12345" },
        }),
    ])
  );
  it(
    "getByName with invalid id",
    pipe([
      () =>
        cluster.getByName({
          name: "124",
        }),
    ])
  );
});
