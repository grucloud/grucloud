---
id: VirtualRouterPeering
title: VirtualRouterPeering
---
Provides a **VirtualRouterPeering** from the **Network** group
## Examples
### Create Virtual Router Peering
```js
provider.Network.makeVirtualRouterPeering({
  name: "myVirtualRouterPeering",
  properties: () => ({ properties: { peerIp: "192.168.1.5", peerAsn: 20000 } }),
  dependencies: ({ resources }) => ({
    resourceGroup: resources.Resources.ResourceGroup["myResourceGroup"],
    virtualRouter: resources.Network.VirtualRouter["myVirtualRouter"],
  }),
});

```
## Dependencies
- [ResourceGroup](../Resources/ResourceGroup.md)
- [VirtualRouter](../Network/VirtualRouter.md)
## Misc
The resource version is `2021-05-01`.

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/network/resource-manager/Microsoft.Network/stable/2021-05-01/virtualRouter.json).
