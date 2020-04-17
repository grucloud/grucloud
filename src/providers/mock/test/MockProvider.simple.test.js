const assert = require("assert");

const MockProvider = require("../MockProvider");
const MockCloud = require("../MockCloud");

const logger = require("logger")({ prefix: "MockProviderTestSimple" });
const toJSON = (x) => JSON.stringify(x, null, 4);

describe("MockProvider Simple", function () {
  const initStates = [
    [
      "Ip",
      new Map([
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
      ]),
    ],
    ["Image", new Map()],
    ["Volume", new Map()],
    ["Server", new Map()],
  ];

  const provider = MockProvider(
    { name: "mockProvider" },
    { ...MockCloud(initStates) }
  );
  it("create ip", async function () {
    {
      const [liveIp] = await provider.listLives();
      assert.equal(liveIp.type, "Ip");
      assert.equal(liveIp.data.items.length, 2);
    }

    const ip = provider.makeIp({ name: "myip" }, ({}) => ({}));

    {
      const [target] = await provider.listTargets();
      assert(!target);
    }

    const plan = await provider.plan();
    assert.equal(plan.destroy.length, 0);
    assert.equal(plan.newOrUpdate.length, 1);
    await provider.deployPlan(plan);

    {
      const [target] = await provider.listTargets();
      assert(target);
      const { name, type } = target;
      assert.equal(name, "myip");
      assert.equal(type, "Ip");
      assert.equal(target.provider, "mockProvider");
    }
    {
      const [liveIp] = await provider.listLives();
      assert.equal(liveIp.type, "Ip");
      assert.equal(liveIp.data.items.length, 3);
    }
  });
});
