const assert = require("assert");
const GoogleProvider = require("../GoogleProvider");
const { ConfigLoader } = require("ConfigLoader");

const {
  testPlanDeploy,
  testPlanDestroy,
} = require("../../../test/E2ETestUtils");

describe("GcpFirewall", async function () {
  const firewallName = "firewall-web-test";

  let config;
  let provider;
  let network;
  let firewall;

  before(async function () {
    try {
      config = ConfigLoader({ baseDir: __dirname });
    } catch (error) {
      this.skip();
    }

    provider = await GoogleProvider({
      name: "google",
      config,
    });

    network = await provider.makeNetwork({
      name: "network",
      properties: () => ({ autoCreateSubnetworks: true }),
    });

    firewall = await provider.makeFirewall({
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

    const { success } = await provider.destroyAll();
    assert(success);
  });
  after(async () => {
    await provider?.destroyAll();
  });
  it("firewall config", async function () {
    const config = await firewall.resolveConfig();
    assert(config);
    assert.equal(config.name, firewallName);
    assert.equal(config.description, provider.config().managedByDescription);
  });
  it("lives", async function () {
    await provider.listLives();
  });
  it("plan", async function () {
    const plan = await provider.planQuery();
    assert.equal(plan.destroy.length, 0);
    assert.equal(plan.newOrUpdate.length, 2);
  });
  it("firewall apply and destroy", async function () {
    await testPlanDeploy({ provider });

    const networkLive = await network.getLive();
    const firewallLive = await firewall.getLive();
    assert(firewallLive.allowed);
    assert.equal(firewallLive.network, networkLive.selfLink);

    await testPlanDestroy({ provider });
  });
});
