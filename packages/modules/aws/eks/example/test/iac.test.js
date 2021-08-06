const assert = require("assert");
const path = require("path");
const { ConfigLoader } = require("@grucloud/core/ConfigLoader");
const { Cli, testEnd2End } = require("@grucloud/core/cli/cliCommands");
const { createStack } = require("../iac");

const title = "EKS Module";
describe(title, async function () {
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

    await testEnd2End({
      cli,
      title,
    });
  }).timeout(35 * 60e3);
});
