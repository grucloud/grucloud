---
id: Snapshot
title: Snapshot
---
Provides a **Snapshot** from the **ContainerService** group
## Examples
### Create/Update Snapshot
```js
provider.ContainerService.makeSnapshot({
  name: "mySnapshot",
  properties: () => ({
    location: "westus",
    tags: { key1: "val1", key2: "val2" },
    properties: {
      creationData: {
        sourceResourceId:
          "/subscriptions/subid1/resourcegroups/rg1/providers/Microsoft.ContainerService/managedClusters/cluster1/agentPools/pool0",
      },
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
The resource version is `2021-10-01`.

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/containerservice/resource-manager/Microsoft.ContainerService/stable/2021-10-01/managedClusters.json).
