const assert = require("assert");
const { ConfigLoader } = require("@grucloud/core/ConfigLoader");
const { Cli } = require("@grucloud/core/cli/cli");
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
    const cli = await Cli({ createStack, config });

    await cli.planDestroy({
      commandOptions: { force: true },
    });
    await cli.planApply({
      commandOptions: { force: true },
    });
    await cli.planDestroy({
      commandOptions: { force: true },
    });
    // TODO list should be empty
    const result = await cli.list({
      commandOptions: { our: true },
    });
    assert(result);
  }).timeout(35 * 60e3);
});
