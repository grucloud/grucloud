const assert = require("assert");
const GoogleProvider = require("../GoogleProvider");
const { ConfigLoader } = require("ConfigLoader");
const { testPlanDeploy, testPlanDestroy } = require("test/E2ETestUtils");
const { notAvailable } = require("../../ProviderCommon");

describe("GoogleProvider", async function () {
  let provider;
  let server;
  let ip;
  const ipName = "ip-webserver";
  before(async () => {
    provider = await GoogleProvider({
      name: "google",
      config: ConfigLoader({ baseDir: __dirname }),
    });
    const { success } = await provider.destroyAll();
    assert(success);
    ip = provider.makeAddress({ name: ipName });
    server = provider.makeInstance({
      name: "web-server",
      dependencies: { ip },
    });
  });
  after(async () => {
    const { success } = await provider.destroyAll();
    assert(success);
  });

  it("server resolveConfig ", async function () {
    const config = await server.resolveConfig();
    //TODO use provider.confg.project  etc ...
    assert.equal(
      config.machineType,
      "projects/starhackit/zones/europe-west4-a/machineTypes/f1-micro"
    );
    assert.equal(config.name, "web-server");
    assert.equal(
      config.networkInterfaces[0].accessConfigs[0].natIP,
      notAvailable(ipName)
    );
  });
  it("plan", async function () {
    const plan = await provider.plan();
    assert.equal(plan.destroy.length, 0);
    assert.equal(plan.newOrUpdate.length, 2);
  });
  it("deploy plan", async function () {
    await testPlanDeploy({ provider });

    const serverLive = await server.getLive();
    const { status, labels } = serverLive;
    assert(status, "RUNNING");
    const { managedByKey, managedByValue } = provider.config;
    assert(labels[managedByKey], managedByValue);
    //TODO assert(labels["environment"], provider.config.stage);
    assert(labels["environment"], "development");

    const ipLive = await ip.getLive();
    assert.equal(
      serverLive.networkInterfaces[0].accessConfigs[0].natIP,
      ipLive.address
    );

    await testPlanDestroy({ provider });
  });
});
