const { describe, it } = require("node:test");
const assert = require("assert");
const path = require("path");
const { testEnd2End } = require("@grucloud/core/qa");
const { createStack } = require("../iac");
const config = require("../config");

describe("Iam Test Example", async function () {
  it(
    "run",
    {
      timeout: 5 * 60e3,
    },
    async function () {
      await testEnd2End({
        programOptions: { workingDirectory: path.resolve(__dirname, "../") },
        steps: [{ createStack, configs: [config] }],
      });
    }
  );
});
