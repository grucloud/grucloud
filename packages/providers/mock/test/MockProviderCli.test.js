const assert = require("assert");
const { tryCatch, map, pipe, tap } = require("rubico");
const { forEach, pluck } = require("rubico/x");
const { createResources } = require("./MockStack");
const prompts = require("prompts");
const sinon = require("sinon");

const { MockProvider } = require("../MockProvider");
const { Cli } = require("@grucloud/core/cli/cliCommands");

describe("MockProviderCli", async function () {
  before(async () => {});
  it("init and uninit error", async function () {
    const errorMessage = "stub-error";

    const cli = await Cli({
      createStack: ({ createProvider }) => ({
        provider: pipe([
          () =>
            createProvider(MockProvider, {
              config: () => ({}),
              createResources,
            }),
          tap((provider) => {
            provider.init = sinon
              .stub()
              .returns(Promise.reject({ message: errorMessage }));
            provider.unInit = sinon
              .stub()
              .returns(Promise.reject({ message: errorMessage }));
          }),
        ])(),
      }),
    });

    const checkError = ({ code, error }) => {
      assert.equal(code, 422);
      assert(error.error);
      assert.equal(error.results.length, 1);
      const result = error.results[0];
      assert(result.error);
      assert.equal(result.error.message, errorMessage);
      assert(result.provider);
    };
    try {
      await cli.init({
        commandOptions: {},
      });
      assert("should not be here");
    } catch (ex) {
      checkError(ex);
    }
    try {
      await cli.unInit({
        commandOptions: {},
      });
      assert("should not be here");
    } catch (ex) {
      checkError(ex);
    }
  });
  it("start error", async function () {
    const errorMessage = "stub-error";
    const cli = await Cli({
      createStack: ({ createProvider }) => ({
        provider: pipe([
          () =>
            createProvider(MockProvider, {
              config: () => ({}),
              createResources,
            }),
          tap((provider) => {
            provider.start = sinon
              .stub()
              .returns(Promise.reject({ message: errorMessage }));
          }),
        ])(),
      }),
    });

    await pipe([
      () => [
        { command: "list" },
        { command: "planQuery" },
        { command: "planApply" },
        { command: "planDestroy" },
        // TODO graph
        // TODO live { command: "planRunScript", options: { onDeployed: true } },
      ],
      map.series(
        tryCatch(
          async ({ command, options = {} }) => {
            const result = await cli[command]({
              commandOptions: options,
            });
            assert(result.error);
            assert(false, `should not be here for command ${command}`);
          },
          (ex, { command }) => {
            assert(command);
            return ex;
          }
        )
      ),
      forEach((ex) => {
        assert.equal(ex.code, 422);
        assert(ex.error);
        assert(ex.error.start.error);
        //assert(ex.error.result.resultStart);
      }),
    ])();
  });
  it("delete with multiple ids", async function () {
    const cli = await Cli({
      createStack: ({ createProvider }) => ({
        provider: pipe([
          () =>
            createProvider(MockProvider, {
              config: () => ({}),
              createResources,
            }),
        ])(),
      }),
    });
    const result = await cli.list({
      commandOptions: {},
    });
    const { resources } = result.lives.results[0].results[0];
    assert(resources);
    const ids = pluck("id")(resources);
    const resultDestroy = await cli.planDestroy({
      commandOptions: { force: true, id: ids },
    });
    assert(resultDestroy);
  });

  it("abort deploy and destroy", async function () {
    const cli = await Cli({
      createStack: ({ createProvider }) => ({
        provider: pipe([
          () =>
            createProvider(MockProvider, {
              config: () => ({}),
              createResources,
            }),
        ])(),
      }),
    });
    {
      const info = await cli.info({
        commandOptions: {},
      });
      assert(!info.error);
      assert(info.results);
    }
    {
      const init = await cli.init({
        commandOptions: {},
      });
      assert(!init.error);
    }
    {
      const unInit = await cli.unInit({
        commandOptions: {},
      });
      assert(!unInit.error);
    }
    {
      const result = await cli.planDestroy({
        commandOptions: { force: true, name: "volume" },
      });
      assert(!result.error);
      assert.equal(
        result.resultQueryDestroy.results[0].plans[0].resource.name,
        "volume"
      );
    }
    const resultDestroy = await cli.planDestroy({
      commandOptions: { force: true },
    });

    prompts.inject([false]);

    await cli.planApply({});

    prompts.inject([true]);

    const resApply = await cli.planApply({});
    assert(resApply);

    prompts.inject([false]);
    await cli.planDestroy({ commandOptions: {} });

    prompts.inject([true]);
    {
      const result = await cli.planDestroy({ commandOptions: {} });
      assert(result);
    }
    {
      const result = await cli.list({
        commandOptions: { our: true },
      });
      assert(result);
    }
  });
});
