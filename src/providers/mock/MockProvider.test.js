const assert = require("assert");

const MockProvider = require("./MockProvider");
const MockCloud = require("./MockCloud");

const logger = require("logger")({ prefix: "MockProviderTest" });
const toJSON = (x) => JSON.stringify(x, null, 4);

const provider = MockProvider(
  { name: "mockProvider" },
  { organization: "myorg", ...MockCloud() }
);

const ip = provider.makeIp({ name: "myip" }, ({}) => ({}));

const image = provider.makeImage({ name: "ubuntu" }, ({ items: images }) => {
  assert(images);
  const image = images.find(
    (image) => image.name.includes("Ubuntu") && image.arch === "x86_64"
  );
  assert(image);
  return image;
});

const volume = provider.makeVolume({ name: "volume1" }, () => ({
  size: 20000000000,
}));

const server = provider.makeServer(
  {
    name: "web-server",
    dependencies: { volume, image, ip },
  },
  async ({ dependencies: { volume, image, ip } }) => ({
    name: "web-server",
    commercial_type: "DEV1-S",
    image: await image.config(),
    volumes: {
      "0": await volume.config(),
    },
    public_ip: await ip.config(),
  })
);

const createName = (name) => `${name}-${new Date().getTime()}`;

const testCrud = async ({ resource, createOptions }) => {
  const { client } = resource;
  {
    await client.destroyAll();
    const {
      data: { items },
    } = await client.list();
    assert.equal(items.length, 0);
  }

  {
    await resource.create({ name: createName("1"), options: createOptions });
    const {
      data: { items },
    } = await client.list();
    assert.equal(items.length, 1);
  }
  {
    await resource.create({ name: createName("2"), options: createOptions });
    const {
      data: { items },
    } = await client.list();
    assert.equal(items.length, 2);
    assert(items[0].name);
    await resource.destroy(items[0].name);
  }
  {
    const {
      data: { items },
    } = await client.list();
    assert.equal(items.length, 1);
  }
  {
    const destroyAll = await client.destroyAll();
    assert(destroyAll);
    const {
      data: { items },
    } = await client.list();
    assert.equal(items.length, 0);
  }
};
describe("MockProvider", function () {
  it("ip config", async function () {
    const config = await ip.config();
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
    //console.log(config);
    assert(config.name);
    assert.equal(config.boot_type, "local");
    assert(config.image);
    assert(config.volumes);
  });

  it("list config", async function () {
    const configs = await provider.listConfig();
    assert(configs);
  });
  it("testCrud", async function () {
    await testCrud({ resource: image });
  });
});
