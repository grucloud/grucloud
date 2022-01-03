---
id: VirtualHubRouteTableV2
title: VirtualHubRouteTableV2
---
Provides a **VirtualHubRouteTableV2** from the **Network** group
## Examples
### VirtualHubRouteTableV2Put
```js
provider.Network.makeVirtualHubRouteTableV2({
  name: "myVirtualHubRouteTableV2",
  properties: () => ({
    properties: {
      routes: [
        {
          destinationType: "CIDR",
          destinations: ["20.10.0.0/16", "20.20.0.0/16"],
          nextHopType: "IPAddress",
          nextHops: ["10.0.0.68"],
        },
        {
          destinationType: "CIDR",
          destinations: ["0.0.0.0/0"],
          nextHopType: "IPAddress",
          nextHops: ["10.0.0.68"],
        },
      ],
      attachedConnections: ["All_Vnets"],
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
