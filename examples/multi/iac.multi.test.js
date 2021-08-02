const assert = require("assert");
const { ConfigLoader } = require("@grucloud/core/ConfigLoader");
const { Cli } = require("@grucloud/core/cli/cli");

const cli = require("@grucloud/core/cli/cli");
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
    const cli = await Cli({ createStack, config });

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
