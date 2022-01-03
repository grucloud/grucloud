---
id: DataExport
title: DataExport
---
Provides a **DataExport** from the **OperationalInsights** group
## Examples
### DataExportCreate
```js
provider.OperationalInsights.makeDataExport({
  name: "myDataExport",
  properties: () => ({
    properties: {
      destination: {
        resourceId:
          "/subscriptions/192b9f85-a39a-4276-b96d-d5cd351703f9/resourceGroups/OIAutoRest1234/providers/Microsoft.EventHub/namespaces/test",
      },
      tableNames: ["Heartbeat"],
    },
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
The resource version is `2020-08-01`.

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/operationalinsights/resource-manager/Microsoft.OperationalInsights/stable/2020-08-01/DataExports.json).
