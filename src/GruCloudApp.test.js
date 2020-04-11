const assert = require("assert");
const GruCloud = require("./GruCloudApp");
const MockProvider = require("./providers/mock");

const config = {
  /*initialState: [
    ["web-server", { name: "web-server", machineType: "f1-micro" }],
  ],*/
  createOption: {
    machineType: "f1-micro",
  },
};
// Create Providers
const provider = MockProvider({ name: "mockProvider" }, config);

const imageResource = provider.makeImage({ name: "ubuntu" }, () => ({
  imageName: "ubuntu-os-cloud-18.04",
}));

const volumeResource = provider.makeVolume(
  { name: "disk", dependencies: { imageResource } },
  ({ image }) => ({
    image: image.name(),
    size: "20GB",
  })
);

// The infrastructure
const infra = {
  providers: [provider],
  resources: [imageResource, volumeResource],
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
        const listTargets = await provider.listTargets();
        assert.equal(listTargets.length, 0);
      }
      {
        const liveResources = await gc.listLives();
        assert.equal(liveResources.length, 0);
      }

      const plan = await gc.plan();
      {
        assert.equal(plan.destroy.length, 0);
        assert.equal(plan.newOrUpdate.length, 2);
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
