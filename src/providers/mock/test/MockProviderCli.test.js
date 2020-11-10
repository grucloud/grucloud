const assert = require("assert");
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
  it("abort deploy and destroy", async function () {
    const config = ConfigLoader({ baseDir: __dirname });
    const provider = MockProvider({ config });
    const resources = await createResources({ provider });
    const infra = { provider };

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
        commandOptions: { name: "myip", field: "id" },
      });
      assert(!output);
    }
    const { plans, results } = await cliCommands.planDestroy({
      infra,
      commandOptions: { force: true, name: "volume" },
    });
    assert.equal(plans[0].resource.name, "volume");

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
        commandOptions: { name: "myip", field: "id" },
        programOptions: {},
      });
      assert(output);
    }
    prompts.inject([false]);
    await cliCommands.planDestroy({
      infra,
    });

    prompts.inject([true]);
    await cliCommands.planDestroy({
      infra,
    });

    await cliCommands.list({
      infra,
      commandOptions: { our: true },
    });
  });
});
