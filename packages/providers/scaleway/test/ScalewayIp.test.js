const assert = require("assert");
const { ScalewayProvider } = require("../ScalewayProvider");
const { ConfigLoader } = require("@grucloud/core");
const {
  testPlanDeploy,
  testPlanDestroy,
} = require("@grucloud/core/E2ETestUtils");

describe("ScalewayIp", async function () {
  let config;

  let provider;
  let ip;
  before(async function () {
    try {
      config = ConfigLoader({ path: "../../../examples/multi" });
    } catch (error) {
      this.skip();
    }
    provider = ScalewayProvider({
      name: "scaleway",
      config: () => ({}),
    });

    ip = await provider.makeIp({ name: "myip" });
  });
  after(async () => {});

  it("ip resolveConfig", async function () {
    const config = await ip.resolveConfig();
    assert(config.tags);
    assert(config.tags.find((tag) => tag === provider.config.tag));
  });

  it.skip("apply and destroy", async function () {
    await testPlanDeploy({ provider });

    const live = await ip.getLive();
    assert(live);
    assert(live.id);

    await testPlanDestroy({ provider });
  });
});
