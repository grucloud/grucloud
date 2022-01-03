---
id: BlobContainer
title: BlobContainer
---
Provides a **BlobContainer** from the **Storage** group
## Examples
### PutContainers
```js
provider.Storage.makeBlobContainer({
  name: "myBlobContainer",
  dependencies: ({ resources }) => ({
    resourceGroup: resources.Resources.ResourceGroup["myResourceGroup"],
    account: resources.Storage.StorageAccount["myStorageAccount"],
  }),
});

```

### PutContainerWithDefaultEncryptionScope
```js
provider.Storage.makeBlobContainer({
  name: "myBlobContainer",
  properties: () => ({
    properties: {
      defaultEncryptionScope: "encryptionscope185",
      denyEncryptionScopeOverride: true,
    },
  }),
  dependencies: ({ resources }) => ({
    resourceGroup: resources.Resources.ResourceGroup["myResourceGroup"],
    account: resources.Storage.StorageAccount["myStorageAccount"],
  }),
});

```

### PutContainerWithObjectLevelWorm
```js
provider.Storage.makeBlobContainer({
  name: "myBlobContainer",
  properties: () => ({
    properties: { immutableStorageWithVersioning: { enabled: true } },
  }),
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

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/storage/resource-manager/Microsoft.Storage/stable/2021-06-01/blob.json).
