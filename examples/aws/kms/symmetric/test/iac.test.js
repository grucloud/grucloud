const assert = require("assert");
const { Cli, testEnd2End } = require("@grucloud/core/cli/cliCommands");
const { createStack } = require("../iac");
const path = require("path");

describe("KMS Symmetric key", async function () {
  before(async function () {});
  it("run", async function () {
    const programOptions = { workingDirectory: path.resolve(__dirname, "../") };
    const cli = await Cli({ programOptions, createStack });

    await testEnd2End({
      cli,
      listOptions: { types: ["Key"] },
    });
  }).timeout(15 * 60e3);
});
