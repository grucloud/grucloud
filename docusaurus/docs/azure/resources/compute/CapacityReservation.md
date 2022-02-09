---
id: CapacityReservation
title: CapacityReservation
---
Provides a **CapacityReservation** from the **Compute** group
## Examples
### Create or update a capacity reservation .
```js
exports.createResources = () => [
  {
    type: "CapacityReservation",
    group: "Compute",
    name: "myCapacityReservation",
    properties: () => ({
      location: "westus",
      tags: { department: "HR" },
      sku: { name: "Standard_DS1_v2", capacity: 4 },
      zones: ["1"],
    }),
    dependencies: ({}) => ({
      resourceGroup: "myResourceGroup",
      capacityReservationGroup: "myCapacityReservationGroup",
    }),
  },
];

```
## Dependencies
- [ResourceGroup](../Resources/ResourceGroup.md)
- [CapacityReservationGroup](../Compute/CapacityReservationGroup.md)
## Swagger Schema
```js
{
  type: 'object',
  properties: {
    properties: {
      'x-ms-client-flatten': true,
      type: 'object',
      properties: {
        reservationId: {
          readOnly: true,
          type: 'string',
          description: 'A unique id generated and assigned to the capacity reservation by the platform which does not change throughout the lifetime of the resource.'
        },
        virtualMachinesAssociated: {
          type: 'array',
          items: {
            properties: {
              id: {
                readOnly: true,
                type: 'string',
                description: 'Resource Id'
              }
            },
            'x-ms-azure-resource': true
          },
          readOnly: true,
          description: 'A list of all virtual machine resource ids that are associated with the capacity reservation.'
        },
        provisioningTime: {
          readOnly: true,
          type: 'string',
          format: 'date-time',
          description: 'The date time when the capacity reservation was last updated.'
        },
        provisioningState: {
          readOnly: true,
          type: 'string',
          description: 'The provisioning state, which only appears in the response.'
        },
        instanceView: {
          type: 'object',
          properties: {
            utilizationInfo: {
              description: 'Unutilized capacity of the capacity reservation.',
              type: 'object',
              properties: {
                virtualMachinesAllocated: {
                  type: 'array',
                  items: {
                    properties: {
                      id: {
                        readOnly: true,
                        type: 'string',
                        description: 'Resource Id'
                      }
                    },
                    'x-ms-azure-resource': true
                  },
                  readOnly: true,
                  description: 'A list of all virtual machines resource ids allocated against the capacity reservation.'
                }
              }
            },
            statuses: {
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
          description: 'The instance view of a capacity reservation that provides as snapshot of the runtime properties of the capacity reservation that is managed by the platform and can change outside of control plane operations.',
          readOnly: true
        },
        timeCreated: {
          readOnly: true,
          type: 'string',
          format: 'date-time',
          description: 'Specifies the time at which the Capacity Reservation resource was created.<br><br>Minimum api-version: 2021-11-01.'
        }
      },
      description: 'Properties of the Capacity reservation.'
    },
    sku: {
      description: "SKU of the resource for which capacity needs be reserved. The SKU name and capacity is required to be set. Currently VM Skus with the capability called 'CapacityReservationSupported' set to true are supported. Refer to List Microsoft.Compute SKUs in a region (https://docs.microsoft.com/rest/api/compute/resourceskus/list) for supported values.",
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
    },
    zones: {
      type: 'array',
      items: { type: 'string' },
      description: 'Availability Zone to use for this capacity reservation. The zone has to be single value and also should be part for the list of zones specified during the capacity reservation group creation. The zone can be assigned only during creation. If not provided, the reservation supports only non-zonal deployments. If provided, enforces VM/VMSS using this capacity reservation to be in same zone.'
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
  required: [ 'sku' ],
  description: 'Specifies information about the capacity reservation.'
}
```
## Misc
The resource version is `2021-11-01`.

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/compute/resource-manager/Microsoft.Compute/stable/2021-11-01/compute.json).
