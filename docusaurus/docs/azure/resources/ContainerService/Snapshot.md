---
id: Snapshot
title: Snapshot
---
Provides a **Snapshot** from the **ContainerService** group
## Examples
### Create/Update Snapshot
```js
provider.ContainerService.makeSnapshot({
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
});

```
## Dependencies
- [ResourceGroup](../Resources/ResourceGroup.md)
## Swagger Schema
```js
{
  type: 'object',
  properties: {
    systemData: {
      readOnly: true,
      description: 'The system metadata relating to this snapshot.',
      type: 'object',
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
          description: 'The UTC timestamp of resource creation.'
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
          description: 'The type of identity that last modified the resource.'
        }
      }
    },
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
          enum: [ 'NodePool' ],
          'x-ms-enum': {
            name: 'SnapshotType',
            modelAsString: true,
            values: [
              {
                value: 'NodePool',
                description: 'The snapshot is a snapshot of a node pool.'
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
          description: 'The operating system type. The default is Linux.',
          readOnly: true
        },
        osSku: {
          type: 'string',
          enum: [ 'Ubuntu', 'CBLMariner' ],
          'x-ms-enum': { name: 'OSSKU', modelAsString: true },
          description: 'Specifies an OS SKU. This value must not be specified if OSType is Windows.',
          readOnly: true
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
      description: 'The Resource model definition.',
      properties: {
        id: { readOnly: true, type: 'string', description: 'Resource Id' },
        name: {
          readOnly: true,
          type: 'string',
          description: 'Resource name'
        },
        type: {
          readOnly: true,
          type: 'string',
          description: 'Resource type'
        },
        location: {
          type: 'string',
          description: 'Resource location',
          'x-ms-mutability': [ 'read', 'create' ]
        },
        tags: {
          type: 'object',
          additionalProperties: { type: 'string' },
          description: 'Resource tags'
        }
      },
      required: [ 'location' ],
      'x-ms-azure-resource': true
    }
  ],
  description: 'A node pool snapshot resource.'
}
```
## Misc
The resource version is `2021-11-01-preview`.

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/containerservice/resource-manager/Microsoft.ContainerService/preview/2021-11-01-preview/managedClusters.json).
