---
id: Image
title: Image
---
Provides a **Image** from the **Compute** group
## Examples
### Create a virtual machine image from a blob.
```js
exports.createResources = () => [
  {
    type: "Image",
    group: "Compute",
    name: "myImage",
    properties: () => ({
      location: "West US",
      properties: {
        storageProfile: {
          osDisk: {
            osType: "Linux",
            blobUri:
              "https://mystorageaccount.blob.core.windows.net/osimages/osimage.vhd",
            osState: "Generalized",
          },
          zoneResilient: true,
        },
      },
    }),
    dependencies: ({}) => ({
      resourceGroup: "myResourceGroup",
      virtualMachine: "myVirtualMachine",
    }),
  },
];

```

### Create a virtual machine image from a snapshot.
```js
exports.createResources = () => [
  {
    type: "Image",
    group: "Compute",
    name: "myImage",
    properties: () => ({
      location: "West US",
      properties: {
        storageProfile: {
          osDisk: {
            osType: "Linux",
            snapshot: {
              id: "subscriptions/{subscription-id}/resourceGroups/myResourceGroup/providers/Microsoft.Compute/snapshots/mySnapshot",
            },
            osState: "Generalized",
          },
          zoneResilient: false,
        },
      },
    }),
    dependencies: ({}) => ({
      resourceGroup: "myResourceGroup",
      virtualMachine: "myVirtualMachine",
    }),
  },
];

```

### Create a virtual machine image from a managed disk.
```js
exports.createResources = () => [
  {
    type: "Image",
    group: "Compute",
    name: "myImage",
    properties: () => ({
      location: "West US",
      properties: {
        storageProfile: {
          osDisk: {
            osType: "Linux",
            managedDisk: {
              id: "subscriptions/{subscription-id}/resourceGroups/myResourceGroup/providers/Microsoft.Compute/disks/myManagedDisk",
            },
            osState: "Generalized",
          },
          zoneResilient: true,
        },
      },
    }),
    dependencies: ({}) => ({
      resourceGroup: "myResourceGroup",
      virtualMachine: "myVirtualMachine",
    }),
  },
];

```

### Create a virtual machine image from an existing virtual machine.
```js
exports.createResources = () => [
  {
    type: "Image",
    group: "Compute",
    name: "myImage",
    properties: () => ({
      location: "West US",
      properties: {
        sourceVirtualMachine: {
          id: "/subscriptions/{subscription-id}/resourceGroups/myResourceGroup/providers/Microsoft.Compute/virtualMachines/myVM",
        },
      },
    }),
    dependencies: ({}) => ({
      resourceGroup: "myResourceGroup",
      virtualMachine: "myVirtualMachine",
    }),
  },
];

```

### Create a virtual machine image that includes a data disk from a blob.
```js
exports.createResources = () => [
  {
    type: "Image",
    group: "Compute",
    name: "myImage",
    properties: () => ({
      location: "West US",
      properties: {
        storageProfile: {
          osDisk: {
            osType: "Linux",
            blobUri:
              "https://mystorageaccount.blob.core.windows.net/osimages/osimage.vhd",
            osState: "Generalized",
          },
          dataDisks: [
            {
              lun: 1,
              blobUri:
                "https://mystorageaccount.blob.core.windows.net/dataimages/dataimage.vhd",
            },
          ],
          zoneResilient: false,
        },
      },
    }),
    dependencies: ({}) => ({
      resourceGroup: "myResourceGroup",
      virtualMachine: "myVirtualMachine",
    }),
  },
];

```

### Create a virtual machine image that includes a data disk from a snapshot.
```js
exports.createResources = () => [
  {
    type: "Image",
    group: "Compute",
    name: "myImage",
    properties: () => ({
      location: "West US",
      properties: {
        storageProfile: {
          osDisk: {
            osType: "Linux",
            snapshot: {
              id: "subscriptions/{subscription-id}/resourceGroups/myResourceGroup/providers/Microsoft.Compute/snapshots/mySnapshot",
            },
            osState: "Generalized",
          },
          dataDisks: [
            {
              lun: 1,
              snapshot: {
                id: "subscriptions/{subscriptionId}/resourceGroups/myResourceGroup/providers/Microsoft.Compute/snapshots/mySnapshot2",
              },
            },
          ],
          zoneResilient: true,
        },
      },
    }),
    dependencies: ({}) => ({
      resourceGroup: "myResourceGroup",
      virtualMachine: "myVirtualMachine",
    }),
  },
];

```

