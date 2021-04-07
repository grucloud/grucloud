const assert = require("assert");
const { ConfigLoader } = require("@grucloud/core/ConfigLoader");
const cliCommands = require("@grucloud/core/cli/cliCommands");
const { createStack } = require("../example/iac");
const config = require("../example/config");

describe("AWS VPC Module", async function () {
  before(async function () {
    try {
      ConfigLoader({ path: "../../examples/multi" });
    } catch (error) {
      this.skip();
    }
  });
  it("run", async function () {
    const infra = await createStack({ config });

    await cliCommands.planDestroy({
      infra,
      commandOptions: { force: true },
    });
    await cliCommands.planApply({
      infra,
      commandOptions: { force: true },
    });
    await cliCommands.planDestroy({
      infra,
      commandOptions: { force: true },
    });
    // TODO list should be empty
    const result = await cliCommands.list({
      infra,
      commandOptions: { our: true },
    });
    assert(result);
  }).timeout(35 * 60e3);
});
