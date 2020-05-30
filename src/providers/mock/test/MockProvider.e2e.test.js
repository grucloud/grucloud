const assert = require("assert");
const createStack = require("./MockStack");
const logger = require("logger")({ prefix: "CoreProvider" });
const config = require("./config");
const toString = (x) => JSON.stringify(x, null, 4);

describe("MockProvider e2e", async function () {
  let stack;
  let provider;
  before(async () => {
    stack = await createStack({
      config,
    });
    provider = stack.providers[0];
  });
  after(async () => {
    //await provider.destroyAll();
  });

  it("plan destroy", async function () {
    {
      const plan = await provider.plan();
      assert(plan.destroy);
      await provider.deployPlan(plan);
    }
    {
      const listTargets = await provider.listTargets();
      assert.equal(listTargets.length, 4);
    }
    {
      const plan = await provider.plan();
      assert(provider.isPlanEmpty(plan));
    }
    {
      const planDestroyed = await provider.planFindDestroy({ all: true });
      assert.equal(planDestroyed.length, 4);
    }
  });
  it("plan", async function () {
    const { providers } = await createStack({ config });
    const provider = providers[0];
    {
      const listTargets = await provider.listTargets();
      assert.equal(listTargets.length, 0);
    }

    {
      const liveResources = await provider.listLives({ all: true });
      assert.equal(liveResources.length, 3);
    }
    {
      const liveResources = await provider.listLives({});
      assert.equal(liveResources.length, 2);
    }
    {
      const liveResources = await provider.listLives({ our: true });
      assert.equal(liveResources.length, 1);
    }
    {
      const liveResources = await provider.listLives({
        types: ["Server", "Ip"],
      });
      assert.equal(liveResources.length, 1);
    }
    const plan = await provider.plan();
    {
      assert.equal(plan.destroy.length, 1);
      assert.equal(plan.newOrUpdate.length, 4);
    }
    await provider.deployPlan(plan);
    {
      const plan = await provider.plan();
      assert.equal(plan.destroy.length, 0);
      assert.equal(plan.newOrUpdate.length, 0);
    }
    {
      const listTargets = await provider.listTargets();
      assert.equal(listTargets.length, 4);
    }
    {
      const listLives = await provider.listLives();
      assert.equal(listLives.length, 4);
    }
    {
      const listLives = await provider.listLives({ all: true });
      assert.equal(listLives.length, 5);
    }

    {
      const configs = await provider.listConfig();
      assert(configs);
    }
    {
      const planDestroy = await provider.planFindDestroy({ all: true });
      const indexServer = planDestroy.findIndex(
        (item) => item.resource.type === "Server"
      );
      assert(indexServer >= 0);
      const indexSecurityGroup = planDestroy.findIndex(
        (item) => item.resource.type === "SecurityGroup"
      );
      assert(indexSecurityGroup > 0);
      assert(indexServer < indexSecurityGroup);
      assert.equal(planDestroy.length, 4);
      // Server must be before SecurityGroup
    }
    await provider.destroyAll();

    {
      const listTargets = await provider.listTargets();
      assert.equal(listTargets.length, 0);
    }
  });
});
