const assert = require("assert");
const createStack = require("./MockStack");

const logger = require("logger")({ prefix: "MockProviderTest" });
const toJSON = (x) => JSON.stringify(x, null, 4);

describe("MockProvider", function () {
  const { providers, ip, volume, server, image } = createStack({});
  const provider = providers[0];

  it("ip config static ", async function () {
    const config = await ip.config();
    assert(config);
  });
  it("ip config live ", async function () {
    const config = await ip.config({ live: true });
    assert(config);
  });
  it("image config", async function () {
    const config = await image.config();
    assert(config);
  });
  it("volume config", async function () {
    const config = await volume.config();
    assert(config);
  });
  it("server config", async function () {
    const config = await server.config();
    assert(config);
    assert(config.name);
    assert.equal(config.boot_type, "local");
    assert.equal(config.commercial_type, "DEV1-S");
    assert(config.tags[0]);
  });

  it("list config", async function () {
    const configs = await provider.listConfig();
    assert(configs);
  });
});
