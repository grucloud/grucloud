---
id: Subnet
title: Subnet
---
Provides a **Subnet** from the **Network** group
## Examples
### Create subnet
```js
provider.Network.makeSubnet({
  name: "mySubnet",
  properties: () => ({ properties: { addressPrefix: "10.0.0.0/16" } }),
  dependencies: ({ resources }) => ({
    resourceGroup: resources.Resources.ResourceGroup["myResourceGroup"],
    virtualNetwork: resources.Network.VirtualNetwork["myVirtualNetwork"],
    virtualMachine: resources.Compute.VirtualMachine["myVirtualMachine"],
    natGateway: resources.Network.NatGateway["myNatGateway"],
    dscpConfiguration:
      resources.Network.DscpConfiguration["myDscpConfiguration"],
    workspace: resources.OperationalInsights.Workspace["myWorkspace"],
    ddosCustomPolicy: resources.Network.DdosCustomPolicy["myDdosCustomPolicy"],
    publicIpPrefix: resources.Network.PublicIPPrefix["myPublicIPPrefix"],
  }),
});

```

### Create subnet with service endpoints
```js
provider.Network.makeSubnet({
  name: "mySubnet",
  properties: () => ({
    properties: {
      addressPrefix: "10.0.0.0/16",
      serviceEndpoints: [{ service: "Microsoft.Storage" }],
    },
  }),
  dependencies: ({ resources }) => ({
    resourceGroup: resources.Resources.ResourceGroup["myResourceGroup"],
    virtualNetwork: resources.Network.VirtualNetwork["myVirtualNetwork"],
    virtualMachine: resources.Compute.VirtualMachine["myVirtualMachine"],
    natGateway: resources.Network.NatGateway["myNatGateway"],
    dscpConfiguration:
      resources.Network.DscpConfiguration["myDscpConfiguration"],
    workspace: resources.OperationalInsights.Workspace["myWorkspace"],
    ddosCustomPolicy: resources.Network.DdosCustomPolicy["myDdosCustomPolicy"],
    publicIpPrefix: resources.Network.PublicIPPrefix["myPublicIPPrefix"],
  }),
});

```

### Create subnet with a delegation
```js
provider.Network.makeSubnet({
  name: "mySubnet",
  properties: () => ({ properties: { addressPrefix: "10.0.0.0/16" } }),
  dependencies: ({ resources }) => ({
    resourceGroup: resources.Resources.ResourceGroup["myResourceGroup"],
    virtualNetwork: resources.Network.VirtualNetwork["myVirtualNetwork"],
    virtualMachine: resources.Compute.VirtualMachine["myVirtualMachine"],
    natGateway: resources.Network.NatGateway["myNatGateway"],
    dscpConfiguration:
      resources.Network.DscpConfiguration["myDscpConfiguration"],
    workspace: resources.OperationalInsights.Workspace["myWorkspace"],
    ddosCustomPolicy: resources.Network.DdosCustomPolicy["myDdosCustomPolicy"],
    publicIpPrefix: resources.Network.PublicIPPrefix["myPublicIPPrefix"],
  }),
});

```
## Dependencies
- [ResourceGroup](../Resources/ResourceGroup.md)
- [VirtualNetwork](../Network/VirtualNetwork.md)
- [VirtualMachine](../Compute/VirtualMachine.md)
- [NatGateway](../Network/NatGateway.md)
- [DscpConfiguration](../Network/DscpConfiguration.md)
- [Workspace](../OperationalInsights/Workspace.md)
- [DdosCustomPolicy](../Network/DdosCustomPolicy.md)
- [PublicIPPrefix](../Network/PublicIPPrefix.md)
## Misc
The resource version is `2021-05-01`.

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/network/resource-manager/Microsoft.Network/stable/2021-05-01/virtualNetwork.json).
