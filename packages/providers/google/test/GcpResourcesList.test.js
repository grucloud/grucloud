const assert = require("assert");
const path = require("path");
const fs = require("fs").promises;
const { pipe, tap } = require("rubico");
const { callProp } = require("rubico/x");

const { GoogleProvider } = require("../GoogleProvider");

describe("GcpResourcesList", async function () {
  it("resourcesList", async function () {
    pipe([
      () => ({
        config: () => ({}),
      }),
      GoogleProvider,
      callProp("resourcesList"),
      (content) =>
        fs.writeFile(
          path.resolve(
            __filename,
            "../../../../../bausaurus/docs/Providers/Google/Resources/GcpResources.md"
          ),
          content
        ),
    ])();
  });
});
