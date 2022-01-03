---
id: VirtualApplianceSite
title: VirtualApplianceSite
---
Provides a **VirtualApplianceSite** from the **Network** group
## Examples
### Create Network Virtual Appliance Site
```js
provider.Network.makeVirtualApplianceSite({
  name: "myVirtualApplianceSite",
  properties: () => ({
    properties: {
      addressPrefix: "192.168.1.0/24",
      o365Policy: {
        breakOutCategories: { allow: true, optimize: true, default: true },
      },
    },
  }),
  dependencies: ({ resources }) => ({
    resourceGroup: resources.Resources.ResourceGroup["myResourceGroup"],
    networkVirtualAppliance:
      resources.Network.NetworkVirtualAppliance["myNetworkVirtualAppliance"],
  }),
});

```
## Dependencies
- [ResourceGroup](../Resources/ResourceGroup.md)
- [NetworkVirtualAppliance](../Network/NetworkVirtualAppliance.md)
## Misc
The resource version is `2021-05-01`.

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/network/resource-manager/Microsoft.Network/stable/2021-05-01/networkVirtualAppliance.json).
