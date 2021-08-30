const assert = require("assert");
const path = require("path");
const { testEnd2End } = require("@grucloud/core/qa");
const { createStack } = require("../iac");
const config = require("../config");

describe("Gcp VM in network", async function () {
  it("run", async function () {
    await testEnd2End({
      programOptions: { workingDirectory: path.resolve(__dirname, "../") },
      steps: [{ createStack, configs: [config] }],
    });
  }).timeout(35 * 60e3);
});
