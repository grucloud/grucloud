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
  dependencies: ({}) => ({
    resourceGroup: "myResourceGroup",
    account: "myStorageAccount",
  }),
});

```

### StorageAccountPutEncryptionScopeWithInfrastructureEncryption
```js
provider.Storage.makeEncryptionScope({
  name: "myEncryptionScope",
  properties: () => ({ properties: { requireInfrastructureEncryption: true } }),
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
      'x-ms-client-name': 'EncryptionScopeProperties',
      description: 'Properties of the encryption scope.',
      properties: {
        source: {
          type: 'string',
          enum: [ 'Microsoft.Storage', 'Microsoft.KeyVault' ],
          'x-ms-enum': { name: 'EncryptionScopeSource', modelAsString: true },
          description: 'The provider for the encryption scope. Possible values (case-insensitive):  Microsoft.Storage, Microsoft.KeyVault.'
        },
        state: {
          type: 'string',
          enum: [ 'Enabled', 'Disabled' ],
          'x-ms-enum': { name: 'EncryptionScopeState', modelAsString: true },
          description: 'The state of the encryption scope. Possible values (case-insensitive):  Enabled, Disabled.'
        },
        creationTime: {
          readOnly: true,
          type: 'string',
          format: 'date-time',
          description: 'Gets the creation date and time of the encryption scope in UTC.'
        },
        lastModifiedTime: {
          readOnly: true,
          type: 'string',
          format: 'date-time',
          description: 'Gets the last modification date and time of the encryption scope in UTC.'
        },
        keyVaultProperties: {
          description: "The key vault properties for the encryption scope. This is a required field if encryption scope 'source' attribute is set to 'Microsoft.KeyVault'.",
          properties: {
            keyUri: {
              type: 'string',
              description: 'The object identifier for a key vault key object. When applied, the encryption scope will use the key referenced by the identifier to enable customer-managed key support on this encryption scope.'
            },
            currentVersionedKeyIdentifier: {
              type: 'string',
              readOnly: true,
              description: 'The object identifier of the current versioned Key Vault Key in use.'
            },
            lastKeyRotationTimestamp: {
              type: 'string',
              readOnly: true,
              format: 'date-time',
              description: 'Timestamp of last rotation of the Key Vault Key.'
            }
          }
        },
        requireInfrastructureEncryption: {
          type: 'boolean',
          description: 'A boolean indicating whether or not the service applies a secondary layer of encryption with platform managed keys for data at rest.'
        }
      }
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
  ],
  description: 'The Encryption Scope resource.'
}
```
## Misc
The resource version is `2021-08-01`.

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/storage/resource-manager/Microsoft.Storage/stable/2021-08-01/storage.json).
