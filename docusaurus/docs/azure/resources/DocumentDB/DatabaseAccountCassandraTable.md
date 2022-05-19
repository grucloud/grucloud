---
id: DatabaseAccountCassandraTable
title: DatabaseAccountCassandraTable
---
Provides a **DatabaseAccountCassandraTable** from the **DocumentDB** group
## Examples
### CosmosDBCassandraTableCreateUpdate
```js
exports.createResources = () => [
  {
    type: "DatabaseAccountCassandraTable",
    group: "DocumentDB",
    name: "myDatabaseAccountCassandraTable",
    properties: () => ({
      properties: {
        resource: {
          id: "tableName",
          defaultTtl: 100,
          schema: {
            columns: [{ name: "columnA", type: "Ascii" }],
            partitionKeys: [{ name: "columnA" }],
            clusterKeys: [{ name: "columnA", orderBy: "Asc" }],
          },
        },
        options: {},
      },
    }),
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
  description: 'Parameters to create and update Cosmos DB Cassandra table.',
  type: 'object',
  properties: {
    properties: {
      'x-ms-client-flatten': true,
      description: 'Properties to create and update Azure Cosmos DB Cassandra table.',
      type: 'object',
      properties: {
        resource: {
          type: 'object',
          description: 'Cosmos DB Cassandra table id object',
          properties: {
            id: {
              type: 'string',
              description: 'Name of the Cosmos DB Cassandra table'
            },
            defaultTtl: {
              type: 'integer',
              description: 'Time to live of the Cosmos DB Cassandra table'
            },
            schema: {
              description: 'Schema of the Cosmos DB Cassandra table',
              type: 'object',
              properties: {
                columns: {
                  type: 'array',
                  items: {
                    type: 'object',
                    description: 'Cosmos DB Cassandra table column',
                    properties: {
                      name: {
                        type: 'string',
                        description: 'Name of the Cosmos DB Cassandra table column'
                      },
                      type: {
                        type: 'string',
                        description: 'Type of the Cosmos DB Cassandra table column'
                      }
                    }
                  },
                  description: 'List of Cassandra table columns.'
                },
                partitionKeys: {
                  type: 'array',
                  items: {
                    type: 'object',
                    description: 'Cosmos DB Cassandra table partition key',
                    properties: {
                      name: {
                        type: 'string',
                        description: 'Name of the Cosmos DB Cassandra table partition key'
                      }
                    }
                  },
                  description: 'List of partition key.'
                },
                clusterKeys: {
                  type: 'array',
                  items: {
                    type: 'object',
                    description: 'Cosmos DB Cassandra table cluster key',
                    properties: {
                      name: {
                        type: 'string',
                        description: 'Name of the Cosmos DB Cassandra table cluster key'
                      },
                      orderBy: {
                        type: 'string',
                        description: 'Order of the Cosmos DB Cassandra table cluster key, only support "Asc" and "Desc"'
                      }
                    }
                  },
                  description: 'List of cluster key.'
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
