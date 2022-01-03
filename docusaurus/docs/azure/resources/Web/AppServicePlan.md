---
id: AppServicePlan
title: AppServicePlan
---
Provides a **AppServicePlan** from the **Web** group
## Examples
### Create Or Update App Service plan
```js
provider.Web.makeAppServicePlan({
  name: "myAppServicePlan",
  properties: () => ({
    kind: "app",
    location: "East US",
    properties: {},
    sku: { name: "P1", tier: "Premium", size: "P1", family: "P", capacity: 1 },
  }),
  dependencies: ({ resources }) => ({
    resourceGroup: resources.Resources.ResourceGroup["myResourceGroup"],
  }),
});

```
## Dependencies
- [ResourceGroup](../Resources/ResourceGroup.md)
## Misc
The resource version is `2021-02-01`.

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/web/resource-manager/Microsoft.Web/stable/2021-02-01/AppServicePlans.json).
