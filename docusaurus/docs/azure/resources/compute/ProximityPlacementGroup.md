---
id: ProximityPlacementGroup
title: ProximityPlacementGroup
---
Provides a **ProximityPlacementGroup** from the **Compute** group
## Examples
### Create or Update a proximity placement group.
```js
provider.Compute.makeProximityPlacementGroup({
  name: "myProximityPlacementGroup",
  properties: () => ({
    location: "westus",
    properties: { proximityPlacementGroupType: "Standard" },
  }),
  dependencies: ({ resources }) => ({
    resourceGroup: resources.Resources.ResourceGroup["myResourceGroup"],
  }),
});

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
              }
            }
          },
          description: 'A list of references to all availability sets in the proximity placement group.'
        },
        colocationStatus: {
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
  description: 'Specifies information about the proximity placement group.'
}
```
## Misc
The resource version is `2021-11-01`.

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/compute/resource-manager/Microsoft.Compute/stable/2021-11-01/compute.json).
