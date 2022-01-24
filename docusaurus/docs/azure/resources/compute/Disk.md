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
    key: resources.KeyVault.Key["myKey"],
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
    key: resources.KeyVault.Key["myKey"],
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
    key: resources.KeyVault.Key["myKey"],
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
    key: resources.KeyVault.Key["myKey"],
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
    key: resources.KeyVault.Key["myKey"],
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
    key: resources.KeyVault.Key["myKey"],
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
    key: resources.KeyVault.Key["myKey"],
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
    key: resources.KeyVault.Key["myKey"],
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
    key: resources.KeyVault.Key["myKey"],
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
    key: resources.KeyVault.Key["myKey"],
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
    key: resources.KeyVault.Key["myKey"],
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
    key: resources.KeyVault.Key["myKey"],
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
    key: resources.KeyVault.Key["myKey"],
    diskEncryptionSet:
      resources.Compute.DiskEncryptionSet["myDiskEncryptionSet"],
    diskAccess: resources.Compute.DiskAccess["myDiskAccess"],
  }),
});

```

### Create a managed disk from ImportSecure create option
```js
provider.Compute.makeDisk({
  name: "myDisk",
  properties: () => ({
    location: "West US",
    properties: {
      osType: "Windows",
      securityProfile: {
        securityType: "ConfidentialVM_VMGuestStateOnlyEncryptedWithPlatformKey",
      },
      creationData: {
        createOption: "ImportSecure",
        storageAccountId:
          "subscriptions/{subscriptionId}/resourceGroups/myResourceGroup/providers/Microsoft.Storage/storageAccounts/myStorageAccount",
        sourceUri:
          "https://mystorageaccount.blob.core.windows.net/osimages/osimage.vhd",
        securityDataUri:
          "https://mystorageaccount.blob.core.windows.net/osimages/vmgs.vhd",
      },
    },
  }),
  dependencies: ({ resources }) => ({
    resourceGroup: resources.Resources.ResourceGroup["myResourceGroup"],
    storageAccount: resources.Storage.StorageAccount["myStorageAccount"],
    image: resources.Compute.Image["myImage"],
    vault: resources.KeyVault.Vault["myVault"],
    key: resources.KeyVault.Key["myKey"],
    diskEncryptionSet:
      resources.Compute.DiskEncryptionSet["myDiskEncryptionSet"],
    diskAccess: resources.Compute.DiskAccess["myDiskAccess"],
  }),
});

```

### Create a managed disk from UploadPreparedSecure create option
```js
provider.Compute.makeDisk({
  name: "myDisk",
  properties: () => ({
    location: "West US",
    properties: {
      osType: "Windows",
      securityProfile: { securityType: "TrustedLaunch" },
      creationData: {
        createOption: "UploadPreparedSecure",
        uploadSizeBytes: 10737418752,
      },
    },
  }),
  dependencies: ({ resources }) => ({
    resourceGroup: resources.Resources.ResourceGroup["myResourceGroup"],
    storageAccount: resources.Storage.StorageAccount["myStorageAccount"],
    image: resources.Compute.Image["myImage"],
    vault: resources.KeyVault.Vault["myVault"],
    key: resources.KeyVault.Key["myKey"],
    diskEncryptionSet:
      resources.Compute.DiskEncryptionSet["myDiskEncryptionSet"],
    diskAccess: resources.Compute.DiskAccess["myDiskAccess"],
  }),
});

