const { AzureProvider } = require("@grucloud/core");

const createStack = async ({ config }) => {
  const { stage, machine } = config;
  // Create an Azure provider
  const provider = await AzureProvider({ name: "azure", config });
  const rg = provider.makeResourceGroup({
    name: `resource-group-${stage}`,
  });

  // https://docs.microsoft.com/en-us/rest/api/virtualnetwork/virtualnetworks/createorupdate#request-body
  const vnet = provider.makeVirtualNetwork({
    name: `virtual-network-${stage}`,
    dependencies: { resourceGroup: rg },
    properties: {
      properties: {
        addressSpace: { addressPrefixes: ["10.0.0.0/16"] },
        subnets: [
          {
            name: `subnet-${stage}`,
            properties: {
              addressPrefix: "10.0.0.0/24",
            },
          },
        ],
      },
    },
  });

  // https://docs.microsoft.com/en-us/rest/api/virtualnetwork/networksecuritygroups/createorupdate#request-body
  const sg = provider.makeSecurityGroup({
    name: `security-group-${stage}`,
    dependencies: { resourceGroup: rg },
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

  // https://docs.microsoft.com/en-us/rest/api/virtualnetwork/publicipaddresses/createorupdate#request-body
  const publicIpAddress = provider.makePublicIpAddress({
    name: `ip-${stage}`,
    dependencies: {
      resourceGroup: rg,
    },
    properties: {
      properties: {
        publicIPAllocationMethod: "Dynamic",
      },
    },
  });
  // https://docs.microsoft.com/en-us/rest/api/virtualnetwork/networkinterfaces/createorupdate#request-body
  const networkInterface = provider.makeNetworkInterface({
    name: `network-interface-${stage}`,
    dependencies: {
      resourceGroup: rg,
      virtualNetwork: vnet,
      securityGroup: sg,
      subnet: `subnet-${stage}`,
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

  const vm = provider.makeVirtualMachine({
    name: `vm-${stage}`,
    dependencies: {
      resourceGroup: rg,
      networkInterface: networkInterface,
    },
    properties: {
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
          adminUsername: machine.adminUsername,
          computerName: "myVM",
          adminPassword: machine.adminPassword,
        },
      },
    },
  });
  return { providers: [provider] };
};

module.exports = createStack;
