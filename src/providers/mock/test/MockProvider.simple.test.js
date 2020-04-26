const assert = require("assert");
const createStack = require("./MockStack");

const logger = require("logger")({ prefix: "MockProviderTestSimple" });
const toJSON = (x) => JSON.stringify(x, null, 4);

describe("MockProvider Simple", function () {
  const { providers, ip, volume, server, image } = createStack({
    config: {},
  });
  const provider = providers[0];

  before(async () => {
    await provider.destroyAll();
  });
  after(async () => {
    await provider.destroyAll();
  });

  it("create ip", async function () {
    {
      const [liveIp] = await provider.listLives({ all: true });

      assert.equal(liveIp.type, "Image");
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
