const assert = require("assert");
const { ConfigLoader } = require("@grucloud/core/ConfigLoader");
const cliCommands = require("@grucloud/core/cli/cliCommands");

const MockStack1 = require("../mock/mock/iac");
const MockStack2 = require("../mock/mock-simple/iac");

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
    const stack1 = await MockStack1.createStack({ config });
    const stack2 = await MockStack2.createStack({ config });

    await cliCommands.planApply({
      infra: stack2,
      commandOptions: { force: true },
    });

    await cliCommands.planApply({
      infra: stack1,
      commandOptions: { force: true },
    });

    await cliCommands.planDestroy({
      infra: stack2,
      commandOptions: { force: true },
    });

    await cliCommands.planDestroy({
      infra: stack1,
      commandOptions: { force: true },
    });
  });
});
