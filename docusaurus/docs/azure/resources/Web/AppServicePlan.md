---
id: AppServicePlan
title: AppServicePlan
---
Provides a **AppServicePlan** from the **Web** group
## Examples
### Create Or Update App Service plan
```js
provider.Web.makeAppServicePlan({
  name: "myAppServicePlan",
  properties: () => ({
    kind: "app",
    location: "East US",
    properties: {},
    sku: { name: "P1", tier: "Premium", size: "P1", family: "P", capacity: 1 },
  }),
  dependencies: ({ resources }) => ({
    resourceGroup: resources.Resources.ResourceGroup["myResourceGroup"],
    hostingEnvironment:
      resources.Web.HostingEnvironment["myHostingEnvironment"],
    kubeEnvironment: resources.Web.KubeEnvironment["myKubeEnvironment"],
  }),
});

```
## Dependencies
- [ResourceGroup](../Resources/ResourceGroup.md)
- [HostingEnvironment](../Web/HostingEnvironment.md)
- [KubeEnvironment](../Web/KubeEnvironment.md)
## Swagger Schema
```js
{
  description: 'App Service plan.',
  type: 'object',
  allOf: [
    {
      description: 'Azure resource. This resource is tracked in Azure Resource Manager',
      required: [ 'location' ],
      type: 'object',
      properties: {
        id: { description: 'Resource Id.', type: 'string', readOnly: true },
        name: {
          description: 'Resource Name.',
          type: 'string',
          readOnly: true
        },
        kind: { description: 'Kind of resource.', type: 'string' },
        location: { description: 'Resource Location.', type: 'string' },
        type: {
          description: 'Resource type.',
          type: 'string',
          readOnly: true
        },
        tags: {
          description: 'Resource tags.',
          type: 'object',
          additionalProperties: { type: 'string' }
        }
      },
      'x-ms-azure-resource': true
    }
  ],
  properties: {
    properties: {
      description: 'AppServicePlan resource specific properties',
      type: 'object',
      properties: {
        workerTierName: {
          description: 'Target worker tier assigned to the App Service plan.',
          type: 'string'
        },
        status: {
          description: 'App Service plan status.',
          enum: [ 'Ready', 'Pending', 'Creating' ],
          type: 'string',
          readOnly: true,
          'x-ms-enum': { name: 'StatusOptions', modelAsString: false }
        },
        subscription: {
          description: 'App Service plan subscription.',
          type: 'string',
          readOnly: true
        },
        hostingEnvironmentProfile: {
          description: 'Specification for the App Service Environment to use for the App Service plan.',
          'x-ms-mutability': [ 'create', 'read' ],
          type: 'object',
          properties: {
            id: {
              description: 'Resource ID of the App Service Environment.',
              type: 'string'
            },
            name: {
              description: 'Name of the App Service Environment.',
              type: 'string',
              readOnly: true
            },
            type: {
              description: 'Resource type of the App Service Environment.',
              type: 'string',
              readOnly: true
            }
          }
        },
        maximumNumberOfWorkers: {
          format: 'int32',
          description: 'Maximum number of instances that can be assigned to this App Service plan.',
          type: 'integer',
          readOnly: true
        },
        geoRegion: {
          description: 'Geographical location for the App Service plan.',
          type: 'string',
          readOnly: true
        },
        perSiteScaling: {
          description: 'If <code>true</code>, apps assigned to this App Service plan can be scaled independently.\n' +
            'If <code>false</code>, apps assigned to this App Service plan will scale to all instances of the plan.',
          default: false,
          type: 'boolean'
        },
        elasticScaleEnabled: {
          description: 'ServerFarm supports ElasticScale. Apps in this plan will scale as if the ServerFarm was ElasticPremium sku',
          type: 'boolean'
        },
        maximumElasticWorkerCount: {
          format: 'int32',
          description: 'Maximum number of total workers allowed for this ElasticScaleEnabled App Service Plan',
          type: 'integer'
        },
        numberOfSites: {
          format: 'int32',
          description: 'Number of apps assigned to this App Service plan.',
          type: 'integer',
          readOnly: true
        },
        isSpot: {
          description: 'If <code>true</code>, this App Service Plan owns spot instances.',
          type: 'boolean'
        },
        spotExpirationTime: {
          format: 'date-time',
          description: 'The time when the server farm expires. Valid only if it is a spot server farm.',
          type: 'string'
        },
        freeOfferExpirationTime: {
          format: 'date-time',
          description: 'The time when the server farm free offer expires.',
          type: 'string'
        },
        resourceGroup: {
          description: 'Resource group of the App Service plan.',
          type: 'string',
          readOnly: true
        },
        reserved: {
          description: 'If Linux app service plan <code>true</code>, <code>false</code> otherwise.',
          default: false,
          type: 'boolean',
          'x-ms-mutability': [ 'create', 'read' ]
        },
        isXenon: {
          description: 'Obsolete: If Hyper-V container app service plan <code>true</code>, <code>false</code> otherwise.',
          default: false,
          type: 'boolean',
          'x-ms-mutability': [ 'create', 'read' ]
        },
        hyperV: {
          description: 'If Hyper-V container app service plan <code>true</code>, <code>false</code> otherwise.',
          default: false,
          type: 'boolean',
          'x-ms-mutability': [ 'create', 'read' ]
        },
        targetWorkerCount: {
          format: 'int32',
          description: 'Scaling worker count.',
          type: 'integer'
        },
        targetWorkerSizeId: {
          format: 'int32',
          description: 'Scaling worker size ID.',
          type: 'integer'
        },
        provisioningState: {
          description: 'Provisioning state of the App Service Plan.',
          enum: [
            'Succeeded',
            'Failed',
            'Canceled',
            'InProgress',
            'Deleting'
          ],
          type: 'string',
          readOnly: true,
          'x-ms-enum': { name: 'ProvisioningState', modelAsString: false }
        },
        kubeEnvironmentProfile: {
          description: 'Specification for the Kubernetes Environment to use for the App Service plan.',
          type: 'object',
          properties: {
            id: {
              description: 'Resource ID of the Kubernetes Environment.',
              type: 'string'
            },
            name: {
              description: 'Name of the Kubernetes Environment.',
              type: 'string',
              readOnly: true
            },
            type: {
              description: 'Resource type of the Kubernetes Environment.',
              type: 'string',
              readOnly: true
            }
          }
        },
        zoneRedundant: {
          description: 'If <code>true</code>, this App Service Plan will perform availability zone balancing.\n' +
            'If <code>false</code>, this App Service Plan will not perform availability zone balancing.',
          default: false,
          type: 'boolean'
        }
      },
      'x-ms-client-flatten': true
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
    },
    extendedLocation: {
      description: 'Extended Location.',
      type: 'object',
      properties: {
        name: { description: 'Name of extended location.', type: 'string' },
        type: {
          description: 'Type of extended location.',
          type: 'string',
          readOnly: true
        }
      }
    }
  }
}
```
## Misc
The resource version is `2021-03-01`.

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/web/resource-manager/Microsoft.Web/stable/2021-03-01/AppServicePlans.json).
