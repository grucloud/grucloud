const assert = require("assert");
const path = require("path");
const fs = require("fs").promises;
const { pipe, tap } = require("rubico");
const { callProp } = require("rubico/x");

const { K8sProvider } = require("../K8sProvider");

describe("K8sResourcesList", async function () {
  it("resourcesList", async function () {
    pipe([
      () => ({
        config: () => ({}),
      }),
      K8sProvider,
      callProp("resourcesList"),
      (content) =>
        fs.writeFile(
          path.resolve(
            __filename,
            "../../../../../bausaurus/docs/Providers/Kubernetes/Resources/K8sResources.md"
          ),
          content
        ),
    ])();
  });
});
