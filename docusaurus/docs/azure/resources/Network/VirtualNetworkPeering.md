---
id: VirtualNetworkPeering
title: VirtualNetworkPeering
---
Provides a **VirtualNetworkPeering** from the **Network** group
## Examples
### Create peering
```js
provider.Network.makeVirtualNetworkPeering({
  name: "myVirtualNetworkPeering",
  properties: () => ({
    properties: {
      allowVirtualNetworkAccess: true,
      allowForwardedTraffic: true,
      allowGatewayTransit: false,
      useRemoteGateways: false,
      remoteVirtualNetwork: {
        id: "/subscriptions/subid/resourceGroups/peerTest/providers/Microsoft.Network/virtualNetworks/vnet2",
      },
    },
  }),
  dependencies: ({ resources }) => ({
    resourceGroup: resources.Resources.ResourceGroup["myResourceGroup"],
    virtualNetwork: resources.Network.VirtualNetwork["myVirtualNetwork"],
  }),
});

```

### Sync Peering
```js
provider.Network.makeVirtualNetworkPeering({
  name: "myVirtualNetworkPeering",
  properties: () => ({
    properties: {
      allowVirtualNetworkAccess: true,
      allowForwardedTraffic: true,
      allowGatewayTransit: false,
      useRemoteGateways: false,
      remoteVirtualNetwork: {
        id: "/subscriptions/subid/resourceGroups/peerTest/providers/Microsoft.Network/virtualNetworks/vnet2",
      },
    },
  }),
  dependencies: ({ resources }) => ({
    resourceGroup: resources.Resources.ResourceGroup["myResourceGroup"],
    virtualNetwork: resources.Network.VirtualNetwork["myVirtualNetwork"],
  }),
});

```

### Create peering with remote virtual network encryption
```js
provider.Network.makeVirtualNetworkPeering({
  name: "myVirtualNetworkPeering",
  properties: () => ({
    properties: {
      allowVirtualNetworkAccess: true,
      allowForwardedTraffic: true,
      allowGatewayTransit: false,
      useRemoteGateways: false,
      remoteVirtualNetwork: {
        id: "/subscriptions/subid/resourceGroups/peerTest/providers/Microsoft.Network/virtualNetworks/vnet2",
      },
    },
  }),
  dependencies: ({ resources }) => ({
    resourceGroup: resources.Resources.ResourceGroup["myResourceGroup"],
    virtualNetwork: resources.Network.VirtualNetwork["myVirtualNetwork"],
  }),
});

```
## Dependencies
- [ResourceGroup](../Resources/ResourceGroup.md)
- [VirtualNetwork](../Network/VirtualNetwork.md)
## Misc
The resource version is `2021-05-01`.

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/network/resource-manager/Microsoft.Network/stable/2021-05-01/virtualNetwork.json).
