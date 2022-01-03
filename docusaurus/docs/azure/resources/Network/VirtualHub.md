---
id: VirtualHub
title: VirtualHub
---
Provides a **VirtualHub** from the **Network** group
## Examples
### VirtualHubPut
```js
provider.Network.makeVirtualHub({
  name: "myVirtualHub",
  properties: () => ({
    location: "West US",
    tags: { key1: "value1" },
    properties: {
      virtualWan: {
        id: "/subscriptions/subid/resourceGroups/rg1/providers/Microsoft.Network/virtualWans/virtualWan1",
      },
      addressPrefix: "10.168.0.0/24",
      sku: "Basic",
    },
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

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/network/resource-manager/Microsoft.Network/stable/2021-05-01/virtualWan.json).
