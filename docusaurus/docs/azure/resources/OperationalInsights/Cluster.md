---
id: Cluster
title: Cluster
---
Provides a **Cluster** from the **OperationalInsights** group
## Examples
### ClustersCreate
```js
provider.OperationalInsights.makeCluster({
  name: "myCluster",
  properties: () => ({
    sku: { name: "CapacityReservation", capacity: 1000 },
    location: "australiasoutheast",
    tags: { tag1: "val1" },
  }),
  dependencies: ({ resources }) => ({
    resourceGroup: resources.Resources.ResourceGroup["myResourceGroup"],
    workspace: resources.OperationalInsights.Workspace["myWorkspace"],
  }),
});

```
## Dependencies
- [ResourceGroup](../Resources/ResourceGroup.md)
- [Workspace](../OperationalInsights/Workspace.md)
## Misc
The resource version is `2021-06-01`.

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/operationalinsights/resource-manager/Microsoft.OperationalInsights/stable/2021-06-01/Clusters.json).
