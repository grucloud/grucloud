---
id: CapacityReservationGroup
title: CapacityReservationGroup
---
Provides a **CapacityReservationGroup** from the **Compute** group
## Examples
### Create or update a capacity reservation group.
```js
provider.Compute.makeCapacityReservationGroup({
  name: "myCapacityReservationGroup",
  properties: () => ({
    location: "westus",
    tags: { department: "finance" },
    zones: ["1", "2"],
  }),
  dependencies: ({}) => ({ resourceGroup: "myResourceGroup" }),
});

```
## Dependencies
- [ResourceGroup](../Resources/ResourceGroup.md)
## Swagger Schema
```js
{
  type: 'object',
  properties: {
    properties: {
      'x-ms-client-flatten': true,
      type: 'object',
      properties: {
        capacityReservations: {
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
          description: 'A list of all capacity reservation resource ids that belong to capacity reservation group.'
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
          description: 'A list of references to all virtual machines associated to the capacity reservation group.'
        },
        instanceView: {
          readOnly: true,
          description: 'The capacity reservation group instance view which has the list of instance views for all the capacity reservations that belong to the capacity reservation group.',
          type: 'object',
          properties: {
            capacityReservations: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  name: {
                    type: 'string',
                    readOnly: true,
                    description: 'The name of the capacity reservation.'
                  }
                },
                allOf: [
                  {
                    type: 'object',
                    properties: {
                      utilizationInfo: {
                        description: 'Unutilized capacity of the capacity reservation.',
                        type: 'object',
                        properties: {
                          virtualMachinesAllocated: {
                            type: 'array',
                            items: {
                              properties: { id: [Object] },
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
                            code: {
                              type: 'string',
                              description: 'The status code.'
                            },
                            level: {
                              type: 'string',
                              description: 'The level code.',
                              enum: [ 'Info', 'Warning', 'Error' ],
                              'x-ms-enum': {
                                name: 'StatusLevelTypes',
                                modelAsString: false
                              }
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
                    description: 'The instance view of a capacity reservation that provides as snapshot of the runtime properties of the capacity reservation that is managed by the platform and can change outside of control plane operations.'
                  }
                ],
                description: 'The instance view of a capacity reservation that includes the name of the capacity reservation. It is used for the response to the instance view of a capacity reservation group.'
              },
              readOnly: true,
              description: 'List of instance view of the capacity reservations under the capacity reservation group.'
            }
          }
        }
      },
      description: 'capacity reservation group Properties.'
    },
    zones: {
      type: 'array',
      items: { type: 'string' },
      description: 'Availability Zones to use for this capacity reservation group. The zones can be assigned only during creation. If not provided, the group supports only regional resources in the region. If provided, enforces each capacity reservation in the group to be in one of the zones.'
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
  description: 'Specifies information about the capacity reservation group that the capacity reservations should be assigned to. <br><br> Currently, a capacity reservation can only be added to a capacity reservation group at creation time. An existing capacity reservation cannot be added or moved to another capacity reservation group.'
}
```
## Misc
The resource version is `2021-11-01`.

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/compute/resource-manager/Microsoft.Compute/stable/2021-11-01/compute.json).
