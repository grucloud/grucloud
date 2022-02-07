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
  dependencies: ({}) => ({
    resourceGroup: "myResourceGroup",
    account: "myStorageAccount",
  }),
});

```

### Create NFS Shares
```js
provider.Storage.makeFileShare({
  name: "myFileShare",
  properties: () => ({ properties: { enabledProtocols: "NFS" } }),
  dependencies: ({}) => ({
    resourceGroup: "myResourceGroup",
    account: "myStorageAccount",
  }),
});

```

### PutShares with Access Tier
```js
provider.Storage.makeFileShare({
  name: "myFileShare",
  properties: () => ({ properties: { accessTier: "Hot" } }),
  dependencies: ({}) => ({
    resourceGroup: "myResourceGroup",
    account: "myStorageAccount",
  }),
});

```
## Dependencies
- [ResourceGroup](../Resources/ResourceGroup.md)
- [StorageAccount](../Storage/StorageAccount.md)
## Swagger Schema
```js
{
  properties: {
    properties: {
      'x-ms-client-flatten': true,
      'x-ms-client-name': 'FileShareProperties',
      description: 'Properties of the file share.',
      properties: {
        lastModifiedTime: {
          type: 'string',
          format: 'date-time',
          readOnly: true,
          description: 'Returns the date and time the share was last modified.'
        },
        metadata: {
          type: 'object',
          additionalProperties: { type: 'string' },
          description: 'A name-value pair to associate with the share as metadata.'
        },
        shareQuota: {
          type: 'integer',
          minimum: 1,
          maximum: 102400,
          description: 'The maximum size of the share, in gigabytes. Must be greater than 0, and less than or equal to 5TB (5120). For Large File Shares, the maximum size is 102400.'
        },
        enabledProtocols: {
          type: 'string',
          enum: [ 'SMB', 'NFS' ],
          'x-ms-enum': { name: 'EnabledProtocols', modelAsString: true },
          description: 'The authentication protocol that is used for the file share. Can only be specified when creating a share.',
          'x-ms-mutability': [ 'create', 'read' ]
        },
        rootSquash: {
          type: 'string',
          enum: [ 'NoRootSquash', 'RootSquash', 'AllSquash' ],
          'x-ms-enum': { name: 'RootSquashType', modelAsString: true },
          description: 'The property is for NFS share only. The default is NoRootSquash.'
        },
        version: {
          type: 'string',
          readOnly: true,
          description: 'The version of the share.'
        },
        deleted: {
          type: 'boolean',
          readOnly: true,
          description: 'Indicates whether the share was deleted.'
        },
        deletedTime: {
          type: 'string',
          format: 'date-time',
          readOnly: true,
          description: 'The deleted time if the share was deleted.'
        },
        remainingRetentionDays: {
          type: 'integer',
          readOnly: true,
          description: 'Remaining retention days for share that was soft deleted.'
        },
        accessTier: {
          type: 'string',
          enum: [ 'TransactionOptimized', 'Hot', 'Cool', 'Premium' ],
          'x-ms-enum': { name: 'ShareAccessTier', modelAsString: true },
          description: 'Access tier for specific share. GpV2 account can choose between TransactionOptimized (default), Hot, and Cool. FileStorage account can choose Premium.'
        },
        accessTierChangeTime: {
          type: 'string',
          format: 'date-time',
          readOnly: true,
          description: 'Indicates the last modification time for share access tier.'
        },
        accessTierStatus: {
          type: 'string',
          readOnly: true,
          description: 'Indicates if there is a pending transition for access tier.'
        },
        shareUsageBytes: {
          type: 'integer',
          format: 'int64',
          readOnly: true,
          description: 'The approximate size of the data stored on the share. Note that this value may not include all recently created or recently resized files.'
        },
        leaseStatus: {
          type: 'string',
          readOnly: true,
          enum: [ 'Locked', 'Unlocked' ],
          'x-ms-enum': { name: 'LeaseStatus', modelAsString: true },
          description: 'The lease status of the share.'
        },
        leaseState: {
          type: 'string',
          readOnly: true,
          enum: [ 'Available', 'Leased', 'Expired', 'Breaking', 'Broken' ],
          'x-ms-enum': { name: 'LeaseState', modelAsString: true },
          description: 'Lease state of the share.'
        },
        leaseDuration: {
          type: 'string',
          readOnly: true,
          enum: [ 'Infinite', 'Fixed' ],
          'x-ms-enum': { name: 'LeaseDuration', modelAsString: true },
          description: 'Specifies whether the lease on a share is of infinite or fixed duration, only when the share is leased.'
        },
        signedIdentifiers: {
          type: 'array',
          items: {
            properties: {
              id: {
                type: 'string',
                description: 'An unique identifier of the stored access policy.'
              },
              accessPolicy: {
                description: 'Access policy',
                properties: {
                  startTime: {
                    type: 'string',
                    format: 'date-time',
                    description: 'Start time of the access policy'
                  },
                  expiryTime: {
                    type: 'string',
                    format: 'date-time',
                    description: 'Expiry time of the access policy'
                  },
                  permission: {
                    type: 'string',
                    description: 'List of abbreviated permissions.'
                  }
                }
              }
            }
          },
          description: 'List of stored access policies specified on the share.'
        },
        snapshotTime: {
          type: 'string',
          format: 'date-time',
          readOnly: true,
          description: 'Creation time of share snapshot returned in the response of list shares with expand param "snapshots".'
        }
      }
    }
  },
  allOf: [
    {
      'x-ms-client-name': 'AzureEntityResource',
      title: 'Entity Resource',
      description: 'The resource model definition for an Azure Resource Manager resource with an etag.',
      type: 'object',
      properties: {
        etag: {
          type: 'string',
          readOnly: true,
          description: 'Resource Etag.'
        }
      },
      allOf: [
        {
          title: 'Resource',
          description: 'Common fields that are returned in the response for all Azure Resource Manager resources',
          type: 'object',
          properties: {
            id: {
              readOnly: true,
              type: 'string',
              description: 'Fully qualified resource ID for the resource. Ex - /subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/{resourceProviderNamespace}/{resourceType}/{resourceName}'
            },
            name: {
              readOnly: true,
              type: 'string',
              description: 'The name of the resource'
            },
            type: {
              readOnly: true,
              type: 'string',
              description: 'The type of the resource. E.g. "Microsoft.Compute/virtualMachines" or "Microsoft.Storage/storageAccounts"'
            }
          },
          'x-ms-azure-resource': true
        }
      ]
    }
  ],
  description: 'Properties of the file share, including Id, resource name, resource type, Etag.'
}
```
## Misc
The resource version is `2021-08-01`.

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/storage/resource-manager/Microsoft.Storage/stable/2021-08-01/file.json).