```

### Create a confidential VM supported disk encrypted with customer managed key
```js
provider.Compute.makeDisk({
  name: "myDisk",
  properties: () => ({
    location: "West US",
    properties: {
      osType: "Windows",
      securityProfile: {
        securityType: "ConfidentialVM_DiskEncryptedWithCustomerKey",
        secureVMDiskEncryptionSetId:
          "/subscriptions/{subscriptionId}/resourceGroups/myResourceGroup/providers/Microsoft.Compute/diskEncryptionSets/{diskEncryptionSetName}",
      },
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
    key: resources.KeyVault.Key["myKey"],
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
- [Key](../KeyVault/Key.md)
- [DiskEncryptionSet](../Compute/DiskEncryptionSet.md)
- [DiskAccess](../Compute/DiskAccess.md)
## Swagger Schema
```js
{
  properties: {
    managedBy: {
      readOnly: true,
      type: 'string',
      description: 'A relative URI containing the ID of the VM that has the disk attached.'
    },
    managedByExtended: {
      readOnly: true,
      type: 'array',
      items: { type: 'string' },
      description: 'List of relative URIs containing the IDs of the VMs that have the disk attached. maxShares should be set to a value greater than one for disks to allow attaching them to multiple VMs.'
    },
    sku: {
      properties: {
        name: {
          type: 'string',
          enum: [
            'Standard_LRS',
            'Premium_LRS',
            'StandardSSD_LRS',
            'UltraSSD_LRS',
            'Premium_ZRS',
            'StandardSSD_ZRS'
          ],
          'x-ms-enum': {
            name: 'DiskStorageAccountTypes',
            modelAsString: true,
            values: [
              {
                value: 'Standard_LRS',
                description: 'Standard HDD locally redundant storage. Best for backup, non-critical, and infrequent access.'
              },
              {
                value: 'Premium_LRS',
                description: 'Premium SSD locally redundant storage. Best for production and performance sensitive workloads.'
              },
              {
                value: 'StandardSSD_LRS',
                description: 'Standard SSD locally redundant storage. Best for web servers, lightly used enterprise applications and dev/test.'
              },
              {
                value: 'UltraSSD_LRS',
                description: 'Ultra SSD locally redundant storage. Best for IO-intensive workloads such as SAP HANA, top tier databases (for example, SQL, Oracle), and other transaction-heavy workloads.'
              },
              {
                value: 'Premium_ZRS',
                description: 'Premium SSD zone redundant storage. Best for the production workloads that need storage resiliency against zone failures.'
              },
              {
                value: 'StandardSSD_ZRS',
                description: 'Standard SSD zone redundant storage. Best for web servers, lightly used enterprise applications and dev/test that need storage resiliency against zone failures.'
              }
            ]
          },
          description: 'The sku name.'
        },
        tier: {
          type: 'string',
          readOnly: true,
          description: 'The sku tier.'
        }
      },
      description: 'The disks sku name. Can be Standard_LRS, Premium_LRS, StandardSSD_LRS, UltraSSD_LRS, Premium_ZRS, or StandardSSD_ZRS.'
    },
    zones: {
      type: 'array',
      items: { type: 'string' },
      description: 'The Logical zone list for Disk.'
    },
    extendedLocation: {
      description: 'The extended location where the disk will be created. Extended location cannot be changed.',
      properties: {
        name: {
          type: 'string',
          description: 'The name of the extended location.'
        },
        type: {
          description: 'The type of the extended location.',
          type: 'string',
          enum: [ 'EdgeZone' ],
          'x-ms-enum': { name: 'ExtendedLocationTypes', modelAsString: true }
        }
      }
    },
    properties: {
      'x-ms-client-flatten': true,
      properties: {
        timeCreated: {
          readOnly: true,
          type: 'string',
          format: 'date-time',
          description: 'The time when the disk was created.'
        },
        osType: {
          type: 'string',
          description: 'The Operating System type.',
          enum: [ 'Windows', 'Linux' ],
          'x-ms-enum': { name: 'OperatingSystemTypes', modelAsString: false }
        },
        hyperVGeneration: {
          type: 'string',
          description: 'The hypervisor generation of the Virtual Machine. Applicable to OS disks only.',
          enum: [ 'V1', 'V2' ],
          'x-ms-enum': { name: 'HyperVGeneration', modelAsString: true }
        },
        purchasePlan: {
          description: 'Purchase plan information for the the image from which the OS disk was created. E.g. - {name: 2019-Datacenter, publisher: MicrosoftWindowsServer, product: WindowsServer}',
          properties: {
            name: { type: 'string', description: 'The plan ID.' },
            publisher: { type: 'string', description: 'The publisher ID.' },
            product: {
              type: 'string',
              description: 'Specifies the product of the image from the marketplace. This is the same value as Offer under the imageReference element.'
            },
            promotionCode: {
              type: 'string',
              description: 'The Offer Promotion Code.'
            }
          },
          required: [ 'publisher', 'name', 'product' ]
        },
        supportedCapabilities: {
          description: 'List of supported capabilities for the image from which the OS disk was created.',
          type: 'object',
          properties: {
            acceleratedNetwork: {
              type: 'boolean',
              description: 'True if the image from which the OS disk is created supports accelerated networking.'
            }
          }
        },
        creationData: {
          description: 'Disk source information. CreationData information cannot be changed after the disk has been created.',
          properties: {
            createOption: {
              type: 'string',
              enum: [
                'Empty',
                'Attach',
                'FromImage',
                'Import',
                'Copy',
                'Restore',
                'Upload',
                'CopyStart',
                'ImportSecure',
                'UploadPreparedSecure'
              ],
              'x-ms-enum': {
                name: 'DiskCreateOption',
                modelAsString: true,
                values: [
                  {
                    value: 'Empty',
                    description: 'Create an empty data disk of a size given by diskSizeGB.'
                  },
                  {
                    value: 'Attach',
                    description: 'Disk will be attached to a VM.'
                  },
                  {
                    value: 'FromImage',
                    description: 'Create a new disk from a platform image specified by the given imageReference or galleryImageReference.'
                  },
                  {
                    value: 'Import',
                    description: 'Create a disk by importing from a blob specified by a sourceUri in a storage account specified by storageAccountId.'
                  },
                  {
                    value: 'Copy',
                    description: 'Create a new disk or snapshot by copying from a disk or snapshot specified by the given sourceResourceId.'
                  },
                  {
                    value: 'Restore',
                    description: 'Create a new disk by copying from a backup recovery point.'
                  },
                  {
                    value: 'Upload',
                    description: 'Create a new disk by obtaining a write token and using it to directly upload the contents of the disk.'
                  },
                  {
                    value: 'CopyStart',
                    description: 'Create a new disk by using a deep copy process, where the resource creation is considered complete only after all data has been copied from the source.'
                  },
                  {
                    value: 'ImportSecure',
                    description: 'Similar to Import create option. Create a new Trusted Launch VM or Confidential VM supported disk by importing additional blob for VM guest state specified by securityDataUri in storage account specified by storageAccountId'
                  },
                  {
                    value: 'UploadPreparedSecure',
                    description: 'Similar to Upload create option. Create a new Trusted Launch VM or Confidential VM supported disk and upload using write token in both disk and VM guest state'
                  }
                ]
              },
              description: "This enumerates the possible sources of a disk's creation."
            },
            storageAccountId: {
              type: 'string',
              description: 'Required if createOption is Import. The Azure Resource Manager identifier of the storage account containing the blob to import as a disk.'
            },
            imageReference: {
              description: 'Disk source information.',
              properties: {
                id: {
                  type: 'string',
                  description: 'A relative uri containing either a Platform Image Repository or user image reference.'
                },
                lun: {
                  type: 'integer',
                  format: 'int32',
                  description: "If the disk is created from an image's data disk, this is an index that indicates which of the data disks in the image to use. For OS disks, this field is null."
                }
              },
              required: [ 'id' ]
            },
            galleryImageReference: {
              description: 'Required if creating from a Gallery Image. The id of the ImageDiskReference will be the ARM id of the shared galley image version from which to create a disk.',
              properties: {
                id: {
                  type: 'string',
                  description: 'A relative uri containing either a Platform Image Repository or user image reference.'
                },
                lun: {
                  type: 'integer',
                  format: 'int32',
                  description: "If the disk is created from an image's data disk, this is an index that indicates which of the data disks in the image to use. For OS disks, this field is null."
                }
              },
              required: [ 'id' ]
            },
            sourceUri: {
              type: 'string',
              description: 'If createOption is Import, this is the URI of a blob to be imported into a managed disk.'
            },
            sourceResourceId: {
              type: 'string',
              description: 'If createOption is Copy, this is the ARM id of the source snapshot or disk.'
            },
            sourceUniqueId: {
              readOnly: true,
              type: 'string',
              description: 'If this field is set, this is the unique id identifying the source of this resource.'
            },
            uploadSizeBytes: {
              type: 'integer',
              format: 'int64',
              description: 'If createOption is Upload, this is the size of the contents of the upload including the VHD footer. This value should be between 20972032 (20 MiB + 512 bytes for the VHD footer) and 35183298347520 bytes (32 TiB + 512 bytes for the VHD footer).'
            },
            logicalSectorSize: {
              type: 'integer',
              format: 'int32',
              description: 'Logical sector size in bytes for Ultra disks. Supported values are 512 ad 4096. 4096 is the default.'
            },
            securityDataUri: {
              type: 'string',
              description: 'If createOption is ImportSecure, this is the URI of a blob to be imported into VM guest state.'
            }
          },
          required: [ 'createOption' ]
        },
        diskSizeGB: {
          type: 'integer',
          format: 'int32',
          description: "If creationData.createOption is Empty, this field is mandatory and it indicates the size of the disk to create. If this field is present for updates or creation with other options, it indicates a resize. Resizes are only allowed if the disk is not attached to a running VM, and can only increase the disk's size."
        },
        diskSizeBytes: {
          type: 'integer',
          format: 'int64',
          readOnly: true,
          description: 'The size of the disk in bytes. This field is read only.'
        },
        uniqueId: {
          type: 'string',
          readOnly: true,
          description: 'Unique Guid identifying the resource.'
        },
        encryptionSettingsCollection: {
          description: 'Encryption settings collection used for Azure Disk Encryption, can contain multiple encryption settings per disk or snapshot.',
          properties: {
            enabled: {
              type: 'boolean',
              description: 'Set this flag to true and provide DiskEncryptionKey and optional KeyEncryptionKey to enable encryption. Set this flag to false and remove DiskEncryptionKey and KeyEncryptionKey to disable encryption. If EncryptionSettings is null in the request object, the existing settings remain unchanged.'
            },
            encryptionSettings: {
              type: 'array',
              items: {
                properties: {
                  diskEncryptionKey: {
                    description: 'Key Vault Secret Url and vault id of the disk encryption key',
                    properties: {
                      sourceVault: {
                        description: 'Resource id of the KeyVault containing the key or secret',
                        properties: {
                          id: {
                            type: 'string',
                            description: 'Resource Id'
                          }
                        }
                      },
                      secretUrl: {
                        type: 'string',
                        description: 'Url pointing to a key or secret in KeyVault'
                      }
                    },
                    required: [ 'secretUrl', 'sourceVault' ]
                  },
                  keyEncryptionKey: {
                    description: 'Key Vault Key Url and vault id of the key encryption key. KeyEncryptionKey is optional and when provided is used to unwrap the disk encryption key.',
                    properties: {
                      sourceVault: {
                        description: 'Resource id of the KeyVault containing the key or secret',
                        properties: {
                          id: {
                            type: 'string',
                            description: 'Resource Id'
                          }
                        }
                      },
                      keyUrl: {
                        type: 'string',
                        description: 'Url pointing to a key or secret in KeyVault'
                      }
                    },
                    required: [ 'keyUrl', 'sourceVault' ]
                  }
                },
                description: 'Encryption settings for one disk volume.'
              },
              description: 'A collection of encryption settings, one for each disk volume.'
            },
            encryptionSettingsVersion: {
              type: 'string',
              description: "Describes what type of encryption is used for the disks. Once this field is set, it cannot be overwritten. '1.0' corresponds to Azure Disk Encryption with AAD app.'1.1' corresponds to Azure Disk Encryption."
            }
          },
          required: [ 'enabled' ]
        },
        provisioningState: {
          readOnly: true,
          type: 'string',
          description: 'The disk provisioning state.'
        },
        diskIOPSReadWrite: {
          type: 'integer',
          format: 'int64',
          description: 'The number of IOPS allowed for this disk; only settable for UltraSSD disks. One operation can transfer between 4k and 256k bytes.'
        },
        diskMBpsReadWrite: {
          type: 'integer',
          format: 'int64',
          description: 'The bandwidth allowed for this disk; only settable for UltraSSD disks. MBps means millions of bytes per second - MB here uses the ISO notation, of powers of 10.'
        },
        diskIOPSReadOnly: {
          type: 'integer',
          format: 'int64',
          description: 'The total number of IOPS that will be allowed across all VMs mounting the shared disk as ReadOnly. One operation can transfer between 4k and 256k bytes.'
        },
        diskMBpsReadOnly: {
          type: 'integer',
          format: 'int64',
          description: 'The total throughput (MBps) that will be allowed across all VMs mounting the shared disk as ReadOnly. MBps means millions of bytes per second - MB here uses the ISO notation, of powers of 10.'
        },
        diskState: {
          description: 'The state of the disk.',
          type: 'string',
          readOnly: true,
          enum: [
            'Unattached',
            'Attached',
            'Reserved',
            'Frozen',
            'ActiveSAS',
            'ActiveSASFrozen',
            'ReadyToUpload',
            'ActiveUpload'
          ],
          'x-ms-enum': {
            name: 'DiskState',
            modelAsString: true,
            values: [
              {
                value: 'Unattached',
                description: 'The disk is not being used and can be attached to a VM.'
              },
              {
                value: 'Attached',
                description: 'The disk is currently attached to a running VM.'
              },
              {
                value: 'Reserved',
                description: 'The disk is attached to a stopped-deallocated VM.'
              },
              {
                value: 'Frozen',
                description: 'The disk is attached to a VM which is in hibernated state.'
              },
              {
                value: 'ActiveSAS',
                description: 'The disk currently has an Active SAS Uri associated with it.'
              },
              {
                value: 'ActiveSASFrozen',
                description: 'The disk is attached to a VM in hibernated state and has an active SAS URI associated with it.'
              },
              {
                value: 'ReadyToUpload',
                description: 'A disk is ready to be created by upload by requesting a write token.'
              },
              {
                value: 'ActiveUpload',
                description: 'A disk is created for upload and a write token has been issued for uploading to it.'
              }
            ]
          }
        },
        encryption: {
          description: 'Encryption property can be used to encrypt data at rest with customer managed keys or platform managed keys.',
          properties: {
            diskEncryptionSetId: {
              type: 'string',
              description: 'ResourceId of the disk encryption set to use for enabling encryption at rest.'
            },
            type: {
              type: 'string',
              description: 'The type of key used to encrypt the data of the disk.',
              enum: [
                'EncryptionAtRestWithPlatformKey',
                'EncryptionAtRestWithCustomerKey',
                'EncryptionAtRestWithPlatformAndCustomerKeys'
              ],
              'x-ms-enum': {
                name: 'EncryptionType',
                modelAsString: true,
                values: [
                  {
                    value: 'EncryptionAtRestWithPlatformKey',
                    description: 'Disk is encrypted at rest with Platform managed key. It is the default encryption type. This is not a valid encryption type for disk encryption sets.'
                  },
                  {
                    value: 'EncryptionAtRestWithCustomerKey',
                    description: 'Disk is encrypted at rest with Customer managed key that can be changed and revoked by a customer.'
                  },
                  {
                    value: 'EncryptionAtRestWithPlatformAndCustomerKeys',
                    description: 'Disk is encrypted at rest with 2 layers of encryption. One of the keys is Customer managed and the other key is Platform managed.'
                  }
                ]
              }
            }
          }
        },
        maxShares: {
          type: 'integer',
          format: 'int32',
          description: 'The maximum number of VMs that can attach to the disk at the same time. Value greater than one indicates a disk that can be mounted on multiple VMs at the same time.'
        },
        shareInfo: {
          readOnly: true,
          type: 'array',
          items: {
            properties: {
              vmUri: {
                readOnly: true,
                type: 'string',
                description: 'A relative URI containing the ID of the VM that has the disk attached.'
              }
            }
          },
          description: 'Details of the list of all VMs that have the disk attached. maxShares should be set to a value greater than one for disks to allow attaching them to multiple VMs.'
        },
        networkAccessPolicy: {
          type: 'string',
          description: 'Policy for accessing the disk via network.',
          enum: [ 'AllowAll', 'AllowPrivate', 'DenyAll' ],
          'x-ms-enum': {
            name: 'NetworkAccessPolicy',
            modelAsString: true,
            values: [
              {
                value: 'AllowAll',
                description: 'The disk can be exported or uploaded to from any network.'
              },
              {
                value: 'AllowPrivate',
                description: "The disk can be exported or uploaded to using a DiskAccess resource's private endpoints."
              },
              {
                value: 'DenyAll',
                description: 'The disk cannot be exported.'
              }
            ]
          }
        },
        diskAccessId: {
          type: 'string',
          description: 'ARM id of the DiskAccess resource for using private endpoints on disks.'
        },
        tier: {
          type: 'string',
          description: 'Performance tier of the disk (e.g, P4, S10) as described here: https://azure.microsoft.com/en-us/pricing/details/managed-disks/. Does not apply to Ultra disks.'
        },
        burstingEnabled: {
          type: 'boolean',
          description: 'Set to true to enable bursting beyond the provisioned performance target of the disk. Bursting is disabled by default. Does not apply to Ultra disks.'
        },
        propertyUpdatesInProgress: {
          readOnly: true,
          description: 'Properties of the disk for which update is pending.',
          properties: {
            targetTier: {
              type: 'string',
              description: 'The target performance tier of the disk if a tier change operation is in progress.'
            }
          }
        },
        supportsHibernation: {
          type: 'boolean',
          description: 'Indicates the OS on a disk supports hibernation.'
        },
        securityProfile: {
          description: 'Contains the security related information for the resource.',
          properties: {
            securityType: {
              type: 'string',
              description: 'Specifies the SecurityType of the VM. Applicable for OS disks only.',
              enum: [
                'TrustedLaunch',
                'ConfidentialVM_VMGuestStateOnlyEncryptedWithPlatformKey',
                'ConfidentialVM_DiskEncryptedWithPlatformKey',
                'ConfidentialVM_DiskEncryptedWithCustomerKey'
              ],
              'x-ms-enum': {
                name: 'DiskSecurityTypes',
                modelAsString: true,
                values: [
                  {
                    value: 'TrustedLaunch',
                    description: 'Trusted Launch provides security features such as secure boot and virtual Trusted Platform Module (vTPM)'
                  },
                  {
                    value: 'ConfidentialVM_VMGuestStateOnlyEncryptedWithPlatformKey',
                    description: 'Indicates Confidential VM disk with only VM guest state encrypted'
                  },
                  {
                    value: 'ConfidentialVM_DiskEncryptedWithPlatformKey',
                    description: 'Indicates Confidential VM disk with both OS disk and VM guest state encrypted with a platform managed key'
                  },
                  {
                    value: 'ConfidentialVM_DiskEncryptedWithCustomerKey',
                    description: 'Indicates Confidential VM disk with both OS disk and VM guest state encrypted with a customer managed key'
                  }
                ]
              }
            },
            secureVMDiskEncryptionSetId: {
              type: 'string',
              description: 'ResourceId of the disk encryption set associated to Confidential VM supported disk encrypted with customer managed key'
            }
          }
        },
        completionPercent: {
          type: 'number',
          description: 'Percentage complete for the background copy when a resource is created via the CopyStart operation.'
        },
        publicNetworkAccess: {
          type: 'string',
          description: 'Policy for controlling export on the disk.',
          enum: [ 'Enabled', 'Disabled' ],
          'x-ms-enum': {
            name: 'PublicNetworkAccess',
            modelAsString: true,
            values: [
              {
                value: 'Enabled',
                description: 'You can generate a SAS URI to access the underlying data of the disk publicly on the internet when NetworkAccessPolicy is set to AllowAll. You can access the data via the SAS URI only from your trusted Azure VNET when NetworkAccessPolicy is set to AllowPrivate.'
              },
              {
                value: 'Disabled',
                description: 'You cannot access the underlying data of the disk publicly on the internet even when NetworkAccessPolicy is set to AllowAll. You can access the data via the SAS URI only from your trusted Azure VNET when NetworkAccessPolicy is set to AllowPrivate.'
              }
            ]
          }
        }
      },
      required: [ 'creationData' ],
      description: 'Disk resource properties.'
    }
  },
  allOf: [
    {
      description: 'The Resource model definition.',
      properties: {
        id: { readOnly: true, type: 'string', description: 'Resource Id' },
        name: {
          readOnly: true,
          type: 'string',
          description: 'Resource name'
        },
        type: {
          readOnly: true,
          type: 'string',
          description: 'Resource type'
        },
        location: { type: 'string', description: 'Resource location' },
        tags: {
          type: 'object',
          additionalProperties: { type: 'string' },
          description: 'Resource tags'
        }
      },
      required: [ 'location' ],
      'x-ms-azure-resource': true
    }
  ],
  description: 'Disk resource.'
}
```
## Misc
The resource version is `2021-08-01`.

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/compute/resource-manager/Microsoft.Compute/stable/2021-08-01/disk.json).
