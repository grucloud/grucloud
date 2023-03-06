const pkg = require("../package.json");
const path = require("path");
const { testEnd2End } = require("@grucloud/core/qa");
const { createStack } = require("../iac");
const config = require("../config");

const title = pkg.name;

describe(title, async function () {
  it("run", async function () {
    await testEnd2End({
      programOptions: {
        download: true,
        workingDirectory: path.resolve(__dirname, "../"),
      },
      commandOptions: { download: true },
      title,
      steps: [{ createStack, configs: [config] }],
    });
  }).timeout(30 * 60e3);
});
