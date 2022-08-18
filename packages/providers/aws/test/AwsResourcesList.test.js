const assert = require("assert");
const path = require("path");
const { pipe, tap } = require("rubico");
const { callProp } = require("rubico/x");

const { AwsProvider } = require("../AwsProvider");

describe("AwsResourcesList", async function () {
  it.only("resourcesList", async function () {
    pipe([
      () =>
        AwsProvider({
          config: () => ({ region: "us-west-2" }),
        }),
      callProp("resourcesList", {
        commandOptions: {
          output: path.resolve(
            __filename,
            "../../../../../docusaurus/docs/aws/AwsResources.md"
          ),
        },
      }),
    ])();
  });
});
