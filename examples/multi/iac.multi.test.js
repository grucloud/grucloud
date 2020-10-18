const assert = require("assert");
const { ConfigLoader } = require("ConfigLoader");
const cliCommands = require("../../src/cli/cliCommands");
const { createStack } = require("./iac");

describe("Multi Example", async function () {
  let config;

  before(async function () {
    try {
      config = ConfigLoader({ path: "examples/multi" });
    } catch (error) {
      this.skip();
    }
  });
  it("run multi example", async function () {
    const infra = await createStack({ config });

    await cliCommands.planDestroy({
      infra,
      commandOptions: { force: true, all: true },
    });
    await cliCommands.planQuery({ infra });
    await cliCommands.planApply({
      infra,
      commandOptions: { force: true },
    });
    await cliCommands.planApply({
      infra,
      commandOptions: {},
    });
    await cliCommands.planQuery({ infra });
    await cliCommands.planRunScript({
      infra,
      commandOptions: { onDeployed: true },
    });
    await cliCommands.planDestroy({
      infra,
      commandOptions: { force: true },
    });
    await cliCommands.planRunScript({
      infra,
      commandOptions: { onDestroyed: true },
    });
    await cliCommands.planDestroy({
      infra,
      commandOptions: {},
    });
    await cliCommands.list({
      infra,
      commandOptions: {},
    });
  }).timeout(1500e3);
});
