---
id: RoutingIntent
title: RoutingIntent
---
Provides a **RoutingIntent** from the **Network** group
## Examples
### RouteTablePut
```js
provider.Network.makeRoutingIntent({
  name: "myRoutingIntent",
  properties: () => ({
    properties: {
      routingPolicies: [
        {
          name: "InternetTraffic",
          destinations: ["Internet"],
          nextHop:
            "/subscriptions/subid/resourceGroups/rg1/providers/Microsoft.Network/azureFirewalls/azfw1",
        },
        {
          name: "PrivateTrafficPolicy",
          destinations: ["PrivateTraffic"],
          nextHop:
            "/subscriptions/subid/resourceGroups/rg1/providers/Microsoft.Network/azureFirewalls/azfw1",
        },
      ],
    },
  }),
  dependencies: ({ resources }) => ({
    resourceGroup: resources.Resources.ResourceGroup["myResourceGroup"],
    virtualHub: resources.Network.VirtualHub["myVirtualHub"],
  }),
});

```
## Dependencies
- [ResourceGroup](../Resources/ResourceGroup.md)
- [VirtualHub](../Network/VirtualHub.md)
## Misc
The resource version is `2021-05-01`.

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/network/resource-manager/Microsoft.Network/stable/2021-05-01/virtualWan.json).
