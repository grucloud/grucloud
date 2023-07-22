---
id: GalleryImageVersion
title: GalleryImageVersion
---
Provides a **GalleryImageVersion** from the **Compute** group
## Examples
### Create or update a simple Gallery Image Version using managed image as source.
```js
exports.createResources = () => [
  {
    type: "GalleryImageVersion",
    group: "Compute",
    name: "myGalleryImageVersion",
    properties: () => ({
      location: "West US",
      properties: {
        publishingProfile: {
          targetRegions: [
            {
              name: "West US",
              regionalReplicaCount: 1,
              encryption: {
                osDiskImage: {
                  diskEncryptionSetId:
                    "/subscriptions/{subscriptionId}/resourceGroups/myResourceGroup/providers/Microsoft.Compute/diskEncryptionSet/myWestUSDiskEncryptionSet",
                },
                dataDiskImages: [
                  {
                    lun: 0,
                    diskEncryptionSetId:
                      "/subscriptions/{subscriptionId}/resourceGroups/myResourceGroup/providers/Microsoft.Compute/diskEncryptionSet/myOtherWestUSDiskEncryptionSet",
                  },
                  {
                    lun: 1,
                    diskEncryptionSetId:
                      "/subscriptions/{subscriptionId}/resourceGroups/myResourceGroup/providers/Microsoft.Compute/diskEncryptionSet/myWestUSDiskEncryptionSet",
                  },
                ],
              },
            },
            {
              name: "East US",
              regionalReplicaCount: 2,
              storageAccountType: "Standard_ZRS",
              encryption: {
                osDiskImage: {
                  diskEncryptionSetId:
                    "/subscriptions/{subscriptionId}/resourceGroups/myResourceGroup/providers/Microsoft.Compute/diskEncryptionSet/myEastUSDiskEncryptionSet",
                },
                dataDiskImages: [
                  {
                    lun: 0,
                    diskEncryptionSetId:
                      "/subscriptions/{subscriptionId}/resourceGroups/myResourceGroup/providers/Microsoft.Compute/diskEncryptionSet/myOtherEastUSDiskEncryptionSet",
                  },
                  {
                    lun: 1,
                    diskEncryptionSetId:
                      "/subscriptions/{subscriptionId}/resourceGroups/myResourceGroup/providers/Microsoft.Compute/diskEncryptionSet/myEastUSDiskEncryptionSet",
                  },
                ],
              },
            },
          ],
        },
        storageProfile: {
          source: {
            id: "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroup}/providers/Microsoft.Compute/images/{imageName}",
          },
        },
      },
    }),
    dependencies: ({}) => ({
      resourceGroup: "myResourceGroup",
      diskEncryptionSets: ["myDiskEncryptionSet"],
      gallery: "myGallery",
      galleryImage: "myGalleryImage",
    }),
  },
];

```

### Create or update a simple Gallery Image Version using snapshots as a source.
```js
exports.createResources = () => [
  {
    type: "GalleryImageVersion",
    group: "Compute",
    name: "myGalleryImageVersion",
    properties: () => ({
      location: "West US",
      properties: {
        publishingProfile: {
          targetRegions: [
            {
              name: "West US",
              regionalReplicaCount: 1,
              encryption: {
                osDiskImage: {
                  diskEncryptionSetId:
                    "/subscriptions/{subscriptionId}/resourceGroups/myResourceGroup/providers/Microsoft.Compute/diskEncryptionSet/myWestUSDiskEncryptionSet",
                },
                dataDiskImages: [
                  {
                    lun: 1,
                    diskEncryptionSetId:
                      "/subscriptions/{subscriptionId}/resourceGroups/myResourceGroup/providers/Microsoft.Compute/diskEncryptionSet/myWestUSDiskEncryptionSet",
                  },
                ],
              },
            },
            {
              name: "East US",
              regionalReplicaCount: 2,
              storageAccountType: "Standard_ZRS",
              encryption: {
                osDiskImage: {
                  diskEncryptionSetId:
                    "/subscriptions/{subscriptionId}/resourceGroups/myResourceGroup/providers/Microsoft.Compute/diskEncryptionSet/myEastUSDiskEncryptionSet",
                },
                dataDiskImages: [
                  {
                    lun: 1,
                    diskEncryptionSetId:
                      "/subscriptions/{subscriptionId}/resourceGroups/myResourceGroup/providers/Microsoft.Compute/diskEncryptionSet/myEastUSDiskEncryptionSet",
                  },
                ],
              },
            },
          ],
        },
        storageProfile: {
          osDiskImage: {
            source: {
              id: "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroup}/providers/Microsoft.Compute/snapshots/{osSnapshotName}",
            },
            hostCaching: "ReadOnly",
          },
          dataDiskImages: [
            {
              source: {
                id: "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroup}/providers/Microsoft.Compute/disks/{dataDiskName}",
              },
              lun: 1,
              hostCaching: "None",
            },
          ],
        },
      },
    }),
    dependencies: ({}) => ({
      resourceGroup: "myResourceGroup",
      diskEncryptionSets: ["myDiskEncryptionSet"],
      gallery: "myGallery",
      galleryImage: "myGalleryImage",
    }),
  },
];

```

