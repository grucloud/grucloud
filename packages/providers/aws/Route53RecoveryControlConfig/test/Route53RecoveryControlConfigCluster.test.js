const assert = require("assert");
const { AwsProvider } = require("../../AwsProvider");
const { pipe, tap } = require("rubico");

describe("Route53RecoveryControlConfigCluster", async function () {
  let config;
  let provider;
  let cluster;

  before(async function () {
    provider = AwsProvider({ config });
    cluster = provider.getClient({
      groupType: "Route53RecoveryControlConfig::Cluster",
    });
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
          live: { ClusterArn: "arn:aws:a-12345" },
        }),
    ])
  );
  it(
    "getById with invalid id",
    pipe([
      () =>
        cluster.getById({
          ClusterArn: "a-12345",
        }),
    ])
  );
  it(
    "getByName with invalid id",
    pipe([
      () =>
        cluster.getByName({
          name: "a-124",
        }),
    ])
  );
});
