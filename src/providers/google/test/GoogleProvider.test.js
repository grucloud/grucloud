const assert = require("assert");
const GoogleProvider = require("../GoogleProvider");
const { ConfigLoader } = require("ConfigLoader");
const { testPlanDeploy, testPlanDestroy } = require("test/E2ETestUtils");
const { notAvailable } = require("../../ProviderCommon");

describe("GoogleProvider", async function () {
  let config;
  let provider;
  let network;
  let subNetwork;
  let firewall;
  let server;
  let ip;
  const ipName = "ip-webserver";
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

    const { error } = await provider.destroyAll();
    assert(!error);

    network = await provider.makeNetwork({
      name: "network-dev",
      properties: () => ({ autoCreateSubnetworks: false }),
    });

    subNetwork = await provider.makeSubNetwork({
      name: "subnet-dev",
      dependencies: { network },
      properties: () => ({
        ipCidrRange: "10.164.0.0/20",
      }),
    });
    firewall = await provider.makeFirewall({
      name: "firewall-dev",
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
    ip = await provider.makeAddress({ name: ipName });
    server = await provider.makeVmInstance({
      name: "web-server",
      dependencies: { ip },
      properties: () => ({
        diskSizeGb: "20",
        machineType: "f1-micro",
        sourceImage:
          "projects/ubuntu-os-cloud/global/images/family/ubuntu-2004-lts",
      }),
    });
  });
  after(async () => {
    await provider?.destroyAll();
  });

  it("gcp server resolveConfig ", async function () {
    const config = await server.resolveConfig();
    const { project, zone } = provider.config();
    assert.equal(
      config.machineType,
      `projects/${project}/zones/${zone}/machineTypes/f1-micro`
    );
    assert.equal(config.disks[0].initializeParams.diskSizeGb, "20");
    assert.equal(config.name, "web-server");
    assert.equal(
      config.networkInterfaces[0].accessConfigs[0].natIP,
      notAvailable(ipName, "address")
    );
  });
  it("plan", async function () {
    const plan = await provider.planQuery();
    assert.equal(plan.destroy.plans.length, 0);
    assert.equal(plan.newOrUpdate.plans.length, 5);
  });
  it.skip("gcp apply and destroy", async function () {
    await testPlanDeploy({ provider, full: true });

    const serverLive = await server.getLive();
    const { status, labels } = serverLive;
    assert(status, "RUNNING");
    const { managedByKey, managedByValue, stageTagKey } = provider.config();
    assert(labels[managedByKey], managedByValue);
    assert(labels[stageTagKey], provider.config().stage);

    const ipLive = await ip.getLive();
    assert.equal(
      serverLive.networkInterfaces[0].accessConfigs[0].natIP,
      ipLive.address
    );

    await testPlanDestroy({ provider, full: true });
  });
});
