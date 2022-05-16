---
id: ScopeMap
title: ScopeMap
---
Provides a **ScopeMap** from the **ContainerRegistry** group
## Examples
### ScopeMapCreate
```js
exports.createResources = () => [
  {
    type: "ScopeMap",
    group: "ContainerRegistry",
    name: "myScopeMap",
    properties: () => ({
      properties: {
        description: "Developer Scopes",
        actions: [
          "repositories/myrepository/contentWrite",
          "repositories/myrepository/delete",
        ],
      },
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
  description: 'An object that represents a scope map for a container registry.',
  type: 'object',
  allOf: [
    {
      description: 'The resource model definition for a ARM proxy resource. It will have everything other than required location and tags.',
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
      description: 'The properties of the scope map.',
      'x-ms-client-flatten': true,
      required: [ 'actions' ],
      type: 'object',
      properties: {
        description: {
          description: 'The user friendly description of the scope map.',
          type: 'string'
        },
        type: {
          description: 'The type of the scope map. E.g. BuildIn scope map.',
          type: 'string',
          readOnly: true
        },
        creationDate: {
          format: 'date-time',
          description: 'The creation date of scope map.',
          type: 'string',
          readOnly: true
        },
        provisioningState: {
          description: 'Provisioning state of the resource.',
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
        actions: {
          description: 'The list of scoped permissions for registry artifacts.\r\n' +
            'E.g. repositories/repository-name/content/read,\r\n' +
            'repositories/repository-name/metadata/write',
          type: 'array',
          items: { type: 'string' }
        }
      }
    }
  }
}
```
## Misc
The resource version is `2022-02-01-preview`.

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/containerregistry/resource-manager/Microsoft.ContainerRegistry/preview/2022-02-01-preview/containerregistry.json).
