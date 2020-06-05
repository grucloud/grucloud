const _ = require("lodash");
const assert = require("assert");
const createStack = require("./MockStack");
const config = require("./config");

const logger = require("logger")({ prefix: "MockProviderTest" });
const toJSON = (x) => JSON.stringify(x, null, 4);

describe("MockProvider", async function () {
  let stack;
  let provider;
  before(async () => {
    stack = await createStack({
      config,
    });
    provider = stack.providers[0];
  });

  it("ip config live ", async function () {
    const config = await stack.ip.resolveConfig();
    assert(config);
  });
  it("image config", async function () {
    const config = await stack.image.resolveConfig();
    assert(config);
  });

  it("volume config", async function () {
    const config = await stack.volume.resolveConfig();
    assert.equal(config.name, "volume1");
    assert.equal(config.size, 20_000_000_000);
  });

  it("server config", async function () {
    const config = await stack.server.resolveConfig();
    assert(config);
    assert(config.networkInterfaces[0]);
    assert(config.networkInterfaces[0].accessConfigs);
    assert(config.networkInterfaces[0].accessConfigs[0].name);
    assert(config.networkInterfaces[0].accessConfigs[0].natIP);

    //console.log(JSON.stringify(config, null, 4));
    assert.equal(config.zone, "projects/starhackit/zones/us-central1-a");
    assert.equal(
      config.machineType,
      "projects/starhackit/zones/us-central1-a/machineTypes/f1-micro"
    );

    assert.equal(config.disks[0].initializeParams.diskSizeGb, "20");
    assert.equal(
      config.disks[0].initializeParams.diskType,
      "projects/starhackit/zones/us-central1-a/diskTypes/pd-standard"
    );
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
    //console.log(resource.serialized());
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
