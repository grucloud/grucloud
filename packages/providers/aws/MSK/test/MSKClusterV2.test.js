const assert = require("assert");
const { AwsProvider } = require("../../AwsProvider");
const { pipe, tap } = require("rubico");

describe("MSKClusterV2", async function () {
  let config;
  let provider;
  let cluster;

  before(async function () {
    provider = await AwsProvider({ config });
    cluster = provider.getClient({
      groupType: "MSK::ClusterV2",
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
              "arn:aws:kafka:us-east-1:840541460064:cluster/demo-cluster-1/5db24fe7-4e03-4fb2-adb6-254e707209c5-s4",
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
            "arn:aws:kafka:us-east-1:840541460064:cluster/demo-cluster-1/5db24fe7-4e03-4fb2-adb6-254e707209c5-s4",
        }),
    ])
  );
  it(
    "getByName with invalid id",
    pipe([
      () =>
        cluster.getByName({
          name: "cluster-1234",
        }),
    ])
  );
});
