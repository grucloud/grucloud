---
id: HostingEnvironment
title: HostingEnvironment
---
Provides a **HostingEnvironment** from the **Web** group
## Examples
## Dependencies
- [ResourceGroup](../Resources/ResourceGroup.md)
- [VirtualNetwork](../Network/VirtualNetwork.md)
## Swagger Schema
```json
{
  description: 'Description of an hostingEnvironment (App Service Environment)',
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
          description: 'Name of the hostingEnvironment (App Service Environment)',
          type: 'string'
        },
        location: {
          description: 'Location of the hostingEnvironment (App Service Environment), e.g. "West US"',
          type: 'string'
        },
        provisioningState: {
          description: 'Provisioning state of the hostingEnvironment (App Service Environment)',
          enum: [
            'Succeeded',
            'Failed',
            'Canceled',
            'InProgress',
            'Deleting'
          ],
          type: 'string',
          'x-ms-enum': { name: 'ProvisioningState', modelAsString: false }
        },
        status: {
          description: 'Current status of the hostingEnvironment (App Service Environment)',
          enum: [ 'Preparing', 'Ready', 'Scaling', 'Deleting' ],
          type: 'string',
          'x-ms-enum': { name: 'HostingEnvironmentStatus', modelAsString: false }
        },
        vnetName: {
          description: "Name of the hostingEnvironment's (App Service Environment) virtual network",
          type: 'string'
        },
        vnetResourceGroupName: {
          description: "Resource group of the hostingEnvironment's (App Service Environment) virtual network",
          type: 'string'
        },
        vnetSubnetName: {
          description: "Subnet of the hostingEnvironment's (App Service Environment) virtual network",
          type: 'string'
        },
        virtualNetwork: {
          description: "Description of the hostingEnvironment's (App Service Environment) virtual network",
          type: 'object',
          properties: {
            id: {
              description: 'Resource id of the virtual network',
              type: 'string'
            },
            name: {
              description: 'Name of the virtual network (read-only)',
              type: 'string'
            },
            type: {
              description: 'Resource type of the virtual network (read-only)',
              type: 'string'
            },
            subnet: {
              description: 'Subnet within the virtual network',
              type: 'string'
            }
          }
        },
        internalLoadBalancingMode: {
          description: "Specifies which endpoints to serve internally in the hostingEnvironment's (App Service Environment) VNET",
          enum: [ 'None', 'Web', 'Publishing' ],
          type: 'string',
          'x-ms-enum': { name: 'InternalLoadBalancingMode', modelAsString: false }
        },
        multiSize: {
          description: 'Front-end VM size, e.g. "Medium", "Large"',
          type: 'string'
        },
        multiRoleCount: {
          format: 'int32',
          description: 'Number of front-end instances',
          type: 'integer'
        },
        workerPools: {
          description: 'Description of worker pools with worker size ids, VM sizes, and number of workers in each pool',
          type: 'array',
          items: {
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
                    'x-ms-enum': {
                      name: 'ComputeModeOptions',
                      modelAsString: false
                    }
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
                  name: {
                    description: 'Name of the resource sku',
                    type: 'string'
                  },
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
        },
        ipsslAddressCount: {
          format: 'int32',
          description: 'Number of IP SSL addresses reserved for this hostingEnvironment (App Service Environment)',
          type: 'integer'
        },
        databaseEdition: {
          description: 'Edition of the metadata database for the hostingEnvironment (App Service Environment) e.g. "Standard"',
          type: 'string'
        },
        databaseServiceObjective: {
          description: 'Service objective of the metadata database for the hostingEnvironment (App Service Environment) e.g. "S0"',
          type: 'string'
        },
        upgradeDomains: {
          format: 'int32',
          description: 'Number of upgrade domains of this hostingEnvironment (App Service Environment)',
          type: 'integer'
        },
        subscriptionId: {
          description: 'Subscription of the hostingEnvironment (App Service Environment)',
          type: 'string'
        },
        dnsSuffix: {
          description: 'DNS suffix of the hostingEnvironment (App Service Environment)',
          type: 'string'
        },
        lastAction: {
          description: 'Last deployment action on this hostingEnvironment (App Service Environment)',
          type: 'string'
        },
        lastActionResult: {
          description: 'Result of the last deployment action on this hostingEnvironment (App Service Environment)',
          type: 'string'
        },
        allowedMultiSizes: {
          description: 'List of comma separated strings describing which VM sizes are allowed for front-ends',
          type: 'string'
        },
        allowedWorkerSizes: {
          description: 'List of comma separated strings describing which VM sizes are allowed for workers',
          type: 'string'
        },
        maximumNumberOfMachines: {
          format: 'int32',
          description: 'Maximum number of VMs in this hostingEnvironment (App Service Environment)',
          type: 'integer'
        },
        vipMappings: {
          description: 'Description of IP SSL mapping for this hostingEnvironment (App Service Environment)',
          type: 'array',
          items: {
            description: 'Class that represents a VIP mapping',
            type: 'object',
            properties: {
              virtualIP: { description: 'Virtual IP address', type: 'string' },
              internalHttpPort: {
                format: 'int32',
                description: 'Internal HTTP port',
                type: 'integer'
              },
              internalHttpsPort: {
                format: 'int32',
                description: 'Internal HTTPS port',
                type: 'integer'
              },
              inUse: { description: 'Is VIP mapping in use', type: 'boolean' }
            }
          }
        },
        environmentCapacities: {
          description: 'Current total, used, and available worker capacities',
          type: 'array',
          items: {
            description: 'Class containing stamp capacity information',
            type: 'object',
            properties: {
              name: { description: 'Name of the stamp', type: 'string' },
              availableCapacity: {
                format: 'int64',
                description: 'Available capacity (# of machines, bytes of storage etc...)',
                type: 'integer'
              },
              totalCapacity: {
                format: 'int64',
                description: 'Total capacity (# of machines, bytes of storage etc...)',
                type: 'integer'
              },
              unit: { description: 'Name of the unit', type: 'string' },
              computeMode: {
                description: 'Shared/Dedicated workers',
                enum: [ 'Shared', 'Dedicated', 'Dynamic' ],
                type: 'string',
                'x-ms-enum': { name: 'ComputeModeOptions', modelAsString: false }
              },
              workerSize: {
                description: 'Size of the machines',
                enum: [ 'Default', 'Small', 'Medium', 'Large' ],
                type: 'string',
                'x-ms-enum': { name: 'WorkerSizeOptions', modelAsString: false }
              },
              workerSizeId: {
                format: 'int32',
                description: 'Size Id of machines: \r\n' +
                  '            0 - Small\r\n' +
                  '            1 - Medium\r\n' +
                  '            2 - Large',
                type: 'integer'
              },
              excludeFromCapacityAllocation: {
                description: 'If true it includes basic sites\r\n' +
                  '            Basic sites are not used for capacity allocation.',
                type: 'boolean'
              },
              isApplicableForAllComputeModes: {
                description: 'Is capacity applicable for all sites?',
                type: 'boolean'
              },
              siteMode: { description: 'Shared or Dedicated', type: 'string' }
            }
          }
        },
        networkAccessControlList: {
          description: 'Access control list for controlling traffic to the hostingEnvironment (App Service Environment)',
          type: 'array',
          items: {
            type: 'object',
            properties: {
              action: {
                enum: [ 'Permit', 'Deny' ],
                type: 'string',
                'x-ms-enum': {
                  name: 'AccessControlEntryAction',
                  modelAsString: false
                }
              },
              description: { type: 'string' },
              order: { format: 'int32', type: 'integer' },
              remoteSubnet: { type: 'string' }
            }
          }
        },
        environmentIsHealthy: {
          description: 'True/false indicating whether the hostingEnvironment (App Service Environment) is healthy',
          type: 'boolean'
        },
        environmentStatus: {
          description: 'Detailed message about with results of the last check of the hostingEnvironment (App Service Environment)',
          type: 'string'
        },
        resourceGroup: {
          description: 'Resource group of the hostingEnvironment (App Service Environment)',
          type: 'string'
        },
        apiManagementAccountId: {
          description: 'Api Management Account associated with this Hosting Environment',
          type: 'string'
        },
        suspended: {
          description: 'True/false indicating whether the hostingEnvironment is suspended. The environment can be suspended e.g. when the management endpoint is no longer available\r\n' +
            '            (most likely because NSG blocked the incoming traffic)',
          type: 'boolean'
        },
        clusterSettings: {
          description: 'Custom settings for changing the behavior of the hosting environment',
          type: 'array',
          items: {
            description: 'Name value pair',
            type: 'object',
            properties: {
              name: { description: 'Pair name', type: 'string' },
              value: { description: 'Pair value', type: 'string' }
            }
          }
        }
      },
      'x-ms-client-flatten': true
    }
  }
}
```
## Misc
The resource version is `2015-08-01`.

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/web/resource-manager/Microsoft.Web/stable/2015-08-01/service.json).
