---
id: DedicatedHostGroup
title: DedicatedHostGroup
---
Provides a **DedicatedHostGroup** from the **Compute** group
## Examples
### Create or update a dedicated host group.
```js
exports.createResources = () => [
  {
    type: "DedicatedHostGroup",
    group: "Compute",
    name: "myDedicatedHostGroup",
    properties: () => ({
      location: "westus",
      tags: { department: "finance" },
      zones: ["1"],
      properties: {
        platformFaultDomainCount: 3,
        supportAutomaticPlacement: true,
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
      properties: {
        platformFaultDomainCount: {
          type: 'integer',
          format: 'int32',
          minimum: 1,
          description: 'Number of fault domains that the host group can span.'
        },
        hosts: {
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
          description: 'A list of references to all dedicated hosts in the dedicated host group.'
        },
        instanceView: {
          readOnly: true,
          description: 'The dedicated host group instance view, which has the list of instance view of the dedicated hosts under the dedicated host group.',
          properties: {
            hosts: {
              type: 'array',
              items: {
                properties: {
                  name: {
                    type: 'string',
                    readOnly: true,
                    description: 'The name of the dedicated host.'
                  }
                },
                allOf: [
                  {
                    properties: {
                      assetId: {
                        readOnly: true,
                        type: 'string',
                        description: 'Specifies the unique id of the dedicated physical machine on which the dedicated host resides.'
                      },
                      availableCapacity: {
                        description: 'Unutilized capacity of the dedicated host.',
                        properties: {
                          allocatableVMs: {
                            type: 'array',
                            items: {
                              properties: { vmSize: [Object], count: [Object] },
                              description: 'Represents the dedicated host unutilized capacity in terms of a specific VM size.'
                            },
                            description: 'The unutilized capacity of the dedicated host represented in terms of each VM size that is allowed to be deployed to the dedicated host.'
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
                    description: 'The instance view of a dedicated host.'
                  }
                ],
                description: 'The instance view of a dedicated host that includes the name of the dedicated host. It is used for the response to the instance view of a dedicated host group.'
              },
              description: 'List of instance view of the dedicated hosts under the dedicated host group.'
            }
          }
        },
        supportAutomaticPlacement: {
          type: 'boolean',
          description: "Specifies whether virtual machines or virtual machine scale sets can be placed automatically on the dedicated host group. Automatic placement means resources are allocated on dedicated hosts, that are chosen by Azure, under the dedicated host group. The value is defaulted to 'false' when not provided. <br><br>Minimum api-version: 2020-06-01."
        }
      },
      required: [ 'platformFaultDomainCount' ],
      description: 'Dedicated Host Group Properties.'
    },
    zones: {
      type: 'array',
      items: { type: 'string' },
      description: 'Availability Zone to use for this host group. Only single zone is supported. The zone can be assigned only during creation. If not provided, the group supports all zones in the region. If provided, enforces each host in the group to be in the same zone.'
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
  description: 'Specifies information about the dedicated host group that the dedicated hosts should be assigned to. <br><br> Currently, a dedicated host can only be added to a dedicated host group at creation time. An existing dedicated host cannot be added to another dedicated host group.'
}
```
## Misc
The resource version is `2021-11-01`.

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/compute/resource-manager/Microsoft.Compute/stable/2021-11-01/compute.json).
