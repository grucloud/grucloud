const { describe, it } = require("node:test");
const pkg = require("../package.json");
const path = require("path");
const { testEnd2End } = require("@grucloud/core/qa");
const { createStack } = require("../iac");
const config = require("../config");

const title = pkg.name;

describe(title, async function () {
  it("run", { timeout: 30 * 60e3 }, async function () {
    await testEnd2End({
      programOptions: { workingDirectory: path.resolve(__dirname, "../") },
      title,
      steps: [{ createStack, configs: [config] }],
    });
  });
});
