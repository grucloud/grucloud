const assert = require("assert");
const sinon = require("sinon");

const { createResources } = require("./MockStack");
const config404 = require("./config/config.404");
const { MockProvider } = require("../MockProvider");
const cliCommands = require("@grucloud/core/cli/cliCommands");
const { tos } = require("@grucloud/core/tos");

describe("MockProviderHooks", async function () {
  it("onDeployed", async function () {
    const onDeployed = { init: sinon.spy() };
    const onDestroyed = { init: sinon.spy() };

    const provider = MockProvider({ config: () => ({}) });
    const resources = await createResources({ provider });

    provider.hookAdd({
      name: "mock-test",
      hookInstance: {
        onDeployed: {
          init: onDeployed.init,
        },
        onDestroyed: {
          init: onDestroyed.init,
        },
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
  it("onDeployed and onDestroyed called when apply fails", async function () {
    const onDeployed = { init: sinon.spy() };
    const onDestroyed = { init: sinon.spy() };

    const provider = MockProvider({
      config: config404,
    });
    const resources = await createResources({ provider });

    provider.hookAdd({
      name: "mock-test",
      hookInstance: {
        onDeployed: {
          init: onDeployed.init,
        },
        onDestroyed: {
          init: onDestroyed.init,
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
    } catch (error) {
      assert(error.error, tos(error));
    }

    assert(onDeployed.init.called);

    try {
      await cliCommands.planDestroy({
        infra,
        commandOptions: { force: true, all: true },
      });
      assert(false, "should not be here");
    } catch (error) {
      const lives = error.error.lives.json;
      assert.equal(lives[0].results[0].error.response.status, 404);
    }
    //TODO should be called ?
    assert(!onDestroyed.init.called);
  });
  it("planApply init throw ", async function () {
    const provider = MockProvider({ config: () => ({}) });
    const resources = await createResources({ provider });
    provider.hookAdd({
      name: "mock-init-throw",
      hookInstance: {
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
      },
    });

    const infra = { provider };
    try {
      const result = await cliCommands.planApply({
        infra,
        commandOptions: { force: true },
      });
      assert(false, "should not be here", result);
    } catch (exception) {
      //assert(error.results);
      const { error } = exception;
      assert(error.error);

      const { resultHooks } = error.resultDeploy.results[0];
      assert(resultHooks.error);
      assert(resultHooks.results[0].error);
    }
    try {
      await cliCommands.planDestroy({
        infra,
        commandOptions: { force: true },
      });
      assert(false, "should not be here");
    } catch (ex) {
      const { error } = ex;
      const resultsHook = error.resultDestroy.results[0].resultHooks;
      assert(resultsHook);
      assert(resultsHook.error);
      assert(resultsHook.results[0].error);
    }
  });
  it("run --onDeployed init throw ", async function () {
    const provider = MockProvider({ config: () => ({}) });
    const resources = await createResources({ provider });
    provider.hookAdd({
      name: "mock-run-ondeployed-init-throw",
      hookInstance: {
        onDeployed: {
          init: () => {
            throw "i throw in onDeployed init";
          },
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
      assert(error.error);
      assert(error.results[0].error);
    }
  });

  it("action throw ", async function () {
    const provider = MockProvider({ config: () => ({}) });
    const resources = await createResources({ provider });
    const message = "i throw in a command";
    provider.hookAdd({
      name: "mock-action-throw",
      hookInstance: {
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
      },
    });

    const infra = { provider };
    try {
      await cliCommands.planApply({
        infra,
        commandOptions: { force: true },
      });
      assert(false, "should not be here");
    } catch (ex) {
      const { error } = ex;
      const { resultHooks } = error.resultDeploy.results[0];
      assert(resultHooks.error);
      assert(resultHooks.results[0].error);
    }
    try {
      await cliCommands.planDestroy({
        infra,
        commandOptions: { force: true },
      });
      assert(false, "should not be here");
    } catch ({ error }) {
      assert(error.error);
      const { resultHooks } = error.resultDestroy.results[0];
      assert(resultHooks.error);
      assert(resultHooks.results[0].error);
    }
  });
});
