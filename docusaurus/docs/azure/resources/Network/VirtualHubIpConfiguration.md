---
id: VirtualHubIpConfiguration
title: VirtualHubIpConfiguration
---
Provides a **VirtualHubIpConfiguration** from the **Network** group
## Examples
### VirtualHubIpConfigurationPut
```js
provider.Network.makeVirtualHubIpConfiguration({
  name: "myVirtualHubIpConfiguration",
  properties: () => ({
    properties: {
      subnet: {
        id: "/subscriptions/subid/resourceGroups/rg1/providers/Microsoft.Network/virtualNetworks/vnet1/subnets/subnet1",
      },
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
