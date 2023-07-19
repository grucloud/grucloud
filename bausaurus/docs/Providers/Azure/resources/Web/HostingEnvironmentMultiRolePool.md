---
id: HostingEnvironmentMultiRolePool
title: HostingEnvironmentMultiRolePool
---
Provides a **HostingEnvironmentMultiRolePool** from the **Web** group
## Examples
## Dependencies
- [ResourceGroup](../Resources/ResourceGroup.md)
- [AppServiceEnvironment](../Web/AppServiceEnvironment.md)
## Swagger Schema
```json
{
  description: 'Worker pool of a hostingEnvironment (App Service Environment)',
  type: 'object',
  allOf: [
    {
      required: [ 'location' ],
      properties: {
        id: { description: 'Resource Id', type: 'string' },
        name: { description: 'Resource Name', type: 'string' },
        kind: { description: 'Kind of resource', type: 'string' },
        location: { description: 'Resource Location', type: 'string' },
        type: { description: 'Resource type', type: 'string' },
        tags: {
          description: 'Resource tags',
          type: 'object',
          additionalProperties: { type: 'string' }
        }
      },
      'x-ms-azure-resource': true
    }
  ],
  properties: {
    properties: {
      properties: {
        workerSizeId: {
          format: 'int32',
          description: 'Worker size id for referencing this worker pool',
          type: 'integer'
        },
        computeMode: {
          description: 'Shared or dedicated web app hosting',
          enum: [ 'Shared', 'Dedicated', 'Dynamic' ],
          type: 'string',
          'x-ms-enum': { name: 'ComputeModeOptions', modelAsString: false }
        },
        workerSize: {
          description: 'VM size of the worker pool instances',
          type: 'string'
        },
        workerCount: {
          format: 'int32',
          description: 'Number of instances in the worker pool',
          type: 'integer'
        },
        instanceNames: {
          description: 'Names of all instances in the worker pool (read only)',
          type: 'array',
          items: { type: 'string' }
        }
      },
      'x-ms-client-flatten': true
    },
    sku: {
      description: 'Describes a sku for a scalable resource',
      type: 'object',
      properties: {
        name: { description: 'Name of the resource sku', type: 'string' },
        tier: {
          description: 'Service Tier of the resource sku',
          type: 'string'
        },
        size: {
          description: 'Size specifier of the resource sku',
          type: 'string'
        },
        family: {
          description: 'Family code of the resource sku',
          type: 'string'
        },
        capacity: {
          format: 'int32',
          description: 'Current number of instances assigned to the resource',
          type: 'integer'
        }
      }
    }
  }
}
```
## Misc
The resource version is `2015-08-01`.

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/web/resource-manager/Microsoft.Web/stable/2015-08-01/service.json).
