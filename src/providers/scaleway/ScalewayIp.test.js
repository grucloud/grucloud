const assert = require("assert");
const ScalewayProvider = require("./ScalewayProvider");
const config = require("./config");
const { testProviderLifeCycle } = require("test/E2ETestUtils");

describe("ScalewayIp", function () {
  const provider = ScalewayProvider({ name: "scaleway" }, config);

  const ip = provider.makeIp({ name: "myip" });

  before(async () => {
    await provider.destroyAll();
  });
  after(async () => {
    await provider.destroyAll();
  });

  it("ip config", async function () {
    const config = await ip.config();
    assert(config);
  });

  it.skip("deploy plan", async function () {
    await testProviderLifeCycle({ provider });

    const live = await ip.getLive();
    assert(live);
    assert(live.id);
  });
});
