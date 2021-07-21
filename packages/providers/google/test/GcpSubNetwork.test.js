const assert = require("assert");
const { GoogleProvider } = require("../GoogleProvider");
const { ConfigLoader } = require("@grucloud/core/ConfigLoader");

const {
  testPlanDeploy,
  testPlanDestroy,
} = require("@grucloud/core/E2ETestUtils");

describe("GcpSubNetwork", async function () {
  const networkName = "network-test";
  const subNetworkName = "subnetwork-test";

  let config;
  let provider;
  let network;
  let subNetwork;

  before(async function () {
    try {
      config = ConfigLoader({ path: "../../../examples/multi" });
    } catch (error) {
      this.skip();
    }

    provider = GoogleProvider({
      name: "google",
      config: () => ({
        projectId: "grucloud-test",
      }),
    });

    network = provider.compute.makeNetwork({
      name: networkName,
      properties: () => ({ autoCreateSubnetworks: false }),
    });

    subNetwork = provider.compute.makeSubNetwork({
      name: subNetworkName,
      dependencies: { network },
      properties: () => ({
        ipCidrRange: "10.164.0.0/20",
      }),
    });

    await provider.start();
  });
  after(async () => {});
  it.skip("subNetwork apply and destroy", async function () {
    await testPlanDeploy({ provider });

    const networkLive = await network.getLive();
    const subnetworkLive = await subNetwork.getLive();
    assert(subnetworkLive.gatewayAddress);
    assert.equal(subnetworkLive.network, networkLive.selfLink);

    await testPlanDestroy({ provider });
  });
});
