const assert = require("assert");
const GoogleProvider = require("../GoogleProvider");
const config = require("../config");
const { testProviderLifeCycle } = require("test/E2ETestUtils");

describe("GoogleProvider", async function () {
  let provider;
  let server;
  let ip;
  before(async () => {
    provider = await GoogleProvider({ name: "google", config });
    const { success } = await provider.destroyAll();
    assert(success);
    ip = provider.makeAddress({ name: "ip-webserver" });
    server = provider.makeInstance({
      name: "web-server",
      dependencies: {},
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
  });
  it("plan", async function () {
    const plan = await provider.plan();
    assert.equal(plan.destroy.length, 0);
    assert.equal(plan.newOrUpdate.length, 2);
  });
  it("deploy plan", async function () {
    await testProviderLifeCycle({ provider });
    // TODO check ip address from instance is the one from address
    // check status == "RUNNING"
  });
});
