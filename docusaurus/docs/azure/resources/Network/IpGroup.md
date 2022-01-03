---
id: IpGroup
title: IpGroup
---
Provides a **IpGroup** from the **Network** group
## Examples
### CreateOrUpdate_IpGroups
```js
provider.Network.makeIpGroup({
  name: "myIpGroup",
  properties: () => ({
    tags: { key1: "value1" },
    location: "West US",
    properties: {
      ipAddresses: ["13.64.39.16/32", "40.74.146.80/31", "40.74.147.32/28"],
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

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/network/resource-manager/Microsoft.Network/stable/2021-05-01/ipGroups.json).
