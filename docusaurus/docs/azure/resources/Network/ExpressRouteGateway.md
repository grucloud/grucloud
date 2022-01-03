---
id: ExpressRouteGateway
title: ExpressRouteGateway
---
Provides a **ExpressRouteGateway** from the **Network** group
## Examples
### ExpressRouteGatewayCreate
```js
provider.Network.makeExpressRouteGateway({
  name: "myExpressRouteGateway",
  properties: () => ({
    location: "westus",
    properties: {
      virtualHub: {
        id: "/subscriptions/subid/resourceGroups/resourceGroupId/providers/Microsoft.Network/virtualHubs/virtualHubName",
      },
      autoScaleConfiguration: { bounds: { min: 3 } },
    },
  }),
  dependencies: ({ resources }) => ({
    resourceGroup: resources.Resources.ResourceGroup["myResourceGroup"],
    expressRouteCircuitPeering:
      resources.Network.ExpressRouteCircuitPeering[
        "myExpressRouteCircuitPeering"
      ],
    routeTable: resources.Network.RouteTable["myRouteTable"],
    virtualHub: resources.Network.VirtualHub["myVirtualHub"],
  }),
});

```
## Dependencies
- [ResourceGroup](../Resources/ResourceGroup.md)
- [ExpressRouteCircuitPeering](../Network/ExpressRouteCircuitPeering.md)
- [RouteTable](../Network/RouteTable.md)
- [VirtualHub](../Network/VirtualHub.md)
## Misc
The resource version is `2021-05-01`.

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/network/resource-manager/Microsoft.Network/stable/2021-05-01/virtualWan.json).
