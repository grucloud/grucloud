const assert = require("assert");
const { testEnd2End } = require("@grucloud/core/qa");
const { createStack } = require("../iac");
const path = require("path");
const config = require("../config.js");

describe("EC2 Instance", async function () {
  before(async function () {});
  it("run", async function () {
    await testEnd2End({
      programOptions: { workingDirectory: path.resolve(__dirname, "../") },
      createStack,
      steps: [
        { createStack, configs: [config] },
        {
          createStack,
          createResources: require("./resourcesUpdate1").createResources,
          configs: [config],
        },
        {
          createStack,
          createResources: require("./resourcesUpdate2").createResources,
          configs: [config],
        },
        {
          createStack,
          createResources: require("./resourcesUpdate3").createResources,
          configs: [config],
        },
        {
          createStack,
          createResources: require("./resourcesUpdate4").createResources,
          configs: [config],
        },
      ],
    });
  }).timeout(20 * 60e3);
});
