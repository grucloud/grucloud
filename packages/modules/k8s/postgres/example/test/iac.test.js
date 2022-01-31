const path = require("path");
const { testEnd2End } = require("@grucloud/core/qa");
const { createStack } = require("../iac");
const config = require("../config");

const title = "K8S Postgres Module";

describe(title, async function () {
  it("run", async function () {
    await testEnd2End({
      programOptions: { workingDirectory: path.resolve(__dirname, "../") },
      title,
      destroyAll: false,
      steps: [{ createStack, configs: [config] }],
    });
  }).timeout(20 * 60e3);
});
