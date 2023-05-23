const { describe, it } = require("node:test");
const path = require("path");
const { testEnd2End } = require("@grucloud/core/qa");
const { createStack } = require("../iac");
const config = require("../config");

const title = "EC2 Instance with Security Group";

describe(title, async function () {
  it(
    "run",
    {
      timeout: 10 * 60e3,
    },
    async function () {
      await testEnd2End({
        programOptions: { workingDirectory: path.resolve(__dirname, "../") },
        title,
        steps: [{ createStack, configs: [config] }],
      });
    }
  );
});
