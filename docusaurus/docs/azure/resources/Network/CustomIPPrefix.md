---
id: CustomIPPrefix
title: CustomIPPrefix
---
Provides a **CustomIPPrefix** from the **Network** group
## Examples
### Create custom IP prefix allocation method
```js
provider.Network.makeCustomIPPrefix({
  name: "myCustomIPPrefix",
  properties: () => ["1"],
  dependencies: ({ resources }) => ({
    resourceGroup: resources.Resources.ResourceGroup["myResourceGroup"],
  }),
});

```
## Dependencies
- [ResourceGroup](../Resources/ResourceGroup.md)
## Misc
The resource version is `2021-05-01`.

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/network/resource-manager/Microsoft.Network/stable/2021-05-01/customIpPrefix.json).
