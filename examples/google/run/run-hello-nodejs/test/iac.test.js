const { describe, it } = require("node:test");
const pkg = require("../package.json");
const path = require("path");
const { testEnd2End } = require("@grucloud/core/qa");
const { createStack } = require("../iac");
const config = require("../config");

const title = pkg.name;

describe(title, async function () {
  it(
    "run",
    {
      timeout: 35 * 60e3,
    },
    async function () {
      await testEnd2End({
        title,
        programOptions: { workingDirectory: path.resolve(__dirname, "../") },
        steps: [
          { createStack, configs: [config] },
          // {
          //   createStack,
          //   createResources: require("./resourcesUpdate1").createResources,
          //   configs: [config],
          // },
        ],
      });
    }
  );
});
