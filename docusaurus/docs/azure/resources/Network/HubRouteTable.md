---
id: HubRouteTable
title: HubRouteTable
---
Provides a **HubRouteTable** from the **Network** group
## Examples
### RouteTablePut
```js
provider.Network.makeHubRouteTable({
  name: "myHubRouteTable",
  properties: () => ({
    properties: {
      routes: [
        {
          name: "route1",
          destinationType: "CIDR",
          destinations: ["10.0.0.0/8", "20.0.0.0/8", "30.0.0.0/8"],
          nextHopType: "ResourceId",
          nextHop:
            "/subscriptions/subid/resourceGroups/rg1/providers/Microsoft.Network/azureFirewalls/azureFirewall1",
        },
      ],
      labels: ["label1", "label2"],
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
