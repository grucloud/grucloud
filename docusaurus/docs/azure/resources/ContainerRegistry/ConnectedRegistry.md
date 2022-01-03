---
id: ConnectedRegistry
title: ConnectedRegistry
---
Provides a **ConnectedRegistry** from the **ContainerRegistry** group
## Examples
### ConnectedRegistryCreate
```js
provider.ContainerRegistry.makeConnectedRegistry({
  name: "myConnectedRegistry",
  properties: () => ({
    properties: {
      mode: "ReadWrite",
      parent: {
        syncProperties: {
          tokenId:
            "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/myResourceGroup/providers/Microsoft.ContainerRegistry/registries/myRegistry/tokens/syncToken",
          schedule: "0 9 * * *",
          messageTtl: "P2D",
          syncWindow: "PT3H",
        },
      },
      clientTokenIds: [
        "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/myResourceGroup/providers/Microsoft.ContainerRegistry/registries/myRegistry/tokens/client1Token",
      ],
      notificationsList: ["hello-world:*:*", "sample/repo/*:1.0:*"],
    },
  }),
  dependencies: ({ resources }) => ({
    resourceGroup: resources.Resources.ResourceGroup["myResourceGroup"],
    registry: resources.ContainerRegistry.Registry["myRegistry"],
  }),
});

```
## Dependencies
- [ResourceGroup](../Resources/ResourceGroup.md)
- [Registry](../ContainerRegistry/Registry.md)
## Misc
The resource version is `2021-08-01-preview`.

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/containerregistry/resource-manager/Microsoft.ContainerRegistry/preview/2021-08-01-preview/containerregistry.json).
