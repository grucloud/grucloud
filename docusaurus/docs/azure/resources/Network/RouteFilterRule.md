---
id: RouteFilterRule
title: RouteFilterRule
---
Provides a **RouteFilterRule** from the **Network** group
## Examples
### RouteFilterRuleCreate
```js
provider.Network.makeRouteFilterRule({
  name: "myRouteFilterRule",
  properties: () => ({
    properties: {
      access: "Allow",
      routeFilterRuleType: "Community",
      communities: ["12076:5030", "12076:5040"],
    },
  }),
  dependencies: ({ resources }) => ({
    resourceGroup: resources.Resources.ResourceGroup["myResourceGroup"],
    routeFilter: resources.Network.RouteFilter["myRouteFilter"],
  }),
});

```
## Dependencies
- [ResourceGroup](../Resources/ResourceGroup.md)
- [RouteFilter](../Network/RouteFilter.md)
## Misc
The resource version is `2021-05-01`.

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/network/resource-manager/Microsoft.Network/stable/2021-05-01/routeFilter.json).