### Create or update a simple Gallery Image Version using VM as source.
```js
exports.createResources = () => [
  {
    type: "GalleryImageVersion",
    group: "Compute",
    name: "myGalleryImageVersion",
    properties: () => ({
      location: "West US",
      properties: {
        publishingProfile: {
          targetRegions: [
            {
              name: "West US",
              regionalReplicaCount: 2,
              encryption: {
                osDiskImage: {
                  diskEncryptionSetId:
                    "/subscriptions/{subscriptionId}/resourceGroups/myResourceGroup/providers/Microsoft.Compute/diskEncryptionSet/myWestUSDiskEncryptionSet",
                },
                dataDiskImages: [
                  {
                    lun: 0,
                    diskEncryptionSetId:
                      "/subscriptions/{subscriptionId}/resourceGroups/myResourceGroup/providers/Microsoft.Compute/diskEncryptionSet/myOtherWestUSDiskEncryptionSet",
                  },
                  {
                    lun: 1,
                    diskEncryptionSetId:
                      "/subscriptions/{subscriptionId}/resourceGroups/myResourceGroup/providers/Microsoft.Compute/diskEncryptionSet/myWestUSDiskEncryptionSet",
                  },
                ],
              },
            },
            {
              name: "East US",
              regionalReplicaCount: 2,
              storageAccountType: "Standard_ZRS",
              encryption: {
                osDiskImage: {
                  diskEncryptionSetId:
                    "/subscriptions/{subscriptionId}/resourceGroups/myResourceGroup/providers/Microsoft.Compute/diskEncryptionSet/myEastUSDiskEncryptionSet",
                },
                dataDiskImages: [
                  {
                    lun: 0,
                    diskEncryptionSetId:
                      "/subscriptions/{subscriptionId}/resourceGroups/myResourceGroup/providers/Microsoft.Compute/diskEncryptionSet/myOtherEastUSDiskEncryptionSet",
                  },
                  {
                    lun: 1,
                    diskEncryptionSetId:
                      "/subscriptions/{subscriptionId}/resourceGroups/myResourceGroup/providers/Microsoft.Compute/diskEncryptionSet/myEastUSDiskEncryptionSet",
                  },
                ],
              },
            },
          ],
        },
        storageProfile: {
          source: {
            id: "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroup}/providers/Microsoft.Compute/virtualMachines/{vmName}",
          },
        },
      },
    }),
    dependencies: ({}) => ({
      resourceGroup: "myResourceGroup",
      diskEncryptionSets: ["myDiskEncryptionSet"],
      gallery: "myGallery",
      galleryImage: "myGalleryImage",
    }),
  },
];

```

