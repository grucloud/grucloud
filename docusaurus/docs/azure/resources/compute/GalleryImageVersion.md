---
id: GalleryImageVersion
title: GalleryImageVersion
---
Provides a **GalleryImageVersion** from the **Compute** group
## Examples
### Create or update a simple Gallery Image Version using managed image as source.
```js
provider.Compute.makeGalleryImageVersion({
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
  dependencies: ({ resources }) => ({
    resourceGroup: resources.Resources.ResourceGroup["myResourceGroup"],
    gallery: resources.Compute.Gallery["myGallery"],
    galleryImage: resources.Compute.GalleryImage["myGalleryImage"],
  }),
});

```

### Create or update a simple Gallery Image Version using snapshots as a source.
```js
provider.Compute.makeGalleryImageVersion({
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
  dependencies: ({ resources }) => ({
    resourceGroup: resources.Resources.ResourceGroup["myResourceGroup"],
    gallery: resources.Compute.Gallery["myGallery"],
    galleryImage: resources.Compute.GalleryImage["myGalleryImage"],
  }),
});

```

### Create or update a simple Gallery Image Version using VM as source.
```js
provider.Compute.makeGalleryImageVersion({
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
          id: "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroup}/providers/Microsoft.Compute/virtualMachines/{vmName}",
        },
      },
    },
  }),
  dependencies: ({ resources }) => ({
    resourceGroup: resources.Resources.ResourceGroup["myResourceGroup"],
    gallery: resources.Compute.Gallery["myGallery"],
    galleryImage: resources.Compute.GalleryImage["myGalleryImage"],
  }),
});

```

### Create or update a simple Gallery Image Version using shared image as source.
```js
provider.Compute.makeGalleryImageVersion({
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
  dependencies: ({ resources }) => ({
    resourceGroup: resources.Resources.ResourceGroup["myResourceGroup"],
    gallery: resources.Compute.Gallery["myGallery"],
    galleryImage: resources.Compute.GalleryImage["myGalleryImage"],
  }),
});

```

### Create or update a simple Gallery Image Version using mix of disks and snapshots as a source.
```js
provider.Compute.makeGalleryImageVersion({
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
  dependencies: ({ resources }) => ({
    resourceGroup: resources.Resources.ResourceGroup["myResourceGroup"],
    gallery: resources.Compute.Gallery["myGallery"],
    galleryImage: resources.Compute.GalleryImage["myGalleryImage"],
  }),
});

```

### Create or update a simple Gallery Image Version using vhd as a source.
```js
provider.Compute.makeGalleryImageVersion({
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
  dependencies: ({ resources }) => ({
    resourceGroup: resources.Resources.ResourceGroup["myResourceGroup"],
    gallery: resources.Compute.Gallery["myGallery"],
    galleryImage: resources.Compute.GalleryImage["myGalleryImage"],
  }),
});

```

### Create or update a simple Gallery Image Version using shallow replication mode.
```js
provider.Compute.makeGalleryImageVersion({
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
  dependencies: ({ resources }) => ({
    resourceGroup: resources.Resources.ResourceGroup["myResourceGroup"],
    gallery: resources.Compute.Gallery["myGallery"],
    galleryImage: resources.Compute.GalleryImage["myGalleryImage"],
  }),
});

```
## Dependencies
- [ResourceGroup](../Resources/ResourceGroup.md)
- [Gallery](../Compute/Gallery.md)
- [GalleryImage](../Compute/GalleryImage.md)
## Misc
The resource version is `2021-07-01`.

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/compute/resource-manager/Microsoft.Compute/stable/2021-07-01/gallery.json).
