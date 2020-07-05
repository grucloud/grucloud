const assert = require("assert");
const GoogleProvider = require("../GoogleProvider");
const { ConfigLoader } = require("ConfigLoader");
const { testPlanDeploy, testPlanDestroy } = require("test/E2ETestUtils");
const { notAvailable } = require("../../ProviderCommon");

describe("GoogleProvider", async function () {
  let config;
  let provider;
  let server;
  let ip;
  const ipName = "ip-webserver";
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
    const { success } = await provider.destroyAll();
    assert(success);
    ip = await provider.makeAddress({ name: ipName });
    server = await provider.makeInstance({
      name: "web-server",
      dependencies: { ip },
      properties: {
        diskSizeGb: "20",
        machineType: "f1-micro",
        sourceImage:
          "projects/ubuntu-os-cloud/global/images/family/ubuntu-2004-lts",
      },
    });
  });
  after(async () => {
    await provider?.destroyAll();
  });

  it("server resolveConfig ", async function () {
    const config = await server.resolveConfig();
    //TODO use provider.config().project  etc ...
    assert.equal(
      config.machineType,
      "projects/starhackit/zones/europe-west4-a/machineTypes/f1-micro"
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
    assert.equal(plan.destroy.length, 0);
    assert.equal(plan.newOrUpdate.length, 2);
  });
  it("gcp apply and destroy", async function () {
    await testPlanDeploy({ provider });

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

    await testPlanDestroy({ provider });
  });
});
