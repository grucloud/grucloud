const assert = require("assert");
const path = require("path");
const { testEnd2End } = require("@grucloud/core/qa");

const { createStack } = require("../iac");
const config = require("../config.js");

describe("ECR Repository", async function () {
  it("run repository", async function () {
    await testEnd2End({
      programOptions: { workingDirectory: path.resolve(__dirname, "../") },
      steps: [
        { createStack, configs: [config] },
        { createStack, configs: [require("./configUpdate1.js")] },
        { createStack, configs: [require("./configUpdate2.js")] },
        { createStack, configs: [require("./configUpdate3.js")] },
      ],
    });
  });
});
