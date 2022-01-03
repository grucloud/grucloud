---
id: PrivateLinkServicePrivateEndpointConnection
title: PrivateLinkServicePrivateEndpointConnection
---
Provides a **PrivateLinkServicePrivateEndpointConnection** from the **Network** group
## Examples
### approve or reject private end point connection for a private link service
```js
provider.Network.makePrivateLinkServicePrivateEndpointConnection({
  name: "myPrivateLinkServicePrivateEndpointConnection",
  properties: () => ({
    name: "testPlePeConnection",
    properties: {
      privateEndpoint: {
        id: "/subscriptions/subId/resourceGroups/rg1/providers/Microsoft.Network/privateEndpoints/testPe",
      },
      privateLinkServiceConnectionState: {
        status: "Approved",
        description: "approved it for some reason.",
      },
    },
  }),
  dependencies: ({ resources }) => ({
    resourceGroup: resources.Resources.ResourceGroup["myResourceGroup"],
    service: resources.Network.PrivateLinkService["myPrivateLinkService"],
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
- [PrivateLinkService](../Network/PrivateLinkService.md)
- [VirtualMachine](../Compute/VirtualMachine.md)
- [DscpConfiguration](../Network/DscpConfiguration.md)
- [NatGateway](../Network/NatGateway.md)
- [Workspace](../OperationalInsights/Workspace.md)
- [DdosCustomPolicy](../Network/DdosCustomPolicy.md)
- [PublicIPPrefix](../Network/PublicIPPrefix.md)
- [PrivateLinkService](../Network/PrivateLinkService.md)
## Misc
The resource version is `2021-05-01`.

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/network/resource-manager/Microsoft.Network/stable/2021-05-01/privateLinkService.json).