### Create a virtual machine image that includes a data disk from a managed disk.
```js
exports.createResources = () => [
  {
    type: "Image",
    group: "Compute",
    name: "myImage",
    properties: () => ({
      location: "West US",
      properties: {
        storageProfile: {
          osDisk: {
            osType: "Linux",
            managedDisk: {
              id: "subscriptions/{subscription-id}/resourceGroups/myResourceGroup/providers/Microsoft.Compute/disks/myManagedDisk",
            },
            osState: "Generalized",
          },
          dataDisks: [
            {
              lun: 1,
              managedDisk: {
                id: "subscriptions/{subscriptionId}/resourceGroups/myResourceGroup/providers/Microsoft.Compute/disks/myManagedDisk2",
              },
            },
          ],
          zoneResilient: false,
        },
      },
    }),
    dependencies: ({}) => ({
      resourceGroup: "myResourceGroup",
      virtualMachine: "myVirtualMachine",
    }),
  },
];

```

### Create a virtual machine image from a blob with DiskEncryptionSet resource.
```js
exports.createResources = () => [
  {
    type: "Image",
    group: "Compute",
    name: "myImage",
    properties: () => ({
      location: "West US",
      properties: {
        storageProfile: {
          osDisk: {
            osType: "Linux",
            blobUri:
              "https://mystorageaccount.blob.core.windows.net/osimages/osimage.vhd",
            diskEncryptionSet: {
              id: "/subscriptions/{subscription-id}/resourceGroups/myResourceGroup/providers/Microsoft.Compute/diskEncryptionSets/{existing-diskEncryptionSet-name}",
            },
            osState: "Generalized",
          },
        },
      },
    }),
    dependencies: ({}) => ({
      resourceGroup: "myResourceGroup",
      virtualMachine: "myVirtualMachine",
    }),
  },
];

```

### Create a virtual machine image from a snapshot with DiskEncryptionSet resource.
```js
exports.createResources = () => [
  {
    type: "Image",
    group: "Compute",
    name: "myImage",
    properties: () => ({
      location: "West US",
      properties: {
        storageProfile: {
          osDisk: {
            osType: "Linux",
            snapshot: {
              id: "subscriptions/{subscription-id}/resourceGroups/myResourceGroup/providers/Microsoft.Compute/snapshots/mySnapshot",
            },
            diskEncryptionSet: {
              id: "/subscriptions/{subscription-id}/resourceGroups/myResourceGroup/providers/Microsoft.Compute/diskEncryptionSets/{existing-diskEncryptionSet-name}",
            },
            osState: "Generalized",
          },
        },
      },
    }),
    dependencies: ({}) => ({
      resourceGroup: "myResourceGroup",
      virtualMachine: "myVirtualMachine",
    }),
  },
];

```

