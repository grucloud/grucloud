const assert = require("assert");
const { createResources } = require("./MockStack");
const { ConfigLoader } = require("ConfigLoader");
const prompts = require("prompts");

const { MockProvider } = require("../MockProvider");
const cliCommands = require("../../../cli/cliCommands");

const logger = require("logger")({ prefix: "MockProviderTest" });
const toJSON = (x) => JSON.stringify(x, null, 4);

describe("MockProviderCli", async function () {
  before(async () => {});

  it("abort deploy and destroy", async function () {
    const config = ConfigLoader({ baseDir: __dirname });
    const provider = await MockProvider({ config });
    const resources = await createResources({ provider });
    const infra = { providers: [provider] };

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
