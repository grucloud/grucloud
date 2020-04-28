const _ = require("lodash");
const assert = require("assert");
const createStack = require("./MockStack");
const config = require("./config");

const logger = require("logger")({ prefix: "MockProviderTest" });
const toJSON = (x) => JSON.stringify(x, null, 4);

describe("MockProvider", function () {
  const { providers, ip, volume, server, image } = createStack({ config });
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

  it.skip("server config", async function () {
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

  const displayResource = (resource, depth = 0) => {
    console.log(
      "  ".repeat(depth),
      resource.serialized(),
      resource.getParent()?.name
    );
    _.map(resource.dependencies, (dep) => {
      displayResource(dep, depth + 1);
    });
  };
  const destroyResource = async (resource) => {
    console.log(resource.serialized());
    await resource.destroy();
    await Promise.all(
      _.map(resource.dependencies, async (dep) => {
        await destroyResource(dep);
      })
    );
  };
  it.skip("list resources", async function () {
    const resources = await provider.getTargetResources();
    assert(resources);
    resources.map((resource) => {
      displayResource(resource);
    });
  });
  it.skip("find delete order", async function () {
    const resources = await provider.getTargetResources();
    assert(resources);
    await Promise.all(
      resources
        .filter((resource) => !resource.getParent())
        .map(async (resource) => await destroyResource(resource))
    );
  });
});
