const assert = require("assert");
const path = require("path");
const { ConfigLoader } = require("@grucloud/core/ConfigLoader");
const { Cli } = require("@grucloud/core/cli/cliCommands");
const { createStack } = require("../iac");

describe("EKS Module", async function () {
  before(async function () {
    try {
      ConfigLoader({ path: "../../examples/multi" });
    } catch (error) {
      this.skip();
    }
  });
  it("run", async function () {
    const programOptions = { workingDirectory: path.resolve(__dirname, "../") };
    const cli = await Cli({ programOptions, createStack });

    await cli.graphTree({
      commandOptions: {},
    });

    await cli.graphTarget({
      commandOptions: {},
    });

    await cli.planDestroy({
      commandOptions: { force: true },
    });
    await cli.planQuery({});
    await cli.planApply({
      commandOptions: { force: true },
    });
    await cli.planApply({
      commandOptions: {},
    });
    await cli.planQuery({});
    await cli.planRunScript({
      commandOptions: { onDeployed: true },
    });
    await cli.planDestroy({
      commandOptions: { force: true },
    });
    await cli.planRunScript({
      commandOptions: { onDestroyed: true },
    });
    await cli.planDestroy({
      commandOptions: {},
    });
    // TODO list should be empty
    const result = await cli.list({
      commandOptions: { our: true },
    });
    assert(result);
  }).timeout(35 * 60e3);
});
