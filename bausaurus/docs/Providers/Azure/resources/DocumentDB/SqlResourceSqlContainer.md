---
id: SqlResourceSqlContainer
title: SqlResourceSqlContainer
---
Provides a **SqlResourceSqlContainer** from the **DocumentDB** group
## Examples
### CosmosDBSqlContainerCreateUpdate
```js
exports.createResources = () => [
  {
    type: "SqlResourceSqlContainer",
    group: "DocumentDB",
    name: "mySqlResourceSqlContainer",
    properties: () => ({
      location: "West US",
      tags: {},
      properties: {
        resource: {
          id: "containerName",
          indexingPolicy: {
            indexingMode: "consistent",
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
      database: "mySqlResourceSqlDatabase",
    }),
  },
];

```
## Dependencies
- [ResourceGroup](../Resources/ResourceGroup.md)
- [DatabaseAccount](../DocumentDB/DatabaseAccount.md)
- [SqlResourceSqlDatabase](../DocumentDB/SqlResourceSqlDatabase.md)
## Swagger Schema
```json
{
  description: 'Parameters to create and update Cosmos DB container.',
  type: 'object',
  properties: {
    properties: {
      'x-ms-client-flatten': true,
      description: 'Properties to create and update Azure Cosmos DB container.',
      type: 'object',
      properties: {
        resource: {
          description: 'The standard JSON format of a container',
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'Name of the Cosmos DB SQL container'
            },
            indexingPolicy: {
              description: 'The configuration of the indexing policy. By default, the indexing is automatic for all document paths within the container',
              type: 'object',
              properties: {
                automatic: {
                  type: 'boolean',
                  description: 'Indicates if the indexing policy is automatic'
                },
                indexingMode: {
                  description: 'Indicates the indexing mode.',
                  type: 'string',
                  default: 'consistent',
                  enum: [ 'consistent', 'lazy', 'none' ],
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
                },
                compositeIndexes: {
                  description: 'List of composite path list',
                  type: 'array',
                  items: {
                    description: 'List of composite path',
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        path: {
                          type: 'string',
                          description: 'The path for which the indexing behavior applies to. Index paths typically start with root and end with wildcard (/path/*)'
                        },
                        order: {
                          description: 'Sort order for composite paths.',
                          type: 'string',
                          enum: [ 'ascending', 'descending' ],
                          'x-ms-enum': {
                            name: 'CompositePathSortOrder',
                            modelAsString: true
                          }
                        }
                      }
                    }
                  }
                },
                spatialIndexes: {
                  description: 'List of spatial specifics',
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      path: {
                        type: 'string',
                        description: 'The path for which the indexing behavior applies to. Index paths typically start with root and end with wildcard (/path/*)'
                      },
                      types: {
                        description: "List of path's spatial type",
                        type: 'array',
                        items: {
                          description: 'Indicates the spatial type of index.',
                          type: 'string',
                          enum: [
                            'Point',
                            'LineString',
                            'Polygon',
                            'MultiPolygon'
                          ],
                          'x-ms-enum': { name: 'SpatialType', modelAsString: true }
                        }
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
                  description: 'Indicates the kind of algorithm used for partitioning. For MultiHash, multiple partition keys (upto three maximum) are supported for container create',
                  type: 'string',
                  default: 'Hash',
                  enum: [ 'Hash', 'Range', 'MultiHash' ],
                  'x-ms-enum': { name: 'PartitionKind', modelAsString: true }
                },
                version: {
                  description: 'Indicates the version of the partition key definition',
                  type: 'integer',
                  minimum: 1,
                  maximum: 2,
                  format: 'int32'
                },
                systemKey: {
                  description: 'Indicates if the container is using a system generated partition key',
                  type: 'boolean',
                  readOnly: true
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
              description: 'The conflict resolution policy for the container.',
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
            },
            analyticalStorageTtl: {
              type: 'integer',
              format: 'int64',
              description: 'Analytical TTL.'
            }
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
