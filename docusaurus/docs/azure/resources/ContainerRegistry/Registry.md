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
    privateEndpointConnection:
      resources.ContainerRegistry.PrivateEndpointConnection[
        "myPrivateEndpointConnection"
      ],
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
    privateEndpointConnection:
      resources.ContainerRegistry.PrivateEndpointConnection[
        "myPrivateEndpointConnection"
      ],
  }),
});

```
## Dependencies
- [ResourceGroup](../Resources/ResourceGroup.md)
- [PrivateEndpointConnection](../ContainerRegistry/PrivateEndpointConnection.md)
## Misc
The resource version is `2021-09-01`.

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/containerregistry/resource-manager/Microsoft.ContainerRegistry/stable/2021-09-01/containerregistry.json).
