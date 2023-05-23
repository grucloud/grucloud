const { describe, it } = require("node:test");
const path = require("path");
const { testEnd2End } = require("@grucloud/core/qa");
const { createStack } = require("../iac");
const config = require("../config");

const title = "RDS Postgres Stateless";

describe(title, async function () {
  it(
    "run",
    {
      timeout: 35 * 60e3,
    },
    async function () {
      await testEnd2End({
        programOptions: { workingDirectory: path.resolve(__dirname, "../") },
        title,
        steps: [
          { createStack, configs: [config] },
          {
            createStack,
            createResources: require("./resourcesUpdate1").createResources,
            configs: [config],
          },
        ],
      });
    }
  );
});
