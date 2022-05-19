---
id: DatabaseAccountMongoDBCollection
title: DatabaseAccountMongoDBCollection
---
Provides a **DatabaseAccountMongoDBCollection** from the **DocumentDB** group
## Examples
### CosmosDBMongoDBCollectionCreateUpdate
```js
exports.createResources = () => [
  {
    type: "DatabaseAccountMongoDBCollection",
    group: "DocumentDB",
    name: "myDatabaseAccountMongoDBCollection",
    properties: () => ({
      properties: {
        resource: {
          id: "testcoll",
          indexes: [
            {
              key: { keys: ["testKey"] },
              options: { expireAfterSeconds: 100, unique: true },
            },
          ],
          shardKey: { testKey: "Hash" },
        },
        options: {},
      },
    }),
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
  description: 'Parameters to create and update Cosmos DB MongoDB collection.',
  type: 'object',
  properties: {
    properties: {
      'x-ms-client-flatten': true,
      description: 'Properties to create and update Azure Cosmos DB MongoDB collection.',
      type: 'object',
      properties: {
        resource: {
          type: 'object',
          description: 'Cosmos DB MongoDB collection resource object',
          properties: {
            id: {
              type: 'string',
              description: 'Name of the Cosmos DB MongoDB collection'
            },
            shardKey: {
              description: 'A key-value pair of shard keys to be applied for the request.',
              type: 'object',
              additionalProperties: { type: 'string' }
            },
            indexes: {
              description: 'List of index keys',
              type: 'array',
              items: {
                type: 'object',
                description: 'Cosmos DB MongoDB collection index key',
                properties: {
                  key: {
                    description: 'Cosmos DB MongoDB collection index keys',
                    type: 'object',
                    properties: {
                      keys: {
                        description: 'List of keys for each MongoDB collection in the Azure Cosmos DB service',
                        type: 'array',
                        items: { type: 'string', description: 'A Key.' }
                      }
                    }
                  },
                  options: {
                    description: 'Cosmos DB MongoDB collection index key options',
                    type: 'object',
                    properties: {
                      expireAfterSeconds: {
                        description: 'Expire after seconds',
                        type: 'integer'
                      },
                      unique: {
                        description: 'Is unique or not',
                        type: 'boolean'
                      }
                    }
                  }
                }
              }
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
