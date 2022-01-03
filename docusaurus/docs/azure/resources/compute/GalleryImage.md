---
id: GalleryImage
title: GalleryImage
---
Provides a **GalleryImage** from the **Compute** group
## Examples
### Create or update a simple gallery image.
```js
provider.Compute.makeGalleryImage({
  name: "myGalleryImage",
  properties: () => ({
    location: "West US",
    properties: {
      osType: "Windows",
      osState: "Generalized",
      hyperVGeneration: "V1",
      identifier: {
        publisher: "myPublisherName",
        offer: "myOfferName",
        sku: "mySkuName",
      },
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
