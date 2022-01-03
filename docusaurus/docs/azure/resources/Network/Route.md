---
id: Route
title: Route
---
Provides a **Route** from the **Network** group
## Examples
### Create route
```js
provider.Network.makeRoute({
  name: "myRoute",
  properties: () => ({
    properties: {
      addressPrefix: "10.0.3.0/24",
      nextHopType: "VirtualNetworkGateway",
    },
  }),
  dependencies: ({ resources }) => ({
    resourceGroup: resources.Resources.ResourceGroup["myResourceGroup"],
    routeTable: resources.Network.RouteTable["myRouteTable"],
  }),
});

```
## Dependencies
- [ResourceGroup](../Resources/ResourceGroup.md)
- [RouteTable](../Network/RouteTable.md)
## Misc
The resource version is `2021-05-01`.

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/network/resource-manager/Microsoft.Network/stable/2021-05-01/routeTable.json).
