---
id: AgentPool
title: AgentPool
---
Provides a **AgentPool** from the **ContainerRegistry** group
## Examples
### AgentPools_Create
```js
provider.ContainerRegistry.makeAgentPool({
  name: "myAgentPool",
  properties: () => ({
    location: "WESTUS",
    tags: { key: "value" },
    properties: { count: 1, tier: "S1", os: "Linux" },
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
The resource version is `2019-06-01-preview`.

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/containerregistry/resource-manager/Microsoft.ContainerRegistry/preview/2019-06-01-preview/containerregistry_build.json).
