const assert = require("assert");
const { AwsProvider } = require("../../AwsProvider");
const { ConfigLoader } = require("@grucloud/core/ConfigLoader");
const {
  testPlanDeploy,
  testPlanDestroy,
} = require("@grucloud/core/E2ETestUtils");

describe.skip("AwsLoadBalancer", async function () {
  let config;
  let provider;
  let loadBalancer;
  let loadBalancerName = "lb";
  const types = ["LoadBalancer"];

  before(async function () {
    try {
      config = ConfigLoader({ path: "../../../examples/multi" });
    } catch (error) {
      this.skip();
    }
    provider = AwsProvider({
      config: () => ({ projectName: "gru-test" }),
    });

    await provider.start();

    loadBalancer = await provider.makeLoadBalancer({
      name: loadBalancerName,
      properties: () => ({}),
    });
  });
  after(async () => {});
  it("load balancer apply plan", async function () {
    await testPlanDeploy({
      provider,
      types,
    });

    await testPlanDestroy({ provider, types });
  });
});
