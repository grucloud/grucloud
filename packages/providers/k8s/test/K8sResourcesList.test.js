const assert = require("assert");
const path = require("path");
const { pipe, tap } = require("rubico");
const { callProp } = require("rubico/x");

const { K8sProvider } = require("../K8sProvider");

describe("K8sResourcesList", async function () {
  it("resourcesList", async function () {
    pipe([
      () =>
        K8sProvider({
          config: () => ({}),
        }),
      callProp("resourcesList", {
        commandOptions: {
          output: path.resolve(
            __filename,
            "../../../../../bausaurus/docs/Providers/k8s/K8sResources.md"
          ),
        },
      }),
    ])();
  });
});
