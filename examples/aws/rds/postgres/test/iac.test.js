const assert = require("assert");
const { Cli, testEnd2End } = require("@grucloud/core/cli/cliCommands");
const path = require("path");
const { createStack } = require("../iac");

describe("RDS Postgres", async function () {
  before(async function () {});
  it("run", async function () {
    const programOptions = { workingDirectory: path.resolve(__dirname, "../") };
    const cli = await Cli({ programOptions, createStack });

    await testEnd2End({ cli });
  }).timeout(20 * 60e3);
});
