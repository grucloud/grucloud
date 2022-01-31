const path = require("path");
const { testEnd2End } = require("@grucloud/core/qa");
const { createStack } = require("../iac");

const title = "K8s Service Account Aws Role";

describe.skip(title, async function () {
  it("run", async function () {
    await testEnd2End({
      programOptions: { workingDirectory: path.resolve(__dirname, "../") },
      title,
      destroyAll: false,
      steps: [{ createStack, configs: [] }],
    });
  }).timeout(10 * 60e3);
});
