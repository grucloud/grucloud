const assert = require("assert");
const { testEnd2End } = require("@grucloud/core/qa");
const { createStack } = require("../iac");
const config = require("../config");
const path = require("path");

describe("ECS Simple", async function () {
  before(async function () {});
  it("run", async function () {
    await testEnd2End({
      programOptions: { workingDirectory: path.resolve(__dirname, "../") },
      createStack,
      configs: [require("./configUpdate1.js")],
    });
  });
});
