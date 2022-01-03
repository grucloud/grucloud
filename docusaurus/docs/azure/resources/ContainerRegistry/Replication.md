---
id: Replication
title: Replication
---
Provides a **Replication** from the **ContainerRegistry** group
## Examples
### ReplicationCreate
```js
provider.ContainerRegistry.makeReplication({
  name: "myReplication",
  properties: () => ({ location: "eastus", tags: { key: "value" } }),
  dependencies: ({ resources }) => ({
    resourceGroup: resources.Resources.ResourceGroup["myResourceGroup"],
    registry: resources.ContainerRegistry.Registry["myRegistry"],
  }),
});

```

### ReplicationCreateZoneRedundant
```js
provider.ContainerRegistry.makeReplication({
  name: "myReplication",
  properties: () => ({
    location: "eastus",
    tags: { key: "value" },
    properties: { regionEndpointEnabled: true, zoneRedundancy: "Enabled" },
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
The resource version is `2021-09-01`.

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/containerregistry/resource-manager/Microsoft.ContainerRegistry/stable/2021-09-01/containerregistry.json).
