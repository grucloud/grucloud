const assert = require("assert");
const { Cli, testEnd2End } = require("@grucloud/core/cli/cliCommands");
const path = require("path");
const { createStack } = require("../iac");
const config = require("../config");

describe("RDS Postgres", async function () {
  before(async function () {});
  it("run", async function () {
    const programOptions = { workingDirectory: path.resolve(__dirname, "../") };
    const cli = await Cli({ programOptions, createStack, config });

    await testEnd2End({
      cli,
      listOptions: {},
    });
  });
});
