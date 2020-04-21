const assert = require("assert");
const MockCloud = require("./MockCloud");
const createStack = require("./MockStack");

const logger = require("logger")({ prefix: "MockProviderTestSimple" });
const toJSON = (x) => JSON.stringify(x, null, 4);

describe("MockProvider Simple", function () {
  const initStates = [
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
    ["Image", []],
    ["Volume", []],
    ["Server", []],
  ];
  const { provider, ip, volume, server, image } = createStack({
    config: MockCloud(initStates),
  });

  it("create ip", async function () {
    {
      const [liveIp] = await provider.listLives();
      assert.equal(liveIp.type, "Ip");
      assert.equal(liveIp.data.items.length, 2);
    }

    const ip = provider.makeIp({ name: "myip" });

    {
      const [target] = await provider.listTargets();
      assert(!target);
    }

    const plan = await provider.plan();
    assert.equal(plan.destroy.length, 0);
    assert.equal(plan.newOrUpdate.length, 3);
    await provider.deployPlan(plan);

    {
      const liveIp = await ip.getLive();
      assert(liveIp);
      assert(liveIp.id);
    }

    {
      const [target] = await provider.listTargets();
      assert(target);
      const { name, type } = target;
      assert.equal(name, "myip");
      assert.equal(type, "Ip");
      assert.equal(target.provider, "mock");
    }
    {
      const lives = await provider.listLives();
      assert.equal(lives.length, 3);
    }
  });
});
