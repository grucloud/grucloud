---
id: ProximityPlacementGroup
title: ProximityPlacementGroup
---
Provides a **ProximityPlacementGroup** from the **Compute** group
## Examples
### Create or Update a proximity placement group.
```js
exports.createResources = () => [
  {
    type: "ProximityPlacementGroup",
    group: "Compute",
    name: "myProximityPlacementGroup",
    properties: () => ({
      location: "westus",
      zones: ["1"],
      properties: {
        proximityPlacementGroupType: "Standard",
        intent: { vmSizes: ["Basic_A0", "Basic_A2"] },
      },
    }),
    dependencies: ({}) => ({ resourceGroup: "myResourceGroup" }),
  },
];

```
## Dependencies
- [ResourceGroup](../Resources/ResourceGroup.md)
## Swagger Schema
```js
{
  properties: {
    properties: {
      'x-ms-client-flatten': true,
      description: 'Describes the properties of a Proximity Placement Group.',
      properties: {
        proximityPlacementGroupType: {
          type: 'string',
          description: 'Specifies the type of the proximity placement group. <br><br> Possible values are: <br><br> **Standard** : Co-locate resources within an Azure region or Availability Zone. <br><br> **Ultra** : For future use.',
          enum: [ 'Standard', 'Ultra' ],
          'x-ms-enum': { name: 'ProximityPlacementGroupType', modelAsString: true }
        },
        virtualMachines: {
          readOnly: true,
          type: 'array',
          items: {
            allOf: [
              {
                properties: { id: { type: 'string', description: 'Resource Id' } },
                'x-ms-azure-resource': true
              }
            ],
            properties: {
              colocationStatus: {
                description: 'Describes colocation status of a resource in the Proximity Placement Group.',
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
                }
              }
            }
          },
          description: 'A list of references to all virtual machines in the proximity placement group.'
        },
        virtualMachineScaleSets: {
          readOnly: true,
          type: 'array',
          items: {
            allOf: [
              {
                properties: { id: { type: 'string', description: 'Resource Id' } },
                'x-ms-azure-resource': true
              }
            ],
            properties: {
              colocationStatus: {
                description: 'Describes colocation status of a resource in the Proximity Placement Group.',
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
                }
              }
            }
          },
          description: 'A list of references to all virtual machine scale sets in the proximity placement group.'
        },
        availabilitySets: {
          readOnly: true,
          type: 'array',
          items: {
            allOf: [
              {
                properties: { id: { type: 'string', description: 'Resource Id' } },
                'x-ms-azure-resource': true
              }
            ],
            properties: {
              colocationStatus: {
                description: 'Describes colocation status of a resource in the Proximity Placement Group.',
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
                }
              }
            }
          },
          description: 'A list of references to all availability sets in the proximity placement group.'
        },
        colocationStatus: {
          description: 'Describes colocation status of the Proximity Placement Group.',
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
          }
        },
        intent: {
          type: 'object',
          properties: {
            vmSizes: {
              type: 'array',
              description: 'Specifies possible sizes of virtual machines that can be created in the proximity placement group.',
              items: {
                type: 'string',
                description: 'Specifies the size of the virtual machine. Recommended way to get the list of available sizes is using these APIs: <br><br> [List all available virtual machine sizes in an availability set](https://docs.microsoft.com/rest/api/compute/availabilitysets/listavailablesizes) <br><br> [List all available virtual machine sizes in a region]( https://docs.microsoft.com/rest/api/compute/resourceskus/list) <br><br> [List all available virtual machine sizes for resizing](https://docs.microsoft.com/rest/api/compute/virtualmachines/listavailablesizes). For more information about virtual machine sizes, see [Sizes for virtual machines](https://docs.microsoft.com/azure/virtual-machines/sizes). <br><br> The available VM sizes depend on region and availability set.'
              }
            }
          },
          description: 'Specifies the user intent of the proximity placement group.'
        }
      }
    },
    zones: {
      type: 'array',
      items: { type: 'string' },
      description: 'Specifies the Availability Zone where virtual machine, virtual machine scale set or availability set associated with the  proximity placement group can be created.'
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
  description: 'Specifies information about the proximity placement group.'
}
```
## Misc
The resource version is `2022-03-01`.

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/Microsoft.Compute/ComputeRP/stable/2022-03-01/ComputeRP/proximityPlacementGroup.json).
