const assert = require("assert");
const forEach = require("rubico/x/forEach");
const { createStack } = require("./MockStack");
const { ConfigLoader } = require("ConfigLoader");

const logger = require("logger")({ prefix: "MockProviderTest" });

describe("MockProviderCornerCase", async function () {
  const config = ConfigLoader({ baseDir: __dirname });

  before(async () => {});

  it("undefined dependencies", async function () {
    const provider = await MockProvider({
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
});
