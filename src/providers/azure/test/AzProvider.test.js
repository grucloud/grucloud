const assert = require("assert");
const AzureProvider = require("../AzureProvider");
const { ConfigLoader } = require("ConfigLoader");

const {
  testPlanDeploy,
  testPlanDestroy,
} = require("../../../test/E2ETestUtils");

describe("AzProvider", async function () {
  const rgName = "resource-group";
  const vnName = "virtualNetwork";
  const subnetName = "subnet";
  let config;
  let provider;
  let resourceGroup;
  let virtualNetwork;

  before(async function () {
    try {
      config = ConfigLoader({ baseDir: __dirname });
    } catch (error) {
      this.skip();
    }
    provider = await AzureProvider({
      name: "azure",
      config,
    });
    resourceGroup = provider.makeResourceGroup({ name: rgName });
    virtualNetwork = provider.makeVirtualNetwork({
      name: vnName,
      dependencies: { resourceGroup },
      properties: {
        addressSpace: { addressPrefixes: ["10.0.0.0/16"] },
        subnets: [
          {
            name: `${subnetName}-${stage}`,
            properties: { addressPrefix: "10.0.0.0/24" },
          },
        ],
      },
    });
    const { success } = await provider.destroyAll();
    assert(success, "destroyAll ko");
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
