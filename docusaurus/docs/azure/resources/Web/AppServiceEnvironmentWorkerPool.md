---
id: AppServiceEnvironmentWorkerPool
title: AppServiceEnvironmentWorkerPool
---
Provides a **AppServiceEnvironmentWorkerPool** from the **Web** group
## Examples
## Dependencies
- [ResourceGroup](../Resources/ResourceGroup.md)
- [AppServiceEnvironment](../Web/AppServiceEnvironment.md)
## Swagger Schema
```js
{
  description: 'Worker pool of an App Service Environment ARM resource.',
  type: 'object',
  allOf: [
    {
      description: 'Azure proxy only resource. This resource is not tracked by Azure Resource Manager.',
      type: 'object',
      properties: {
        id: { description: 'Resource Id.', type: 'string', readOnly: true },
        name: {
          description: 'Resource Name.',
          type: 'string',
          readOnly: true
        },
        kind: { description: 'Kind of resource.', type: 'string' },
        type: {
          description: 'Resource type.',
          type: 'string',
          readOnly: true
        }
      },
      'x-ms-azure-resource': true
    }
  ],
  properties: {
    properties: {
      description: 'Core resource properties',
      'x-ms-client-flatten': true,
      type: 'object',
      properties: {
        workerSizeId: {
          format: 'int32',
          description: 'Worker size ID for referencing this worker pool.',
          type: 'integer'
        },
        computeMode: {
          description: 'Shared or dedicated app hosting.',
          enum: [ 'Shared', 'Dedicated', 'Dynamic' ],
          type: 'string',
          'x-ms-enum': { name: 'ComputeModeOptions', modelAsString: false }
        },
        workerSize: {
          description: 'VM size of the worker pool instances.',
          type: 'string'
        },
        workerCount: {
          format: 'int32',
          description: 'Number of instances in the worker pool.',
          type: 'integer'
        },
        instanceNames: {
          description: 'Names of all instances in the worker pool (read only).',
          type: 'array',
          items: { type: 'string' },
          readOnly: true
        }
      }
    },
    sku: {
      description: 'Description of a SKU for a scalable resource.',
      type: 'object',
      properties: {
        name: { description: 'Name of the resource SKU.', type: 'string' },
        tier: {
          description: 'Service tier of the resource SKU.',
          type: 'string'
        },
        size: {
          description: 'Size specifier of the resource SKU.',
          type: 'string'
        },
        family: {
          description: 'Family code of the resource SKU.',
          type: 'string'
        },
        capacity: {
          format: 'int32',
          description: 'Current number of instances assigned to the resource.',
          type: 'integer'
        },
        skuCapacity: {
          description: 'Min, max, and default scale values of the SKU.',
          type: 'object',
          properties: {
            minimum: {
              format: 'int32',
              description: 'Minimum number of workers for this App Service plan SKU.',
              type: 'integer'
            },
            maximum: {
              format: 'int32',
              description: 'Maximum number of workers for this App Service plan SKU.',
              type: 'integer'
            },
            elasticMaximum: {
              format: 'int32',
              description: 'Maximum number of Elastic workers for this App Service plan SKU.',
              type: 'integer'
            },
            default: {
              format: 'int32',
              description: 'Default number of workers for this App Service plan SKU.',
              type: 'integer'
            },
            scaleType: {
              description: 'Available scale configurations for an App Service plan.',
              type: 'string'
            }
          }
        },
        locations: {
          description: 'Locations of the SKU.',
          type: 'array',
          items: { type: 'string' }
        },
        capabilities: {
          description: 'Capabilities of the SKU, e.g., is traffic manager enabled?',
          type: 'array',
          items: {
            description: 'Describes the capabilities/features allowed for a specific SKU.',
            type: 'object',
            properties: {
              name: {
                description: 'Name of the SKU capability.',
                type: 'string'
              },
              value: {
                description: 'Value of the SKU capability.',
                type: 'string'
              },
              reason: {
                description: 'Reason of the SKU capability.',
                type: 'string'
              }
            }
          }
        }
      }
    }
  }
}
```
## Misc
The resource version is `2021-03-01`.

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/web/resource-manager/Microsoft.Web/stable/2021-03-01/AppServiceEnvironments.json).
