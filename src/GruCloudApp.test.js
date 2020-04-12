const assert = require("assert");
const GruCloud = require("./GruCloudApp");
const MockProvider = require("./providers/mock");

// Create Providers
const provider = MockProvider({ name: "mockProvider" }, {});

const image = provider.makeImage({ name: "ubuntu" }, () => ({
  imageName: "ubuntu-os-cloud-18.04",
}));

const volume = provider.makeVolume(
  { name: "disk", dependencies: { image } },
  async ({}) => ({
    size: 20000000000,
  })
);

// The infrastructure
const infra = {
  providers: [provider],
  resources: [image, volume],
};

describe("GruCloud", function () {
  it("destroy", async function () {
    const gc = GruCloud(infra);
    const destroyed = await gc.destroy({ all: true });
    await gc.destroy({});

    assert(destroyed);
  });
  describe("plan", function () {
    it("plan", async function () {
      const gc = GruCloud(infra);
      {
        const configs = await provider.listConfig();
        assert(configs);
        console.log(configs);
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
      console.log(plan);
      {
        //TODO
        assert.equal(plan.destroy.length, 0);
        assert.equal(plan.newOrUpdate.length, 1);
      }
      await gc.deployPlan(plan);
      {
        const listTargets = await provider.listTargets();
        assert.equal(listTargets[0].data.items.length, 2);
      }
      {
        const listLives = await provider.listLives();
        assert.equal(listLives[0].data.items.length, 2);
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