### Create or update a simple Gallery Image Version using shared image as source.
```js
exports.createResources = () => [
  {
    type: "GalleryImageVersion",
    group: "Compute",
    name: "myGalleryImageVersion",
    properties: () => ({
      location: "West US",
      properties: {
        publishingProfile: {
          targetRegions: [
            {
              name: "West US",
              regionalReplicaCount: 1,
              encryption: {
                osDiskImage: {
                  diskEncryptionSetId:
                    "/subscriptions/{subscriptionId}/resourceGroups/myResourceGroup/providers/Microsoft.Compute/diskEncryptionSet/myWestUSDiskEncryptionSet",
                },
                dataDiskImages: [
                  {
                    lun: 0,
                    diskEncryptionSetId:
                      "/subscriptions/{subscriptionId}/resourceGroups/myResourceGroup/providers/Microsoft.Compute/diskEncryptionSet/myOtherWestUSDiskEncryptionSet",
                  },
                  {
                    lun: 1,
                    diskEncryptionSetId:
                      "/subscriptions/{subscriptionId}/resourceGroups/myResourceGroup/providers/Microsoft.Compute/diskEncryptionSet/myWestUSDiskEncryptionSet",
                  },
                ],
              },
            },
            {
              name: "East US",
              regionalReplicaCount: 2,
              storageAccountType: "Standard_ZRS",
              encryption: {
                osDiskImage: {
                  diskEncryptionSetId:
                    "/subscriptions/{subscriptionId}/resourceGroups/myResourceGroup/providers/Microsoft.Compute/diskEncryptionSet/myEastUSDiskEncryptionSet",
                },
                dataDiskImages: [
                  {
                    lun: 0,
                    diskEncryptionSetId:
                      "/subscriptions/{subscriptionId}/resourceGroups/myResourceGroup/providers/Microsoft.Compute/diskEncryptionSet/myOtherEastUSDiskEncryptionSet",
                  },
                  {
                    lun: 1,
                    diskEncryptionSetId:
                      "/subscriptions/{subscriptionId}/resourceGroups/myResourceGroup/providers/Microsoft.Compute/diskEncryptionSet/myEastUSDiskEncryptionSet",
                  },
                ],
              },
            },
          ],
        },
        storageProfile: {
          source: {
            id: "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroup}/providers/Microsoft.Compute/galleries/{galleryName}/images/{imageDefinitionName}/versions/{versionName}",
          },
        },
      },
    }),
    dependencies: ({}) => ({
      resourceGroup: "myResourceGroup",
      diskEncryptionSets: ["myDiskEncryptionSet"],
      gallery: "myGallery",
      galleryImage: "myGalleryImage",
    }),
  },
];

```

### Create or update a simple Gallery Image Version using mix of disks and snapshots as a source.
```js
exports.createResources = () => [
  {
    type: "GalleryImageVersion",
    group: "Compute",
    name: "myGalleryImageVersion",
    properties: () => ({
      location: "West US",
      properties: {
        publishingProfile: {
          targetRegions: [
            {
              name: "West US",
              regionalReplicaCount: 1,
              encryption: {
                osDiskImage: {
                  diskEncryptionSetId:
                    "/subscriptions/{subscriptionId}/resourceGroups/myResourceGroup/providers/Microsoft.Compute/diskEncryptionSet/myWestUSDiskEncryptionSet",
                },
                dataDiskImages: [
                  {
                    lun: 1,
                    diskEncryptionSetId:
                      "/subscriptions/{subscriptionId}/resourceGroups/myResourceGroup/providers/Microsoft.Compute/diskEncryptionSet/myWestUSDiskEncryptionSet",
                  },
                ],
              },
            },
            {
              name: "East US",
              regionalReplicaCount: 2,
              storageAccountType: "Standard_ZRS",
              encryption: {
                osDiskImage: {
                  diskEncryptionSetId:
                    "/subscriptions/{subscriptionId}/resourceGroups/myResourceGroup/providers/Microsoft.Compute/diskEncryptionSet/myEastUSDiskEncryptionSet",
                },
                dataDiskImages: [
                  {
                    lun: 1,
                    diskEncryptionSetId:
                      "/subscriptions/{subscriptionId}/resourceGroups/myResourceGroup/providers/Microsoft.Compute/diskEncryptionSet/myEastUSDiskEncryptionSet",
                  },
                ],
              },
            },
          ],
        },
        storageProfile: {
          osDiskImage: {
            source: {
              id: "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroup}/providers/Microsoft.Compute/snapshots/{osSnapshotName}",
            },
            hostCaching: "ReadOnly",
          },
          dataDiskImages: [
            {
              source: {
                id: "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroup}/providers/Microsoft.Compute/disks/{dataDiskName}",
              },
              lun: 1,
              hostCaching: "None",
            },
          ],
        },
      },
    }),
    dependencies: ({}) => ({
      resourceGroup: "myResourceGroup",
      diskEncryptionSets: ["myDiskEncryptionSet"],
      gallery: "myGallery",
      galleryImage: "myGalleryImage",
    }),
  },
];

```

