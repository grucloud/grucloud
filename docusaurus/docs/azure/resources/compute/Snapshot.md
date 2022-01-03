---
id: Snapshot
title: Snapshot
---
Provides a **Snapshot** from the **Compute** group
## Examples
### Create a snapshot from an existing snapshot in the same or a different subscription.
```js
provider.Compute.makeSnapshot({
  name: "mySnapshot",
  properties: () => ({
    location: "West US",
    properties: {
      creationData: {
        createOption: "Copy",
        sourceResourceId:
          "subscriptions/{subscription-id}/resourceGroups/myResourceGroup/providers/Microsoft.Compute/snapshots/mySnapshot1",
      },
    },
  }),
  dependencies: ({ resources }) => ({
    resourceGroup: resources.Resources.ResourceGroup["myResourceGroup"],
    storageAccount: resources.Storage.StorageAccount["myStorageAccount"],
    image: resources.Compute.Image["myImage"],
    vault: resources.KeyVault.Vault["myVault"],
    diskEncryptionSet:
      resources.Compute.DiskEncryptionSet["myDiskEncryptionSet"],
    diskAccess: resources.Compute.DiskAccess["myDiskAccess"],
  }),
});

```

### Create a snapshot by importing an unmanaged blob from the same subscription.
```js
provider.Compute.makeSnapshot({
  name: "mySnapshot",
  properties: () => ({
    location: "West US",
    properties: {
      creationData: {
        createOption: "Import",
        sourceUri:
          "https://mystorageaccount.blob.core.windows.net/osimages/osimage.vhd",
      },
    },
  }),
  dependencies: ({ resources }) => ({
    resourceGroup: resources.Resources.ResourceGroup["myResourceGroup"],
    storageAccount: resources.Storage.StorageAccount["myStorageAccount"],
    image: resources.Compute.Image["myImage"],
    vault: resources.KeyVault.Vault["myVault"],
    diskEncryptionSet:
      resources.Compute.DiskEncryptionSet["myDiskEncryptionSet"],
    diskAccess: resources.Compute.DiskAccess["myDiskAccess"],
  }),
});

```

### Create a snapshot by importing an unmanaged blob from a different subscription.
```js
provider.Compute.makeSnapshot({
  name: "mySnapshot",
  properties: () => ({
    location: "West US",
    properties: {
      creationData: {
        createOption: "Import",
        storageAccountId:
          "subscriptions/{subscription-id}/resourceGroups/myResourceGroup/providers/Microsoft.Storage/storageAccounts/myStorageAccount",
        sourceUri:
          "https://mystorageaccount.blob.core.windows.net/osimages/osimage.vhd",
      },
    },
  }),
  dependencies: ({ resources }) => ({
    resourceGroup: resources.Resources.ResourceGroup["myResourceGroup"],
    storageAccount: resources.Storage.StorageAccount["myStorageAccount"],
    image: resources.Compute.Image["myImage"],
    vault: resources.KeyVault.Vault["myVault"],
    diskEncryptionSet:
      resources.Compute.DiskEncryptionSet["myDiskEncryptionSet"],
    diskAccess: resources.Compute.DiskAccess["myDiskAccess"],
  }),
});

```

### Create a snapshot from an existing snapshot in the same or a different subscription in a different region.
```js
provider.Compute.makeSnapshot({
  name: "mySnapshot",
  properties: () => ({
    location: "West US",
    properties: {
      creationData: {
        createOption: "CopyStart",
        sourceResourceId:
          "subscriptions/{subscription-id}/resourceGroups/myResourceGroup/providers/Microsoft.Compute/snapshots/mySnapshot1",
      },
    },
  }),
  dependencies: ({ resources }) => ({
    resourceGroup: resources.Resources.ResourceGroup["myResourceGroup"],
    storageAccount: resources.Storage.StorageAccount["myStorageAccount"],
    image: resources.Compute.Image["myImage"],
    vault: resources.KeyVault.Vault["myVault"],
    diskEncryptionSet:
      resources.Compute.DiskEncryptionSet["myDiskEncryptionSet"],
    diskAccess: resources.Compute.DiskAccess["myDiskAccess"],
  }),
});

```
## Dependencies
- [ResourceGroup](../Resources/ResourceGroup.md)
- [StorageAccount](../Storage/StorageAccount.md)
- [Image](../Compute/Image.md)
- [Vault](../KeyVault/Vault.md)
- [DiskEncryptionSet](../Compute/DiskEncryptionSet.md)
- [DiskAccess](../Compute/DiskAccess.md)
## Misc
The resource version is `2021-04-01`.

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/compute/resource-manager/Microsoft.Compute/stable/2021-04-01/disk.json).
