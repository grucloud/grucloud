---
id: ExpressRouteConnection
title: ExpressRouteConnection
---
Provides a **ExpressRouteConnection** from the **Network** group
## Examples
### ExpressRouteConnectionCreate
```js
provider.Network.makeExpressRouteConnection({
  name: "myExpressRouteConnection",
  properties: () => ({
    id: "/subscriptions/subid/resourceGroups/resourceGroupName/providers/Microsoft.Network/expressRouteGateways/gateway-2/expressRouteConnections/connectionName",
    name: "connectionName",
    properties: {
      routingWeight: 2,
      authorizationKey: "authorizationKey",
      expressRouteCircuitPeering: {
        id: "/subscriptions/subid/resourceGroups/resourceGroupName/providers/Microsoft.Network/expressRouteCircuits/circuitName/peerings/AzurePrivatePeering",
      },
    },
  }),
  dependencies: ({ resources }) => ({
    resourceGroup: resources.Resources.ResourceGroup["myResourceGroup"],
    expressRouteGateway:
      resources.Network.ExpressRouteGateway["myExpressRouteGateway"],
    expressRouteCircuitPeering:
      resources.Network.ExpressRouteCircuitPeering[
        "myExpressRouteCircuitPeering"
      ],
    routeTable: resources.Network.RouteTable["myRouteTable"],
  }),
});

```
## Dependencies
- [ResourceGroup](../Resources/ResourceGroup.md)
- [ExpressRouteGateway](../Network/ExpressRouteGateway.md)
- [ExpressRouteCircuitPeering](../Network/ExpressRouteCircuitPeering.md)
- [RouteTable](../Network/RouteTable.md)
## Misc
The resource version is `2021-05-01`.

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/network/resource-manager/Microsoft.Network/stable/2021-05-01/virtualWan.json).
