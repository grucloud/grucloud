const assert = require("assert");
const Axios = require("axios");
const urljoin = require("url-join");

const { forEach } = require("rubico/x");
const { createStack } = require("./MockStack");

const BASE_URL = "http://localhost:8089";

const createAxios = ({ url }) => {
  assert(url);
  return Axios.create({
    baseURL: urljoin(BASE_URL, url),
    headers: { "Content-Type": "application/json" },
  });
};

const displayResource = (resource, depth = 0) => {
  console.log(
    "  ".repeat(depth),
    resource.toJSON && resource.toJSON(),
    resource.usedBy && [...resource.usedBy().keys()].join("\n")
  );
  resource.dependencies &&
    forEach((dep) => {
      displayResource(dep, depth + 1);
    })(resource.dependencies);
};

describe("MockProvider", async function () {
  let stack;
  let provider;
  let resources;

  before(async () => {
    stack = await createStack({
      config: () => ({ createAxios }),
    });
    provider = stack.provider;
    await provider.start();
    resources = stack.resources;
  });

  it("type", async function () {
    assert.equal(provider.type(), "mock");
  });

  it("ip config live ", async function () {
    const config = await resources.ip.resolveConfig();
    assert(config);
  });
  it.skip("image config", async function () {
    const config = await resources.image.resolveConfig();
    assert(config);
  });

  it("volume config", async function () {
    const config = await resources.volume.resolveConfig();
    assert.equal(config.name, "volume1");
    assert.equal(config.size, 20_000_000_000);
  });
  //TODO
  it.skip("server config", async function () {
    const config = await resources.server.resolveConfig();
    assert(config);
    assert(config.networkInterfaces[0]);
    assert(config.networkInterfaces[0].accessConfigs);
    //assert(config.networkInterfaces[0].accessConfigs[0].natIP);

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
    const configs = provider.listConfig();
    assert(configs);
  });

  it("list resources", async function () {
    const resources = provider.getTargetResources();
    assert(resources);
    resources.map((resource) => {
      displayResource(resource);
    });
  });
});
