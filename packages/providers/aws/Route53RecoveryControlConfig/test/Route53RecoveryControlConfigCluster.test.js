const assert = require("assert");
const { AwsProvider } = require("../../AwsProvider");
const { pipe, tap } = require("rubico");

describe("Route53RecoveryControlConfigCluster", async function () {
  let config;
  let provider;
  let cluster;

  before(async function () {
    provider = await AwsProvider({ config });
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
          live: {
            ClusterArn:
              "arn:aws:route53-recovery-control::840541460064:cluster/3011f1ab-0558-4627-a890-cad5e8e7ae8a",
          },
        }),
    ])
  );
  it(
    "getById with invalid id",
    pipe([
      () =>
        cluster.getById({})({
          ClusterArn:
            "arn:aws:route53-recovery-control::840541460064:cluster/3011f1ab-0558-4627-a890-cad5e8e7ae8a",
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
