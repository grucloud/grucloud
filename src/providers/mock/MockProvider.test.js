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
      const list = await mockResource.list();
      assert.equal(list.length, 0);
    }

    {
      await mockResource.create(createName("1"), createOptions);
      const list = await mockResource.list();
      assert.equal(list.length, 1);
    }
    {
      await mockResource.create(createName("2"), createOptions);
      const list = await mockResource.list();
      assert.equal(list.length, 2);
      assert(list[0].name);
      await mockResource.destroy(list[0].name);
    }
    {
      const list4 = await mockResource.list();
      assert.equal(list4.length, 1);
    }
    {
      const destroyAll = await mockResource.destroyAll();
      assert(destroyAll);
      const list = await mockResource.list();
      assert.equal(list.length, 0);
    }
  });
});
