const assert = require("assert");
const { AzureProvider } = require("../AzureProvider");
const { ConfigLoader } = require("@grucloud/core/ConfigLoader");

const {
  testPlanDeploy,
  testPlanDestroy,
} = require("@grucloud/core/E2ETestUtils");

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
      config = ConfigLoader({ path: "../../../examples/multi" });
      assert(config);
    } catch (error) {
      this.skip();
    }
    provider = AzureProvider({
      name: "azure",
      config: () => ({ location: "uksouth" }),
    });
    resourceGroup = provider.makeResourceGroup({ name: rgName });
    virtualNetwork = provider.makeVirtualNetwork({
      name: vnName,
      dependencies: { resourceGroup },
      properties: () => ({
        properties: {
          addressSpace: { addressPrefixes: ["10.0.0.0/16"] },
          subnets: [
            {
              name: subnetName,
              properties: { addressPrefix: "10.0.0.0/24" },
            },
          ],
        },
      }),
    });
    securityGroup = provider.makeSecurityGroup({
      name: `security-group`,
      dependencies: { resourceGroup },
      properties: () => ({
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
      }),
    });
    const publicIpAddress = provider.makePublicIpAddress({
      name: `ip`,
      dependencies: {
        resourceGroup,
      },
      properties: () => ({
        properties: {
          publicIPAllocationMethod: "Dynamic",
        },
      }),
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
      properties: () => ({
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
      }),
    });

    const { MACHINE_ADMIN_USERNAME, MACHINE_ADMIN_PASSWORD } = process.env;
    assert(MACHINE_ADMIN_USERNAME);
    assert(MACHINE_ADMIN_PASSWORD);

    const vm = provider.makeVirtualMachine({
      name: `vm`,
      dependencies: {
        resourceGroup,
        networkInterface,
      },
      properties: () => ({
        properties: {
          hardwareProfile: {
            vmSize: "Standard_A1_v2",
          },
          storageProfile: {
            imageReference: {
              // az vm image list
              offer: "UbuntuServer",
              publisher: "Canonical",
              sku: "18.04-LTS",
              version: "latest",
            },
          },
          osProfile: {
            adminUsername: MACHINE_ADMIN_USERNAME,
            computerName: "myVM",
            adminPassword: MACHINE_ADMIN_PASSWORD,
          },
        },
      }),
    });
  });
  after(async () => {});
  it("az info", async function () {
    const info = provider.info();
    assert(info.subscriptionId);
    assert(info.tenantId);
    assert(info.appId);
  });
  it.skip("az apply and destroy", async function () {
    await testPlanDeploy({ provider, full: true });
    await testPlanDestroy({ provider, full: true });
  });
});
