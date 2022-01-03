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
## Misc
The resource version is `2021-07-01`.

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/compute/resource-manager/Microsoft.Compute/stable/2021-07-01/gallery.json).
