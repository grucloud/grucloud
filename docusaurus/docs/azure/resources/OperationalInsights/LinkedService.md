---
id: LinkedService
title: LinkedService
---
Provides a **LinkedService** from the **OperationalInsights** group
## Examples
### LinkedServicesCreate
```js
provider.OperationalInsights.makeLinkedService({
  name: "myLinkedService",
  properties: () => ({
    properties: {
      writeAccessResourceId:
        "/subscriptions/00000000-0000-0000-0000-00000000000/resourceGroups/mms-eus/providers/Microsoft.OperationalInsights/clusters/testcluster",
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

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/operationalinsights/resource-manager/Microsoft.OperationalInsights/stable/2020-08-01/LinkedServices.json).
