const assert = require("assert");
const path = require("path");
const { ConfigLoader } = require("@grucloud/core/ConfigLoader");
const { Cli } = require("@grucloud/core/cli/cliCommands");
const { createStack } = require("../iac");

const title = "Certificate Module";

describe("Certificate Module", async function () {
  before(async function () {
    try {
      ConfigLoader({ path: "../../../../../examples/multi/" });
    } catch (error) {
      this.skip();
    }
  });
  it("run", async function () {
    const programOptions = { workingDirectory: path.resolve(__dirname, "../") };
    const cli = await Cli({ programOptions, createStack });

    await cli.graphTree({
      commandOptions: { title },
    });

    await cli.graphTarget({
      commandOptions: { title },
    });

    await cli.planDestroy({
      commandOptions: { force: true },
    });

    await cli.planApply({
      commandOptions: { force: true },
    });

    await cli.list({
      commandOptions: { our: true, graph: true, title },
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
