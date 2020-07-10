const assert = require("assert");
const createStack = require("./MockStack");
const logger = require("logger")({ prefix: "CoreProvider" });
const { ConfigLoader } = require("ConfigLoader");
const { testPlanDeploy, testPlanDestroy } = require("test/E2ETestUtils");

const { tos } = require("../../../tos");

describe("MockProvider e2e", async function () {
  let stack;
  let provider;
  before(async () => {
    stack = await createStack({
      config: ConfigLoader({ baseDir: __dirname }),
    });
    provider = stack.providers[0];
  });
  after(async () => {
    const { success } = await provider.destroyAll();
    assert(success);
  });

  it("plan destroy", async function () {
    {
      const liveResources = await provider.listLives({ all: true });
      assert.equal(liveResources.length, 3);
    }

    {
      const plan = await provider.planQuery();
      assert(plan.destroy);
      const { results, success } = await provider.planApply({ plan });
      assert(results);
      assert(success);
    }
    {
      const listTargets = await provider.listTargets();
      assert.equal(listTargets.length, 4);
    }
    {
      const plan = await provider.planQuery();
      assert(provider.isPlanEmpty(plan));
    }
    {
      const planDestroyed = await provider.planFindDestroy({ all: true }, 1);
      assert.equal(planDestroyed.length, 6);
    }
  });
  it("plan destroy by provider", async function () {
    {
      const plan = await provider.planQuery();
      assert(plan.destroy);
      const { results, success } = await provider.planApply({ plan });
      assert(success);
    }
    {
      const planDestroyed = await provider.planFindDestroy({
        provider: "idonotexist",
      });
      assert.equal(planDestroyed.length, 0);
    }
    {
      const planDestroyed = await provider.planFindDestroy({
        provider: "mock",
      });
      assert(planDestroyed.length > 0);
    }
  });
  it("simple plan", async function () {
    {
      {
        const { success } = await provider.destroyAll();
        assert(success);
      }
      {
        const liveResources = await provider.listLives({ our: true });
        assert.equal(liveResources.length, 0);
      }

      const plan = await provider.planQuery();
      assert(plan.destroy);
      {
        const { results, success } = await provider.planApply({ plan });
        assert(success);
        assert(results);
        results
          .filter(({ item: { action } }) => action === "CREATE")
          .forEach(({ item, input, output }) => {
            assert(input);
            assert(output);
          });
        results
          .filter(({ item: { action } }) => action !== "CREATE")
          .forEach(({ item, input, output }) => {
            assert(!input);
            assert(!output);
          });

        assert.equal(
          results.length,
          plan.newOrUpdate.length + plan.destroy.length
        );
      }
      {
        const lives = await provider.listLives({ our: true });
        assert.equal(lives.length, plan.newOrUpdate.length);
      }
      {
        const lives = await provider.listLives({ provider: "mock" });
        assert(lives.length > 0);
      }
      {
        const lives = await provider.listLives({ provider: "idonotexist" });
        assert(lives.length === 0);
      }
      {
        const { success } = await provider.destroyAll();
        assert(success);
      }
    }
  });

  it("LifeCycle", async function () {
    await testPlanDeploy({ provider, full: true });
    await testPlanDestroy({ provider, full: true });
  });
  it("plan", async function () {
    const { providers } = await createStack({
      config: ConfigLoader({ baseDir: __dirname }),
    });
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
    const plan = await provider.planQuery();
    {
      assert.equal(plan.destroy.length, 1);
      assert.equal(plan.newOrUpdate.length, 4);
    }
    {
      const { success } = await provider.planApply({ plan });
      assert(success);
    }
    {
      const plan = await provider.planQuery();
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
      const planDestroy = await provider.planFindDestroy({ all: true }, -1);
      const indexServer = planDestroy.findIndex(
        (item) => item.resource.type === "Server"
      );
      assert(indexServer >= 0);
      const indexSecurityGroup = planDestroy.findIndex(
        (item) => item.resource.type === "SecurityGroup"
      );
      assert(indexSecurityGroup > 0);
      assert(indexServer < indexSecurityGroup);
      assert.equal(planDestroy.length, 6);
      // Server must be before SecurityGroup
    }

    const { success } = await provider.destroyAll();
    assert(success);

    {
      const listTargets = await provider.listTargets();
      assert.equal(listTargets.length, 0);
    }
  });
});
