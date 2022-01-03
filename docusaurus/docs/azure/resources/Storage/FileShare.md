---
id: FileShare
title: FileShare
---
Provides a **FileShare** from the **Storage** group
## Examples
### PutShares
```js
provider.Storage.makeFileShare({
  name: "myFileShare",
  dependencies: ({ resources }) => ({
    resourceGroup: resources.Resources.ResourceGroup["myResourceGroup"],
    account: resources.Storage.StorageAccount["myStorageAccount"],
  }),
});

```

### Create NFS Shares
```js
provider.Storage.makeFileShare({
  name: "myFileShare",
  properties: () => ({ properties: { enabledProtocols: "NFS" } }),
  dependencies: ({ resources }) => ({
    resourceGroup: resources.Resources.ResourceGroup["myResourceGroup"],
    account: resources.Storage.StorageAccount["myStorageAccount"],
  }),
});

```

### PutShares with Access Tier
```js
provider.Storage.makeFileShare({
  name: "myFileShare",
  properties: () => ({ properties: { accessTier: "Hot" } }),
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

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/storage/resource-manager/Microsoft.Storage/stable/2021-06-01/file.json).
