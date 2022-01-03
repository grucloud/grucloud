---
id: EncryptionScope
title: EncryptionScope
---
Provides a **EncryptionScope** from the **Storage** group
## Examples
### StorageAccountPutEncryptionScope
```js
provider.Storage.makeEncryptionScope({
  name: "myEncryptionScope",
  dependencies: ({ resources }) => ({
    resourceGroup: resources.Resources.ResourceGroup["myResourceGroup"],
    account: resources.Storage.StorageAccount["myStorageAccount"],
  }),
});

```

### StorageAccountPutEncryptionScopeWithInfrastructureEncryption
```js
provider.Storage.makeEncryptionScope({
  name: "myEncryptionScope",
  properties: () => ({ properties: { requireInfrastructureEncryption: true } }),
  dependencies: ({ resources }) => ({
    resourceGroup: resources.Resources.ResourceGroup["myResourceGroup"],
    account: resources.Storage.StorageAccount["myStorageAccount"],
  }),
});

```
## Dependencies
- [ResourceGroup](../Resources/ResourceGroup.md)
- [StorageAccount](../Storage/StorageAccount.md)
## Misc
The resource version is `2021-06-01`.

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/storage/resource-manager/Microsoft.Storage/stable/2021-06-01/storage.json).
