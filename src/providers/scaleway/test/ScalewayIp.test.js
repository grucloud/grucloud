const assert = require("assert");
const ScalewayProvider = require("../ScalewayProvider");
const { ConfigLoader } = require("ConfigLoader");
const { testPlanDeploy, testPlanDestroy } = require("test/E2ETestUtils");

describe("ScalewayIp", async function () {
  let provider;
  let ip;
  before(async () => {
    provider = await ScalewayProvider({
      name: "scaleway",
      config: ConfigLoader({ baseDir: __dirname }),
    });
    await provider.destroyAll();
    ip = provider.makeIp({ name: "myip" });
  });
  after(async () => {
    await provider.destroyAll();
  });

  it("ip config", async function () {
    const config = await ip.resolveConfig();
    assert(config.organization);
    assert(config.tags);
    assert(config.tags.find((tag) => tag === provider.config.tag));
  });

  it.skip("deploy plan", async function () {
    await testPlanDeploy({ provider });

    const live = await ip.getLive();
    assert(live);
    assert(live.id);

    await testPlanDestroy({ provider });
  });
});
