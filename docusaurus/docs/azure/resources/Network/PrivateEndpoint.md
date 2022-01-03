---
id: PrivateEndpoint
title: PrivateEndpoint
---
Provides a **PrivateEndpoint** from the **Network** group
## Examples
### Create private endpoint
```js
provider.Network.makePrivateEndpoint({
  name: "myPrivateEndpoint",
  properties: () => ({ type: "EdgeZone", name: "edgeZone0" }),
  dependencies: ({ resources }) => ({
    resourceGroup: resources.Resources.ResourceGroup["myResourceGroup"],
    virtualMachine: resources.Compute.VirtualMachine["myVirtualMachine"],
    dscpConfiguration:
      resources.Network.DscpConfiguration["myDscpConfiguration"],
    natGateway: resources.Network.NatGateway["myNatGateway"],
    workspace: resources.OperationalInsights.Workspace["myWorkspace"],
    ddosCustomPolicy: resources.Network.DdosCustomPolicy["myDdosCustomPolicy"],
    publicIpPrefix: resources.Network.PublicIPPrefix["myPublicIPPrefix"],
    privateLinkService:
      resources.Network.PrivateLinkService["myPrivateLinkService"],
  }),
});

```

### Create private endpoint with manual approval connection
```js
provider.Network.makePrivateEndpoint({
  name: "myPrivateEndpoint",
  properties: () => ({
    location: "eastus",
    properties: {
      manualPrivateLinkServiceConnections: [
        {
          properties: {
            privateLinkServiceId:
              "/subscriptions/subId/resourceGroups/rg1/providers/Microsoft.Network/privateLinkServices/testPls",
            groupIds: ["groupIdFromResource"],
            requestMessage: "Please manually approve my connection.",
          },
        },
      ],
      subnet: {
        id: "/subscriptions/subId/resourceGroups/rg1/providers/Microsoft.Network/virtualNetworks/myVnet/subnets/mySubnet",
      },
      ipConfigurations: [
        {
          name: "pestaticconfig",
          properties: {
            groupId: "file",
            memberName: "file",
            privateIPAddress: "192.168.0.5",
          },
        },
      ],
      customNetworkInterfaceName: "testPeNic",
    },
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
    privateLinkService:
      resources.Network.PrivateLinkService["myPrivateLinkService"],
  }),
});

```

### Create private endpoint with application security groups
```js
provider.Network.makePrivateEndpoint({
  name: "myPrivateEndpoint",
  properties: () => ({ type: "EdgeZone", name: "edgeZone0" }),
  dependencies: ({ resources }) => ({
    resourceGroup: resources.Resources.ResourceGroup["myResourceGroup"],
    virtualMachine: resources.Compute.VirtualMachine["myVirtualMachine"],
    dscpConfiguration:
      resources.Network.DscpConfiguration["myDscpConfiguration"],
    natGateway: resources.Network.NatGateway["myNatGateway"],
    workspace: resources.OperationalInsights.Workspace["myWorkspace"],
    ddosCustomPolicy: resources.Network.DdosCustomPolicy["myDdosCustomPolicy"],
    publicIpPrefix: resources.Network.PublicIPPrefix["myPublicIPPrefix"],
    privateLinkService:
      resources.Network.PrivateLinkService["myPrivateLinkService"],
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
- [PrivateLinkService](../Network/PrivateLinkService.md)
## Misc
The resource version is `2021-05-01`.

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/network/resource-manager/Microsoft.Network/stable/2021-05-01/privateEndpoint.json).
