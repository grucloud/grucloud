---
id: AzureGettingStarted
title: Azure Getting Started
---

Let's create a simple infrastructure with the following resources:

- [Resource Group](./resources/ResourceGroup)
- [Virtual Network](./resources/VirtualNetwork)
- [Security Group](./resources/SecurityGroup)
- [Public Ip Address](./resources/PublicIpAddress)
- [Network Interface](./resources/NetworkInterface)
- [Virtual Machine](./resources/VirtualMachine)

First of all, ensure all the Azure prerequisites has been met: [AzureRequirements](./AzureRequirements.md)

## Getting the code

Install the grucloud command line utility: **gc**

```bash
npm i -g @grucloud/core
```

Clone the code and go to one of the azure examples:

```bash
git clone git@github.com:grucloud/grucloud.git
```

```bash
cd grucloud/examples/azure/vm
```

```bash
npm install
```

### Environment

Create **default.env** and set the correct values:

```sh
TENANT_ID=
SUBSCRIPTION_ID=
APP_ID=
PASSWORD=
MACHINE_ADMIN_USERNAME=
MACHINE_ADMIN_PASSWORD=
```

> See [AzureRequirements](./AzureRequirements.md) to retrieve these informations

### Config

Edit **config.js** and set the location:

```js
module.exports = () => ({
  location: "uksouth",
});
```

To find out the list of locations:

```
az account list-locations -o table
```

Now it is time to edit the infrastructure **iac.js** file that describes the architecture.

```js
const assert = require("assert");
const { AzureProvider } = require("@grucloud/provider-azure");

exports.createStack = async ({ createProvider }) => {
  // Create an Azure provider
  const provider = createProvider(AzureProvider, {
    config: require("./config"),
  });
  // https://docs.microsoft.com/en-us/rest/api/apimanagement/2019-12-01/apimanagementservice/createorupdate
  const rg = provider.resourceManagement.makeResourceGroup({
    name: `resource-group`,
  });

  // https://docs.microsoft.com/en-us/rest/api/virtualnetwork/virtualnetworks/createorupdate#request-body
  const vnet = provider.virtualNetworks.makeVirtualNetwork({
    name: `virtual-network`,
    dependencies: { resourceGroup: rg },
    properties: () => ({
      properties: {
        addressSpace: { addressPrefixes: ["10.0.0.0/16"] },
        subnets: [
          {
            name: `subnet`,
            properties: {
              addressPrefix: "10.0.0.0/24",
            },
          },
        ],
      },
    }),
  });

  // https://docs.microsoft.com/en-us/rest/api/virtualnetwork/networksecuritygroups/createorupdate#request-body
  const sg = provider.virtualNetworks.makeSecurityGroup({
    name: `security-group`,
    dependencies: { resourceGroup: rg },
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

  // https://docs.microsoft.com/en-us/rest/api/virtualnetwork/publicipaddresses/createorupdate#request-body
  const publicIpAddress = provider.virtualNetworks.makePublicIpAddress({
    name: `ip`,
    dependencies: {
      resourceGroup: rg,
    },
    properties: () => ({
      properties: {
        publicIPAllocationMethod: "Dynamic",
      },
    }),
  });
  // https://docs.microsoft.com/en-us/rest/api/virtualnetwork/networkinterfaces/createorupdate#request-body
  const networkInterface = provider.virtualNetworks.makeNetworkInterface({
    name: `network-interface`,
    dependencies: {
      resourceGroup: rg,
      virtualNetwork: vnet,
      securityGroup: sg,
      subnet: `subnet`,
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

  // https://docs.microsoft.com/en-us/rest/api/compute/virtualmachines/createorupdate
  const vm = provider.compute.makeVirtualMachine({
    name: `vm`,
    dependencies: {
      resourceGroup: rg,
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
  return { provider };
};
```

## Plan

Find out which resources are going to be allocated:

```sh
gc plan
```

## Deploy

Happy with the expected plan ? Deploy it now:

```sh
gc apply
```

## List

List the available resources and display a diagram with:

```sh
gc list --graph
```

## Destroy

Time to destroy the resouces allocated:

```sh
gc destroy
```
