const assert = require("assert");
const AzureProvider = require("../AzureProvider");
const { ConfigLoader } = require("ConfigLoader");

const {
  testPlanDeploy,
  testPlanDestroy,
} = require("../../../test/E2ETestUtils");

describe.skip("AzProvider", async function () {
  const rgName = "dev-resource-group";
  const vnName = "virtualNetwork";
  let provider;
  let resourceGroup;
  let virtualNetwork;
  before(async function () {
    try {
      provider = await AzureProvider({
        name: "azure",
        config: ConfigLoader({ baseDir: __dirname }),
      });
      resourceGroup = provider.makeResourceGroup({ name: rgName });
      virtualNetwork = provider.makeVirtualNetwork({
        name: vnName,
        dependencies: { resourceGroup },
        // https://docs.microsoft.com/en-us/rest/api/virtualnetwork/virtualnetworks/createorupdate#request-body
        properties: {
          addressSpace: { addressPrefixes: ["10.0.0.0/16"] },
        },
      });
      await provider.destroyAll();
    } catch (error) {
      assert(error.code, 422);
      this.skip();
    }
  });
  after(async () => {
    await provider?.destroyAll();
  });
  it("plan", async function () {
    const plan = await provider.planQuery();
    assert.equal(plan.destroy.length, 0);
    assert.equal(plan.newOrUpdate.length, 2);
  });
  it("apply and destroy", async function () {
    await testPlanDeploy({ provider });
    //TODO check address_space
    await testPlanDestroy({ provider });
  });
});
