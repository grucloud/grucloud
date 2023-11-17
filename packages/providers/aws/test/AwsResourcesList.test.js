const assert = require("assert");
const path = require("path");
const fs = require("fs").promises;
const { pipe, tap } = require("rubico");
const { callProp } = require("rubico/x");

const { AwsProvider } = require("../AwsProvider");

describe("AwsResourcesList", async function () {
  it("resourcesList", () =>
    pipe([
      () => ({
        config: () => ({ region: "us-east-1", includeAllResources: true }),
      }),
      AwsProvider,
      callProp("resourcesList"),
      (content) =>
        fs.writeFile(
          path.resolve(
            __filename,
            "../../../../../bausaurus/docs/Providers/AWS/Resources/AwsResources.md"
          ),
          content
        ),
    ])());
});