### Create or update a simple Gallery Image Version using vhd as a source.
```js
exports.createResources = () => [
  {
    type: "GalleryImageVersion",
    group: "Compute",
    name: "myGalleryImageVersion",
    properties: () => ({
      location: "West US",
      properties: {
        publishingProfile: {
          targetRegions: [
            {
              name: "West US",
              regionalReplicaCount: 1,
              encryption: {
                osDiskImage: {
                  diskEncryptionSetId:
                    "/subscriptions/{subscriptionId}/resourceGroups/myResourceGroup/providers/Microsoft.Compute/diskEncryptionSet/myDiskEncryptionSet",
                },
                dataDiskImages: [
                  {
                    diskEncryptionSetId:
                      "/subscriptions/{subscriptionId}/resourceGroups/myResourceGroup/providers/Microsoft.Compute/diskEncryptionSet/myOtherDiskEncryptionSet",
                    lun: 1,
                  },
                ],
              },
            },
            {
              name: "East US",
              regionalReplicaCount: 2,
              storageAccountType: "Standard_ZRS",
            },
          ],
        },
        storageProfile: {
          osDiskImage: {
            source: {
              id: "/subscriptions/{subscriptionId}/resourceGroups/myResourceGroup/providers/Microsoft.Storage/storageAccounts/{storageAccount}",
              uri: "https://gallerysourcencus.blob.core.windows.net/myvhds/Windows-Server-2012-R2-20171216-en.us-128GB.vhd",
            },
            hostCaching: "ReadOnly",
          },
          dataDiskImages: [
            {
              source: {
                id: "/subscriptions/{subscriptionId}/resourceGroups/myResourceGroup/providers/Microsoft.Storage/storageAccounts/{storageAccount}",
                uri: "https://gallerysourcencus.blob.core.windows.net/myvhds/Windows-Server-2012-R2-20171216-en.us-128GB.vhd",
              },
              lun: 1,
              hostCaching: "None",
            },
          ],
        },
      },
    }),
    dependencies: ({}) => ({
      resourceGroup: "myResourceGroup",
      diskEncryptionSets: ["myDiskEncryptionSet"],
      gallery: "myGallery",
      galleryImage: "myGalleryImage",
    }),
  },
];

```

### Create or update a simple Gallery Image Version using shallow replication mode.
```js
exports.createResources = () => [
  {
    type: "GalleryImageVersion",
    group: "Compute",
    name: "myGalleryImageVersion",
    properties: () => ({
      location: "West US",
      properties: {
        publishingProfile: {
          targetRegions: [{ name: "West US", regionalReplicaCount: 1 }],
          replicationMode: "Shallow",
        },
        storageProfile: {
          source: {
            id: "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroup}/providers/Microsoft.Compute/images/{imageName}",
          },
        },
      },
    }),
    dependencies: ({}) => ({
      resourceGroup: "myResourceGroup",
      diskEncryptionSets: ["myDiskEncryptionSet"],
      gallery: "myGallery",
      galleryImage: "myGalleryImage",
    }),
  },
];

```

