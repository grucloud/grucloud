---
id: RouteFilter
title: RouteFilter
---
Provides a **RouteFilter** from the **Network** group
## Examples
### RouteFilterCreate
```js
provider.Network.makeRouteFilter({
  name: "myRouteFilter",
  properties: () => ({
    location: "West US",
    tags: { key1: "value1" },
    properties: {
      rules: [
        {
          name: "ruleName",
          properties: {
            access: "Allow",
            routeFilterRuleType: "Community",
            communities: ["12076:5030", "12076:5040"],
          },
        },
      ],
    },
  }),
  dependencies: ({ resources }) => ({
    resourceGroup: resources.Resources.ResourceGroup["myResourceGroup"],
    route: resources.Network.Route["myRoute"],
    expressRouteConnection:
      resources.Network.ExpressRouteConnection["myExpressRouteConnection"],
  }),
});

```
## Dependencies
- [ResourceGroup](../Resources/ResourceGroup.md)
- [Route](../Network/Route.md)
- [ExpressRouteConnection](../Network/ExpressRouteConnection.md)
## Misc
The resource version is `2021-05-01`.

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/network/resource-manager/Microsoft.Network/stable/2021-05-01/routeFilter.json).
