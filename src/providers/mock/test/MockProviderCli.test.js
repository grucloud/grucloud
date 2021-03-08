const assert = require("assert");
const { tryCatch, map, pipe } = require("rubico");
const { forEach } = require("rubico/x");
const { createResources } = require("./MockStack");
const { ConfigLoader } = require("ConfigLoader");
const prompts = require("prompts");
const sinon = require("sinon");

const { MockProvider } = require("../MockProvider");
const cliCommands = require("../../../cli/cliCommands");

const logger = require("logger")({ prefix: "MockProviderTest" });
const toJSON = (x) => JSON.stringify(x, null, 4);

describe("MockProviderCli", async function () {
  before(async () => {});
  it("init and uninit error", async function () {
    const config = ConfigLoader({ baseDir: __dirname });
    const provider = MockProvider({ config });
    const resources = await createResources({ provider });
    const infra = { provider };
    const errorMessage = "stub-error";

    provider.init = sinon
      .stub()
      .returns(Promise.reject({ message: errorMessage }));
    provider.unInit = sinon
      .stub()
      .returns(Promise.reject({ message: errorMessage }));

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
      await cliCommands.init({
        infra,
        commandOptions: {},
      });
      assert("should not be here");
    } catch (ex) {
      checkError(ex);
    }
    try {
      await cliCommands.unInit({
        infra,
        commandOptions: {},
      });
      assert("should not be here");
    } catch (ex) {
      checkError(ex);
    }
  });
  it("start error", async function () {
    const config = ConfigLoader({ baseDir: __dirname });
    const provider = MockProvider({ config });
    const errorMessage = "stub-error";

    provider.start = sinon
      .stub()
      .returns(Promise.reject({ message: errorMessage }));
    const resources = await createResources({ provider });
    const infra = { provider };

    await pipe([
      map(
        tryCatch(
          async ({ command, options = {} }) => {
            await cliCommands[command]({
              infra,
              commandOptions: options,
            });
            assert(false, `should not be here for command ${command}`);
          },
          (ex) => ex
        )
      ),
      forEach((ex) => {
        assert.equal(ex.code, 422);
        assert(ex.error);
        assert(ex.error.error);
        //assert(ex.error.result.resultStart);
      }),
    ])([
      { command: "list" },
      { command: "planQuery" },
      { command: "planApply" },
      { command: "planDestroy" },
      { command: "planRunScript", options: { onDeployed: true } },
    ]);
  });
  it("abort deploy and destroy", async function () {
    const config = ConfigLoader({ baseDir: __dirname });
    const provider = MockProvider({ config });
    const resources = await createResources({ provider });
    const infra = { provider, resources };

    {
      const info = await cliCommands.info({
        infra,
        commandOptions: {},
      });
      assert(!info.error);
      assert(info.results);
    }
    {
      const init = await cliCommands.init({
        infra,
        commandOptions: {},
      });
      assert(!init.error);
    }
    {
      const unInit = await cliCommands.unInit({
        infra,
        commandOptions: {},
      });
      assert(!unInit.error);
    }
    {
      const output = await cliCommands.output({
        infra,
        commandOptions: { type: "Ip", name: "myip", field: "id" },
      });
      assert(!output);
    }
    {
      const result = await cliCommands.planDestroy({
        infra,
        commandOptions: { force: true, name: "volume" },
      });
      assert(!result.error);
      assert.equal(
        result.resultQueryDestroy.results[0].plans[0].resource.name,
        "volume"
      );
    }
    const resultDestroy = await cliCommands.planDestroy({
      infra,
      commandOptions: { force: true },
    });

    prompts.inject([false]);

    await cliCommands.planApply({
      infra,
    });

    prompts.inject([true]);

    await cliCommands.planApply({
      infra,
    });
    {
      const output = await cliCommands.output({
        infra,
        commandOptions: { type: "Ip", name: "myip", field: "id" },
        programOptions: {},
      });
      assert(output);
    }
    prompts.inject([false]);
    await cliCommands.planDestroy({
      infra,
    });

    prompts.inject([true]);
    {
      const result = await cliCommands.planDestroy({
        infra,
      });
      assert(result);
    }
    {
      const result = await cliCommands.list({
        infra,
        commandOptions: { our: true },
      });
      assert(result);
    }
  });
});
