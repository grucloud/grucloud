---
id: Workspace
title: Workspace
---
Provides a **Workspace** from the **OperationalInsights** group
## Examples
### WorkspacesCreate
```js
provider.OperationalInsights.makeWorkspace({
  name: "myWorkspace",
  properties: () => ({
    properties: { sku: { name: "PerGB2018" }, retentionInDays: 30 },
    location: "australiasoutheast",
    tags: { tag1: "val1" },
  }),
  dependencies: ({ resources }) => ({
    resourceGroup: resources.Resources.ResourceGroup["myResourceGroup"],
    cluster: resources.OperationalInsights.Cluster["myCluster"],
  }),
});

```
## Dependencies
- [ResourceGroup](../Resources/ResourceGroup.md)
- [Cluster](../OperationalInsights/Cluster.md)
## Misc
The resource version is `2021-06-01`.

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/operationalinsights/resource-manager/Microsoft.OperationalInsights/stable/2021-06-01/Workspaces.json).
