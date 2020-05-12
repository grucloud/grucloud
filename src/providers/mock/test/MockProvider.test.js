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

  it("merge defaut ", async function () {
    const input = {
      name: "web-server",
      disks: [
        {
          initializeParams: {
            diskSizeGb: "20",
          },
        },
      ],
      networkInterfaces: [
        {
          accessConfigs: [
            {
              natIP: "192.168.1.1",
            },
          ],
        },
      ],
    };
    const defaultConfig = {
      kind: "compute#instance",
      disks: [
        {
          kind: "compute#attachedDisk",
          type: "PERSISTENT",
          boot: true,
          mode: "READ_WRITE",
          autoDelete: true,
          initializeParams: {
            sourceImage:
              "projects/debian-cloud/global/images/debian-9-stretch-v20200420",
            diskSizeGb: "10",
          },
          diskEncryptionKey: {},
        },
      ],
      networkInterfaces: [
        {
          kind: "compute#networkInterface",
          accessConfigs: [
            {
              kind: "compute#accessConfig",
              name: "External NAT",
              type: "ONE_TO_ONE_NAT",
              networkTier: "PREMIUM",
            },
          ],
          aliasIpRanges: [],
        },
      ],
    };
    const result = _.defaultsDeep(input, defaultConfig);
    //console.log(JSON.stringify(result, null, 4));
    //TODO assert
  });
  it("ip config static ", async function () {
    const config = await stack.ip.config();
    assert(config);
  });
  it("ip config live ", async function () {
    const config = await stack.ip.config({ live: true });
    assert(config);
  });
  it("image config", async function () {
    const config = await stack.image.config();
    assert(config);
  });
  it("volume config static", async function () {
    const config = stack.volume.configStatic();
    assert.equal(config.name, "volume1");
    assert.equal(config.size, 20_000_000_000);
  });
  it("volume config", async function () {
    const config = await stack.volume.config();
    assert.equal(config.name, "volume1");
    assert.equal(config.size, 20_000_000_000);
  });

  it("server config", async function () {
    const config = stack.server.configStatic();
    assert(config);
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
