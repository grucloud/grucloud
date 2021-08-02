const assert = require("assert");
const { Cli } = require("@grucloud/core/cli/cliCommands");
const path = require("path");
const { createStack } = require("../iac");
const config = require("../config");

describe("RDS Postgres", async function () {
  before(async function () {});
  it("run", async function () {
    const programOptions = { workingDirectory: path.resolve(__dirname, "../") };
    const cli = await Cli({ programOptions, createStack, config });

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
