const assert = require("assert");
const { MockProvider } = require("../MockProvider");
const cliCommands = require("@grucloud/core/cli/cliCommands");

describe("MockProviderCornerCase", async function () {
  let config;

  before(async () => {});

  it("undefined dependencies", async function () {
    const provider = MockProvider({
      config: () => ({}),
    });
    try {
      await provider.makeServer({
        name: "web-server",
        dependencies: { volume: undefined },
        properties: () => ({}),
      });
    } catch (error) {
      assert.equal(error.message, "missing dependency for Server/web-server");
    }
  });

  it("same name", async function () {
    const provider = MockProvider({
      config: () => ({}),
    });
    await provider.makeServer({
      name: "web-server",
      dependencies: {},
      properties: () => ({}),
    });
    await provider.makeIp({
      name: "web-server",
      dependencies: {},
      properties: () => ({}),
    });
  });
});
