---
id: Replication
title: Replication
---
Provides a **Replication** from the **ContainerRegistry** group
## Examples
### ReplicationCreate
```js
exports.createResources = () => [
  {
    type: "Replication",
    group: "ContainerRegistry",
    name: "myReplication",
    properties: () => ({ location: "eastus", tags: { key: "value" } }),
    dependencies: ({}) => ({
      resourceGroup: "myResourceGroup",
      registry: "myRegistry",
    }),
  },
];

```

### ReplicationCreateZoneRedundant
```js
exports.createResources = () => [
  {
    type: "Replication",
    group: "ContainerRegistry",
    name: "myReplication",
    properties: () => ({
      location: "eastus",
      tags: { key: "value" },
      properties: { regionEndpointEnabled: true, zoneRedundancy: "Enabled" },
    }),
    dependencies: ({}) => ({
      resourceGroup: "myResourceGroup",
      registry: "myRegistry",
    }),
  },
];

```
## Dependencies
- [ResourceGroup](../Resources/ResourceGroup.md)
- [Registry](../ContainerRegistry/Registry.md)
## Swagger Schema
```js
{
  description: 'An object that represents a replication for a container registry.',
  type: 'object',
  allOf: [
    {
      description: 'An Azure resource.',
      required: [ 'location' ],
      properties: {
        id: {
          description: 'The resource ID.',
          type: 'string',
          readOnly: true
        },
        name: {
          description: 'The name of the resource.',
          type: 'string',
          readOnly: true
        },
        type: {
          description: 'The type of the resource.',
          type: 'string',
          readOnly: true
        },
        location: {
          description: 'The location of the resource. This cannot be changed after the resource is created.',
          type: 'string',
          'x-ms-mutability': [ 'read', 'create' ]
        },
        tags: {
          description: 'The tags of the resource.',
          type: 'object',
          additionalProperties: { type: 'string' }
        },
        systemData: {
          description: 'Metadata pertaining to creation and last modification of the resource.',
          type: 'object',
          readOnly: true,
          properties: {
            createdBy: {
              description: 'The identity that created the resource.',
              type: 'string'
            },
            createdByType: {
              description: 'The type of identity that created the resource.',
              enum: [ 'User', 'Application', 'ManagedIdentity', 'Key' ],
              type: 'string',
              'x-ms-enum': { name: 'createdByType', modelAsString: true }
            },
            createdAt: {
              format: 'date-time',
              description: 'The timestamp of resource creation (UTC).',
              type: 'string'
            },
            lastModifiedBy: {
              description: 'The identity that last modified the resource.',
              type: 'string'
            },
            lastModifiedByType: {
              description: 'The type of identity that last modified the resource.',
              enum: [ 'User', 'Application', 'ManagedIdentity', 'Key' ],
              type: 'string',
              'x-ms-enum': { name: 'lastModifiedByType', modelAsString: true }
            },
            lastModifiedAt: {
              format: 'date-time',
              description: 'The timestamp of resource modification (UTC).',
              type: 'string'
            }
          }
        }
      },
      'x-ms-azure-resource': true
    }
  ],
  properties: {
    properties: {
      description: 'The properties of the replication.',
      'x-ms-client-flatten': true,
      type: 'object',
      properties: {
        provisioningState: {
          description: 'The provisioning state of the replication at the time the operation was called.',
          enum: [
            'Creating',
            'Updating',
            'Deleting',
            'Succeeded',
            'Failed',
            'Canceled'
          ],
          type: 'string',
          readOnly: true,
          'x-ms-enum': { name: 'ProvisioningState', modelAsString: true }
        },
        status: {
          description: 'The status of the replication at the time the operation was called.',
          readOnly: true,
          type: 'object',
          properties: {
            displayStatus: {
              description: 'The short label for the status.',
              type: 'string',
              readOnly: true
            },
            message: {
              description: 'The detailed message for the status, including alerts and error messages.',
              type: 'string',
              readOnly: true
            },
            timestamp: {
              format: 'date-time',
              description: 'The timestamp when the status was changed to the current value.',
              type: 'string',
              readOnly: true
            }
          }
        },
        regionEndpointEnabled: {
          description: "Specifies whether the replication's regional endpoint is enabled. Requests will not be routed to a replication whose regional endpoint is disabled, however its data will continue to be synced with other replications.",
          default: true,
          type: 'boolean'
        },
        zoneRedundancy: {
          description: 'Whether or not zone redundancy is enabled for this container registry replication',
          default: 'Disabled',
          enum: [ 'Enabled', 'Disabled' ],
          type: 'string',
          'x-ms-enum': { name: 'ZoneRedundancy', modelAsString: true }
        }
      }
    }
  }
}
```
## Misc
The resource version is `2021-09-01`.

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/containerregistry/resource-manager/Microsoft.ContainerRegistry/stable/2021-09-01/containerregistry.json).
