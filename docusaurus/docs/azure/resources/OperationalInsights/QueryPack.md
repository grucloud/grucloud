---
id: QueryPack
title: QueryPack
---
Provides a **QueryPack** from the **OperationalInsights** group
## Examples
### QueryPackCreate
```js
provider.OperationalInsights.makeQueryPack({
  name: "myQueryPack",
  properties: () => ({ location: "South Central US", properties: {} }),
  dependencies: ({ resources }) => ({
    resourceGroup: resources.Resources.ResourceGroup["myResourceGroup"],
  }),
});

```

### QueryPackUpdate
```js
provider.OperationalInsights.makeQueryPack({
  name: "myQueryPack",
  properties: () => ({
    location: "South Central US",
    tags: { Tag1: "Value1" },
    properties: {},
  }),
  dependencies: ({ resources }) => ({
    resourceGroup: resources.Resources.ResourceGroup["myResourceGroup"],
  }),
});

```
## Dependencies
- [ResourceGroup](../Resources/ResourceGroup.md)
## Misc
The resource version is `2019-09-01-preview`.

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/operationalinsights/resource-manager/Microsoft.OperationalInsights/preview/2019-09-01-preview/QueryPacks_API.json).
