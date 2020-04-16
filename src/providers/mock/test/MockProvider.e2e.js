const assert = require("assert");
const MockProvider = require("..");
const MockCloud = require("../MockCloud");

const createStack = () => {
  const mockCloud = MockCloud();
  const provider = MockProvider({ name: "mockProvider" }, { ...mockCloud });

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
  return { provider, image, volume1, volume2, mockCloud };
};

describe("MockProvider e2e", function () {
  describe("plan", function () {
    it("simple plan", async function () {
      const { provider } = createStack();
      const plan = await provider.plan();
      console.log(`plan ${JSON.stringify(plan, null, 4)}`);
      assert.equal(plan.destroy.length, 0);
      assert.equal(plan.newOrUpdate.length, 2);
    });
    it("deploy plan", async function () {
      const { provider } = createStack();
      const plan = await provider.plan();
      await provider.deployPlan(plan);
      await provider.destroyAll();
    });
    it("plan is empty after deploy plan", async function () {
      const { provider } = createStack();
      await provider.deployPlan(await provider.plan());

      {
        const listTargets = await provider.listTargets();
        assert.equal(listTargets.length, 2);
      }

      const plan = await provider.plan();
      assert.equal(plan.destroy.length, 0);
      assert.equal(plan.newOrUpdate.length, 0);
    });
    it("plan", async function () {
      const { provider } = createStack();
      {
        const configs = await provider.listConfig();
        assert(configs);
        //console.log(configs);
      }
      {
        const listTargets = await provider.listTargets();
        assert.equal(listTargets.length, 0);
      }
      {
        const liveResources = await provider.listLives();
        assert.equal(liveResources.length, 2);
      }

      const plan = await provider.plan();
      //console.log(plan);
      {
        //TODO
        assert.equal(plan.destroy.length, 0);
        assert.equal(plan.newOrUpdate.length, 2);
      }
      await provider.deployPlan(plan);
      {
        const listTargets = await provider.listTargets();
        assert.equal(listTargets.length, 2);
      }
      {
        const listLives = await provider.listLives();
        assert.equal(listLives.length, 3);
      }
      {
        const plan = await provider.plan();
        assert.equal(plan.destroy.length, 0);
        assert.equal(plan.newOrUpdate.length, 0);
      }
    });
  });
});
