const assert = require("assert");
const { GoogleProvider } = require("../GoogleProvider");
const { ConfigLoader } = require("ConfigLoader");

const {
  testPlanDeploy,
  testPlanDestroy,
} = require("../../../test/E2ETestUtils");

describe("GcpSubNetwork", async function () {
  const networkName = "network-test";
  const subNetworkName = "subnetwork-test";

  let config;
  let provider;
  let network;
  let subNetwork;

  before(async function () {
    try {
      config = ConfigLoader({ path: "examples/google/vm" });
    } catch (error) {
      this.skip();
    }

    provider = await GoogleProvider({
      name: "google",
      config,
    });

    network = await provider.makeNetwork({
      name: networkName,
      properties: () => ({ autoCreateSubnetworks: false }),
    });

    subNetwork = await provider.makeSubNetwork({
      name: subNetworkName,
      dependencies: { network },
      properties: () => ({
        ipCidrRange: "10.164.0.0/20",
      }),
    });

    const { error } = await provider.destroyAll();
    assert(!error);
  });
  after(async () => {
    await provider?.destroyAll();
  });
  it("subNetwork config", async function () {
    const config = await subNetwork.resolveConfig();
    assert(config);
    assert.equal(config.name, subNetworkName);
    assert.equal(config.description, provider.config().managedByDescription);
  });
  it("lives", async function () {
    await provider.listLives();
  });
  it("plan", async function () {
    const plan = await provider.planQuery();
    assert.equal(plan.resultDestroy.plans.length, 0);
    assert.equal(plan.resultCreate.plans.length, 2);
  });
  it.skip("subNetwork apply and destroy", async function () {
    await testPlanDeploy({ provider });

    const networkLive = await network.getLive();
    const subnetworkLive = await subNetwork.getLive();
    assert(subnetworkLive.gatewayAddress);
    assert.equal(subnetworkLive.network, networkLive.selfLink);

    await testPlanDestroy({ provider });
  });
});
