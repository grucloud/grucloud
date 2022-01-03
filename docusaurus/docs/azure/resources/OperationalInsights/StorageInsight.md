---
id: StorageInsight
title: StorageInsight
---
Provides a **StorageInsight** from the **OperationalInsights** group
## Examples
### StorageInsightsCreate
```js
provider.OperationalInsights.makeStorageInsight({
  name: "myStorageInsight",
  properties: () => ({
    properties: {
      containers: ["wad-iis-logfiles"],
      tables: ["WADWindowsEventLogsTable", "LinuxSyslogVer2v0"],
      storageAccount: {
        id: "/subscriptions/00000000-0000-0000-0000-000000000005/resourcegroups/OIAutoRest6987/providers/microsoft.storage/storageaccounts/AzTestFakeSA9945",
        key: "1234",
      },
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
The resource version is `2015-03-20`.

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/operationalinsights/resource-manager/Microsoft.OperationalInsights/stable/2015-03-20/OperationalInsights.json).
