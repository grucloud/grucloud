---
id: DatabaseAccountCassandraKeyspaceThroughput
title: DatabaseAccountCassandraKeyspaceThroughput
---
Provides a **DatabaseAccountCassandraKeyspaceThroughput** from the **DocumentDB** group
## Examples
### CosmosDBCassandraKeyspaceThroughputUpdate
```js
exports.createResources = () => [
  {
    type: "DatabaseAccountCassandraKeyspaceThroughput",
    group: "DocumentDB",
    name: "myDatabaseAccountCassandraKeyspaceThroughput",
    properties: () => ({ properties: { resource: { throughput: 400 } } }),
    dependencies: ({}) => ({
      resourceGroup: "myResourceGroup",
      account: "myDatabaseAccount",
      keyspace: "myDatabaseAccountCassandraKeyspace",
    }),
  },
];

```
## Dependencies
- [ResourceGroup](../Resources/ResourceGroup.md)
- [DatabaseAccount](../DocumentDB/DatabaseAccount.md)
- [DatabaseAccountCassandraKeyspace](../DocumentDB/DatabaseAccountCassandraKeyspace.md)
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
          description: 'The standard JSON format of a resource throughput',
          type: 'object',
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
