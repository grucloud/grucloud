---
id: SqlResourceClientEncryptionKey
title: SqlResourceClientEncryptionKey
---
Provides a **SqlResourceClientEncryptionKey** from the **DocumentDB** group
## Examples
### CosmosDBClientEncryptionKeyCreateUpdate
```js
exports.createResources = () => [
  {
    type: "SqlResourceClientEncryptionKey",
    group: "DocumentDB",
    name: "mySqlResourceClientEncryptionKey",
    properties: () => ({
      properties: {
        resource: {
          id: "cekName",
          encryptionAlgorithm: "AEAD_AES_256_CBC_HMAC_SHA256",
          wrappedDataEncryptionKey:
            "This is actually an array of bytes. This request/response is being presented as a string for readability in the example",
          keyWrapMetadata: {
            name: "customerManagedKey",
            type: "AzureKeyVault",
            value: "AzureKeyVault Key URL",
            algorithm: "RSA-OAEP",
          },
        },
      },
    }),
    dependencies: ({}) => ({
      resourceGroup: "myResourceGroup",
      account: "myDatabaseAccount",
      database: "mySqlResourceSqlDatabase",
    }),
  },
];

```
## Dependencies
- [ResourceGroup](../Resources/ResourceGroup.md)
- [DatabaseAccount](../DocumentDB/DatabaseAccount.md)
- [SqlResourceSqlDatabase](../DocumentDB/SqlResourceSqlDatabase.md)
## Swagger Schema
```js
{
  description: 'Parameters to create and update ClientEncryptionKey.',
  type: 'object',
  properties: {
    properties: {
      'x-ms-client-flatten': true,
      description: 'Properties to create and update ClientEncryptionKey.',
      type: 'object',
      properties: {
        resource: {
          description: 'The standard JSON format of a ClientEncryptionKey',
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'Name of the ClientEncryptionKey'
            },
            encryptionAlgorithm: {
              type: 'string',
              description: 'Encryption algorithm that will be used along with this client encryption key to encrypt/decrypt data.'
            },
            wrappedDataEncryptionKey: {
              type: 'string',
              format: 'byte',
              description: 'Wrapped (encrypted) form of the key represented as a byte array.'
            },
            keyWrapMetadata: {
              description: 'Metadata for the wrapping provider that can be used to unwrap the wrapped client encryption key.',
              type: 'object',
              properties: {
                name: {
                  type: 'string',
                  description: 'The name of associated KeyEncryptionKey (aka CustomerManagedKey).'
                },
                type: {
                  type: 'string',
                  description: 'ProviderName of KeyStoreProvider.'
                },
                value: {
                  type: 'string',
                  description: 'Reference / link to the KeyEncryptionKey.'
                },
                algorithm: {
                  type: 'string',
                  description: 'Algorithm used in wrapping and unwrapping of the data encryption key.'
                }
              }
            }
          }
        }
      },
      required: [ 'resource' ]
    }
  },
  required: [ 'properties' ]
}
```
## Misc
The resource version is `2022-02-15-preview`.

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/cosmos-db/resource-manager/Microsoft.DocumentDB/preview/2022-02-15-preview/cosmos-db.json).
