const assert = require("assert");
const path = require("path");
const { testEnd2End } = require("@grucloud/core/qa");
const { createStack } = require("../iac");
const config = require("../config.js");

describe("LaunchTemplate", async function () {
  before(async function () {});
  it("run", async function () {
    await testEnd2End({
      programOptions: { workingDirectory: path.resolve(__dirname, "../") },
      steps: [
        { createStack, configs: [config] },
        { createStack, configs: [require("./configUpdate1.js"), config] },
      ],
    });
  });
});
