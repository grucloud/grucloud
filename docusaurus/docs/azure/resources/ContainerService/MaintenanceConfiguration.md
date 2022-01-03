---
id: MaintenanceConfiguration
title: MaintenanceConfiguration
---
Provides a **MaintenanceConfiguration** from the **ContainerService** group
## Examples
### Create/Update Maintenance Configuration
```js
provider.ContainerService.makeMaintenanceConfiguration({
  name: "myMaintenanceConfiguration",
  properties: () => ({
    properties: {
      timeInWeek: [{ day: "Monday", hourSlots: [1, 2] }],
      notAllowedTime: [
        { start: "2020-11-26T03:00:00Z", end: "2020-11-30T12:00:00Z" },
      ],
    },
  }),
  dependencies: ({ resources }) => ({
    resourceGroup: resources.Resources.ResourceGroup["myResourceGroup"],
    resource: resources.ContainerService.ManagedCluster["myManagedCluster"],
  }),
});

```
## Dependencies
- [ResourceGroup](../Resources/ResourceGroup.md)
- [ManagedCluster](../ContainerService/ManagedCluster.md)
## Misc
The resource version is `2021-10-01`.

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/containerservice/resource-manager/Microsoft.ContainerService/stable/2021-10-01/managedClusters.json).
