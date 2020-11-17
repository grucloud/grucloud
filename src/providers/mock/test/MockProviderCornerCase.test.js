const assert = require("assert");
const { ConfigLoader } = require("ConfigLoader");
const { MockProvider } = require("../MockProvider");
const cliCommands = require("../../../cli/cliCommands");

const logger = require("logger")({ prefix: "MockProviderTest" });

describe("MockProviderCornerCase", async function () {
  const config = ConfigLoader({ baseDir: __dirname });

  before(async () => {});

  it("undefined dependencies", async function () {
    const provider = MockProvider({
      config,
    });
    try {
      await provider.makeServer({
        name: "web-server",
        dependencies: { volume: undefined },
        properties: () => ({}),
      });
    } catch (error) {
      assert.equal(error.message, "missing dependency");
    }
  });

  it("same name", async function () {
    const provider = MockProvider({
      config,
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
