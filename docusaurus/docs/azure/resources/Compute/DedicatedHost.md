---
id: DedicatedHost
title: DedicatedHost
---
Provides a **DedicatedHost** from the **Compute** group
## Examples
### Create or update a dedicated host .
```js
exports.createResources = () => [
  {
    type: "DedicatedHost",
    group: "Compute",
    name: "myDedicatedHost",
    properties: () => ({
      location: "westus",
      tags: { department: "HR" },
      properties: { platformFaultDomain: 1 },
      sku: { name: "DSv3-Type1" },
    }),
    dependencies: ({}) => ({
      resourceGroup: "myResourceGroup",
      dedicatedHostGroup: "myDedicatedHostGroup",
      hostGroup: "myDedicatedHostGroup",
    }),
  },
];

```
## Dependencies
- [ResourceGroup](../Resources/ResourceGroup.md)
- [DedicatedHostGroup](../Compute/DedicatedHostGroup.md)
- [DedicatedHostGroup](../Compute/DedicatedHostGroup.md)
## Swagger Schema
```js
{
  properties: {
    properties: {
      'x-ms-client-flatten': true,
      properties: {
        platformFaultDomain: {
          type: 'integer',
          format: 'int32',
          minimum: 0,
          description: 'Fault domain of the dedicated host within a dedicated host group.'
        },
        autoReplaceOnFailure: {
          type: 'boolean',
          description: "Specifies whether the dedicated host should be replaced automatically in case of a failure. The value is defaulted to 'true' when not provided."
        },
        hostId: {
          readOnly: true,
          type: 'string',
          description: 'A unique id generated and assigned to the dedicated host by the platform. <br><br> Does not change throughout the lifetime of the host.'
        },
        virtualMachines: {
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
          description: 'A list of references to all virtual machines in the Dedicated Host.'
        },
        licenseType: {
          description: 'Specifies the software license type that will be applied to the VMs deployed on the dedicated host. <br><br> Possible values are: <br><br> **None** <br><br> **Windows_Server_Hybrid** <br><br> **Windows_Server_Perpetual** <br><br> Default: **None**',
          type: 'string',
          enum: [
            'None',
            'Windows_Server_Hybrid',
            'Windows_Server_Perpetual'
          ],
          'x-ms-enum': { name: 'DedicatedHostLicenseTypes', modelAsString: false }
        },
        provisioningTime: {
          readOnly: true,
          type: 'string',
          format: 'date-time',
          description: 'The date when the host was first provisioned.'
        },
        provisioningState: {
          readOnly: true,
          type: 'string',
          description: 'The provisioning state, which only appears in the response.'
        },
        instanceView: {
          readOnly: true,
          description: 'The dedicated host instance view.',
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
                    properties: {
                      vmSize: {
                        type: 'string',
                        description: 'VM size in terms of which the unutilized capacity is represented.'
                      },
                      count: {
                        type: 'number',
                        format: 'double',
                        description: "Maximum number of VMs of size vmSize that can fit in the dedicated host's remaining capacity."
                      }
                    },
                    description: 'Represents the dedicated host unutilized capacity in terms of a specific VM size.'
                  },
                  'x-ms-identifiers': [],
                  description: 'The unutilized capacity of the dedicated host represented in terms of each VM size that is allowed to be deployed to the dedicated host.'
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
              'x-ms-identifiers': [],
              description: 'The resource status information.'
            }
          }
        },
        timeCreated: {
          readOnly: true,
          type: 'string',
          format: 'date-time',
          description: 'Specifies the time at which the Dedicated Host resource was created.<br><br>Minimum api-version: 2022-03-01.'
        }
      },
      description: 'Properties of the dedicated host.'
    },
    sku: {
      description: 'SKU of the dedicated host for Hardware Generation and VM family. Only name is required to be set. List Microsoft.Compute SKUs for a list of possible values.',
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
  required: [ 'sku' ],
  description: 'Specifies information about the Dedicated host.'
}
```
## Misc
The resource version is `2022-03-01`.

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/Microsoft.Compute/ComputeRP/stable/2022-03-01/ComputeRP/dedicatedHost.json).
