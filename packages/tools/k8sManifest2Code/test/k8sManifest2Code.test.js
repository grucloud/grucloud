const assert = require("assert");
const path = require("path");
const { map, pipe, tap, tryCatch } = require("rubico");
const { main } = require("../k8s-manifest2code");
describe("K8sManifest2Code", function () {
  before(async function () {});

  after(async function () {});
  it("dashboad", async () => {
    await main({
      input: path.resolve(__dirname, "web-ui-dashboard.yaml"),
      output: path.resolve(__dirname, "web-ui-dashboard-resources.js"),
    });
  });
});
