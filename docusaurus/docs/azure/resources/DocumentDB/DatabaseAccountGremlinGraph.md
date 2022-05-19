---
id: DatabaseAccountGremlinGraph
title: DatabaseAccountGremlinGraph
---
Provides a **DatabaseAccountGremlinGraph** from the **DocumentDB** group
## Examples
### CosmosDBGremlinGraphCreateUpdate
```js
exports.createResources = () => [
  {
    type: "DatabaseAccountGremlinGraph",
    group: "DocumentDB",
    name: "myDatabaseAccountGremlinGraph",
    properties: () => ({
      properties: {
        resource: {
          id: "graphName",
          indexingPolicy: {
            indexingMode: "Consistent",
            automatic: true,
            includedPaths: [
              {
                path: "/*",
                indexes: [
                  { kind: "Range", dataType: "String", precision: -1 },
                  { kind: "Range", dataType: "Number", precision: -1 },
                ],
              },
            ],
            excludedPaths: [],
          },
          partitionKey: { paths: ["/AccountNumber"], kind: "Hash" },
          defaultTtl: 100,
          uniqueKeyPolicy: { uniqueKeys: [{ paths: ["/testPath"] }] },
          conflictResolutionPolicy: {
            mode: "LastWriterWins",
            conflictResolutionPath: "/path",
          },
        },
        options: {},
      },
    }),
    dependencies: ({}) => ({
      resourceGroup: "myResourceGroup",
      account: "myDatabaseAccount",
      database: "myDatabaseAccountGremlinDatabase",
    }),
  },
];

```
## Dependencies
- [ResourceGroup](../Resources/ResourceGroup.md)
- [DatabaseAccount](../DocumentDB/DatabaseAccount.md)
- [DatabaseAccountGremlinDatabase](../DocumentDB/DatabaseAccountGremlinDatabase.md)
## Swagger Schema
```js
{
  description: 'Parameters to create and update Cosmos DB Gremlin graph.',
  type: 'object',
  properties: {
    properties: {
      'x-ms-client-flatten': true,
      description: 'Properties to create and update Azure Cosmos DB Gremlin graph.',
      type: 'object',
      properties: {
        resource: {
          type: 'object',
          description: 'Cosmos DB Gremlin graph resource object',
          properties: {
            id: {
              type: 'string',
              description: 'Name of the Cosmos DB Gremlin graph'
            },
            indexingPolicy: {
              description: 'The configuration of the indexing policy. By default, the indexing is automatic for all document paths within the graph',
              type: 'object',
              properties: {
                automatic: {
                  type: 'boolean',
                  description: 'Indicates if the indexing policy is automatic'
                },
                indexingMode: {
                  description: 'Indicates the indexing mode.',
                  type: 'string',
                  default: 'Consistent',
                  enum: [ 'Consistent', 'Lazy', 'None' ],
                  'x-ms-enum': { name: 'IndexingMode', modelAsString: true }
                },
                includedPaths: {
                  description: 'List of paths to include in the indexing',
                  type: 'array',
                  items: {
                    type: 'object',
                    description: 'The paths that are included in indexing',
                    properties: {
                      path: {
                        type: 'string',
                        description: 'The path for which the indexing behavior applies to. Index paths typically start with root and end with wildcard (/path/*)'
                      },
                      indexes: {
                        description: 'List of indexes for this path',
                        type: 'array',
                        items: {
                          type: 'object',
                          description: 'The indexes for the path.',
                          properties: {
                            dataType: {
                              description: 'The datatype for which the indexing behavior is applied to.',
                              type: 'string',
                              default: 'String',
                              enum: [
                                'String',
                                'Number',
                                'Point',
                                'Polygon',
                                'LineString',
                                'MultiPolygon'
                              ],
                              'x-ms-enum': { name: 'DataType', modelAsString: true }
                            },
                            precision: {
                              description: 'The precision of the index. -1 is maximum precision.',
                              type: 'integer'
                            },
                            kind: {
                              description: 'Indicates the type of index.',
                              type: 'string',
                              default: 'Hash',
                              enum: [ 'Hash', 'Range', 'Spatial' ],
                              'x-ms-enum': {
                                name: 'IndexKind',
                                modelAsString: true
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                },
                excludedPaths: {
                  description: 'List of paths to exclude from indexing',
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      path: {
                        type: 'string',
                        description: 'The path for which the indexing behavior applies to. Index paths typically start with root and end with wildcard (/path/*)'
                      }
                    }
                  }
                }
              }
            },
            partitionKey: {
              description: 'The configuration of the partition key to be used for partitioning data into multiple partitions',
              type: 'object',
              properties: {
                paths: {
                  description: 'List of paths using which data within the container can be partitioned',
                  type: 'array',
                  items: {
                    type: 'string',
                    description: 'A path. These typically start with root (/path)'
                  }
                },
                kind: {
                  description: 'Indicates the kind of algorithm used for partitioning',
                  type: 'string',
                  default: 'Hash',
                  enum: [ 'Hash', 'Range' ],
                  'x-ms-enum': { name: 'PartitionKind', modelAsString: true }
                }
              }
            },
            defaultTtl: { type: 'integer', description: 'Default time to live' },
            uniqueKeyPolicy: {
              description: 'The unique key policy configuration for specifying uniqueness constraints on documents in the collection in the Azure Cosmos DB service.',
              type: 'object',
              properties: {
                uniqueKeys: {
                  description: 'List of unique keys on that enforces uniqueness constraint on documents in the collection in the Azure Cosmos DB service.',
                  type: 'array',
                  items: {
                    type: 'object',
                    description: 'The unique key on that enforces uniqueness constraint on documents in the collection in the Azure Cosmos DB service.',
                    properties: {
                      paths: {
                        description: 'List of paths must be unique for each document in the Azure Cosmos DB service',
                        type: 'array',
                        items: {
                          type: 'string',
                          description: 'A path. These typically start with root (/path)'
                        }
                      }
                    }
                  }
                }
              }
            },
            conflictResolutionPolicy: {
              description: 'The conflict resolution policy for the graph.',
              type: 'object',
              properties: {
                mode: {
                  description: 'Indicates the conflict resolution mode.',
                  type: 'string',
                  default: 'LastWriterWins',
                  enum: [ 'LastWriterWins', 'Custom' ],
                  'x-ms-enum': {
                    name: 'ConflictResolutionMode',
                    modelAsString: true
                  }
                },
                conflictResolutionPath: {
                  type: 'string',
                  description: 'The conflict resolution path in the case of LastWriterWins mode.'
                },
                conflictResolutionProcedure: {
                  type: 'string',
                  description: 'The procedure to resolve conflicts in the case of custom mode.'
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
