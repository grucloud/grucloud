---
id: CassandraResourceCassandraViewThroughput
title: CassandraResourceCassandraViewThroughput
---
Provides a **CassandraResourceCassandraViewThroughput** from the **DocumentDB** group
## Examples
### CosmosDBCassandraViewThroughputUpdate
```js
exports.createResources = () => [
  {
    type: "CassandraResourceCassandraViewThroughput",
    group: "DocumentDB",
    name: "myCassandraResourceCassandraViewThroughput",
    properties: () => ({
      tags: {},
      properties: { resource: { throughput: 400 } },
    }),
    dependencies: ({}) => ({
      resourceGroup: "myResourceGroup",
      account: "myDatabaseAccount",
      keyspace: "myCassandraResourceCassandraKeyspace",
      view: "myCassandraResourceCassandraView",
    }),
  },
];

```
## Dependencies
- [ResourceGroup](../Resources/ResourceGroup.md)
- [DatabaseAccount](../DocumentDB/DatabaseAccount.md)
- [CassandraResourceCassandraKeyspace](../DocumentDB/CassandraResourceCassandraKeyspace.md)
- [CassandraResourceCassandraView](../DocumentDB/CassandraResourceCassandraView.md)
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
              description: 'Value of the Cosmos DB resource throughput. Either throughput is required or autoscaleSettings is required, but not both.'
            },
            autoscaleSettings: {
              description: 'Cosmos DB resource for autoscale settings. Either throughput is required or autoscaleSettings is required, but not both.',
              type: 'object',
              properties: {
                maxThroughput: {
                  type: 'integer',
                  description: 'Represents maximum throughput container can scale up to.'
                },
                autoUpgradePolicy: {
                  description: 'Cosmos DB resource auto-upgrade policy',
                  type: 'object',
                  properties: {
                    throughputPolicy: {
                      description: 'Represents throughput policy which service must adhere to for auto-upgrade',
                      type: 'object',
                      properties: {
                        isEnabled: {
                          type: 'boolean',
                          description: 'Determines whether the ThroughputPolicy is active or not'
                        },
                        incrementPercent: {
                          type: 'integer',
                          description: 'Represents the percentage by which throughput can increase every time throughput policy kicks in.'
                        }
                      }
                    }
                  }
                },
                targetMaxThroughput: {
                  type: 'integer',
                  description: 'Represents target maximum throughput container can scale up to once offer is no longer in pending state.',
                  readOnly: true
                }
              },
              required: [ 'maxThroughput' ]
            },
            minimumThroughput: {
              type: 'string',
              description: 'The minimum throughput of the resource',
              readOnly: true
            },
            offerReplacePending: {
              type: 'string',
              description: 'The throughput replace is pending',
              readOnly: true
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
        },
        identity: {
          properties: {
            principalId: {
              readOnly: true,
              type: 'string',
              description: 'The principal id of the system assigned identity. This property will only be provided for a system assigned identity.'
            },
            tenantId: {
              readOnly: true,
              type: 'string',
              description: 'The tenant id of the system assigned identity. This property will only be provided for a system assigned identity.'
            },
            type: {
              type: 'string',
              description: "The type of identity used for the resource. The type 'SystemAssigned,UserAssigned' includes both an implicitly created identity and a set of user assigned identities. The type 'None' will remove any identities from the service.",
              enum: [
                'SystemAssigned',
                'UserAssigned',
                'SystemAssigned,UserAssigned',
                'None'
              ],
              'x-ms-enum': { name: 'ResourceIdentityType', modelAsString: false }
            },
            userAssignedIdentities: {
              type: 'object',
              additionalProperties: {
                type: 'object',
                properties: {
                  principalId: {
                    readOnly: true,
                    type: 'string',
                    description: 'The principal id of user assigned identity.'
                  },
                  clientId: {
                    readOnly: true,
                    type: 'string',
                    description: 'The client id of user assigned identity.'
                  }
                }
              },
              description: "The list of user identities associated with resource. The user identity dictionary key references will be ARM resource ids in the form: '/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.ManagedIdentity/userAssignedIdentities/{identityName}'."
            }
          },
          description: 'Identity for the resource.'
        }
      },
      'x-ms-azure-resource': true
    }
  ],
  required: [ 'properties' ]
}
```
## Misc
The resource version is `2022-05-15-preview`.

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/cosmos-db/resource-manager/Microsoft.DocumentDB/preview/2022-05-15-preview/cosmos-db.json).
