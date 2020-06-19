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
  let securityGroup;

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
        properties: {
          addressSpace: { addressPrefixes: ["10.0.0.0/16"] },
          subnets: [
            {
              name: subnetName,
              properties: { addressPrefix: "10.0.0.0/24" },
            },
          ],
        },
      },
    });
    securityGroup = provider.makeSecurityGroup({
      name: `security-group`,
      dependencies: { resourceGroup },
      properties: {
        properties: {
          securityRules: [
            {
              name: "SSH",
              properties: {
                access: "Allow",
                direction: "Inbound",
                protocol: "Tcp",
                destinationPortRange: "22",
                destinationAddressPrefix: "*",
                sourcePortRange: "*",
                sourceAddressPrefix: "*",
                priority: 1000,
              },
            },
          ],
        },
      },
    });
    const publicIpAddress = provider.makePublicIpAddress({
      name: `ip`,
      dependencies: {
        resourceGroup,
      },
      properties: {
        properties: {
          publicIPAllocationMethod: "Dynamic",
        },
      },
    });
    const networkInterface = provider.makeNetworkInterface({
      name: `network-interface`,
      dependencies: {
        resourceGroup,
        virtualNetwork,
        securityGroup,
        subnet: subnetName,
        publicIpAddress,
      },
      properties: {
        properties: {
          ipConfigurations: [
            {
              name: "ipconfig",
              properties: {
                privateIPAllocationMethod: "Dynamic",
              },
            },
          ],
        },
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
    assert.equal(plan.newOrUpdate.length, 5);
  });
  it("apply and destroy", async function () {
    await testPlanDeploy({ provider });
    //TODO check address_space
    await testPlanDestroy({ provider });
  });
});
