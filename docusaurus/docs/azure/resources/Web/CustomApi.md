---
id: CustomApi
title: CustomApi
---
Provides a **CustomApi** from the **Web** group
## Examples
### Replace a custom API
```js
provider.Web.makeCustomApi({
  name: "myCustomApi",
  properties: () => ({
    properties: {
      capabilities: [],
      description: "",
      displayName: "testCustomApi",
      iconUri: "/testIcon.svg",
      apiDefinitions: {
        originalSwaggerUrl: "https://tempuri.org/swagger.json",
        swagger: {},
      },
      apiType: "Rest",
    },
    id: "/subscriptions/34adfa4f-cedf-4dc0-ba29-b6d1a69ab345/resourceGroups/testResourceGroup/providers/Microsoft.Web/customApis/testCustomApi",
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
