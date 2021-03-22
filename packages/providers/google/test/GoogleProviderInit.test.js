const assert = require("assert");
const { GoogleProvider } = require("../GoogleProvider");
const { ConfigLoader } = require("@grucloud/core/ConfigLoader");

describe("GoogleProviderInit", async function () {
  let config;
  let provider;
  before(async function () {
    try {
      config = ConfigLoader({ path: "../../../examples/multi" });
    } catch (error) {
      this.skip();
    }
    provider = GoogleProvider({
      config: () => ({
        projectId: () => "grucloud-e2e",
        projectName: () => "grucloud-e2e",
      }),
    });

    await provider.start();
  });
  after(async () => {});

  it("init and unit", async function () {
    await provider.init();
    await provider.unInit({});
    await provider.unInit({});
    await provider.init();
    await provider.init();
  }).timeout(1000e3);
});
