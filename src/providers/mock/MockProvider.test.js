const assert = require("assert");
const GruCloud = require("../../GruCloudApp");
const MockProvider = require("./MockProvider");

const config = {
  compute: { machines: [] },
};

const provider = MockProvider({ name: "mockProvider" }, config);

const imageResource = provider.makeImage({ name: "ubuntu" }, () => ({
  imageName: "ubuntu-os-cloud-18.04",
}));

const volumeResource = provider.makeVolume(
  { name: "disk", dependencies: { image: imageResource } },
  ({ image }) => ({
    image: image.config().imageName,
    size: "20GB",
  })
);

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
  it("testCrud", async function () {
    await testCrud(imageResource);
  });
  it("config", async function () {
    const config = await volumeResource.config();
    assert(config);
  });
});
