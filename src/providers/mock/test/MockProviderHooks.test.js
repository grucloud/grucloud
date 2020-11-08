const assert = require("assert");
const path = require("path");
const { createResources } = require("./MockStack");
const { ConfigLoader } = require("ConfigLoader");
const sinon = require("sinon");
const config404 = require("../../../cli/test/config/config.500");
const { MockProvider } = require("../MockProvider");
const cliCommands = require("../../../cli/cliCommands");
const logger = require("logger")({ prefix: "MockProviderTest" });
const toJSON = (x) => JSON.stringify(x, null, 4);

describe("MockProviderHooks", async function () {
  it("exception on hook.js", async function () {
    const config = ConfigLoader({ baseDir: __dirname });
    const provider = MockProvider({ config });
    const resources = await createResources({ provider });
    try {
      provider.register({
        dirname: path.resolve(__dirname, "fixtures"),
        resources,
      });
      assert(false, "should not be here");
    } catch (error) {
      assert.equal(error.message, "Bang");
    }
  });

  it("onDeployed", async function () {
    const onDeployed = { init: sinon.spy() };
    const onDestroyed = { init: sinon.spy() };

    const config = ConfigLoader({ baseDir: __dirname });
    const provider = MockProvider({ config });
    const resources = await createResources({ provider });

    provider.hookAdd("mock-test", {
      onDeployed: {
        init: onDeployed.init,
      },
      onDestroyed: {
        init: onDestroyed.init,
      },
    });
    const infra = { provider };

    await cliCommands.planApply({
      infra,
      commandOptions: { force: true },
    });
    assert(onDeployed.init.called);

    await cliCommands.planDestroy({
      infra,
      commandOptions: { force: true },
    });
    assert(onDestroyed.init.called);
  });
  it("onDeployed and onDestroyed not called when apply fails", async function () {
    const onDeployed = { init: sinon.spy() };
    const onDestroyed = { init: sinon.spy() };

    const config = ConfigLoader({ baseDir: __dirname });
    const provider = MockProvider({
      config: { ...config, ...config404 },
    });
    const resources = await createResources({ provider });

    provider.hookAdd("mock-test", {
      onDeployed: {
        init: onDeployed.init,
      },
      onDestroyed: {
        init: onDestroyed.init,
      },
    });
    const infra = { provider };

    try {
      await cliCommands.planApply({
        infra,
        commandOptions: { force: true },
      });
      assert(false, "should not be here");
    } catch (error) {
      assert(error.error);
    }

    assert(!onDeployed.init.called);

    try {
      await cliCommands.planDestroy({
        infra,
        commandOptions: { force: true, all: true },
      });
      assert(false, "should not be here");
    } catch (error) {
      assert.equal(
        error.error.resultsDestroy[0].result.results[0].error.Status,
        500
      );
    }

    assert(!onDestroyed.init.called);
  });
  it("planApply init throw ", async function () {
    const config = ConfigLoader({ baseDir: __dirname });
    const provider = MockProvider({ config });
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

    const infra = { provider };
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
      const { resultHooks } = error.resultsDestroy[0].result;
      assert(resultHooks.error);
      assert(resultHooks.results[0].error);
      assert(resultHooks.results[0].results[0].error);
    }
  });
  it("run --onDeployed init throw ", async function () {
    const config = ConfigLoader({ baseDir: __dirname });
    const provider = MockProvider({ config });
    const resources = await createResources({ provider });
    provider.hookAdd("mock-run-ondeployed-init-throw", {
      onDeployed: {
        init: () => {
          throw "i throw in onDeployed init";
        },
      },
    });

    const infra = { provider };
    try {
      await cliCommands.planRunScript({
        infra,
        commandOptions: { onDeployed: true },
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

  it("action throw ", async function () {
    const config = ConfigLoader({ baseDir: __dirname });
    const provider = MockProvider({ config });
    const resources = await createResources({ provider });
    const message = "i throw in a command";
    provider.hookAdd("mock-action-throw", {
      onDeployed: {
        init: () => {},
        actions: [
          {
            name: "Ping",
            command: async () => {},
          },
          {
            name: "SSH",
            command: async () => {
              throw Error(message);
            },
          },
        ],
      },
      onDestroyed: {
        init: () => {},
        actions: [
          {
            name: "Ping",
            command: async () => {},
          },
          {
            name: "SSH",
            command: async () => {
              throw Error(message);
            },
          },
        ],
      },
    });

    const infra = { provider };
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
      const result = resultHooks.results[0];
      assert(result.error);
      assert(result.results[1].error);
      assert.equal(result.results[1].error.message, message);
    }
    try {
      await cliCommands.planDestroy({
        infra,
        commandOptions: { force: true },
      });
      assert(false, "should not be here");
    } catch ({ error }) {
      assert(error.results);
      const { resultHooks } = error.resultsDestroy[0].result;
      assert(resultHooks.error);
      const result = resultHooks.results[0];
      assert(result.error);
      assert(result.results[1].error);
      assert.equal(result.results[1].error.message, message);
    }
  });
});
