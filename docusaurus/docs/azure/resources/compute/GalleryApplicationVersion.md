---
id: GalleryApplicationVersion
title: GalleryApplicationVersion
---
Provides a **GalleryApplicationVersion** from the **Compute** group
## Examples
### Create or update a simple gallery Application Version.
```js
provider.Compute.makeGalleryApplicationVersion({
  name: "myGalleryApplicationVersion",
  properties: () => ({
    location: "West US",
    properties: {
      publishingProfile: {
        source: {
          mediaLink:
            "https://mystorageaccount.blob.core.windows.net/mycontainer/package.zip?{sasKey}",
        },
        manageActions: {
          install:
            'powershell -command "Expand-Archive -Path package.zip -DestinationPath C:\\package"',
          remove: "del C:\\package ",
        },
        targetRegions: [
          {
            name: "West US",
            regionalReplicaCount: 1,
            storageAccountType: "Standard_LRS",
          },
        ],
        replicaCount: 1,
        endOfLifeDate: "2019-07-01T07:00:00Z",
        storageAccountType: "Standard_LRS",
      },
    },
  }),
  dependencies: ({ resources }) => ({
    resourceGroup: resources.Resources.ResourceGroup["myResourceGroup"],
    gallery: resources.Compute.Gallery["myGallery"],
    galleryApplication:
      resources.Compute.GalleryApplication["myGalleryApplication"],
  }),
});

```
## Dependencies
- [ResourceGroup](../Resources/ResourceGroup.md)
- [Gallery](../Compute/Gallery.md)
- [GalleryApplication](../Compute/GalleryApplication.md)
## Swagger Schema
```js
{
  properties: {
    properties: {
      'x-ms-client-flatten': true,
      properties: {
        publishingProfile: {
          properties: {
            source: {
              properties: {
                mediaLink: {
                  type: 'string',
                  description: 'Required. The mediaLink of the artifact, must be a readable storage page blob.'
                },
                defaultConfigurationLink: {
                  type: 'string',
                  description: 'Optional. The defaultConfigurationLink of the artifact, must be a readable storage page blob.'
                }
              },
              required: [ 'mediaLink' ],
              description: 'The source image from which the Image Version is going to be created.'
            },
            manageActions: {
              properties: {
                install: {
                  type: 'string',
                  description: 'Required. The path and arguments to install the gallery application. This is limited to 4096 characters.'
                },
                remove: {
                  type: 'string',
                  description: 'Required. The path and arguments to remove the gallery application. This is limited to 4096 characters.'
                },
                update: {
                  type: 'string',
                  description: 'Optional. The path and arguments to update the gallery application. If not present, then update operation will invoke remove command on the previous version and install command on the current version of the gallery application. This is limited to 4096 characters.'
                }
              },
              required: [ 'install', 'remove' ]
            },
            enableHealthCheck: {
              type: 'boolean',
              description: 'Optional. Whether or not this application reports health.'
            }
          },
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
                            allOf: [
                              {
                                properties: [Object],
                                description: 'This is the disk image encryption base class.'
                              }
                            ],
                            description: 'Contains encryption settings for an OS disk image.'
                          },
                          dataDiskImages: {
                            type: 'array',
                            items: {
                              properties: { lun: [Object] },
                              allOf: [ [Object] ],
                              required: [ 'lun' ],
                              description: 'Contains encryption settings for a data disk image.'
                            },
                            description: 'A list of encryption specifications for data disk images.'
                          }
                        },
                        description: 'Optional. Allows users to provide customer managed keys for encrypting the OS and data disks in the gallery artifact.'
                      }
                    },
                    required: [ 'name' ],
                    description: 'Describes the target region information.'
                  },
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
                }
              },
              description: 'Describes the basic gallery artifact publishing profile.'
            }
          ],
          required: [ 'source' ],
          description: 'The publishing profile of a gallery image version.'
        },
        provisioningState: {
          readOnly: true,
          type: 'string',
          title: 'The current state of the gallery Application Version.',
          description: 'The provisioning state, which only appears in the response.',
          enum: [
            'Creating',
            'Updating',
            'Failed',
            'Succeeded',
            'Deleting',
            'Migrating'
          ]
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
              description: 'This is a summary of replication status for each region.'
            }
          },
          description: 'This is the replication status of the gallery image version.'
        }
      },
      required: [ 'publishingProfile' ],
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
  description: 'Specifies information about the gallery Application Version that you want to create or update.'
}
```
## Misc
The resource version is `2021-07-01`.

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/compute/resource-manager/Microsoft.Compute/stable/2021-07-01/gallery.json).
