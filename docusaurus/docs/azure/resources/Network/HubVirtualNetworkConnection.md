---
id: HubVirtualNetworkConnection
title: HubVirtualNetworkConnection
---
Provides a **HubVirtualNetworkConnection** from the **Network** group
## Examples
### HubVirtualNetworkConnectionPut
```js
provider.Network.makeHubVirtualNetworkConnection({
  name: "myHubVirtualNetworkConnection",
  properties: () => ({
    properties: {
      remoteVirtualNetwork: {
        id: "/subscriptions/subid/resourceGroups/rg1/providers/Microsoft.Network/virtualNetworks/SpokeVnet1",
      },
      enableInternetSecurity: false,
      routingConfiguration: {
        associatedRouteTable: {
          id: "/subscriptions/subid/resourceGroups/rg1/providers/Microsoft.Network/virtualHubs/virtualHub1/hubRouteTables/hubRouteTable1",
        },
        propagatedRouteTables: {
          labels: ["label1", "label2"],
          ids: [
            {
              id: "/subscriptions/subid/resourceGroups/rg1/providers/Microsoft.Network/virtualHubs/virtualHub1/hubRouteTables/hubRouteTable1",
            },
          ],
        },
        vnetRoutes: {
          staticRoutes: [
            {
              name: "route1",
              addressPrefixes: ["10.1.0.0/16", "10.2.0.0/16"],
              nextHopIpAddress: "10.0.0.68",
            },
            {
              name: "route2",
              addressPrefixes: ["10.3.0.0/16", "10.4.0.0/16"],
              nextHopIpAddress: "10.0.0.65",
            },
          ],
        },
      },
    },
  }),
  dependencies: ({ resources }) => ({
    resourceGroup: resources.Resources.ResourceGroup["myResourceGroup"],
    virtualHub: resources.Network.VirtualHub["myVirtualHub"],
    virtualNetwork: resources.Network.VirtualNetwork["myVirtualNetwork"],
    routeTable: resources.Network.RouteTable["myRouteTable"],
  }),
});

```
## Dependencies
- [ResourceGroup](../Resources/ResourceGroup.md)
- [VirtualHub](../Network/VirtualHub.md)
- [VirtualNetwork](../Network/VirtualNetwork.md)
- [RouteTable](../Network/RouteTable.md)
## Misc
The resource version is `2021-05-01`.

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/network/resource-manager/Microsoft.Network/stable/2021-05-01/virtualWan.json).
