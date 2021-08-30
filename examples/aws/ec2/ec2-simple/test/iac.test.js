const assert = require("assert");
const { testEnd2End } = require("@grucloud/core/qa");
const { createStack } = require("../iac");
const path = require("path");
const config = require("../config.js");

describe("EC2 simple instance", async function () {
  before(async function () {});
  it("run", async function () {
    await testEnd2End({
      programOptions: { workingDirectory: path.resolve(__dirname, "../") },
      createStack,
      steps: [
        { createStack, configs: [config] },
        { createStack, configs: [require("./configUpdate1"), config] },
      ],
    });
  });
});