### Create a virtual machine image from a managed disk with DiskEncryptionSet resource.
```js
exports.createResources = () => [
  {
    type: "Image",
    group: "Compute",
    name: "myImage",
    properties: () => ({
      location: "West US",
      properties: {
        storageProfile: {
          osDisk: {
            osType: "Linux",
            managedDisk: {
              id: "subscriptions/{subscription-id}/resourceGroups/myResourceGroup/providers/Microsoft.Compute/disks/myManagedDisk",
            },
            diskEncryptionSet: {
              id: "/subscriptions/{subscription-id}/resourceGroups/myResourceGroup/providers/Microsoft.Compute/diskEncryptionSets/{existing-diskEncryptionSet-name}",
            },
            osState: "Generalized",
          },
        },
      },
    }),
    dependencies: ({}) => ({
      resourceGroup: "myResourceGroup",
      virtualMachine: "myVirtualMachine",
    }),
  },
];

```
## Dependencies
- [ResourceGroup](../Resources/ResourceGroup.md)
- [VirtualMachine](../Compute/VirtualMachine.md)
## Swagger Schema
```js
{
  properties: {
    properties: {
      'x-ms-client-flatten': true,
      properties: {
        sourceVirtualMachine: {
          properties: { id: { type: 'string', description: 'Resource Id' } },
          'x-ms-azure-resource': true,
          description: 'The source virtual machine from which Image is created.'
        },
        storageProfile: {
          description: 'Specifies the storage settings for the virtual machine disks.',
          properties: {
            osDisk: {
              description: 'Specifies information about the operating system disk used by the virtual machine. <br><br> For more information about disks, see [About disks and VHDs for Azure virtual machines](https://docs.microsoft.com/azure/virtual-machines/managed-disks-overview).',
              properties: {
                osType: {
                  type: 'string',
                  description: 'This property allows you to specify the type of the OS that is included in the disk if creating a VM from a custom image. <br><br> Possible values are: <br><br> **Windows** <br><br> **Linux**',
                  enum: [ 'Windows', 'Linux' ],
                  'x-ms-enum': {
                    name: 'OperatingSystemTypes',
                    modelAsString: false
                  }
                },
                osState: {
                  type: 'string',
                  description: 'The OS State.',
                  enum: [ 'Generalized', 'Specialized' ],
                  'x-ms-enum': {
                    name: 'OperatingSystemStateTypes',
                    modelAsString: false,
                    values: [
                      {
                        value: 'Generalized',
                        description: 'Generalized image. Needs to be provisioned during deployment time.'
                      },
                      {
                        value: 'Specialized',
                        description: 'Specialized image. Contains already provisioned OS Disk.'
                      }
                    ]
                  }
                }
              },
              allOf: [
                {
                  properties: {
                    snapshot: {
                      properties: {
                        id: { type: 'string', description: 'Resource Id' }
                      },
                      'x-ms-azure-resource': true,
                      description: 'The snapshot.'
                    },
                    managedDisk: {
                      properties: {
                        id: { type: 'string', description: 'Resource Id' }
                      },
                      'x-ms-azure-resource': true,
                      description: 'The managedDisk.'
                    },
                    blobUri: {
                      type: 'string',
                      description: 'The Virtual Hard Disk.'
                    },
                    caching: {
                      type: 'string',
                      description: 'Specifies the caching requirements. <br><br> Possible values are: <br><br> **None** <br><br> **ReadOnly** <br><br> **ReadWrite** <br><br> Default: **None for Standard storage. ReadOnly for Premium storage**',
                      enum: [ 'None', 'ReadOnly', 'ReadWrite' ],
                      'x-ms-enum': { name: 'CachingTypes', modelAsString: false }
                    },
                    diskSizeGB: {
                      type: 'integer',
                      format: 'int32',
                      description: 'Specifies the size of empty data disks in gigabytes. This element can be used to overwrite the name of the disk in a virtual machine image. <br><br> This value cannot be larger than 1023 GB'
                    },
                    storageAccountType: {
                      description: 'Specifies the storage account type for the managed disk. NOTE: UltraSSD_LRS can only be used with data disks, it cannot be used with OS Disk.',
                      type: 'string',
                      enum: [
                        'Standard_LRS',
                        'Premium_LRS',
                        'StandardSSD_LRS',
                        'UltraSSD_LRS',
                        'Premium_ZRS',
                        'StandardSSD_ZRS'
                      ],
                      'x-ms-enum': {
                        name: 'StorageAccountTypes',
                        modelAsString: true
                      }
                    },
                    diskEncryptionSet: {
                      description: 'Specifies the customer managed disk encryption set resource id for the managed image disk.',
                      allOf: [
                        {
                          properties: {
                            id: {
                              type: 'string',
                              description: 'Resource Id'
                            }
                          },
                          'x-ms-azure-resource': true
                        }
                      ]
                    }
                  },
                  description: 'Describes a image disk.'
                }
              ],
              required: [ 'osType', 'osState' ]
            },
            dataDisks: {
              type: 'array',
              items: {
                properties: {
                  lun: {
                    type: 'integer',
                    format: 'int32',
                    description: 'Specifies the logical unit number of the data disk. This value is used to identify data disks within the VM and therefore must be unique for each data disk attached to a VM.'
                  }
                },
                allOf: [
                  {
                    properties: {
                      snapshot: {
                        properties: {
                          id: {
                            type: 'string',
                            description: 'Resource Id'
                          }
                        },
                        'x-ms-azure-resource': true,
                        description: 'The snapshot.'
                      },
                      managedDisk: {
                        properties: {
                          id: {
                            type: 'string',
                            description: 'Resource Id'
                          }
                        },
                        'x-ms-azure-resource': true,
                        description: 'The managedDisk.'
                      },
                      blobUri: {
                        type: 'string',
                        description: 'The Virtual Hard Disk.'
                      },
                      caching: {
                        type: 'string',
                        description: 'Specifies the caching requirements. <br><br> Possible values are: <br><br> **None** <br><br> **ReadOnly** <br><br> **ReadWrite** <br><br> Default: **None for Standard storage. ReadOnly for Premium storage**',
                        enum: [ 'None', 'ReadOnly', 'ReadWrite' ],
                        'x-ms-enum': { name: 'CachingTypes', modelAsString: false }
                      },
                      diskSizeGB: {
                        type: 'integer',
                        format: 'int32',
                        description: 'Specifies the size of empty data disks in gigabytes. This element can be used to overwrite the name of the disk in a virtual machine image. <br><br> This value cannot be larger than 1023 GB'
                      },
                      storageAccountType: {
                        description: 'Specifies the storage account type for the managed disk. NOTE: UltraSSD_LRS can only be used with data disks, it cannot be used with OS Disk.',
                        type: 'string',
                        enum: [
                          'Standard_LRS',
                          'Premium_LRS',
                          'StandardSSD_LRS',
                          'UltraSSD_LRS',
                          'Premium_ZRS',
                          'StandardSSD_ZRS'
                        ],
                        'x-ms-enum': {
                          name: 'StorageAccountTypes',
                          modelAsString: true
                        }
                      },
                      diskEncryptionSet: {
                        description: 'Specifies the customer managed disk encryption set resource id for the managed image disk.',
                        allOf: [
                          {
                            properties: {
                              id: {
                                type: 'string',
                                description: 'Resource Id'
                              }
                            },
                            'x-ms-azure-resource': true
                          }
                        ]
                      }
                    },
                    description: 'Describes a image disk.'
                  }
                ],
                required: [ 'lun' ],
                description: 'Describes a data disk.'
              },
              'x-ms-identifiers': [ 'lun' ],
              description: 'Specifies the parameters that are used to add a data disk to a virtual machine. <br><br> For more information about disks, see [About disks and VHDs for Azure virtual machines](https://docs.microsoft.com/azure/virtual-machines/managed-disks-overview).'
            },
            zoneResilient: {
              type: 'boolean',
              description: 'Specifies whether an image is zone resilient or not. Default is false. Zone resilient images can be created only in regions that provide Zone Redundant Storage (ZRS).'
            }
          }
        },
        provisioningState: {
          readOnly: true,
          type: 'string',
          description: 'The provisioning state.'
        },
        hyperVGeneration: {
          type: 'string',
          description: 'Specifies the HyperVGeneration Type',
          enum: [ 'V1', 'V2' ],
          'x-ms-enum': { name: 'HyperVGenerationTypes', modelAsString: true }
        }
      },
      description: 'Describes the properties of an Image.'
    },
    extendedLocation: {
      description: 'The extended location of the Image.',
      properties: {
        name: {
          type: 'string',
          description: 'The name of the extended location.'
        },
        type: {
          description: 'The type of the extended location.',
          type: 'string',
          enum: [ 'EdgeZone' ],
          'x-ms-enum': { name: 'ExtendedLocationTypes', modelAsString: true }
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
  description: 'The source user image virtual hard disk. The virtual hard disk will be copied before being attached to the virtual machine. If SourceImage is provided, the destination virtual hard drive must not exist.'
}
```
## Misc
The resource version is `2021-11-01`.

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/compute/resource-manager/Microsoft.Compute/stable/2021-11-01/compute.json).
