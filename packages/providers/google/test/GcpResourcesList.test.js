const assert = require("assert");
const path = require("path");
const { pipe, tap } = require("rubico");
const { callProp } = require("rubico/x");

const { GoogleProvider } = require("../GoogleProvider");

describe("GcpResourcesList", async function () {
  it("resourcesList", async function () {
    pipe([
      () =>
        GoogleProvider({
          config: () => ({}),
        }),
      callProp("resourcesList", {
        commandOptions: {
          output: path.resolve(
            __filename,
            "../../../../../bausaurus/docs/Providers/Google/GcpResources.md"
          ),
        },
      }),
    ])();
  });
});
