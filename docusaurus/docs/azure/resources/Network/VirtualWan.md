---
id: VirtualWan
title: VirtualWan
---
Provides a **VirtualWan** from the **Network** group
## Examples
### VirtualWANCreate
```js
provider.Network.makeVirtualWan({
  name: "myVirtualWan",
  properties: () => ({
    location: "West US",
    tags: { key1: "value1" },
    properties: { disableVpnEncryption: false, type: "Basic" },
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
