---
id: PublicIPPrefix
title: PublicIPPrefix
---
Provides a **PublicIPPrefix** from the **Network** group
## Examples
### Create public IP prefix defaults
```js
provider.Network.makePublicIPPrefix({
  name: "myPublicIPPrefix",
  properties: () => ({
    location: "westus",
    properties: { prefixLength: 30 },
    sku: { name: "Standard" },
  }),
  dependencies: ({ resources }) => ({
    resourceGroup: resources.Resources.ResourceGroup["myResourceGroup"],
    loadBalancer: resources.Network.LoadBalancer["myLoadBalancer"],
    customIpPrefix: resources.Network.CustomIPPrefix["myCustomIPPrefix"],
  }),
});

```

### Create public IP prefix allocation method
```js
provider.Network.makePublicIPPrefix({
  name: "myPublicIPPrefix",
  properties: () => ["1"],
  dependencies: ({ resources }) => ({
    resourceGroup: resources.Resources.ResourceGroup["myResourceGroup"],
    loadBalancer: resources.Network.LoadBalancer["myLoadBalancer"],
    customIpPrefix: resources.Network.CustomIPPrefix["myCustomIPPrefix"],
  }),
});

```
## Dependencies
- [ResourceGroup](../Resources/ResourceGroup.md)
- [LoadBalancer](../Network/LoadBalancer.md)
- [CustomIPPrefix](../Network/CustomIPPrefix.md)
## Misc
The resource version is `2021-05-01`.

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/network/resource-manager/Microsoft.Network/stable/2021-05-01/publicIpPrefix.json).
