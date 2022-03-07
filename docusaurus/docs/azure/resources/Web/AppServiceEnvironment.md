---
id: AppServiceEnvironment
title: AppServiceEnvironment
---
Provides a **AppServiceEnvironment** from the **Web** group
## Examples
## Dependencies
- [ResourceGroup](../Resources/ResourceGroup.md)
- [VirtualNetwork](../Network/VirtualNetwork.md)
## Swagger Schema
```js
{
  description: 'App Service Environment ARM resource.',
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
      description: 'Core resource properties',
      type: 'object',
      'x-ms-client-flatten': true,
      required: [ 'virtualNetwork' ],
      properties: {
        provisioningState: {
          description: 'Provisioning state of the App Service Environment.',
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
        status: {
          description: 'Current status of the App Service Environment.',
          enum: [ 'Preparing', 'Ready', 'Scaling', 'Deleting' ],
          type: 'string',
          readOnly: true,
          'x-ms-enum': { name: 'HostingEnvironmentStatus', modelAsString: false }
        },
        virtualNetwork: {
          description: 'Description of the Virtual Network.',
          required: [ 'id' ],
          type: 'object',
          properties: {
            id: {
              description: 'Resource id of the Virtual Network.',
              type: 'string'
            },
            name: {
              description: 'Name of the Virtual Network (read-only).',
              type: 'string',
              readOnly: true
            },
            type: {
              description: 'Resource type of the Virtual Network (read-only).',
              type: 'string',
              readOnly: true
            },
            subnet: {
              description: 'Subnet within the Virtual Network.',
              type: 'string'
            }
          }
        },
        internalLoadBalancingMode: {
          description: 'Specifies which endpoints to serve internally in the Virtual Network for the App Service Environment.',
          enum: [ 'None', 'Web', 'Publishing', 'Web, Publishing' ],
          type: 'string',
          'x-ms-enum': { name: 'LoadBalancingMode', modelAsString: true }
        },
        multiSize: {
          description: 'Front-end VM size, e.g. "Medium", "Large".',
          type: 'string'
        },
        multiRoleCount: {
          format: 'int32',
          description: 'Number of front-end instances.',
          type: 'integer',
          readOnly: true
        },
        ipsslAddressCount: {
          format: 'int32',
          description: 'Number of IP SSL addresses reserved for the App Service Environment.',
          type: 'integer'
        },
        dnsSuffix: {
          description: 'DNS suffix of the App Service Environment.',
          type: 'string'
        },
        maximumNumberOfMachines: {
          format: 'int32',
          description: 'Maximum number of VMs in the App Service Environment.',
          type: 'integer',
          readOnly: true
        },
        frontEndScaleFactor: {
          format: 'int32',
          description: 'Scale factor for front-ends.',
          type: 'integer'
        },
        suspended: {
          description: '<code>true</code> if the App Service Environment is suspended; otherwise, <code>false</code>. The environment can be suspended, e.g. when the management endpoint is no longer available\n' +
            ' (most likely because NSG blocked the incoming traffic).',
          type: 'boolean',
          readOnly: true
        },
        clusterSettings: {
          description: 'Custom settings for changing the behavior of the App Service Environment.',
          type: 'array',
          items: {
            description: 'Name value pair.',
            type: 'object',
            properties: {
              name: { description: 'Pair name.', type: 'string' },
              value: { description: 'Pair value.', type: 'string' }
            }
          },
          'x-ms-identifiers': [ 'name' ]
        },
        userWhitelistedIpRanges: {
          description: 'User added ip ranges to whitelist on ASE db',
          type: 'array',
          items: { type: 'string' }
        },
        hasLinuxWorkers: {
          description: 'Flag that displays whether an ASE has linux workers or not',
          type: 'boolean',
          readOnly: true
        },
        dedicatedHostCount: {
          format: 'int32',
          description: 'Dedicated Host Count',
          type: 'integer'
        },
        zoneRedundant: {
          description: 'Whether or not this App Service Environment is zone-redundant.',
          type: 'boolean'
        }
      }
    }
  }
}
```
## Misc
The resource version is `2021-03-01`.

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/web/resource-manager/Microsoft.Web/stable/2021-03-01/AppServiceEnvironments.json).
