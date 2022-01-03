---
id: Registry
title: Registry
---
Provides a **Registry** from the **ContainerRegistry** group
## Examples
### RegistryCreate
```js
provider.ContainerRegistry.makeRegistry({
  name: "myRegistry",
  properties: () => ({
    location: "westus",
    tags: { key: "value" },
    sku: { name: "Standard" },
    properties: { adminUserEnabled: true },
  }),
  dependencies: ({ resources }) => ({
    resourceGroup: resources.Resources.ResourceGroup["myResourceGroup"],
  }),
});

```

### RegistryCreateZoneRedundant
```js
provider.ContainerRegistry.makeRegistry({
  name: "myRegistry",
  properties: () => ({
    location: "westus",
    tags: { key: "value" },
    sku: { name: "Standard" },
    properties: { zoneRedundancy: "Enabled" },
  }),
  dependencies: ({ resources }) => ({
    resourceGroup: resources.Resources.ResourceGroup["myResourceGroup"],
  }),
});

```
## Dependencies
- [ResourceGroup](../Resources/ResourceGroup.md)
## Misc
The resource version is `2021-09-01`.

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/containerregistry/resource-manager/Microsoft.ContainerRegistry/stable/2021-09-01/containerregistry.json).
