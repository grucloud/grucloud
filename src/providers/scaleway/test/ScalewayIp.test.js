const assert = require("assert");
const ScalewayProvider = require("../ScalewayProvider");
const config = require("../config");
const { testProviderLifeCycle } = require("test/E2ETestUtils");

describe("ScalewayIp", async function () {
  let provider;
  let ip;

  before(async () => {
    provider = await ScalewayProvider({ name: "scaleway" }, config);
    await provider.destroyAll();
    ip = provider.makeIp({ name: "myip" });
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
