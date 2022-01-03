---
id: VirtualHubBgpConnection
title: VirtualHubBgpConnection
---
Provides a **VirtualHubBgpConnection** from the **Network** group
## Examples
### VirtualHubRouteTableV2Put
```js
provider.Network.makeVirtualHubBgpConnection({
  name: "myVirtualHubBgpConnection",
  properties: () => ({
    properties: {
      peerIp: "192.168.1.5",
      peerAsn: 20000,
      hubVirtualNetworkConnection: {
        id: "/subscriptions/subid/resourceGroups/rg1/providers/Microsoft.Network/virtualHubs/hub1/hubVirtualNetworkConnections/hubVnetConn1",
      },
    },
  }),
  dependencies: ({ resources }) => ({
    resourceGroup: resources.Resources.ResourceGroup["myResourceGroup"],
    virtualHub: resources.Network.VirtualHub["myVirtualHub"],
    hubVirtualNetworkConnection:
      resources.Network.HubVirtualNetworkConnection[
        "myHubVirtualNetworkConnection"
      ],
  }),
});

```
## Dependencies
- [ResourceGroup](../Resources/ResourceGroup.md)
- [VirtualHub](../Network/VirtualHub.md)
- [HubVirtualNetworkConnection](../Network/HubVirtualNetworkConnection.md)
## Misc
The resource version is `2021-05-01`.

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/network/resource-manager/Microsoft.Network/stable/2021-05-01/virtualWan.json).
