---
id: SavedSearch
title: SavedSearch
---
Provides a **SavedSearch** from the **OperationalInsights** group
## Examples
### SavedSearchCreateOrUpdate
```js
provider.OperationalInsights.makeSavedSearch({
  name: "mySavedSearch",
  properties: () => ({
    properties: {
      category: "Saved Search Test Category",
      displayName: "Create or Update Saved Search Test",
      version: 2,
      functionAlias: "heartbeat_func",
      functionParameters: "a:int=1",
      query: "Heartbeat | summarize Count() by Computer | take a",
      tags: [{ name: "Group", value: "Computer" }],
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

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/operationalinsights/resource-manager/Microsoft.OperationalInsights/stable/2020-08-01/SavedSearches.json).
