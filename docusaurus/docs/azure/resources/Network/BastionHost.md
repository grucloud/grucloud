---
id: BastionHost
title: BastionHost
---
Provides a **BastionHost** from the **Network** group
## Examples
### Create Bastion Host
```js
provider.Network.makeBastionHost({
  name: "myBastionHost",
  properties: () => ({ name: "Standard" }),
  dependencies: ({ resources }) => ({
    resourceGroup: resources.Resources.ResourceGroup["myResourceGroup"],
  }),
});

```
## Dependencies
- [ResourceGroup](../Resources/ResourceGroup.md)
## Misc
The resource version is `2021-05-01`.

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/network/resource-manager/Microsoft.Network/stable/2021-05-01/bastionHost.json).
