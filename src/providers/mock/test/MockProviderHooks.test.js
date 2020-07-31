const _ = require("lodash");
const assert = require("assert");
const { createResources } = require("./MockStack");
const { ConfigLoader } = require("ConfigLoader");
const sinon = require("sinon");

const MockProvider = require("../MockProvider");

const logger = require("logger")({ prefix: "MockProviderTest" });
const toJSON = (x) => JSON.stringify(x, null, 4);

describe("MockProviderHooks", async function () {
  before(async () => {});

  it("onDeployed", async function () {
    const onDeployed = { init: sinon.spy() };
    const onDestroyed = { init: sinon.spy() };

    const config = ConfigLoader({ baseDir: __dirname });
    const provider = await MockProvider({ config });
    const resources = await createResources({ provider });
    provider.hookAdd("mock-test", {
      onDeployed: {
        init: onDeployed.init,
      },
      onDestroyed: {
        init: onDestroyed.init,
      },
    });
    {
      const { error, hookResults } = await provider.planQueryAndApply();
      assert(!error, "planQueryAndApply failed");
      assert(onDeployed.init.called);
    }
    {
      const { error, hookResults } = await provider.destroyAll();
      assert(!error, "planDestroy failed");
      assert(onDestroyed.init.called);
    }
  });
});
