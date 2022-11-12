const assert = require("assert");
const pkg = require("../package.json");

const { testEnd2End } = require("@grucloud/core/qa");
const { createStack } = require("../iac");
const path = require("path");
const config = require("../config.js");
const title = pkg.name;

describe(title, async function () {
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
      ],
    });
  });
});
