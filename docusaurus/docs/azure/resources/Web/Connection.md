---
id: Connection
title: Connection
---
Provides a **Connection** from the **Web** group
## Examples
### Replace a connection
```js
provider.Web.makeConnection({
  name: "myConnection",
  properties: () => ({
    properties: {
      displayName: "testManagedApi",
      parameterValues: {},
      customParameterValues: {},
      api: {
        id: "/subscriptions/f34b22a3-2202-4fb1-b040-1332bd928c84/providers/Microsoft.Web/locations/centralus/managedApis/testManagedApi",
      },
    },
    id: "/subscriptions/f34b22a3-2202-4fb1-b040-1332bd928c84/resourceGroups/testResourceGroup/providers/Microsoft.Web/connections/testManagedApi-1",
  }),
  dependencies: ({ resources }) => ({
    resourceGroup: resources.Resources.ResourceGroup["myResourceGroup"],
  }),
});

```
## Dependencies
- [ResourceGroup](../Resources/ResourceGroup.md)
## Misc
The resource version is `2016-06-01`.

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/web/resource-manager/Microsoft.Web/stable/2016-06-01/logicAppsManagementClient.json).
