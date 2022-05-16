const pkg = require("../package.json");
const path = require("path");
const { testEnd2End } = require("@grucloud/core/qa");
const { createStack } = require("../iac");
const config = require("../config");

const title = pkg.name;

describe.skip(title, async function () {
  it("run", async function () {
    await testEnd2End({
      programOptions: { workingDirectory: path.resolve(__dirname, "../") },
      title,
      steps: [
        { createStack, configs: [config] },
        // {
        //   createStack,
        //   createResources: require("./resourcesUpdate1").createResources,
        //   configs: [config],
        // },
      ],
    });
  }).timeout(10 * 60e3);
});
