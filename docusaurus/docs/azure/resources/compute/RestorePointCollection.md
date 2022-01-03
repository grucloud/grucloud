---
id: RestorePointCollection
title: RestorePointCollection
---
Provides a **RestorePointCollection** from the **Compute** group
## Examples
### Create or update a restore point collection.
```js
provider.Compute.makeRestorePointCollection({
  name: "myRestorePointCollection",
  properties: () => ({
    location: "norwayeast",
    properties: {
      source: {
        id: "/subscriptions/{subscription-id}/resourceGroups/myResourceGroup/providers/Microsoft.Compute/virtualMachines/myVM",
      },
    },
    tags: { myTag1: "tagValue1" },
  }),
  dependencies: ({ resources }) => ({
    resourceGroup: resources.Resources.ResourceGroup["myResourceGroup"],
    restorePoint: resources.Compute.RestorePoint["myRestorePoint"],
    virtualMachineScaleSetVm:
      resources.Compute.VirtualMachineScaleSetVM["myVirtualMachineScaleSetVM"],
  }),
});

```
## Dependencies
- [ResourceGroup](../Resources/ResourceGroup.md)
- [RestorePoint](../Compute/RestorePoint.md)
- [VirtualMachineScaleSetVM](../Compute/VirtualMachineScaleSetVM.md)
## Swagger Schema
```js
{
  properties: {
    properties: {
      'x-ms-client-flatten': true,
      properties: {
        source: {
          properties: {
            location: {
              type: 'string',
              readOnly: true,
              description: 'Location of the source resource used to create this restore point collection.'
            },
            id: {
              type: 'string',
              description: 'Resource Id of the source resource used to create this restore point collection'
            }
          },
          description: 'The properties of the source resource that this restore point collection is created from.'
        },
        provisioningState: {
          type: 'string',
          readOnly: true,
          description: 'The provisioning state of the restore point collection.'
        },
        restorePointCollectionId: {
          type: 'string',
          readOnly: true,
          description: 'The unique id of the restore point collection.'
        },
        restorePoints: {
          type: 'array',
          readOnly: true,
          items: {
            properties: {
              properties: {
                'x-ms-client-flatten': true,
                type: 'object',
                properties: {
                  excludeDisks: {
                    type: 'array',
                    items: {
                      properties: [Object],
                      description: 'The API entity reference.'
                    },
                    description: 'List of disk resource ids that the customer wishes to exclude from the restore point. If no disks are specified, all disks will be included.'
                  },
                  sourceMetadata: {
                    readOnly: true,
                    description: 'Gets the details of the VM captured at the time of the restore point creation.',
                    properties: {
                      hardwareProfile: [Object],
                      storageProfile: [Object],
                      osProfile: [Object],
                      diagnosticsProfile: [Object],
                      licenseType: [Object],
                      vmId: [Object],
                      securityProfile: [Object],
                      location: [Object]
                    }
                  },
                  provisioningState: {
                    type: 'string',
                    readOnly: true,
                    description: 'Gets the provisioning state of the restore point.'
                  },
                  consistencyMode: {
                    type: 'string',
                    readOnly: true,
                    enum: [
                      'CrashConsistent',
                      'FileSystemConsistent',
                      'ApplicationConsistent'
                    ],
                    'x-ms-enum': {
                      name: 'ConsistencyModeTypes',
                      modelAsString: true
                    },
                    description: 'Gets the consistency mode for the restore point. Please refer to https://aka.ms/RestorePoints for more details.'
                  },
                  timeCreated: {
                    type: 'string',
                    format: 'date-time',
                    description: 'Gets the creation time of the restore point.'
                  }
                },
                description: 'The restore point properties.'
              }
            },
            allOf: [
              {
                properties: {
                  id: {
                    readOnly: true,
                    type: 'string',
                    description: 'Resource Id'
                  },
                  name: {
                    readOnly: true,
                    type: 'string',
                    description: 'Resource name'
                  },
                  type: {
                    readOnly: true,
                    type: 'string',
                    description: 'Resource type'
                  }
                },
                description: 'The resource model definition for an Azure Resource Manager proxy resource. It will not have tags and a location',
                'x-ms-azure-resource': true
              }
            ],
            description: 'Restore Point details.'
          },
          description: 'A list containing all restore points created under this restore point collection.'
        }
      },
      description: 'The restore point collection properties.'
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
  description: 'Create or update Restore Point collection parameters.'
}
```
## Misc
The resource version is `2021-07-01`.

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/compute/resource-manager/Microsoft.Compute/stable/2021-07-01/compute.json).
