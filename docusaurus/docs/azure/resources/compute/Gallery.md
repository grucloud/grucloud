---
id: Gallery
title: Gallery
---
Provides a **Gallery** from the **Compute** group
## Examples
### Create or update a simple gallery.
```js
provider.Compute.makeGallery({
  name: "myGallery",
  properties: () => ({
    location: "West US",
    properties: { description: "This is the gallery description." },
  }),
  dependencies: ({ resources }) => ({
    resourceGroup: resources.Resources.ResourceGroup["myResourceGroup"],
  }),
});

```

### Create or update a simple gallery with sharing profile.
```js
provider.Compute.makeGallery({
  name: "myGallery",
  properties: () => ({
    location: "West US",
    properties: {
      description: "This is the gallery description.",
      sharingProfile: { permissions: "Groups" },
    },
  }),
  dependencies: ({ resources }) => ({
    resourceGroup: resources.Resources.ResourceGroup["myResourceGroup"],
  }),
});

```

### Create or update a simple gallery with soft deletion enabled.
```js
provider.Compute.makeGallery({
  name: "myGallery",
  properties: () => ({
    location: "West US",
    properties: {
      description: "This is the gallery description.",
      softDeletePolicy: { isSoftDeleteEnabled: true },
    },
  }),
  dependencies: ({ resources }) => ({
    resourceGroup: resources.Resources.ResourceGroup["myResourceGroup"],
  }),
});

```
## Dependencies
- [ResourceGroup](../Resources/ResourceGroup.md)
## Misc
The resource version is `2021-07-01`.

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/compute/resource-manager/Microsoft.Compute/stable/2021-07-01/gallery.json).
