---
id: Table
title: Table
---
Provides a **Table** from the **Storage** group
## Examples
### TableOperationPut
```js
exports.createResources = () => [
  {
    type: "Table",
    group: "Storage",
    name: "myTable",
    dependencies: ({}) => ({
      resourceGroup: "myResourceGroup",
      account: "myStorageAccount",
    }),
  },
];

```

### TableOperationPutOrPatchAcls
```js
exports.createResources = () => [
  {
    type: "Table",
    group: "Storage",
    name: "myTable",
    properties: () => ({
      properties: {
        signedIdentifiers: [
          {
            id: "MTIzNDU2Nzg5MDEyMzQ1Njc4OTAxMjM0NTY3ODkwMTI",
            accessPolicy: {
              startTime: "2022-03-17T08:49:37.0000000Z",
              expiryTime: "2022-03-20T08:49:37.0000000Z",
              permission: "raud",
            },
          },
          {
            id: "PTIzNDU2Nzg5MDEyMzQ1Njc4OTAxMjM0NTY3ODklMTI",
            accessPolicy: {
              startTime: "2022-03-17T08:49:37.0000000Z",
              expiryTime: "2022-03-20T08:49:37.0000000Z",
              permission: "rad",
            },
          },
        ],
      },
    }),
    dependencies: ({}) => ({
      resourceGroup: "myResourceGroup",
      account: "myStorageAccount",
    }),
  },
];

```
## Dependencies
- [ResourceGroup](../Resources/ResourceGroup.md)
- [StorageAccount](../Storage/StorageAccount.md)
## Swagger Schema
```json
{
  properties: {
    properties: {
      'x-ms-client-flatten': true,
      'x-ms-client-name': 'TableProperties',
      description: 'Table resource properties.',
      properties: {
        tableName: {
          type: 'string',
          readOnly: true,
          description: 'Table name under the specified account'
        },
        signedIdentifiers: {
          type: 'array',
          items: {
            properties: {
              id: {
                type: 'string',
                description: 'unique-64-character-value of the stored access policy.'
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
                    description: "Required. List of abbreviated permissions. Supported permission values include 'r','a','u','d'"
                  }
                },
                required: [ 'permission' ],
                type: 'object'
              }
            },
            required: [ 'id' ],
            type: 'object',
            description: 'Object to set Table Access Policy.'
          },
          description: 'List of stored access policies specified on the table.'
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
  description: 'Properties of the table, including Id, resource name, resource type.'
}
```
## Misc
The resource version is `2022-05-01`.

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/storage/resource-manager/Microsoft.Storage/stable/2022-05-01/table.json).
