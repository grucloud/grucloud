---
id: NatGateway
title: NatGateway
---
Provides a **NatGateway** from the **Network** group
## Examples
### Create nat gateway
```js
provider.Network.makeNatGateway({
  name: "myNatGateway",
  properties: () => ({
    location: "westus",
    sku: { name: "Standard" },
    properties: {
      publicIpAddresses: [
        {
          id: "/subscriptions/subid/resourceGroups/rg1/providers/Microsoft.Network/publicIPAddresses/PublicIpAddress1",
        },
      ],
      publicIpPrefixes: [
        {
          id: "/subscriptions/subid/resourceGroups/rg1/providers/Microsoft.Network/publicIPPrefixes/PublicIpPrefix1",
        },
      ],
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

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/network/resource-manager/Microsoft.Network/stable/2021-05-01/natGateway.json).
