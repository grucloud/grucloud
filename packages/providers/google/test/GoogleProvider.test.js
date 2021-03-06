const assert = require("assert");
const { GoogleProvider } = require("../GoogleProvider");
const { ConfigLoader } = require("@grucloud/core/ConfigLoader");
const {
  testPlanDeploy,
  testPlanDestroy,
} = require("@grucloud/core/E2ETestUtils");
const { notAvailable } = require("@grucloud/core/ProviderCommon");

describe("GoogleProvider", async function () {
  let config;
  let provider;
  let network;
  let subNetwork;
  let firewall;
  let server;
  let ip;
  const ipName = "ip-webserver";
  const types = ["Network", "SubNetwork", "Firewall", "Address", "VmInstance"];
  before(async function () {
    try {
      config = ConfigLoader({ path: "../../../examples/multi" });
    } catch (error) {
      this.skip();
    }
    provider = GoogleProvider({
      config: () => ({
        projectId: "grucloud-test",
      }),
    });

    network = provider.compute.makeNetwork({
      name: "network-dev",
      properties: () => ({ autoCreateSubnetworks: false }),
    });

    subNetwork = provider.compute.makeSubNetwork({
      name: "subnet-dev",
      dependencies: { network },
      properties: () => ({
        ipCidrRange: "10.164.0.0/20",
      }),
    });
    firewall = provider.compute.makeFirewall({
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
    ip = provider.compute.makeAddress({ name: ipName });
    server = provider.compute.makeVmInstance({
      name: "web-server",
      dependencies: { ip },
      properties: () => ({
        diskSizeGb: "20",
        machineType: "f1-micro",
        sourceImage:
          "projects/ubuntu-os-cloud/global/images/family/ubuntu-2004-lts",
      }),
    });

    await provider.start();
  });
  after(async () => {});
  it("gcp info", async function () {
    const info = provider.info();
    assert(info.projectId);
    assert(info.config);
  });
  it("gcp server resolveConfig ", async function () {
    const config = await server.resolveConfig();
    const { projectId, zone } = provider.config;
    assert.equal(
      config.machineType,
      `https://www.googleapis.com/compute/v1/projects/${projectId}/zones/${zone}/machineTypes/f1-micro`
    );
    assert.equal(config.disks[0].initializeParams.diskSizeGb, "20");
    assert.equal(config.name, "web-server");
  });

  it("gcp apply and destroy", async function () {
    try {
      await testPlanDeploy({ provider, types, full: false });

      const serverLive = await server.getLive();
      const { status, labels } = serverLive;
      assert(status, "RUNNING");
      const { managedByKey, managedByValue, stageTagKey } = provider.config;
      assert(labels[managedByKey], managedByValue);
      assert(labels[stageTagKey], provider.config.stage);

      const ipLive = await ip.getLive();
      assert.equal(
        serverLive.networkInterfaces[0].accessConfigs[0].natIP,
        ipLive.address
      );

      await testPlanDestroy({ provider, types, full: false });
    } catch (error) {
      throw error;
    }
  }).timeout(7 * 60e3);
});
