---
id: DiskEncryptionSet
title: DiskEncryptionSet
---
Provides a **DiskEncryptionSet** from the **Compute** group
## Examples
### Create a disk encryption set.
```js
exports.createResources = () => [
  {
    type: "DiskEncryptionSet",
    group: "Compute",
    name: "myDiskEncryptionSet",
    properties: () => ({
      location: "West US",
      identity: { type: "SystemAssigned" },
      properties: {
        activeKey: {
          sourceVault: {
            id: "/subscriptions/{subscriptionId}/resourceGroups/myResourceGroup/providers/Microsoft.KeyVault/vaults/myVMVault",
          },
          keyUrl: "https://myvmvault.vault-int.azure-int.net/keys/{key}",
        },
        encryptionType: "EncryptionAtRestWithCustomerKey",
      },
    }),
    dependencies: ({}) => ({
      resourceGroup: "myResourceGroup",
      vault: "myVault",
      key: "myKey",
    }),
  },
];

```

### Create a disk encryption set with key vault from a different subscription.
```js
exports.createResources = () => [
  {
    type: "DiskEncryptionSet",
    group: "Compute",
    name: "myDiskEncryptionSet",
    properties: () => ({
      location: "West US",
      identity: { type: "SystemAssigned" },
      properties: {
        activeKey: {
          keyUrl:
            "https://myvaultdifferentsub.vault-int.azure-int.net/keys/{key}",
        },
        encryptionType: "EncryptionAtRestWithCustomerKey",
      },
    }),
    dependencies: ({}) => ({
      resourceGroup: "myResourceGroup",
      vault: "myVault",
      key: "myKey",
    }),
  },
];

```
## Dependencies
- [ResourceGroup](../Resources/ResourceGroup.md)
- [Vault](../KeyVault/Vault.md)
- [Key](../KeyVault/Key.md)
## Swagger Schema
```js
{
  properties: {
    identity: {
      properties: {
        type: {
          type: 'string',
          enum: [ 'SystemAssigned', 'None' ],
          'x-ms-enum': {
            name: 'DiskEncryptionSetIdentityType',
            modelAsString: true
          },
          description: 'The type of Managed Identity used by the DiskEncryptionSet. Only SystemAssigned is supported for new creations. Disk Encryption Sets can be updated with Identity type None during migration of subscription to a new Azure Active Directory tenant; it will cause the encrypted resources to lose access to the keys.'
        },
        principalId: {
          readOnly: true,
          type: 'string',
          description: 'The object id of the Managed Identity Resource. This will be sent to the RP from ARM via the x-ms-identity-principal-id header in the PUT request if the resource has a systemAssigned(implicit) identity'
        },
        tenantId: {
          readOnly: true,
          type: 'string',
          description: 'The tenant id of the Managed Identity Resource. This will be sent to the RP from ARM via the x-ms-client-tenant-id header in the PUT request if the resource has a systemAssigned(implicit) identity'
        }
      },
      description: 'The managed identity for the disk encryption set. It should be given permission on the key vault before it can be used to encrypt disks.'
    },
    properties: {
      'x-ms-client-flatten': true,
      properties: {
        encryptionType: {
          type: 'string',
          description: 'The type of key used to encrypt the data of the disk.',
          enum: [
            'EncryptionAtRestWithCustomerKey',
            'EncryptionAtRestWithPlatformAndCustomerKeys',
            'ConfidentialVmEncryptedWithCustomerKey'
          ],
          'x-ms-enum': {
            name: 'DiskEncryptionSetType',
            modelAsString: true,
            values: [
              {
                value: 'EncryptionAtRestWithCustomerKey',
                description: 'Resource using diskEncryptionSet would be encrypted at rest with Customer managed key that can be changed and revoked by a customer.'
              },
              {
                value: 'EncryptionAtRestWithPlatformAndCustomerKeys',
                description: 'Resource using diskEncryptionSet would be encrypted at rest with two layers of encryption. One of the keys is Customer managed and the other key is Platform managed.'
              },
              {
                value: 'ConfidentialVmEncryptedWithCustomerKey',
                description: 'Confidential VM supported disk and VM guest state would be encrypted with customer managed key.'
              }
            ]
          }
        },
        activeKey: {
          description: 'The key vault key which is currently used by this disk encryption set.',
          properties: {
            sourceVault: {
              description: 'Resource id of the KeyVault containing the key or secret. This property is optional and cannot be used if the KeyVault subscription is not the same as the Disk Encryption Set subscription.',
              properties: { id: { type: 'string', description: 'Resource Id' } }
            },
            keyUrl: {
              type: 'string',
              description: 'Fully versioned Key Url pointing to a key in KeyVault. Version segment of the Url is required regardless of rotationToLatestKeyVersionEnabled value.'
            }
          },
          required: [ 'keyUrl' ]
        },
        previousKeys: {
          type: 'array',
          readOnly: true,
          items: {
            properties: {
              sourceVault: {
                description: 'Resource id of the KeyVault containing the key or secret. This property is optional and cannot be used if the KeyVault subscription is not the same as the Disk Encryption Set subscription.',
                properties: { id: { type: 'string', description: 'Resource Id' } }
              },
              keyUrl: {
                type: 'string',
                description: 'Fully versioned Key Url pointing to a key in KeyVault. Version segment of the Url is required regardless of rotationToLatestKeyVersionEnabled value.'
              }
            },
            required: [ 'keyUrl' ],
            description: 'Key Vault Key Url to be used for server side encryption of Managed Disks and Snapshots'
          },
          description: 'A readonly collection of key vault keys previously used by this disk encryption set while a key rotation is in progress. It will be empty if there is no ongoing key rotation.'
        },
        provisioningState: {
          readOnly: true,
          type: 'string',
          description: 'The disk encryption set provisioning state.'
        },
        rotationToLatestKeyVersionEnabled: {
          type: 'boolean',
          description: 'Set this flag to true to enable auto-updating of this disk encryption set to the latest key version.'
        },
        lastKeyRotationTimestamp: {
          readOnly: true,
          type: 'string',
          format: 'date-time',
          description: 'The time when the active key of this disk encryption set was updated.'
        },
        autoKeyRotationError: {
          readOnly: true,
          description: 'The error that was encountered during auto-key rotation. If an error is present, then auto-key rotation will not be attempted until the error on this disk encryption set is fixed.',
          properties: {
            details: {
              type: 'array',
              items: {
                properties: {
                  code: { type: 'string', description: 'The error code.' },
                  target: {
                    type: 'string',
                    description: 'The target of the particular error.'
                  },
                  message: { type: 'string', description: 'The error message.' }
                },
                description: 'Api error base.'
              },
              description: 'The Api error details'
            },
            innererror: {
              description: 'The Api inner error',
              properties: {
                exceptiontype: { type: 'string', description: 'The exception type.' },
                errordetail: {
                  type: 'string',
                  description: 'The internal error message or exception dump.'
                }
              }
            },
            code: { type: 'string', description: 'The error code.' },
            target: {
              type: 'string',
              description: 'The target of the particular error.'
            },
            message: { type: 'string', description: 'The error message.' }
          }
        }
      }
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
  description: 'disk encryption set resource.'
}
```
## Misc
The resource version is `2021-08-01`.

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/compute/resource-manager/Microsoft.Compute/stable/2021-08-01/disk.json).
