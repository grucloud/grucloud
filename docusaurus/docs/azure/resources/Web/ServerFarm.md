---
id: ServerFarm
title: ServerFarm
---
Provides a **ServerFarm** from the **Web** group
## Examples
## Dependencies
- [ResourceGroup](../Resources/ResourceGroup.md)
- [HostingEnvironment](../Web/HostingEnvironment.md)
## Swagger Schema
```js
{
  description: 'App Service Plan Model',
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
      required: [ 'status' ],
      properties: {
        name: {
          description: 'Name for the App Service Plan',
          type: 'string'
        },
        workerTierName: {
          description: 'Target worker tier assigned to the App Service Plan',
          type: 'string'
        },
        status: {
          description: 'App Service Plan Status',
          enum: [ 'Ready', 'Pending' ],
          type: 'string',
          readOnly: true,
          'x-ms-enum': { name: 'StatusOptions', modelAsString: false }
        },
        subscription: {
          description: 'App Service Plan Subscription',
          type: 'string',
          readOnly: true
        },
        adminSiteName: {
          description: 'App Service Plan administration site',
          type: 'string'
        },
        hostingEnvironmentProfile: {
          description: 'Specification for the hosting environment (App Service Environment) to use for the App Service Plan',
          type: 'object',
          properties: {
            id: {
              description: 'Resource id of the hostingEnvironment (App Service Environment)',
              type: 'string'
            },
            name: {
              description: 'Name of the hostingEnvironment (App Service Environment) (read only)',
              type: 'string'
            },
            type: {
              description: 'Resource type of the hostingEnvironment (App Service Environment) (read only)',
              type: 'string'
            }
          }
        },
        maximumNumberOfWorkers: {
          format: 'int32',
          description: 'Maximum number of instances that can be assigned to this App Service Plan',
          type: 'integer'
        },
        geoRegion: {
          description: 'Geographical location for the App Service Plan',
          type: 'string',
          readOnly: true
        },
        perSiteScaling: {
          description: 'If True apps assigned to this App Service Plan can be scaled independently\r\n' +
            '            If False apps assigned to this App Service Plan will scale to all instances of the plan',
          type: 'boolean'
        },
        numberOfSites: {
          format: 'int32',
          description: 'Number of web apps assigned to this App Service Plan',
          type: 'integer',
          readOnly: true
        },
        resourceGroup: {
          description: 'Resource group of the server farm',
          type: 'string',
          readOnly: true
        },
        reserved: {
          description: 'Enables creation of a Linux App Service Plan',
          type: 'boolean'
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
