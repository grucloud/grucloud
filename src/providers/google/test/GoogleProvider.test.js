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
    await provider.destroyAll();
    ip = provider.makeAddress({ name: "ip-webserver" });

    server = provider.makeInstance({
      name: "web-server",
      dependencies: {},

      config: async ({ dependencies: { ip } }) => ({
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
  it("config static", async function () {
    const config = server.configStatic();
    assert.equal(
      config.machineType,
      "projects/starhackit/zones/us-central1-a/machineTypes/f1-micro"
    );
    assert.equal(config.name, "web-server");
  }),
    it("plan", async function () {
      const plan = await provider.plan();
      assert.equal(plan.destroy.length, 0);
      assert.equal(plan.newOrUpdate.length, 2);
    });
  it.skip("deploy plan", async function () {
    await testProviderLifeCycle({ provider });
  });
});
