---
id: Secret
title: Secret
---
Provides a **Secret** from the **KeyVault** group
## Examples
### Create a secret
```js
provider.KeyVault.makeSecret({
  name: "mySecret",
  properties: () => ({ properties: { value: "secret-value" } }),
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

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/keyvault/resource-manager/Microsoft.KeyVault/preview/2021-06-01-preview/secrets.json).
