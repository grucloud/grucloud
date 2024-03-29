const assert = require("assert");
const { AzureProvider } = require("../AzureProvider");
const { ConfigLoader } = require("@grucloud/core");

const {
  testPlanDeploy,
  testPlanDestroy,
} = require("@grucloud/core/E2ETestUtils");

describe("AzResourceGroup", async function () {
  let config;
  const rgName = "dev-resource-group";
  let provider;
  let rg;
  before(async function () {
    try {
      config = ConfigLoader({ path: "examples/azure" });
    } catch (error) {
      this.skip();
    }
    provider = AzureProvider({
      name: "azure",
      config,
    });
    rg = provider.makeResourceGroup({ name: rgName });
  });
  after(async () => {});
  it.skip("az rg apply and destroy", async function () {
    await testPlanDeploy({ provider });
    await testPlanDestroy({ provider });
  });
});
