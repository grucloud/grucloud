---
id: SecurityPartnerProvider
title: SecurityPartnerProvider
---
Provides a **SecurityPartnerProvider** from the **Network** group
## Examples
### Create Security Partner Provider
```js
provider.Network.makeSecurityPartnerProvider({
  name: "mySecurityPartnerProvider",
  properties: () => ({
    tags: { key1: "value1" },
    location: "West US",
    properties: {
      securityProviderName: "ZScaler",
      virtualHub: {
        id: "/subscriptions/subid/resourceGroups/rg1/providers/Microsoft.Network/virtualHubs/hub1",
      },
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

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/network/resource-manager/Microsoft.Network/stable/2021-05-01/securityPartnerProvider.json).
