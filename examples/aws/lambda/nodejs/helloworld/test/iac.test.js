const assert = require("assert");
const cli = require("@grucloud/core/cli/cliCommands");
const { createStack } = require("../iac");
const config = require("../config");

describe.skip("Lambda", async function () {
  before(async function () {});
  it("run", async function () {
    const infra = await createStack({ config });

    await cli.planDestroy({
      infra,
      commandOptions: { force: true },
    });
    await cli.planApply({
      infra,
      commandOptions: { force: true },
    });
    await cli.list({
      infra,
      commandOptions: { our: true, graph: true },
    });
    await cli.planDestroy({
      infra,
      commandOptions: { force: true },
    });
    // TODO list should be empty
    const result = await cli.list({
      infra,
      commandOptions: { our: true },
    });
    assert(result);
  });
});
