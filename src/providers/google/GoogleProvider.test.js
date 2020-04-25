const assert = require("assert");
const GoogleProvider = require("./GoogleProvider");
const config = require("./config");
const { testProviderLifeCycle } = require("../TestUtils");

describe.skip("GoogleProvider", function () {
  const provider = GoogleProvider({ name: "google" }, config);
  const ip = provider.makeAddress({ name: "ip-webserver" });
  /*
  const volume = provider.makeVolume({
    name: "volume1",
    config: () => ({
      size: 20000000000,
    }),
  });
*/
  const server = provider.makeInstance({
    name: "web-server",
    dependencies: {},
    config: async ({ dependencies: {} }) => ({
      machineType: "e2-micro",
    }),
  });

  before(async () => {
    await provider.destroyAll();
  });
  after(async () => {
    //await provider.destroyAll();
  });
  it("plan", async function () {
    const plan = await provider.plan();
    assert.equal(plan.destroy.length, 0);
    assert.equal(plan.newOrUpdate.length, 2);
  });
  it.skip("deploy plan", async function () {
    await testProviderLifeCycle({ provider });
    const live = await server.getLive();
    assert(live);
    assert(live.id);
  });
});
