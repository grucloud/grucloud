const assert = require("assert");
const path = require("path");
const fs = require("fs").promises;
const { pipe, tap } = require("rubico");
const { callProp } = require("rubico/x");

const { AzureProvider } = require("../AzureProvider");

describe("AzResourcesList", async function () {
  it("resourcesList", async function () {
    pipe([
      () => ({
        config: () => ({}),
      }),
      AzureProvider,
      callProp("resourcesList"),
      (content) =>
        fs.writeFile(
          path.resolve(
            __filename,
            "../../../../../bausaurus/docs/Providers/Azure/Resources/AzureResources.md"
          ),
          content
        ),
    ])();
  });
});
