const assert = require("assert");
const GruCloud = require("./GruCloudApp");
const MockProvider = require("./providers/mock");

const mockConfig = {
  compute: {
    machines: [{ name: "web-server", machineType: "f1-micro" }],
  },
};

const infra = {
  providers: [
    {
      name: "mock",
      engine: MockProvider,
      config: mockConfig,
    },
  ],
  resources: [
    {
      name: "web-server",
      type: "compute",
      provider: "mock",
      config: {
        machineType: "f1-micro",
      },
    },
  ],
};

describe("GruCloud", function () {
  describe("plan", function () {
    it("plan", async function () {
      const gc = GruCloud(infra);
      const plan = await gc.plan();
      console.log(JSON.stringify(plan, null, 4));
      assert.equal(plan.destroy.length, 0);
      assert.equal(plan.newOrUpdate.length, 1);
    });

    it("NoResource", async function () {
      const infraNoResource = {
        providers: infra.providers,
        resources: [],
      };

      const gruCloud = GruCloud(infraNoResource);
      const plan = await gruCloud.plan();
      console.log(plan.destroy);
      assert.equal(plan.destroy.length, 1);

      const destroyItem = plan.destroy[0];
      assert.equal(
        destroyItem.data[0].name,
        mockConfig.compute.machines[0].name
      );
      assert.equal(plan.newOrUpdate.length, 0);
    });

    it("list", async function () {
      const gc = GruCloud(infra);
      const result = await gc.list();
      //console.log(result);
      assert(result);
    });
  });
});
