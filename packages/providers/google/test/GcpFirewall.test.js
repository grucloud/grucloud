const assert = require("assert");
const { GoogleProvider } = require("../GoogleProvider");
const { ConfigLoader } = require("@grucloud/core/ConfigLoader");

const {
  testPlanDeploy,
  testPlanDestroy,
} = require("@grucloud/core/E2ETestUtils");

describe("GcpFirewall", async function () {
  const firewallName = "firewall-web-test";

  let config;
  let provider;
  let network;
  let firewall;

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
      name: "network",
      properties: () => ({ autoCreateSubnetworks: true }),
    });

    firewall = provider.compute.makeFirewall({
      name: firewallName,
      dependencies: { network },
      properties: () => ({
        allowed: [
          {
            IPProtocol: "TCP",
            ports: [80, 433],
          },
        ],
      }),
    });
  });
  after(async () => {});
  it.skip("firewall apply and destroy", async function () {
    await testPlanDeploy({ provider });

    const networkLive = await network.getLive();
    const firewallLive = await firewall.getLive();
    assert(firewallLive.allowed);
    assert.equal(firewallLive.network, networkLive.selfLink);

    await testPlanDestroy({ provider });
  });
});
