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

    await cliCommands.planDestroy({
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
