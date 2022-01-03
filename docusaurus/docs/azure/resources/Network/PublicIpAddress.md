---
id: PublicIPAddress
title: PublicIPAddress
---
Provides a **PublicIPAddress** from the **Network** group
## Examples
### Create public IP address defaults
```js
provider.Network.makePublicIPAddress({
  name: "myPublicIPAddress",
  properties: () => ({ location: "eastus" }),
  dependencies: ({ resources }) => ({
    resourceGroup: resources.Resources.ResourceGroup["myResourceGroup"],
    virtualMachine: resources.Compute.VirtualMachine["myVirtualMachine"],
    dscpConfiguration:
      resources.Network.DscpConfiguration["myDscpConfiguration"],
    natGateway: resources.Network.NatGateway["myNatGateway"],
    workspace: resources.OperationalInsights.Workspace["myWorkspace"],
    ddosCustomPolicy: resources.Network.DdosCustomPolicy["myDdosCustomPolicy"],
    publicIpPrefix: resources.Network.PublicIPPrefix["myPublicIPPrefix"],
  }),
});

```

### Create public IP address allocation method
```js
provider.Network.makePublicIPAddress({
  name: "myPublicIPAddress",
  properties: () => ["1"],
  dependencies: ({ resources }) => ({
    resourceGroup: resources.Resources.ResourceGroup["myResourceGroup"],
    virtualMachine: resources.Compute.VirtualMachine["myVirtualMachine"],
    dscpConfiguration:
      resources.Network.DscpConfiguration["myDscpConfiguration"],
    natGateway: resources.Network.NatGateway["myNatGateway"],
    workspace: resources.OperationalInsights.Workspace["myWorkspace"],
    ddosCustomPolicy: resources.Network.DdosCustomPolicy["myDdosCustomPolicy"],
    publicIpPrefix: resources.Network.PublicIPPrefix["myPublicIPPrefix"],
  }),
});

```

### Create public IP address DNS
```js
provider.Network.makePublicIPAddress({
  name: "myPublicIPAddress",
  properties: () => ({
    properties: { dnsSettings: { domainNameLabel: "dnslbl" } },
    location: "eastus",
  }),
  dependencies: ({ resources }) => ({
    resourceGroup: resources.Resources.ResourceGroup["myResourceGroup"],
    virtualMachine: resources.Compute.VirtualMachine["myVirtualMachine"],
    dscpConfiguration:
      resources.Network.DscpConfiguration["myDscpConfiguration"],
    natGateway: resources.Network.NatGateway["myNatGateway"],
    workspace: resources.OperationalInsights.Workspace["myWorkspace"],
    ddosCustomPolicy: resources.Network.DdosCustomPolicy["myDdosCustomPolicy"],
    publicIpPrefix: resources.Network.PublicIPPrefix["myPublicIPPrefix"],
  }),
});

```
## Dependencies
- [ResourceGroup](../Resources/ResourceGroup.md)
- [VirtualMachine](../Compute/VirtualMachine.md)
- [DscpConfiguration](../Network/DscpConfiguration.md)
- [NatGateway](../Network/NatGateway.md)
- [Workspace](../OperationalInsights/Workspace.md)
- [DdosCustomPolicy](../Network/DdosCustomPolicy.md)
- [PublicIPPrefix](../Network/PublicIPPrefix.md)
## Misc
The resource version is `2021-05-01`.

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/network/resource-manager/Microsoft.Network/stable/2021-05-01/publicIpAddress.json).
