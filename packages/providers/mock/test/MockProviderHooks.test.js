const assert = require("assert");
const sinon = require("sinon");

const { createResources } = require("./MockStack");
const config404 = require("./config/config.404");
const { MockProvider } = require("../MockProvider");
const { Cli } = require("@grucloud/core/cli/cliCommands");

const { tos } = require("@grucloud/core/tos");

describe("MockProviderHooks", async function () {
  it("onDeployed", async function () {
    const onDeployed = { init: sinon.spy() };
    const onDestroyed = { init: sinon.spy() };
    const cli = await Cli({
      createStack: ({ createProvider }) => ({
        provider: createProvider(MockProvider, { createResources }),
        hooks: [
          () => ({
            name: "mock-test",
            onDeployed: {
              init: onDeployed.init,
            },
            onDestroyed: {
              init: onDestroyed.init,
            },
          }),
        ],
      }),
    });

    await cli.planApply({
      commandOptions: { force: true },
    });
    assert(onDeployed.init.called);

    await cli.planDestroy({
      commandOptions: { force: true },
    });
    assert(onDestroyed.init.called);
  });
  it("onDeployed and onDestroyed not called when apply fails", async function () {
    const onDeployed = { init: sinon.spy() };
    const onDestroyed = { init: sinon.spy() };

    const cli = await Cli({
      createStack: ({ createProvider }) => ({
        provider: createProvider(MockProvider, {
          config: config404,
          createResources,
        }),
        hooks: [
          () => ({
            name: "mock-test",
            onDeployed: {
              init: onDeployed.init,
            },
            onDestroyed: {
              init: onDestroyed.init,
            },
          }),
        ],
      }),
    });

    try {
      await cli.planApply({
        commandOptions: { force: true },
      });
      assert(false, "should not be here");
    } catch (error) {
      assert(error.error, tos(error));
    }

    assert(!onDeployed.init.called);

    try {
      await cli.planDestroy({
        commandOptions: { force: true, all: true },
      });
      assert(false, "should not be here");
    } catch (error) {
      const lives = error.error.lives.results;
      assert.equal(lives[0].results[0].error.response.status, 404);
    }

    assert(!onDestroyed.init.called);
  });
  it("planApply init throw ", async function () {
    const cli = await Cli({
      createStack: ({ createProvider }) => ({
        provider: createProvider(MockProvider, {
          createResources,
        }),
        hooks: [
          () => ({
            name: "mock-test",
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
          }),
        ],
      }),
    });

    try {
      const result = await cli.planApply({
        commandOptions: { force: true },
      });
      assert(false, "should not be here", result);
    } catch (exception) {
      //assert(error.results);
      const { error } = exception;
      assert(error.error);

      const { resultHooks } = error.resultDeploy;
      assert(resultHooks.error);
      assert(resultHooks.results[0].error);
    }
    try {
      await cli.planDestroy({
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
    const cli = await Cli({
      createStack: ({ createProvider }) => ({
        provider: createProvider(MockProvider, {
          createResources,
        }),
        hooks: [
          () => ({
            name: "mock-test",
            onDeployed: {
              init: () => {
                throw "i throw in onDeployed init";
              },
            },
          }),
        ],
      }),
    });

    try {
      await cli.planRunScript({
        commandOptions: { onDeployed: true },
      });
      assert(false, "should not be here");
    } catch ({ error }) {
      assert(error.error);
      assert(error.results[0].error);
    }
  });

  it("action throw ", async function () {
    const message = "i throw in a command";

    const cli = await Cli({
      createStack: ({ createProvider }) => ({
        provider: createProvider(MockProvider, { createResources }),
        hooks: [
          () => ({
            name: "mock-test",
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
          }),
        ],
      }),
    });

    try {
      await cli.planApply({
        commandOptions: { force: true },
      });
      assert(false, "should not be here");
    } catch (ex) {
      const { error } = ex;
      const { resultHooks } = error.resultDeploy;
      assert(resultHooks.error);
      assert(resultHooks.results[0].error);
    }
    try {
      await cli.planDestroy({
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
