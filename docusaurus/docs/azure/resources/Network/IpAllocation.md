---
id: IpAllocation
title: IpAllocation
---
Provides a **IpAllocation** from the **Network** group
## Examples
### Create IpAllocation
```js
provider.Network.makeIpAllocation({
  name: "myIpAllocation",
  properties: () => ({
    properties: {
      type: "Hypernet",
      prefix: "3.2.5.0/24",
      allocationTags: {
        VNetID:
          "/subscriptions/subid/resourceGroups/rg1/providers/Microsoft.Network/virtualNetworks/HypernetVnet1",
      },
    },
    location: "centraluseuap",
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

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/network/resource-manager/Microsoft.Network/stable/2021-05-01/ipAllocation.json).
