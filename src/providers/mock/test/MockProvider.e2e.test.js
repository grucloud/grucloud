const assert = require("assert");
const createStack = require("./MockStack");
const logger = require("logger")({ prefix: "CoreProvider" });

const toString = (x) => JSON.stringify(x, null, 4);

const mockCloudInitStates = [
  [
    "Ip",
    [
      [
        "51.15.246.48",
        {
          address: "51.15.246.48",
        },
      ],
      [
        "51.15.246.50",
        {
          address: "51.15.246.50",
        },
      ],
    ],
  ],
  [
    "Image",
    [
      ["1", { name: "Ubuntu", arch: "x86_64" }],
      ["2", { name: "CentOS", arch: "x86_64" }],
    ],
  ],
  ["Volume"],
  ["Server"],
];

describe("MockProvider e2e", function () {
  describe("plan", function () {
    it("plan", async function () {
      const { providers } = createStack({
        config: { mockCloudInitStates },
      });
      const provider = providers[0];
      {
        const listTargets = await provider.listTargets();
        assert.equal(listTargets.length, 0);
      }

      {
        const configs = await provider.listConfig();
        assert(configs);
      }
      {
        const liveResources = await provider.listLives();
        assert.equal(liveResources.length, 2);
      }

      const plan = await provider.plan();
      {
        assert.equal(plan.destroy.length, 0);
        assert.equal(plan.newOrUpdate.length, 3);
      }
      await provider.deployPlan(plan);
      {
        const listTargets = await provider.listTargets();
        assert.equal(listTargets.length, 3);
      }
      {
        const listLives = await provider.listLives();
        assert.equal(listLives.length, 4);
      }
      {
        const plan = await provider.plan();
        assert.equal(plan.destroy.length, 0);
        assert.equal(plan.newOrUpdate.length, 0);
      }
    });
  });
});
