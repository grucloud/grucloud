const assert = require("assert");
const { AwsProvider } = require("../../AwsProvider");
const { pipe, tap } = require("rubico");

describe("MemoryDB Cluster", async function () {
  let config;
  let provider;
  let cluster;

  before(async function () {
    provider = await AwsProvider({ config });
    cluster = provider.getClient({ groupType: "MemoryDB::Cluster" });
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
          live: { ClusterName: "cluster-12345" },
        }),
    ])
  );
  it(
    "getById with invalid id",
    pipe([
      () =>
        cluster.getById({
          ClusterName: "cluster-12345",
        }),
    ])
  );
  it(
    "getByName with invalid id",
    pipe([
      () =>
        cluster.getByName({
          ClusterName: "cluster-1234",
        }),
    ])
  );
});
