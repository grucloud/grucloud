---
id: Key
title: Key
---
Provides a **Key** from the **KeyVault** group
## Examples
### Create a key
```js
provider.KeyVault.makeKey({
  name: "myKey",
  properties: () => ({ properties: { kty: "RSA" } }),
  dependencies: ({ resources }) => ({
    resourceGroup: resources.Resources.ResourceGroup["myResourceGroup"],
    vault: resources.KeyVault.Vault["myVault"],
  }),
});

```
## Dependencies
- [ResourceGroup](../Resources/ResourceGroup.md)
- [Vault](../KeyVault/Vault.md)
## Misc
The resource version is `2021-06-01-preview`.

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/keyvault/resource-manager/Microsoft.KeyVault/preview/2021-06-01-preview/keys.json).
