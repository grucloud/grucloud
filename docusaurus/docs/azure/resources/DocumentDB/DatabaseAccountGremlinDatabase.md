---
id: DatabaseAccountGremlinDatabase
title: DatabaseAccountGremlinDatabase
---
Provides a **DatabaseAccountGremlinDatabase** from the **DocumentDB** group
## Examples
### CosmosDBGremlinDatabaseCreateUpdate
```js
exports.createResources = () => [
  {
    type: "DatabaseAccountGremlinDatabase",
    group: "DocumentDB",
    name: "myDatabaseAccountGremlinDatabase",
    properties: () => ({
      properties: { resource: { id: "databaseName" }, options: {} },
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
  description: 'Parameters to create and update Cosmos DB Gremlin database.',
  type: 'object',
  properties: {
    properties: {
      'x-ms-client-flatten': true,
      description: 'Properties to create and update Azure Cosmos DB Gremlin database.',
      type: 'object',
      properties: {
        resource: {
          type: 'object',
          description: 'Cosmos DB Gremlin database id object',
          properties: {
            id: {
              type: 'string',
              description: 'Name of the Cosmos DB Gremlin database'
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
