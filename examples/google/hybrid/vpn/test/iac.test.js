const pkg = require("../package.json");
const path = require("path");
const { testEnd2End } = require("@grucloud/core/qa");
const { createStack } = require("../iac");
const config = require("../config");

const title = pkg.name;

describe.skip(title, async function () {
  it("run", async function () {
    await testEnd2End({
      title,
      programOptions: { workingDirectory: path.resolve(__dirname, "../") },
      steps: [{ createStack, configs: [config] }],
    });
  }).timeout(35 * 60e3);
});
