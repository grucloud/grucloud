---
id: ScopeMap
title: ScopeMap
---
Provides a **ScopeMap** from the **ContainerRegistry** group
## Examples
### ScopeMapCreate
```js
provider.ContainerRegistry.makeScopeMap({
  name: "myScopeMap",
  properties: () => ({
    properties: {
      description: "Developer Scopes",
      actions: [
        "repositories/myrepository/contentWrite",
        "repositories/myrepository/delete",
      ],
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
