const assert = require("assert");
const { createResources } = require("./MockStack");
const { ConfigLoader } = require("ConfigLoader");
const sinon = require("sinon");

const MockProvider = require("../MockProvider");
const cliCommands = require("../../../cli/cliCommands");

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
      const { error } = await provider.planQueryAndApply();
      assert(!error, "planQueryAndApply failed");
      assert(onDeployed.init.called);
    }
    {
      const { error } = await provider.destroyAll();
      assert(!error, "planDestroy failed");
      assert(onDestroyed.init.called);
    }
  });
  it("init throw ", async function () {
    const config = ConfigLoader({ baseDir: __dirname });
    const provider = await MockProvider({ config });
    const resources = await createResources({ provider });
    provider.hookAdd("mock-init-throw", {
      onDeployed: {
        init: () => {
          throw "i throw in onDeployed init";
        },
      },
      onDestroyed: {
        init: () => {
          throw "i throw in onDestroyed init";
        },
      },
    });

    const infra = { providers: [provider] };
    try {
      await cliCommands.planApply({
        infra,
        commandOptions: { force: true },
      });
      assert(false, "should not be here");
    } catch ({ error }) {
      assert(error.results);
      const { resultHooks } = error.results[0].result;
      assert(resultHooks.error);
      assert(resultHooks.results[0].error);
      assert(resultHooks.results[0].results[0].error);
    }
    try {
      await cliCommands.planDestroy({
        infra,
        commandOptions: { force: true },
      });
      assert(false, "should not be here");
    } catch ({ error }) {
      assert(error.results);
      const { resultHooks } = error.results[0].result;
      assert(resultHooks.error);
      assert(resultHooks.results[0].error);
      assert(resultHooks.results[0].results[0].error);
    }
  });
});
