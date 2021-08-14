const assert = require("assert");
const { testEnd2End } = require("@grucloud/core/qa");
const { createStack } = require("../iac");
const path = require("path");

describe("ECR Repository", async function () {
  it("run repository", async function () {
    await testEnd2End({
      programOptions: { workingDirectory: path.resolve(__dirname, "../") },
      createStack,
      configs: [
        require("./configUpdate1.js"),
        require("./configUpdate2.js"),
        require("../config.js"),
      ],
    });
  });
});
