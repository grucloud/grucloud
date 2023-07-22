---
id: AgentPool
title: AgentPool
---
Provides a **AgentPool** from the **ContainerRegistry** group
## Examples
### AgentPools_Create
```js
exports.createResources = () => [
  {
    type: "AgentPool",
    group: "ContainerRegistry",
    name: "myAgentPool",
    properties: () => ({
      location: "WESTUS",
      tags: { key: "value" },
      properties: { count: 1, tier: "S1", os: "Linux" },
    }),
    dependencies: ({}) => ({
      resourceGroup: "myResourceGroup",
      subnet: "mySubnet",
      registry: "myRegistry",
    }),
  },
];

```
## Dependencies
- [ResourceGroup](../Resources/ResourceGroup.md)
- [Subnet](../Network/Subnet.md)
- [Registry](../ContainerRegistry/Registry.md)
## Swagger Schema
```js
{
  description: 'The agentpool that has the ARM resource and properties. \r\n' +
    'The agentpool will have all information to create an agent pool.',
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
      description: 'The properties associated with the agent pool',
      'x-ms-client-flatten': true,
      type: 'object',
      properties: {
        count: {
          format: 'int32',
          description: 'The count of agent machine',
          type: 'integer'
        },
        tier: { description: 'The Tier of agent machine', type: 'string' },
        os: {
          description: 'The OS of agent machine',
          enum: [ 'Windows', 'Linux' ],
          type: 'string',
          'x-ms-enum': { name: 'OS', modelAsString: true }
        },
        virtualNetworkSubnetResourceId: {
          description: 'The Virtual Network Subnet Resource Id of the agent machine',
          type: 'string'
        },
        provisioningState: {
          description: 'The provisioning state of this agent pool',
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
        }
      }
    }
  }
}
```
## Misc
The resource version is `2019-06-01-preview`.

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/containerregistry/resource-manager/Microsoft.ContainerRegistry/preview/2019-06-01-preview/containerregistry_build.json).