### Create or update a simple gallery image version with target extended locations specified.
```js
exports.createResources = () => [
  {
    type: "GalleryImageVersion",
    group: "Compute",
    name: "myGalleryImageVersion",
    properties: () => ({
      location: "West US",
      properties: {
        publishingProfile: {
          targetRegions: [
            {
              name: "West US",
              regionalReplicaCount: 1,
              encryption: {
                osDiskImage: {
                  diskEncryptionSetId:
                    "/subscriptions/{subscriptionId}/resourceGroups/myResourceGroup/providers/Microsoft.Compute/diskEncryptionSet/myWestUSDiskEncryptionSet",
                },
                dataDiskImages: [
                  {
                    lun: 0,
                    diskEncryptionSetId:
                      "/subscriptions/{subscriptionId}/resourceGroups/myResourceGroup/providers/Microsoft.Compute/diskEncryptionSet/myOtherWestUSDiskEncryptionSet",
                  },
                  {
                    lun: 1,
                    diskEncryptionSetId:
                      "/subscriptions/{subscriptionId}/resourceGroups/myResourceGroup/providers/Microsoft.Compute/diskEncryptionSet/myWestUSDiskEncryptionSet",
                  },
                ],
              },
            },
            {
              name: "East US",
              regionalReplicaCount: 2,
              storageAccountType: "Standard_ZRS",
              encryption: {
                osDiskImage: {
                  diskEncryptionSetId:
                    "/subscriptions/{subscriptionId}/resourceGroups/myResourceGroup/providers/Microsoft.Compute/diskEncryptionSet/myEastUSDiskEncryptionSet",
                },
                dataDiskImages: [
                  {
                    lun: 0,
                    diskEncryptionSetId:
                      "/subscriptions/{subscriptionId}/resourceGroups/myResourceGroup/providers/Microsoft.Compute/diskEncryptionSet/myOtherEastUSDiskEncryptionSet",
                  },
                  {
                    lun: 1,
                    diskEncryptionSetId:
                      "/subscriptions/{subscriptionId}/resourceGroups/myResourceGroup/providers/Microsoft.Compute/diskEncryptionSet/myEastUSDiskEncryptionSet",
                  },
                ],
              },
            },
          ],
        },
        storageProfile: {
          source: {
            id: "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroup}/providers/Microsoft.Compute/images/{imageName}",
          },
        },
      },
    }),
    dependencies: ({}) => ({
      resourceGroup: "myResourceGroup",
      diskEncryptionSets: ["myDiskEncryptionSet"],
      gallery: "myGallery",
      galleryImage: "myGalleryImage",
    }),
  },
];

```
## Dependencies
- [ResourceGroup](../Resources/ResourceGroup.md)
- [DiskEncryptionSet](../Compute/DiskEncryptionSet.md)
- [Gallery](../Compute/Gallery.md)
- [GalleryImage](../Compute/GalleryImage.md)
## Swagger Schema
```json
{
  properties: {
    properties: {
      'x-ms-client-flatten': true,
      properties: {
        publishingProfile: {
          allOf: [
            {
              properties: {
                targetRegions: {
                  type: 'array',
                  items: {
                    properties: {
                      name: {
                        type: 'string',
                        description: 'The name of the region.'
                      },
                      regionalReplicaCount: {
                        type: 'integer',
                        format: 'int32',
                        description: 'The number of replicas of the Image Version to be created per region. This property is updatable.'
                      },
                      storageAccountType: {
                        type: 'string',
                        description: 'Specifies the storage account type to be used to store the image. This property is not updatable.',
                        enum: [
                          'Standard_LRS',
                          'Standard_ZRS',
                          'Premium_LRS'
                        ],
                        'x-ms-enum': {
                          name: 'StorageAccountType',
                          modelAsString: true
                        }
                      },
                      encryption: {
                        properties: {
                          osDiskImage: {
                            type: 'object',
                            properties: {
                              securityProfile: {
                                type: 'object',
                                description: 'This property specifies the security profile of an OS disk image.',
                                properties: {
                                  confidentialVMEncryptionType: {
                                    type: 'string',
                                    description: 'confidential VM encryption types',
                                    enum: [
                                      'EncryptedVMGuestStateOnlyWithPmk',
                                      'EncryptedWithPmk',
                                      'EncryptedWithCmk'
                                    ],
                                    'x-ms-enum': {
                                      name: 'ConfidentialVMEncryptionType',
                                      modelAsString: true
                                    }
                                  },
                                  secureVMDiskEncryptionSetId: {
                                    type: 'string',
                                    description: 'secure VM disk encryption set id'
                                  }
                                }
                              }
                            },
                            allOf: [
                              {
                                properties: {
                                  diskEncryptionSetId: {
                                    type: 'string',
                                    description: 'A relative URI containing the resource ID of the disk encryption set.'
                                  }
                                },
                                description: 'This is the disk image encryption base class.'
                              }
                            ],
                            description: 'Contains encryption settings for an OS disk image.'
                          },
                          dataDiskImages: {
                            type: 'array',
                            items: {
                              properties: {
                                lun: {
                                  type: 'integer',
                                  format: 'int32',
                                  description: 'This property specifies the logical unit number of the data disk. This value is used to identify data disks within the Virtual Machine and therefore must be unique for each data disk attached to the Virtual Machine.'
                                }
                              },
                              allOf: [
                                {
                                  properties: {
                                    diskEncryptionSetId: {
                                      type: 'string',
                                      description: 'A relative URI containing the resource ID of the disk encryption set.'
                                    }
                                  },
                                  description: 'This is the disk image encryption base class.'
                                }
                              ],
                              required: [ 'lun' ],
                              description: 'Contains encryption settings for a data disk image.'
                            },
                            'x-ms-identifiers': [ 'lun' ],
                            description: 'A list of encryption specifications for data disk images.'
                          }
                        },
                        description: 'Optional. Allows users to provide customer managed keys for encrypting the OS and data disks in the gallery artifact.'
                      }
                    },
                    required: [ 'name' ],
                    description: 'Describes the target region information.'
                  },
                  'x-ms-identifiers': [ 'name' ],
                  description: 'The target regions where the Image Version is going to be replicated to. This property is updatable.'
                },
                replicaCount: {
                  type: 'integer',
                  format: 'int32',
                  description: 'The number of replicas of the Image Version to be created per region. This property would take effect for a region when regionalReplicaCount is not specified. This property is updatable.'
                },
                excludeFromLatest: {
                  type: 'boolean',
                  description: "If set to true, Virtual Machines deployed from the latest version of the Image Definition won't use this Image Version."
                },
                publishedDate: {
                  readOnly: true,
                  type: 'string',
                  format: 'date-time',
                  description: 'The timestamp for when the gallery image version is published.'
                },
                endOfLifeDate: {
                  type: 'string',
                  format: 'date-time',
                  description: 'The end of life date of the gallery image version. This property can be used for decommissioning purposes. This property is updatable.'
                },
                storageAccountType: {
                  type: 'string',
                  description: 'Specifies the storage account type to be used to store the image. This property is not updatable.',
                  enum: [ 'Standard_LRS', 'Standard_ZRS', 'Premium_LRS' ],
                  'x-ms-enum': { name: 'StorageAccountType', modelAsString: true }
                },
                replicationMode: {
                  type: 'string',
                  description: 'Optional parameter which specifies the mode to be used for replication. This property is not updatable.',
                  enum: [ 'Full', 'Shallow' ],
                  'x-ms-enum': { name: 'ReplicationMode', modelAsString: true }
                },
                targetExtendedLocations: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      name: {
                        type: 'string',
                        description: 'The name of the region.'
                      },
                      extendedLocation: {
                        type: 'object',
                        properties: {
                          name: { type: 'string' },
                          type: {
                            type: 'string',
                            enum: [ 'EdgeZone', 'Unknown' ],
                            'x-ms-enum': {
                              name: 'GalleryExtendedLocationType',
                              modelAsString: true
                            },
                            description: 'It is type of the extended location.'
                          }
                        },
                        description: 'The name of the extended location.'
                      },
                      extendedLocationReplicaCount: {
                        type: 'integer',
                        format: 'int32',
                        description: 'The number of replicas of the Image Version to be created per extended location. This property is updatable.'
                      },
                      storageAccountType: {
                        type: 'string',
                        description: 'Specifies the storage account type to be used to store the image. This property is not updatable.',
                        enum: [
                          'Standard_LRS',
                          'Standard_ZRS',
                          'Premium_LRS'
                        ],
                        'x-ms-enum': {
                          name: 'StorageAccountType',
                          modelAsString: true
                        }
                      },
                      encryption: {
                        properties: {
                          osDiskImage: {
                            type: 'object',
                            properties: {
                              securityProfile: {
                                type: 'object',
                                description: 'This property specifies the security profile of an OS disk image.',
                                properties: {
                                  confidentialVMEncryptionType: {
                                    type: 'string',
                                    description: 'confidential VM encryption types',
                                    enum: [
                                      'EncryptedVMGuestStateOnlyWithPmk',
                                      'EncryptedWithPmk',
                                      'EncryptedWithCmk'
                                    ],
                                    'x-ms-enum': {
                                      name: 'ConfidentialVMEncryptionType',
                                      modelAsString: true
                                    }
                                  },
                                  secureVMDiskEncryptionSetId: {
                                    type: 'string',
                                    description: 'secure VM disk encryption set id'
                                  }
                                }
                              }
                            },
                            allOf: [
                              {
                                properties: {
                                  diskEncryptionSetId: {
                                    type: 'string',
                                    description: 'A relative URI containing the resource ID of the disk encryption set.'
                                  }
                                },
                                description: 'This is the disk image encryption base class.'
                              }
                            ],
                            description: 'Contains encryption settings for an OS disk image.'
                          },
                          dataDiskImages: {
                            type: 'array',
                            items: {
                              properties: {
                                lun: {
                                  type: 'integer',
                                  format: 'int32',
                                  description: 'This property specifies the logical unit number of the data disk. This value is used to identify data disks within the Virtual Machine and therefore must be unique for each data disk attached to the Virtual Machine.'
                                }
                              },
                              allOf: [
                                {
                                  properties: {
                                    diskEncryptionSetId: {
                                      type: 'string',
                                      description: 'A relative URI containing the resource ID of the disk encryption set.'
                                    }
                                  },
                                  description: 'This is the disk image encryption base class.'
                                }
                              ],
                              required: [ 'lun' ],
                              description: 'Contains encryption settings for a data disk image.'
                            },
                            'x-ms-identifiers': [ 'lun' ],
                            description: 'A list of encryption specifications for data disk images.'
                          }
                        },
                        description: 'Optional. Allows users to provide customer managed keys for encrypting the OS and data disks in the gallery artifact.'
                      }
                    }
                  },
                  'x-ms-identifiers': [ 'name', 'extendedLocation/name' ],
                  description: 'The target extended locations where the Image Version is going to be replicated to. This property is updatable.'
                }
              },
              description: 'Describes the basic gallery artifact publishing profile.'
            }
          ],
          description: 'The publishing profile of a gallery image Version.'
        },
        provisioningState: {
          readOnly: true,
          type: 'string',
          title: 'The current state of the gallery or gallery artifact.',
          description: 'The provisioning state, which only appears in the response.',
          enum: [
            'Creating',
            'Updating',
            'Failed',
            'Succeeded',
            'Deleting',
            'Migrating'
          ],
          'x-ms-enum': { name: 'GalleryProvisioningState', modelAsString: true }
        },
        storageProfile: {
          properties: {
            source: {
              properties: {
                id: {
                  type: 'string',
                  description: 'The id of the gallery artifact version source. Can specify a disk uri, snapshot uri, user image or storage account resource.'
                },
                uri: {
                  type: 'string',
                  description: 'The uri of the gallery artifact version source. Currently used to specify vhd/blob source.'
                }
              },
              description: 'The gallery artifact version source.'
            },
            osDiskImage: {
              allOf: [
                {
                  properties: {
                    sizeInGB: {
                      readOnly: true,
                      type: 'integer',
                      format: 'int32',
                      description: 'This property indicates the size of the VHD to be created.'
                    },
                    hostCaching: {
                      type: 'string',
                      description: "The host caching of the disk. Valid values are 'None', 'ReadOnly', and 'ReadWrite'",
                      enum: [ 'None', 'ReadOnly', 'ReadWrite' ],
                      'x-ms-enum': { name: 'HostCaching', modelAsString: false }
                    },
                    source: {
                      properties: {
                        id: {
                          type: 'string',
                          description: 'The id of the gallery artifact version source. Can specify a disk uri, snapshot uri, user image or storage account resource.'
                        },
                        uri: {
                          type: 'string',
                          description: 'The uri of the gallery artifact version source. Currently used to specify vhd/blob source.'
                        }
                      },
                      description: 'The gallery artifact version source.'
                    }
                  },
                  description: 'This is the disk image base class.'
                }
              ],
              description: 'This is the OS disk image.'
            },
            dataDiskImages: {
              type: 'array',
              items: {
                properties: {
                  lun: {
                    type: 'integer',
                    format: 'int32',
                    description: 'This property specifies the logical unit number of the data disk. This value is used to identify data disks within the Virtual Machine and therefore must be unique for each data disk attached to the Virtual Machine.'
                  }
                },
                allOf: [
                  {
                    properties: {
                      sizeInGB: {
                        readOnly: true,
                        type: 'integer',
                        format: 'int32',
                        description: 'This property indicates the size of the VHD to be created.'
                      },
                      hostCaching: {
                        type: 'string',
                        description: "The host caching of the disk. Valid values are 'None', 'ReadOnly', and 'ReadWrite'",
                        enum: [ 'None', 'ReadOnly', 'ReadWrite' ],
                        'x-ms-enum': { name: 'HostCaching', modelAsString: false }
                      },
                      source: {
                        properties: {
                          id: {
                            type: 'string',
                            description: 'The id of the gallery artifact version source. Can specify a disk uri, snapshot uri, user image or storage account resource.'
                          },
                          uri: {
                            type: 'string',
                            description: 'The uri of the gallery artifact version source. Currently used to specify vhd/blob source.'
                          }
                        },
                        description: 'The gallery artifact version source.'
                      }
                    },
                    description: 'This is the disk image base class.'
                  }
                ],
                required: [ 'lun' ],
                description: 'This is the data disk image.'
              },
              'x-ms-identifiers': [ 'lun' ],
              description: 'A list of data disk images.'
            }
          },
          description: 'This is the storage profile of a Gallery Image Version.'
        },
        replicationStatus: {
          readOnly: true,
          properties: {
            aggregatedState: {
              readOnly: true,
              type: 'string',
              description: 'This is the aggregated replication status based on all the regional replication status flags.',
              enum: [ 'Unknown', 'InProgress', 'Completed', 'Failed' ],
              'x-ms-enum': {
                name: 'AggregatedReplicationState',
                modelAsString: true
              }
            },
            summary: {
              readOnly: true,
              type: 'array',
              items: {
                properties: {
                  region: {
                    readOnly: true,
                    type: 'string',
                    description: 'The region to which the gallery image version is being replicated to.'
                  },
                  state: {
                    readOnly: true,
                    type: 'string',
                    description: 'This is the regional replication state.',
                    enum: [ 'Unknown', 'Replicating', 'Completed', 'Failed' ],
                    'x-ms-enum': { name: 'ReplicationState', modelAsString: true }
                  },
                  details: {
                    readOnly: true,
                    type: 'string',
                    description: 'The details of the replication status.'
                  },
                  progress: {
                    readOnly: true,
                    type: 'integer',
                    format: 'int32',
                    description: 'It indicates progress of the replication job.'
                  }
                },
                description: 'This is the regional replication status.'
              },
              'x-ms-identifiers': [ 'region' ],
              description: 'This is a summary of replication status for each region.'
            }
          },
          description: 'This is the replication status of the gallery image version.'
        }
      },
      required: [ 'storageProfile' ],
      description: 'Describes the properties of a gallery image version.'
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
  description: 'Specifies information about the gallery image version that you want to create or update.'
}
```
## Misc
The resource version is `2022-01-03`.

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/compute/resource-manager/Microsoft.Compute/GalleryRP/stable/2022-01-03/gallery.json).
