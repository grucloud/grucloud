const assert = require("assert");
const MockProvider = require("./MockProvider");

const provider = MockProvider({ name: "mockProvider" }, {});

const image = provider.makeImage({ name: "ubuntu" }, (dependencies, images) => {
  console.log("images", images);
  assert(images);
  const image = images.find(
    (image) => image.name.includes("Ubuntu") && image.arch === "x86_64"
  );
  return image;
});

const volume = provider.makeVolume({ name: "volume1" }, () => ({
  size: 20000000000,
}));

const server = provider.makeServer(
  {
    name: "web-server",
    dependencies: { volume, image },
  },
  async ({ volume, image }) => ({
    name: "web-server",
    commercial_type: "DEV1-S",
    image: await image.config(),
    volumes: {
      "0": await volume.config(),
    },
  })
);
const resources = [image, volume, server];
const createName = (name) => `${name}-${new Date().getTime()}`;

const testCrud = async (resource, createOptions) => {
  const { client } = resource;
  {
    await client.destroyAll();
    const {
      data: { items },
    } = await client.list();
    assert.equal(items.length, 0);
  }

  {
    await client.create(createName("1"), createOptions);
    const {
      data: { items },
    } = await client.list();
    assert.equal(items.length, 1);
  }
  {
    await client.create(createName("2"), createOptions);
    const {
      data: { items },
    } = await client.list();
    assert.equal(items.length, 2);
    assert(items[0].name);
    await client.destroy(items[0].name);
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
    console.log(config);
    assert(config.name);
    assert.equal(config.boot_type, "local");
    assert(config.image);
    assert(config.volumes);
  });
  it("all config", async function () {
    const configs = await Promise.all(
      resources.map(async (resource) => await resource.config())
    );
    assert(configs);
  });
  it("testCrud", async function () {
    await testCrud(image);
  });
});
