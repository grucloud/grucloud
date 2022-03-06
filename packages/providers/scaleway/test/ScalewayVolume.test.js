const assert = require("assert");
const { ScalewayProvider } = require("../ScalewayProvider");
const {
  testPlanDeploy,
  testPlanDestroy,
} = require("@grucloud/core/E2ETestUtils");

describe("ScalewayVolume", async function () {
  let config;
  let provider;
  let volume;

  before(async function () {
    provider = ScalewayProvider({
      name: "scaleway",
      config: () => ({}),
    });
    volume = provider.makeVolume({
      name: "volume1",
      config: () => ({
        size: 20_000_000_000,
      }),
    });
  });

  after(async () => {});

  it.skip("apply and destroy", async function () {
    await testPlanDeploy({ provider });
    await testPlanDestroy({ provider });
  });
});
