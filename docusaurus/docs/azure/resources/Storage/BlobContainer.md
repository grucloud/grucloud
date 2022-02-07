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
  dependencies: ({}) => ({
    resourceGroup: "myResourceGroup",
    account: "myStorageAccount",
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
  dependencies: ({}) => ({
    resourceGroup: "myResourceGroup",
    account: "myStorageAccount",
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
      'x-ms-client-name': 'ContainerProperties',
      description: 'Properties of the blob container.',
      properties: {
        version: {
          type: 'string',
          readOnly: true,
          description: 'The version of the deleted blob container.'
        },
        deleted: {
          type: 'boolean',
          readOnly: true,
          description: 'Indicates whether the blob container was deleted.'
        },
        deletedTime: {
          type: 'string',
          format: 'date-time',
          readOnly: true,
          description: 'Blob container deletion time.'
        },
        remainingRetentionDays: {
          type: 'integer',
          readOnly: true,
          description: 'Remaining retention days for soft deleted blob container.'
        },
        defaultEncryptionScope: {
          type: 'string',
          description: 'Default the container to use specified encryption scope for all writes.'
        },
        denyEncryptionScopeOverride: {
          type: 'boolean',
          description: 'Block override of encryption scope from the container default.'
        },
        publicAccess: {
          type: 'string',
          enum: [ 'Container', 'Blob', 'None' ],
          'x-ms-enum': { name: 'PublicAccess', modelAsString: false },
          description: 'Specifies whether data in the container may be accessed publicly and the level of access.'
        },
        lastModifiedTime: {
          type: 'string',
          format: 'date-time',
          readOnly: true,
          description: 'Returns the date and time the container was last modified.'
        },
        leaseStatus: {
          type: 'string',
          readOnly: true,
          enum: [ 'Locked', 'Unlocked' ],
          'x-ms-enum': { name: 'LeaseStatus', modelAsString: true },
          description: 'The lease status of the container.'
        },
        leaseState: {
          type: 'string',
          readOnly: true,
          enum: [ 'Available', 'Leased', 'Expired', 'Breaking', 'Broken' ],
          'x-ms-enum': { name: 'LeaseState', modelAsString: true },
          description: 'Lease state of the container.'
        },
        leaseDuration: {
          type: 'string',
          readOnly: true,
          enum: [ 'Infinite', 'Fixed' ],
          'x-ms-enum': { name: 'LeaseDuration', modelAsString: true },
          description: 'Specifies whether the lease on a container is of infinite or fixed duration, only when the container is leased.'
        },
        metadata: {
          type: 'object',
          additionalProperties: { type: 'string' },
          description: 'A name-value pair to associate with the container as metadata.'
        },
        immutabilityPolicy: {
          readOnly: true,
          'x-ms-client-name': 'ImmutabilityPolicy',
          description: 'The ImmutabilityPolicy property of the container.',
          properties: {
            properties: {
              'x-ms-client-flatten': true,
              description: 'The properties of an ImmutabilityPolicy of a blob container.',
              properties: {
                immutabilityPeriodSinceCreationInDays: {
                  type: 'integer',
                  description: 'The immutability period for the blobs in the container since the policy creation, in days.'
                },
                state: {
                  type: 'string',
                  readOnly: true,
                  enum: [ 'Locked', 'Unlocked' ],
                  'x-ms-enum': {
                    name: 'ImmutabilityPolicyState',
                    modelAsString: true
                  },
                  description: 'The ImmutabilityPolicy state of a blob container, possible values include: Locked and Unlocked.'
                },
                allowProtectedAppendWrites: {
                  type: 'boolean',
                  description: 'This property can only be changed for unlocked time-based retention policies. When enabled, new blocks can be written to an append blob while maintaining immutability protection and compliance. Only new blocks can be added and any existing blocks cannot be modified or deleted. This property cannot be changed with ExtendImmutabilityPolicy API.'
                },
                allowProtectedAppendWritesAll: {
                  type: 'boolean',
                  description: "This property can only be changed for unlocked time-based retention policies. When enabled, new blocks can be written to both 'Append and Bock Blobs' while maintaining immutability protection and compliance. Only new blocks can be added and any existing blocks cannot be modified or deleted. This property cannot be changed with ExtendImmutabilityPolicy API. The 'allowProtectedAppendWrites' and 'allowProtectedAppendWritesAll' properties are mutually exclusive."
                }
              }
            },
            etag: {
              type: 'string',
              readOnly: true,
              description: 'ImmutabilityPolicy Etag.'
            },
            updateHistory: {
              type: 'array',
              readOnly: true,
              items: {
                properties: {
                  update: {
                    type: 'string',
                    readOnly: true,
                    enum: [ 'put', 'lock', 'extend' ],
                    'x-ms-enum': {
                      name: 'ImmutabilityPolicyUpdateType',
                      modelAsString: true
                    },
                    description: 'The ImmutabilityPolicy update type of a blob container, possible values include: put, lock and extend.'
                  },
                  immutabilityPeriodSinceCreationInDays: {
                    type: 'integer',
                    readOnly: true,
                    description: 'The immutability period for the blobs in the container since the policy creation, in days.'
                  },
                  timestamp: {
                    type: 'string',
                    format: 'date-time',
                    readOnly: true,
                    description: 'Returns the date and time the ImmutabilityPolicy was updated.'
                  },
                  objectIdentifier: {
                    type: 'string',
                    readOnly: true,
                    description: 'Returns the Object ID of the user who updated the ImmutabilityPolicy.'
                  },
                  tenantId: {
                    type: 'string',
                    readOnly: true,
                    description: 'Returns the Tenant ID that issued the token for the user who updated the ImmutabilityPolicy.'
                  },
                  upn: {
                    type: 'string',
                    readOnly: true,
                    description: 'Returns the User Principal Name of the user who updated the ImmutabilityPolicy.'
                  },
                  allowProtectedAppendWrites: {
                    type: 'boolean',
                    description: 'This property can only be changed for unlocked time-based retention policies. When enabled, new blocks can be written to an append blob while maintaining immutability protection and compliance. Only new blocks can be added and any existing blocks cannot be modified or deleted. This property cannot be changed with ExtendImmutabilityPolicy API.'
                  },
                  allowProtectedAppendWritesAll: {
                    type: 'boolean',
                    description: "This property can only be changed for unlocked time-based retention policies. When enabled, new blocks can be written to both 'Append and Bock Blobs' while maintaining immutability protection and compliance. Only new blocks can be added and any existing blocks cannot be modified or deleted. This property cannot be changed with ExtendImmutabilityPolicy API. The 'allowProtectedAppendWrites' and 'allowProtectedAppendWritesAll' properties are mutually exclusive."
                  }
                },
                description: 'An update history of the ImmutabilityPolicy of a blob container.'
              },
              description: 'The ImmutabilityPolicy update history of the blob container.'
            }
          }
        },
        legalHold: {
          readOnly: true,
          description: 'The LegalHold property of the container.',
          properties: {
            hasLegalHold: {
              type: 'boolean',
              readOnly: true,
              description: 'The hasLegalHold public property is set to true by SRP if there are at least one existing tag. The hasLegalHold public property is set to false by SRP if all existing legal hold tags are cleared out. There can be a maximum of 1000 blob containers with hasLegalHold=true for a given account.'
            },
            tags: {
              type: 'array',
              items: {
                properties: {
                  tag: {
                    type: 'string',
                    readOnly: true,
                    description: 'The tag value.'
                  },
                  timestamp: {
                    type: 'string',
                    format: 'date-time',
                    readOnly: true,
                    description: 'Returns the date and time the tag was added.'
                  },
                  objectIdentifier: {
                    type: 'string',
                    readOnly: true,
                    description: 'Returns the Object ID of the user who added the tag.'
                  },
                  tenantId: {
                    type: 'string',
                    readOnly: true,
                    description: 'Returns the Tenant ID that issued the token for the user who added the tag.'
                  },
                  upn: {
                    type: 'string',
                    readOnly: true,
                    description: 'Returns the User Principal Name of the user who added the tag.'
                  }
                },
                description: 'A tag of the LegalHold of a blob container.'
              },
              description: 'The list of LegalHold tags of a blob container.'
            },
            protectedAppendWritesHistory: {
              type: 'object',
              description: 'Protected append blob writes history.',
              properties: {
                allowProtectedAppendWritesAll: {
                  type: 'boolean',
                  description: "When enabled, new blocks can be written to both 'Append and Bock Blobs' while maintaining legal hold protection and compliance. Only new blocks can be added and any existing blocks cannot be modified or deleted."
                },
                timestamp: {
                  type: 'string',
                  format: 'date-time',
                  readOnly: true,
                  description: 'Returns the date and time the tag was added.'
                }
              }
            }
          }
        },
        hasLegalHold: {
          type: 'boolean',
          readOnly: true,
          description: 'The hasLegalHold public property is set to true by SRP if there are at least one existing tag. The hasLegalHold public property is set to false by SRP if all existing legal hold tags are cleared out. There can be a maximum of 1000 blob containers with hasLegalHold=true for a given account.'
        },
        hasImmutabilityPolicy: {
          type: 'boolean',
          readOnly: true,
          description: 'The hasImmutabilityPolicy public property is set to true by SRP if ImmutabilityPolicy has been created for this container. The hasImmutabilityPolicy public property is set to false by SRP if ImmutabilityPolicy has not been created for this container.'
        },
        immutableStorageWithVersioning: {
          description: 'The object level immutability property of the container. The property is immutable and can only be set to true at the container creation time. Existing containers must undergo a migration process.',
          properties: {
            enabled: {
              type: 'boolean',
              description: 'This is an immutable property, when set to true it enables object level immutability at the container level.'
            },
            timeStamp: {
              type: 'string',
              format: 'date-time',
              readOnly: true,
              description: 'Returns the date and time the object level immutability was enabled.'
            },
            migrationState: {
              type: 'string',
              readOnly: true,
              enum: [ 'InProgress', 'Completed' ],
              'x-ms-enum': { name: 'MigrationState', modelAsString: true },
              description: 'This property denotes the container level immutability to object level immutability migration state.'
            }
          }
        },
        enableNfsV3RootSquash: {
          type: 'boolean',
          description: 'Enable NFSv3 root squash on blob container.'
        },
        enableNfsV3AllSquash: {
          type: 'boolean',
          description: 'Enable NFSv3 all squash on blob container.'
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
  description: 'Properties of the blob container, including Id, resource name, resource type, Etag.'
}
```
## Misc
The resource version is `2021-08-01`.

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/storage/resource-manager/Microsoft.Storage/stable/2021-08-01/blob.json).
