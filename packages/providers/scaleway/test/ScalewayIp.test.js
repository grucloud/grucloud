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

    ip = provider.makeIp({ name: "myip" });
  });
  after(async () => {});

  it.skip("apply and destroy", async function () {
    await testPlanDeploy({ provider });

    const live = await ip.getLive();
    assert(live);
    assert(live.id);

    await testPlanDestroy({ provider });
  });
});
