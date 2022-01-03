---
id: NetworkSecurityGroup
title: NetworkSecurityGroup
---
Provides a **NetworkSecurityGroup** from the **Network** group
## Examples
### Create network security group
```js
provider.Network.makeNetworkSecurityGroup({
  name: "myNetworkSecurityGroup",
  properties: () => ({ location: "eastus" }),
  dependencies: ({ resources }) => ({
    resourceGroup: resources.Resources.ResourceGroup["myResourceGroup"],
    virtualMachine: resources.Compute.VirtualMachine["myVirtualMachine"],
    natGateway: resources.Network.NatGateway["myNatGateway"],
    dscpConfiguration:
      resources.Network.DscpConfiguration["myDscpConfiguration"],
    workspace: resources.OperationalInsights.Workspace["myWorkspace"],
  }),
});

```

### Create network security group with rule
```js
provider.Network.makeNetworkSecurityGroup({
  name: "myNetworkSecurityGroup",
  properties: () => ({
    properties: {
      securityRules: [
        {
          name: "rule1",
          properties: {
            protocol: "*",
            sourceAddressPrefix: "*",
            destinationAddressPrefix: "*",
            access: "Allow",
            destinationPortRange: "80",
            sourcePortRange: "*",
            priority: 130,
            direction: "Inbound",
          },
        },
      ],
    },
    location: "eastus",
  }),
  dependencies: ({ resources }) => ({
    resourceGroup: resources.Resources.ResourceGroup["myResourceGroup"],
    virtualMachine: resources.Compute.VirtualMachine["myVirtualMachine"],
    natGateway: resources.Network.NatGateway["myNatGateway"],
    dscpConfiguration:
      resources.Network.DscpConfiguration["myDscpConfiguration"],
    workspace: resources.OperationalInsights.Workspace["myWorkspace"],
  }),
});

```
## Dependencies
- [ResourceGroup](../Resources/ResourceGroup.md)
- [VirtualMachine](../Compute/VirtualMachine.md)
- [NatGateway](../Network/NatGateway.md)
- [DscpConfiguration](../Network/DscpConfiguration.md)
- [Workspace](../OperationalInsights/Workspace.md)
## Misc
The resource version is `2021-05-01`.

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/network/resource-manager/Microsoft.Network/stable/2021-05-01/networkSecurityGroup.json).
