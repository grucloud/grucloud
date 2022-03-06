const assert = require("assert");
const { ScalewayProvider } = require("../ScalewayProvider");
const {
  testPlanDeploy,
  testPlanDestroy,
} = require("@grucloud/core/E2ETestUtils");

describe("ScalewayIp", async function () {
  let config;

  let provider;
  let ip;
  before(async function () {
    provider = ScalewayProvider({
      name: "scaleway",
      config: () => ({}),
    });

    ip = provider.makeIp({ name: "myip" });
  });
  after(async () => {});

  it.skip("apply and destroy", async function () {
    await testPlanDeploy({ provider });
    await testPlanDestroy({ provider });
  });
});
