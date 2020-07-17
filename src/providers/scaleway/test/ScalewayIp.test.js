const assert = require("assert");
const ScalewayProvider = require("../ScalewayProvider");
const { ConfigLoader } = require("ConfigLoader");
const { testPlanDeploy, testPlanDestroy } = require("test/E2ETestUtils");

describe("ScalewayIp", async function () {
  let config;

  let provider;
  let ip;
  before(async function () {
    try {
      config = ConfigLoader({ baseDir: __dirname });
    } catch (error) {
      this.skip();
    }
    provider = await ScalewayProvider({
      name: "scaleway",
      config,
    });

    const { success } = await provider.destroyAll();
    assert(success);

    ip = await provider.makeIp({ name: "myip" });
  });
  after(async () => {
    await provider?.destroyAll();
  });

  it("ip config", async function () {
    const config = await ip.resolveConfig();
    assert(config.tags);
    assert(config.tags.find((tag) => tag === provider.config().tag));
  });

  it.skip("apply and destroy", async function () {
    await testPlanDeploy({ provider });

    const live = await ip.getLive();
    assert(live);
    assert(live.id);

    await testPlanDestroy({ provider });
  });
});
