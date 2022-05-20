---
id: Snapshot
title: Snapshot
---
Provides a **Snapshot** from the **ContainerService** group
## Examples
### Create/Update Snapshot
```js
exports.createResources = () => [
  {
    type: "Snapshot",
    group: "ContainerService",
    name: "mySnapshot",
    properties: () => ({
      location: "westus",
      tags: { key1: "val1", key2: "val2" },
      properties: {
        creationData: {
          sourceResourceId:
            "/subscriptions/subid1/resourcegroups/rg1/providers/Microsoft.ContainerService/managedClusters/cluster1/agentPools/pool0",
        },
      },
    }),
    dependencies: ({}) => ({ resourceGroup: "myResourceGroup" }),
  },
];

```
## Dependencies
- [ResourceGroup](../Resources/ResourceGroup.md)
## Swagger Schema
```js
{
  type: 'object',
  properties: {
    properties: {
      description: 'Properties of a snapshot.',
      'x-ms-client-flatten': true,
      type: 'object',
      properties: {
        creationData: {
          description: 'CreationData to be used to specify the source agent pool resource ID to create this snapshot.',
          type: 'object',
          properties: {
            sourceResourceId: {
              type: 'string',
              description: 'This is the ARM ID of the source object to be used to create the target object.'
            }
          }
        },
        snapshotType: {
          type: 'string',
          default: 'NodePool',
          enum: [ 'NodePool', 'ManagedCluster' ],
          'x-ms-enum': {
            name: 'SnapshotType',
            modelAsString: true,
            values: [
              {
                value: 'NodePool',
                description: 'The snapshot is a snapshot of a node pool.'
              },
              {
                value: 'ManagedCluster',
                description: 'The snapshot is a snapshot of a managed cluster.'
              }
            ]
          },
          description: 'The type of a snapshot. The default is NodePool.'
        },
        kubernetesVersion: {
          readOnly: true,
          type: 'string',
          description: 'The version of Kubernetes.'
        },
        nodeImageVersion: {
          readOnly: true,
          type: 'string',
          description: 'The version of node image.'
        },
        osType: {
          readOnly: true,
          type: 'string',
          default: 'Linux',
          enum: [ 'Linux', 'Windows' ],
          'x-ms-enum': {
            name: 'OSType',
            modelAsString: true,
            values: [
              { value: 'Linux', description: 'Use Linux.' },
              { value: 'Windows', description: 'Use Windows.' }
            ]
          },
          description: 'The operating system type. The default is Linux.'
        },
        osSku: {
          readOnly: true,
          type: 'string',
          enum: [ 'Ubuntu', 'CBLMariner', 'Windows2019', 'Windows2022' ],
          'x-ms-enum': { name: 'OSSKU', modelAsString: true },
          description: 'Specifies the OS SKU used by the agent pool. If not specified, the default is Ubuntu if OSType=Linux or Windows2019 if OSType=Windows. And the default Windows OSSKU will be changed to Windows2022 after Windows2019 is deprecated.'
        },
        vmSize: {
          readOnly: true,
          type: 'string',
          description: 'The size of the VM.'
        },
        enableFIPS: {
          readOnly: true,
          type: 'boolean',
          description: 'Whether to use a FIPS-enabled OS.'
        }
      }
    }
  },
  allOf: [
    {
      title: 'Tracked Resource',
      description: "The resource model definition for an Azure Resource Manager tracked top level resource which has 'tags' and a 'location'",
      type: 'object',
      properties: {
        tags: {
          type: 'object',
          additionalProperties: { type: 'string' },
          'x-ms-mutability': [ 'read', 'create', 'update' ],
          description: 'Resource tags.'
        },
        location: {
          type: 'string',
          'x-ms-mutability': [ 'read', 'create' ],
          description: 'The geo-location where the resource lives'
        }
      },
      required: [ 'location' ],
      allOf: [
        {
          title: 'Resource',
          description: 'Common fields that are returned in the response for all Azure Resource Manager resources',
          type: 'object',
          properties: {
            id: {
              readOnly: true,
              type: 'string',
              description: 'Fully qualified resource ID for the resource. Ex - /subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/{resourceProviderNamespace}/{resourceType}/{resourceName}'
            },
            name: {
              readOnly: true,
              type: 'string',
              description: 'The name of the resource'
            },
            type: {
              readOnly: true,
              type: 'string',
              description: 'The type of the resource. E.g. "Microsoft.Compute/virtualMachines" or "Microsoft.Storage/storageAccounts"'
            },
            systemData: {
              readOnly: true,
              type: 'object',
              description: 'Azure Resource Manager metadata containing createdBy and modifiedBy information.',
              properties: {
                createdBy: {
                  type: 'string',
                  description: 'The identity that created the resource.'
                },
                createdByType: {
                  type: 'string',
                  description: 'The type of identity that created the resource.',
                  enum: [ 'User', 'Application', 'ManagedIdentity', 'Key' ],
                  'x-ms-enum': { name: 'createdByType', modelAsString: true }
                },
                createdAt: {
                  type: 'string',
                  format: 'date-time',
                  description: 'The timestamp of resource creation (UTC).'
                },
                lastModifiedBy: {
                  type: 'string',
                  description: 'The identity that last modified the resource.'
                },
                lastModifiedByType: {
                  type: 'string',
                  description: 'The type of identity that last modified the resource.',
                  enum: [ 'User', 'Application', 'ManagedIdentity', 'Key' ],
                  'x-ms-enum': { name: 'createdByType', modelAsString: true }
                },
                lastModifiedAt: {
                  type: 'string',
                  format: 'date-time',
                  description: 'The timestamp of resource last modification (UTC)'
                }
              }
            }
          },
          'x-ms-azure-resource': true
        }
      ]
    }
  ],
  description: 'A node pool snapshot resource.'
}
```
## Misc
The resource version is `2022-04-02-preview`.

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/containerservice/resource-manager/Microsoft.ContainerService/preview/2022-04-02-preview/managedClusters.json).
