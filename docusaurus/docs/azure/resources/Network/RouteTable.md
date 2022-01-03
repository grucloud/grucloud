---
id: RouteTable
title: RouteTable
---
Provides a **RouteTable** from the **Network** group
## Examples
### Create route table
```js
provider.Network.makeRouteTable({
  name: "myRouteTable",
  properties: () => ({ location: "westus" }),
  dependencies: ({ resources }) => ({
    resourceGroup: resources.Resources.ResourceGroup["myResourceGroup"],
  }),
});

```

### Create route table with route
```js
provider.Network.makeRouteTable({
  name: "myRouteTable",
  properties: () => ({
    properties: {
      disableBgpRoutePropagation: true,
      routes: [
        {
          name: "route1",
          properties: {
            addressPrefix: "10.0.3.0/24",
            nextHopType: "VirtualNetworkGateway",
          },
        },
      ],
    },
    location: "westus",
  }),
  dependencies: ({ resources }) => ({
    resourceGroup: resources.Resources.ResourceGroup["myResourceGroup"],
  }),
});

```
## Dependencies
- [ResourceGroup](../Resources/ResourceGroup.md)
## Misc
The resource version is `2021-05-01`.

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/network/resource-manager/Microsoft.Network/stable/2021-05-01/routeTable.json).
