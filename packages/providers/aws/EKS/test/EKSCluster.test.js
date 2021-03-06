const assert = require("assert");
const { AwsProvider } = require("../../AwsProvider");
const { ConfigLoader } = require("@grucloud/core/ConfigLoader");
const {
  testPlanDeploy,
  testPlanDestroy,
} = require("@grucloud/core/E2ETestUtils");

describe("EKSCluster", async function () {
  let config;
  let provider;
  let cluster;
  const clusterName = "cluster";
  const types = ["Cluster"];

  before(async function () {
    try {
      config = ConfigLoader({ path: "../../../examples/multi" });
    } catch (error) {
      this.skip();
    }
    provider = AwsProvider({
      name: "aws",
      config: () => ({ projectName: "gru-test" }),
    });

    await provider.start();

    cluster = provider.eks.makeCluster({
      name: clusterName,
      properties: () => ({}),
    });
  });
  after(async () => {});
  it("cluster resolveConfig", async function () {
    assert.equal(cluster.name, clusterName);
    const config = await cluster.resolveConfig();
    assert.equal(config.name, clusterName);
  });
  it.skip("cluster apply plan", async function () {
    await testPlanDeploy({
      provider,
      types,
      planResult: { create: 1, destroy: 0 },
    });

    const clusterLive = await cluster.getLive();
    assert(clusterLive);

    await testPlanDestroy({ provider, types });
  });
});
