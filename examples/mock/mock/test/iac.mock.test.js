const assert = require("assert");
const { ConfigLoader } = require("@grucloud/core/ConfigLoader");
const { Cli } = require("@grucloud/core/cli/cliCommands");

const MockStack1 = require("../iac");
const MockStack2 = require("../../mock-simple/iac");

describe("Mock Multi", async function () {
  let config;

  before(async function () {
    try {
      config = ConfigLoader({ path: "examples/multi" });
    } catch (error) {
      this.skip();
    }
  });
  it("run mocks example", async function () {
    const cli1 = await Cli({ createStack: MockStack1.createStack, config });
    const cli2 = await Cli({ createStack: MockStack2.createStack, config });

    await cli2.planApply({
      commandOptions: { force: true },
    });

    await cli1.planApply({
      commandOptions: { force: true },
    });

    await cli2.planDestroy({
      commandOptions: { force: true },
    });

    await cli1.planDestroy({
      commandOptions: { force: true },
    });
  });
});
