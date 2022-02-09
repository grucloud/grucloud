---
id: AvailabilitySet
title: AvailabilitySet
---
Provides a **AvailabilitySet** from the **Compute** group
## Examples
### Create an availability set.
```js
exports.createResources = () => [
  {
    type: "AvailabilitySet",
    group: "Compute",
    name: "myAvailabilitySet",
    properties: () => ({
      location: "westus",
      properties: {
        platformFaultDomainCount: 2,
        platformUpdateDomainCount: 20,
      },
    }),
    dependencies: ({}) => ({
      resourceGroup: "myResourceGroup",
      proximityPlacementGroup: "myProximityPlacementGroup",
    }),
  },
];

```
## Dependencies
- [ResourceGroup](../Resources/ResourceGroup.md)
- [ProximityPlacementGroup](../Compute/ProximityPlacementGroup.md)
## Swagger Schema
```js
{
  properties: {
    properties: {
      'x-ms-client-flatten': true,
      properties: {
        platformUpdateDomainCount: {
          type: 'integer',
          format: 'int32',
          description: 'Update Domain count.'
        },
        platformFaultDomainCount: {
          type: 'integer',
          format: 'int32',
          description: 'Fault Domain count.'
        },
        virtualMachines: {
          type: 'array',
          items: {
            properties: { id: { type: 'string', description: 'Resource Id' } },
            'x-ms-azure-resource': true
          },
          description: 'A list of references to all virtual machines in the availability set.'
        },
        proximityPlacementGroup: {
          properties: { id: { type: 'string', description: 'Resource Id' } },
          'x-ms-azure-resource': true,
          description: 'Specifies information about the proximity placement group that the availability set should be assigned to. <br><br>Minimum api-version: 2018-04-01.'
        },
        statuses: {
          readOnly: true,
          type: 'array',
          items: {
            properties: {
              code: { type: 'string', description: 'The status code.' },
              level: {
                type: 'string',
                description: 'The level code.',
                enum: [ 'Info', 'Warning', 'Error' ],
                'x-ms-enum': { name: 'StatusLevelTypes', modelAsString: false }
              },
              displayStatus: {
                type: 'string',
                description: 'The short localizable label for the status.'
              },
              message: {
                type: 'string',
                description: 'The detailed status message, including for alerts and error messages.'
              },
              time: {
                type: 'string',
                format: 'date-time',
                description: 'The time of the status.'
              }
            },
            description: 'Instance view status.'
          },
          description: 'The resource status information.'
        }
      },
      description: 'The instance view of a resource.'
    },
    sku: {
      description: "Sku of the availability set, only name is required to be set. See AvailabilitySetSkuTypes for possible set of values. Use 'Aligned' for virtual machines with managed disks and 'Classic' for virtual machines with unmanaged disks. Default value is 'Classic'.",
      properties: {
        name: { type: 'string', description: 'The sku name.' },
        tier: {
          type: 'string',
          description: 'Specifies the tier of virtual machines in a scale set.<br /><br /> Possible Values:<br /><br /> **Standard**<br /><br /> **Basic**'
        },
        capacity: {
          type: 'integer',
          format: 'int64',
          description: 'Specifies the number of virtual machines in the scale set.'
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
        location: { type: 'string', description: 'Resource location' },
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
  description: 'Specifies information about the availability set that the virtual machine should be assigned to. Virtual machines specified in the same availability set are allocated to different nodes to maximize availability. For more information about availability sets, see [Availability sets overview](https://docs.microsoft.com/azure/virtual-machines/availability-set-overview). <br><br> For more information on Azure planned maintenance, see [Maintenance and updates for Virtual Machines in Azure](https://docs.microsoft.com/azure/virtual-machines/maintenance-and-updates) <br><br> Currently, a VM can only be added to availability set at creation time. An existing VM cannot be added to an availability set.'
}
```
## Misc
The resource version is `2021-11-01`.

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/compute/resource-manager/Microsoft.Compute/stable/2021-11-01/compute.json).
