const assert = require("assert");
const GoogleProvider = require("../GoogleProvider");
const config = require("../config");
const { testProviderLifeCycle } = require("test/E2ETestUtils");

describe("GoogleProvider", async function () {
  let provider;
  let ip;
  before(async () => {
    provider = await GoogleProvider({ name: "google" }, config);
    await provider.destroyAll();
    ip = provider.makeAddress({ name: "ip-webserver" });

    provider.makeInstance({
      name: "web-server",
      dependencies: {},
      config: async ({ dependencies: { ip } }) => ({
        machineType: "e2-micro",
        networkInterfaces: [
          {
            accessConfigs: [
              {
                natIP: await ip.configLive().address,
              },
            ],
          },
        ],
      }),
    });
  });
  after(async () => {
    await provider.destroyAll();
  });
  it("plan", async function () {
    const plan = await provider.plan();
    assert.equal(plan.destroy.length, 0);
    assert.equal(plan.newOrUpdate.length, 2);
  });
  it.skip("deploy plan", async function () {
    await testProviderLifeCycle({ provider });
  });
});
