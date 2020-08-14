const assert = require("assert");
const { createStack } = require("./MockStack");
const logger = require("logger")({ prefix: "CoreProvider" });
const { ConfigLoader } = require("ConfigLoader");
const { testPlanDeploy, testPlanDestroy } = require("test/E2ETestUtils");

const { tos } = require("../../../tos");

describe("MockProvider e2e", async function () {
  let stack;
  let provider;
  let config;
  before(async () => {
    config = ConfigLoader({ baseDir: __dirname });
    stack = await createStack({
      config,
    });
    provider = stack.providers[0];
  });
  after(async () => {
    const { error } = await provider.destroyAll();
    assert(!error);
  });

  it("plan destroy", async function () {
    {
      const { results: liveResources } = await provider.listLives({
        all: true,
      });
      assert.equal(liveResources.length, 3);
    }

    {
      const plan = await provider.planQuery();
      assert(plan.resultDestroy);
      const { results, error } = await provider.planApply({ plan });
      //assert(results);
      assert(!error);
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
      const planDestroyed = await provider.planFindDestroy(
        { options: { all: true } },
        1
      );
      //TODO was 6
      assert.equal(planDestroyed.plans.length, 7);
    }
  });
  it("simple plan", async function () {
    {
      {
        const { error } = await provider.destroyAll();
        assert(!error);
      }
      {
        const { results: liveResources } = await provider.listLives({
          our: true,
        });
        assert.equal(liveResources.length, 0);
      }

      const plan = await provider.planQuery();
      assert(plan.resultDestroy);
      {
        const { resultCreate, error } = await provider.planApply({ plan });
        assert(!error);
        assert(resultCreate);
        resultCreate.results
          .filter(({ item: { action } }) => action === "CREATE")
          .forEach(({ item, input, output }) => {
            assert(input);
            assert(output);
          });
        resultCreate.results
          .filter(({ item: { action } }) => action !== "CREATE")
          .forEach(({ item, input, output }) => {
            assert(!input);
            assert(!output);
          });

        assert.equal(
          resultCreate.results.length,
          plan.resultCreate.plans.length + plan.resultDestroy.plans.length
        );
      }
      {
        const { results: lives } = await provider.listLives({ our: true });
        assert.equal(lives.length, plan.resultCreate.plans.length);
      }
      {
        const { results: lives } = await provider.listLives({
          provider: "mock",
        });
        assert(lives.length > 0);
      }
      {
        const { results: lives } = await provider.listLives({
          provider: "idonotexist",
        });
        assert(lives.length === 0);
      }
      {
        const { error } = await provider.destroyAll();
        assert(!error);
      }
    }
  });

  it("LifeCycle", async function () {
    await testPlanDeploy({ provider, full: true });
    await testPlanDestroy({ provider, full: true });
  });
  it("plan", async function () {
    const { providers } = await createStack({
      config,
    });
    const provider = providers[0];
    {
      const listTargets = await provider.listTargets();
      assert.equal(listTargets.length, 0);
    }

    {
      const { results: liveResources } = await provider.listLives({
        all: true,
      });
      assert.equal(liveResources.length, 3);
    }
    {
      const { results: liveResources } = await provider.listLives({});
      assert.equal(liveResources.length, 2);
    }
    {
      const { results: liveResources } = await provider.listLives({
        our: true,
      });
      //TODO
      //assert.equal(liveResources.length, 1);
    }
    {
      const { results: liveResources } = await provider.listLives({
        types: ["Server", "Ip"],
      });
      assert.equal(liveResources.length, 1);
    }
    const plan = await provider.planQuery();
    {
      //TODO
      //assert.equal(plan.resultDestroy.plans.length, 1);
      assert.equal(plan.resultCreate.plans.length, 4);
    }
    {
      const { error } = await provider.planApply({ plan });
      assert(!error);
    }
    {
      const plan = await provider.planQuery();
      assert.equal(plan.resultDestroy.plans.length, 0);
      assert.equal(plan.resultCreate.plans.length, 0);
    }
    {
      const listTargets = await provider.listTargets();
      assert.equal(listTargets.length, 4);
    }
    {
      const { results: listLives } = await provider.listLives();
      assert.equal(listLives.length, 4);
    }
    {
      const { results: listLives } = await provider.listLives({ all: true });
      assert.equal(listLives.length, 5);
    }

    {
      const configs = await provider.listConfig();
      assert(configs);
    }
    {
      const planDestroy = await provider.planFindDestroy(
        { options: { all: true } },
        -1
      );
      const indexServer = planDestroy.plans.findIndex(
        (item) => item.resource.type === "Server"
      );
      assert(indexServer >= 0);
      const indexSecurityGroup = planDestroy.plans.findIndex(
        (item) => item.resource.type === "SecurityGroup"
      );
      assert(indexSecurityGroup > 0);
      //TODO
      //assert(indexServer < indexSecurityGroup);
      //assert.equal(planDestroy.length, 6);
      // Server must be before SecurityGroup
    }

    const { error } = await provider.destroyAll();
    assert(!error);

    {
      const listTargets = await provider.listTargets();
      assert.equal(listTargets.length, 0);
    }
  });
});
