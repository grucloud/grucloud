---
id: MongoDBResourceMongoDBCollection
title: MongoDBResourceMongoDBCollection
---
Provides a **MongoDBResourceMongoDBCollection** from the **DocumentDB** group
## Examples
### CosmosDBMongoDBCollectionCreateUpdate
```js
exports.createResources = () => [
  {
    type: "MongoDBResourceMongoDBCollection",
    group: "DocumentDB",
    name: "myMongoDBResourceMongoDBCollection",
    properties: () => ({
      location: "West US",
      tags: {},
      properties: {
        resource: {
          id: "collectionName",
          indexes: [
            {
              key: { keys: ["_ts"] },
              options: { expireAfterSeconds: 100, unique: true },
            },
            { key: { keys: ["_id"] } },
          ],
          shardKey: { testKey: "Hash" },
        },
        options: {},
      },
    }),
    dependencies: ({}) => ({
      resourceGroup: "myResourceGroup",
      account: "myDatabaseAccount",
      database: "myMongoDBResourceMongoDBDatabase",
    }),
  },
];

```
## Dependencies
- [ResourceGroup](../Resources/ResourceGroup.md)
- [DatabaseAccount](../DocumentDB/DatabaseAccount.md)
- [MongoDBResourceMongoDBDatabase](../DocumentDB/MongoDBResourceMongoDBDatabase.md)
## Swagger Schema
```json
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
          description: 'The standard JSON format of a MongoDB collection',
          type: 'object',
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
            },
            analyticalStorageTtl: { type: 'integer', description: 'Analytical TTL.' }
          },
          required: [ 'id' ]
        },
        options: {
          description: 'A key-value pair of options to be applied for the request. This corresponds to the headers sent with the request.',
          type: 'object',
          properties: {
            throughput: {
              type: 'integer',
              description: 'Request Units per second. For example, "throughput": 10000.'
            },
            autoscaleSettings: {
              description: 'Specifies the Autoscale settings.',
              type: 'object',
              properties: {
                maxThroughput: {
                  type: 'integer',
                  description: 'Represents maximum throughput, the resource can scale up to.'
                }
              }
            }
          }
        }
      },
      required: [ 'resource' ]
    }
  },
  allOf: [
    {
      type: 'object',
      description: 'The core properties of ARM resources.',
      properties: {
        id: {
          readOnly: true,
          type: 'string',
          description: 'The unique resource identifier of the ARM resource.'
        },
        name: {
          readOnly: true,
          type: 'string',
          description: 'The name of the ARM resource.'
        },
        type: {
          readOnly: true,
          type: 'string',
          description: 'The type of Azure resource.'
        },
        location: {
          type: 'string',
          description: 'The location of the resource group to which the resource belongs.'
        },
        tags: {
          type: 'object',
          additionalProperties: { type: 'string' },
          description: 'Tags are a list of key-value pairs that describe the resource. These tags can be used in viewing and grouping this resource (across resource groups). A maximum of 15 tags can be provided for a resource. Each tag must have a key no greater than 128 characters and value no greater than 256 characters. For example, the default experience for a template type is set with "defaultExperience": "Cassandra". Current "defaultExperience" values also include "Table", "Graph", "DocumentDB", and "MongoDB".'
        }
      },
      'x-ms-azure-resource': true
    }
  ],
  required: [ 'properties' ]
}
```
## Misc
The resource version is `2022-05-15`.

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/cosmos-db/resource-manager/Microsoft.DocumentDB/stable/2022-05-15/cosmos-db.json).
