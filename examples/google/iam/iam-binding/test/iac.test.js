const assert = require("assert");
const { Cli } = require("@grucloud/core/cli/cliCommands");
const { createStack } = require("../iac");
const config = require("../config");

describe("Gcp Iam Binding", async function () {
  before(async function () {});
  it("run", async function () {
    const cli = await Cli({ createStack, config });

    await cli.planDestroy({
      commandOptions: { force: true },
    });
    await cli.planApply({
      commandOptions: { force: true },
    });
    await cli.list({
      commandOptions: { our: true, graph: true },
    });
    await cli.planDestroy({
      commandOptions: { force: true },
    });
    // TODO list should be empty
    const result = await cli.list({
      commandOptions: { our: true },
    });
    assert(result);
  });
});
