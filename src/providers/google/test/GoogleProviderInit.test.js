const assert = require("assert");
const { GoogleProvider } = require("../GoogleProvider");
const { ConfigLoader } = require("ConfigLoader");

describe("GoogleProviderInit", async function () {
  let config;
  let provider;
  before(async function () {
    try {
      config = ConfigLoader({ path: "examples/multi" });
    } catch (error) {
      this.skip();
    }
    provider = GoogleProvider({
      config: config.google,
    });

    await provider.start();

    const { error } = await provider.destroyAll();
    assert(!error);
  });
  after(async () => {
    await provider?.destroyAll();
  });

  it("init and unit", async function () {
    await provider.init();
    await provider.unInit();
    await provider.unInit();
    await provider.init();
    await provider.init();
  }).timeout(1000e3);
});
