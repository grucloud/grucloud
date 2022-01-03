---
id: GalleryApplication
title: GalleryApplication
---
Provides a **GalleryApplication** from the **Compute** group
## Examples
### Create or update a simple gallery Application.
```js
provider.Compute.makeGalleryApplication({
  name: "myGalleryApplication",
  properties: () => ({
    location: "West US",
    properties: {
      description: "This is the gallery application description.",
      eula: "This is the gallery application EULA.",
      privacyStatementUri: "myPrivacyStatementUri}",
      releaseNoteUri: "myReleaseNoteUri",
      supportedOSType: "Windows",
    },
  }),
  dependencies: ({ resources }) => ({
    resourceGroup: resources.Resources.ResourceGroup["myResourceGroup"],
    gallery: resources.Compute.Gallery["myGallery"],
  }),
});

```
## Dependencies
- [ResourceGroup](../Resources/ResourceGroup.md)
- [Gallery](../Compute/Gallery.md)
## Misc
The resource version is `2021-07-01`.

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/compute/resource-manager/Microsoft.Compute/stable/2021-07-01/gallery.json).
