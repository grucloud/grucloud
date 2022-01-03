---
id: ServerKey
title: ServerKey
---
Provides a **ServerKey** from the **DBforPostgreSQL** group
## Examples
### Creates or updates a PostgreSQL Server key
```js
provider.DBforPostgreSQL.makeServerKey({
  name: "myServerKey",
  properties: () => ({
    properties: {
      serverKeyType: "AzureKeyVault",
      uri: "https://someVault.vault.azure.net/keys/someKey/01234567890123456789012345678901",
    },
  }),
  dependencies: ({ resources }) => ({
    resourceGroup: resources.Resources.ResourceGroup["myResourceGroup"],
    server:
      resources.Network.P2sVpnServerConfiguration[
        "myP2sVpnServerConfiguration"
      ],
  }),
});

```
## Dependencies
- [ResourceGroup](../Resources/ResourceGroup.md)
- [P2sVpnServerConfiguration](../Network/P2sVpnServerConfiguration.md)
## Swagger Schema
```js
{
  description: 'A PostgreSQL Server key.',
  type: 'object',
  allOf: [
    {
      title: 'Proxy Resource',
      description: 'The resource model definition for a Azure Resource Manager proxy resource. It will not have tags and a location',
      type: 'object',
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
  properties: {
    kind: {
      description: 'Kind of encryption protector used to protect the key.',
      type: 'string',
      readOnly: true
    },
    properties: {
      description: 'Properties of the ServerKey Resource.',
      'x-ms-client-flatten': true,
      required: [ 'serverKeyType' ],
      type: 'object',
      properties: {
        serverKeyType: {
          description: "The key type like 'AzureKeyVault'.",
          enum: [ 'AzureKeyVault' ],
          type: 'string',
          'x-ms-enum': { name: 'ServerKeyType', modelAsString: true }
        },
        uri: { description: 'The URI of the key.', type: 'string' },
        creationDate: {
          format: 'date-time',
          description: 'The key creation date.',
          type: 'string',
          readOnly: true
        }
      }
    }
  }
}
```
## Misc
The resource version is `2020-01-01`.

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/postgresql/resource-manager/Microsoft.DBforPostgreSQL/stable/2020-01-01/DataEncryptionKeys.json).
