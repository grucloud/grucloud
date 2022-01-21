const assert = require("assert");
const { pipe, tap, get } = require("rubico");
const path = require("path");
const { AzureProvider } = require("../AzureProvider");
const { ConfigLoader } = require("@grucloud/core/ConfigLoader");
const { Cli } = require("@grucloud/core/cli/cliCommands");

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
    } catch (error) {
      this.skip();
    }
    provider = AzureProvider({
      name: "azure",
      config: () => ({ location: "canadacentral" }),
    });
    resourceGroup = provider.Resources.makeResourceGroup({
      name: rgName,
    });
    virtualNetwork = provider.Network.makeVirtualNetwork({
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
    securityGroup = provider.Network.makeNetworkSecurityGroup({
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
    const publicIpAddress = provider.Network.makePublicIPAddress({
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
    const networkInterface = provider.Network.makeNetworkInterface({
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

    // const { MACHINE_ADMIN_USERNAME, MACHINE_ADMIN_PASSWORD } = process.env;
    // assert(MACHINE_ADMIN_USERNAME);
    // assert(MACHINE_ADMIN_PASSWORD);

    const vm = provider.Compute.makeVirtualMachine({
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
    const programOptions = {
      workingDirectory: path.resolve(__dirname, "../../../../examples/multi"),
    };

    const cli = await Cli({
      programOptions,
      createStack: () => ({ provider }),
      config,
    });
    pipe([
      cli.info,
      get("results[0]"),
      (info) => {
        assert(info.subscriptionId);
        assert(info.tenantId);
        assert(info.appId);
      },
    ])();
  });
  it.skip("az apply and destroy", async function () {
    await testPlanDeploy({ provider, full: true });
    await testPlanDestroy({ provider, full: true });
  });
});
