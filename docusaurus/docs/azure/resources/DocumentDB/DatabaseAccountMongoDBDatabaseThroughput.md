---
id: DatabaseAccountMongoDBDatabaseThroughput
title: DatabaseAccountMongoDBDatabaseThroughput
---
Provides a **DatabaseAccountMongoDBDatabaseThroughput** from the **DocumentDB** group
## Examples
### CosmosDBMongoDBDatabaseThroughputUpdate
```js
exports.createResources = () => [
  {
    type: "DatabaseAccountMongoDBDatabaseThroughput",
    group: "DocumentDB",
    name: "myDatabaseAccountMongoDBDatabaseThroughput",
    properties: () => ({ properties: { resource: { throughput: 400 } } }),
    dependencies: ({}) => ({
      resourceGroup: "myResourceGroup",
      account: "myDatabaseAccount",
      database: "myDatabaseAccountMongoDBDatabase",
    }),
  },
];

```
## Dependencies
- [ResourceGroup](../Resources/ResourceGroup.md)
- [DatabaseAccount](../DocumentDB/DatabaseAccount.md)
- [DatabaseAccountMongoDBDatabase](../DocumentDB/DatabaseAccountMongoDBDatabase.md)
## Swagger Schema
```js
{
  description: 'Parameters to update Cosmos DB resource throughput.',
  type: 'object',
  properties: {
    properties: {
      'x-ms-client-flatten': true,
      description: 'Properties to update Azure Cosmos DB resource throughput.',
      type: 'object',
      properties: {
        resource: {
          type: 'object',
          description: 'Cosmos DB resource throughput object',
          properties: {
            throughput: {
              type: 'integer',
              description: 'Value of the Cosmos DB resource throughput'
            }
          },
          required: [ 'throughput' ]
        }
      },
      required: [ 'resource' ]
    }
  },
  required: [ 'properties' ]
}
```
## Misc
The resource version is `2016-03-31`.

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/cosmos-db/resource-manager/Microsoft.DocumentDB/stable/2016-03-31/cosmos-db.json).
