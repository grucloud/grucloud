---
id: DatabaseAccountTable
title: DatabaseAccountTable
---
Provides a **DatabaseAccountTable** from the **DocumentDB** group
## Examples
### CosmosDBTableReplace
```js
exports.createResources = () => [
  {
    type: "DatabaseAccountTable",
    group: "DocumentDB",
    name: "myDatabaseAccountTable",
    properties: () => ({
      properties: { resource: { id: "tableName" }, options: {} },
    }),
    dependencies: ({}) => ({
      resourceGroup: "myResourceGroup",
      account: "myDatabaseAccount",
    }),
  },
];

```
## Dependencies
- [ResourceGroup](../Resources/ResourceGroup.md)
- [DatabaseAccount](../DocumentDB/DatabaseAccount.md)
## Swagger Schema
```js
{
  description: 'Parameters to create and update Cosmos DB Table.',
  type: 'object',
  properties: {
    properties: {
      'x-ms-client-flatten': true,
      description: 'Properties to create and update Azure Cosmos DB Table.',
      type: 'object',
      properties: {
        resource: {
          type: 'object',
          description: 'Cosmos DB table id object',
          properties: {
            id: {
              type: 'string',
              description: 'Name of the Cosmos DB table'
            }
          },
          required: [ 'id' ]
        },
        options: {
          description: 'A key-value pair of options to be applied for the request. This corresponds to the headers sent with the request.',
          type: 'object',
          additionalProperties: { type: 'string' }
        }
      },
      required: [ 'resource', 'options' ]
    }
  },
  required: [ 'properties' ]
}
```
## Misc
The resource version is `2016-03-31`.

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/cosmos-db/resource-manager/Microsoft.DocumentDB/stable/2016-03-31/cosmos-db.json).
