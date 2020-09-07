const assert = require("assert");
const { createStack } = require("./MockStack");
const logger = require("logger")({ prefix: "CoreProvider" });
const { ConfigLoader } = require("ConfigLoader");
const {
  testPlanDeploy,
  testPlanDestroy,
  isPlanEmpty,
} = require("test/E2ETestUtils");

//const { tos } = require("../../../tos");

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
      assert.equal(liveResources.length, 4);
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
      assert(isPlanEmpty(plan));
    }
    {
      const planDestroyed = await provider.planFindDestroy(
        { options: { all: true } },
        1
      );
      assert.equal(planDestroyed.plans.length, 8);
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
      assert.equal(liveResources.length, 4);
    }
    {
      const { results: liveResources } = await provider.listLives({});
      assert.equal(liveResources.length, 3);
    }
    {
      const { results: liveResources } = await provider.listLives({
        our: true,
      });
      assert.equal(liveResources.length, 0);
    }
    {
      const { results: liveResources } = await provider.listLives({
        types: ["Server", "Ip"],
      });
      assert.equal(liveResources.length, 2);
    }
    {
      const { results: liveResources } = await provider.listLives({
        types: ["Serv"],
      });
      assert.equal(liveResources.length, 1);
    }
    const plan = await provider.planQuery();
    {
      assert.equal(plan.resultDestroy.plans.length, 0);
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
      const { plans } = await provider.planFindDestroy(
        { options: { all: true } },
        -1
      );

      assert.equal(plans.length, 8);
    }

    const { error } = await provider.destroyAll();
    assert(!error);

    {
      const listTargets = await provider.listTargets();
      assert.equal(listTargets.length, 0);
    }
  });
});
