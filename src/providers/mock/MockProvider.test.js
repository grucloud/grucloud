const assert = require("assert");
const GruCloud = require("../../GruCloudApp");
const MockProvider = require("./MockProvider");
const MockResource = require("./resources/MockResource");

const config = {
  compute: { machines: [] },
};

const createOptions = {
  machineType: "f1-micro",
};

const provider = MockProvider({ name: "mockProvider" }, config);
const mockResource = MockResource(
  { name: "mock1", provider },
  { initialState: [] }
);

const gc = GruCloud({ providers: [provider], resources: [mockResource] });

const createName = (name) => `${name}-${new Date().getTime()}`;

describe("MockProvider", function () {
  it("delete all, create, list, delete by name, delete all", async function () {
    {
      await mockResource.destroyAll();
      const {
        data: { items },
      } = await mockResource.client.list();
      assert.equal(items.length, 0);
    }

    {
      await mockResource.client.create(createName("1"), createOptions);
      const {
        data: { items },
      } = await mockResource.client.list();
      assert.equal(items.length, 1);
    }
    {
      await mockResource.client.create(createName("2"), createOptions);
      const {
        data: { items },
      } = await mockResource.client.list();
      assert.equal(items.length, 2);
      assert(items[0].name);
      await mockResource.client.destroy(items[0].name);
    }
    {
      const {
        data: { items },
      } = await mockResource.client.list();
      assert.equal(items.length, 1);
    }
    {
      const destroyAll = await mockResource.destroyAll();
      assert(destroyAll);
      const {
        data: { items },
      } = await mockResource.client.list();
      assert.equal(items.length, 0);
    }
  });
});
