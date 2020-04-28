const assert = require("assert");
const createStack = require("./MockStack");
const logger = require("logger")({ prefix: "CoreProvider" });
const config = require("./config");
const toString = (x) => JSON.stringify(x, null, 4);

describe("MockProvider e2e", function () {
  const { providers } = createStack({
    config,
  });
  const provider = providers[0];

  before(async () => {
    //await provider.destroyAll();
  });
  after(async () => {
    //await provider.destroyAll();
  });

  it("destroy", async function () {
    {
      const plan = await provider.plan();
      assert(plan.destroy);
      await provider.deployPlan(plan);
    }
    {
      const listTargets = await provider.listTargets();
      assert.equal(listTargets.length, 3);
    }
    {
      const plan = await provider.plan();
      assert(provider.isPlanEmpty(plan));
    }
    {
      const planDestroyed = await provider.planFindDestroy({ all: true });
      assert.equal(planDestroyed.length, 3);
    }
  });
  it("plan", async function () {
    const { providers } = createStack({ config });
    const provider = providers[0];
    {
      const listTargets = await provider.listTargets();
      assert.equal(listTargets.length, 0);
    }

    {
      const liveResources = await provider.listLives({ all: true });
      assert.equal(liveResources.length, 3);
    }

    const plan = await provider.plan();
    {
      assert.equal(plan.destroy.length, 1);
      assert.equal(plan.newOrUpdate.length, 3);
    }
    await provider.deployPlan(plan);
    {
      const plan = await provider.plan();
      assert.equal(plan.destroy.length, 0);
      assert.equal(plan.newOrUpdate.length, 0);
    }
    {
      const listTargets = await provider.listTargets();
      assert.equal(listTargets.length, 3);
    }
    {
      const listLives = await provider.listLives();
      assert.equal(listLives.length, 3);
    }
    {
      const listLives = await provider.listLives({ all: true });
      assert.equal(listLives.length, 4);
    }

    {
      const configs = await provider.listConfig();
      assert(configs);
    }
  });
});
