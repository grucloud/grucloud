---
id: Disk
title: Disk
---
Provides a **Disk** from the **Compute** group
## Examples
### Create an empty managed disk.
```js
provider.Compute.makeDisk({
  name: "myDisk",
  properties: () => ({
    location: "West US",
    properties: { creationData: { createOption: "Empty" }, diskSizeGB: 200 },
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

### Create a managed disk from a platform image.
```js
provider.Compute.makeDisk({
  name: "myDisk",
  properties: () => ({
    location: "West US",
    properties: {
      osType: "Windows",
      creationData: {
        createOption: "FromImage",
        imageReference: {
          id: "/Subscriptions/{subscriptionId}/Providers/Microsoft.Compute/Locations/westus/Publishers/{publisher}/ArtifactTypes/VMImage/Offers/{offer}/Skus/{sku}/Versions/1.0.0",
        },
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

### Create a managed disk from an existing managed disk in the same or different subscription.
```js
provider.Compute.makeDisk({
  name: "myDisk",
  properties: () => ({
    location: "West US",
    properties: {
      creationData: {
        createOption: "Copy",
        sourceResourceId:
          "subscriptions/{subscriptionId}/resourceGroups/myResourceGroup/providers/Microsoft.Compute/disks/myDisk1",
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

### Create a managed disk by importing an unmanaged blob from the same subscription.
```js
provider.Compute.makeDisk({
  name: "myDisk",
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

### Create a managed disk by importing an unmanaged blob from a different subscription.
```js
provider.Compute.makeDisk({
  name: "myDisk",
  properties: () => ({
    location: "West US",
    properties: {
      creationData: {
        createOption: "Import",
        storageAccountId:
          "subscriptions/{subscriptionId}/resourceGroups/myResourceGroup/providers/Microsoft.Storage/storageAccounts/myStorageAccount",
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

### Create a managed disk by copying a snapshot.
```js
provider.Compute.makeDisk({
  name: "myDisk",
  properties: () => ({
    location: "West US",
    properties: {
      creationData: {
        createOption: "Copy",
        sourceResourceId:
          "subscriptions/{subscriptionId}/resourceGroups/myResourceGroup/providers/Microsoft.Compute/snapshots/mySnapshot",
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

### Create a managed upload disk.
```js
provider.Compute.makeDisk({
  name: "myDisk",
  properties: () => ({
    location: "West US",
    properties: {
      creationData: { createOption: "Upload", uploadSizeBytes: 10737418752 },
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

### Create a managed disk and associate with disk access resource.
```js
provider.Compute.makeDisk({
  name: "myDisk",
  properties: () => ({
    location: "West US",
    properties: {
      creationData: { createOption: "Empty" },
      diskSizeGB: 200,
      networkAccessPolicy: "AllowPrivate",
      diskAccessId:
        "/subscriptions/{subscription-id}/resourceGroups/myResourceGroup/providers/Microsoft.Compute/diskAccesses/{existing-diskAccess-name}",
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

### Create a managed disk and associate with disk encryption set.
```js
provider.Compute.makeDisk({
  name: "myDisk",
  properties: () => ({
    location: "West US",
    properties: {
      creationData: { createOption: "Empty" },
      diskSizeGB: 200,
      encryption: {
        diskEncryptionSetId:
          "/subscriptions/{subscription-id}/resourceGroups/myResourceGroup/providers/Microsoft.Compute/diskEncryptionSets/{existing-diskEncryptionSet-name}",
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

### Create an ultra managed disk with logicalSectorSize 512E
```js
provider.Compute.makeDisk({
  name: "myDisk",
  properties: () => ({
    location: "West US",
    sku: { name: "UltraSSD_LRS" },
    properties: {
      creationData: { createOption: "Empty", logicalSectorSize: 512 },
      diskSizeGB: 200,
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

### Create an empty managed disk in extended location.
```js
provider.Compute.makeDisk({
  name: "myDisk",
  properties: () => ({
    location: "West US",
    extendedLocation: { type: "EdgeZone", name: "{edge-zone-id}" },
    properties: { creationData: { createOption: "Empty" }, diskSizeGB: 200 },
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

### Create a managed disk with ssd zrs account type.
```js
provider.Compute.makeDisk({
  name: "myDisk",
  properties: () => ({
    location: "West US",
    sku: { name: "Premium_ZRS" },
    properties: { creationData: { createOption: "Empty" }, diskSizeGB: 200 },
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

### Create a managed disk with security profile
```js
provider.Compute.makeDisk({
  name: "myDisk",
  properties: () => ({
    location: "North Central US",
    properties: {
      osType: "Windows",
      securityProfile: { securityType: "TrustedLaunch" },
      creationData: {
        createOption: "FromImage",
        imageReference: {
          id: "/Subscriptions/{subscriptionId}/Providers/Microsoft.Compute/Locations/uswest/Publishers/Microsoft/ArtifactTypes/VMImage/Offers/{offer}",
        },
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
