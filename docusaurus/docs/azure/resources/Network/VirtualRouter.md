---
id: VirtualRouter
title: VirtualRouter
---
Provides a **VirtualRouter** from the **Network** group
## Examples
### Create VirtualRouter
```js
provider.Network.makeVirtualRouter({
  name: "myVirtualRouter",
  properties: () => ({
    tags: { key1: "value1" },
    location: "West US",
    properties: {
      hostedGateway: {
        id: "/subscriptions/subid/resourceGroups/rg1/providers/Microsoft.Network/virtualNetworkGateways/vnetGateway",
      },
    },
  }),
  dependencies: ({ resources }) => ({
    resourceGroup: resources.Resources.ResourceGroup["myResourceGroup"],
    subnet: resources.Network.Subnet["mySubnet"],
  }),
});

```
## Dependencies
- [ResourceGroup](../Resources/ResourceGroup.md)
- [Subnet](../Network/Subnet.md)
## Misc
The resource version is `2021-05-01`.

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/network/resource-manager/Microsoft.Network/stable/2021-05-01/virtualRouter.json).
