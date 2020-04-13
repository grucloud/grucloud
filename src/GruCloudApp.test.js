const assert = require("assert");
const GruCloud = require("./GruCloudApp");
const MockProvider = require("./providers/mock");

// Create Providers
const provider = MockProvider({ name: "mockProvider" }, {});

const image = provider.makeImage({ name: "ubuntu" }, () => ({
  imageName: "ubuntu-os-cloud-18.04",
}));

const volume1 = provider.makeVolume(
  { name: "disk1", dependencies: { image } },
  async ({}) => ({
    size: 20000000000,
  })
);

const volume2 = provider.makeVolume(
  { name: "disk2", dependencies: { image } },
  async ({}) => ({
    size: 30000000000,
  })
);

// The infrastructure
const infra = {
  providers: [provider],
  resources: [image, volume1, volume2],
};

describe("GruCloud", function () {
  it("destroy", async function () {
    const gc = GruCloud(infra);
    await gc.destroy({ all: true });
    await gc.destroy({});
  });
  describe("plan", function () {
    it("simple plan", async function () {
      const gc = GruCloud(infra);
      const plan = await gc.plan();
      console.log(`plan ${JSON.stringify(plan, null, 4)}`);
      assert.equal(plan.destroy.length, 0);
      assert.equal(plan.newOrUpdate.length, 2);
    });
    it("deploy plan", async function () {
      const gc = GruCloud(infra);
      const plan = await gc.plan();
      await gc.deployPlan(plan);
    });
    it.only("plan is empty after deploy plan", async function () {
      const gc = GruCloud(infra);
      await gc.deployPlan(await gc.plan());
      const plan = await gc.plan();
      assert.equal(plan.destroy.length, 0);
      assert.equal(plan.newOrUpdate.length, 0);
    });
    it("plan", async function () {
      const gc = GruCloud(infra);
      {
        const configs = await provider.listConfig();
        assert(configs);
        //console.log(configs);
      }
      {
        const listTargets = await provider.listTargets();
        assert.equal(listTargets[0].data.items.length, 1);
      }
      {
        const liveResources = await gc.listLives();
        assert.equal(liveResources.length, 2);
      }

      const plan = await gc.plan();
      //console.log(plan);
      {
        //TODO
        assert.equal(plan.destroy.length, 0);
        assert.equal(plan.newOrUpdate.length, 1);
      }
      await gc.deployPlan(plan);
      {
        const listTargets = await provider.listTargets();
        assert.equal(listTargets[0].data.items.length, 1);
      }
      {
        const listLives = await provider.listLives();
        assert.equal(listLives.length, 2);
      }
      {
        const plan = await gc.plan();
        assert.equal(plan.destroy.length, 0);
        assert.equal(plan.newOrUpdate.length, 0);
      }
    });

    it("NoResource", async function () {
      const infraNoResource = {
        providers: infra.providers,
        resources: [],
      };

      const gruCloud = GruCloud(infraNoResource);
      const plan = await gruCloud.plan();
      assert.equal(plan.destroy.length, 1);

      const destroyItem = plan.destroy[0];
      assert.equal(destroyItem.data[0].name, mockResource1.name);
      assert.equal(plan.newOrUpdate.length, 0);
    });
  });
});
