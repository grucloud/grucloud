---
id: Query
title: Query
---
Provides a **Query** from the **OperationalInsights** group
## Examples
### QueryPut
```js
provider.OperationalInsights.makeQuery({
  name: "myQuery",
  properties: () => ({
    properties: {
      displayName: "Exceptions - New in the last 24 hours",
      description: "my description",
      body: "let newExceptionsTimeRange = 1d;\nlet timeRangeToCheckBefore = 7d;\nexceptions\n| where timestamp < ago(timeRangeToCheckBefore)\n| summarize count() by problemId\n| join kind= rightanti (\nexceptions\n| where timestamp >= ago(newExceptionsTimeRange)\n| extend stack = tostring(details[0].rawStack)\n| summarize count(), dcount(user_AuthenticatedId), min(timestamp), max(timestamp), any(stack) by problemId  \n) on problemId \n| order by  count_ desc\n",
      related: { categories: ["analytics"] },
      tags: { "my-label": ["label1"], "my-other-label": ["label2"] },
    },
  }),
  dependencies: ({ resources }) => ({
    resourceGroup: resources.Resources.ResourceGroup["myResourceGroup"],
    queryPack: resources.OperationalInsights.QueryPack["myQueryPack"],
  }),
});

```
## Dependencies
- [ResourceGroup](../Resources/ResourceGroup.md)
- [QueryPack](../OperationalInsights/QueryPack.md)
## Misc
The resource version is `2019-09-01-preview`.

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/operationalinsights/resource-manager/Microsoft.OperationalInsights/preview/2019-09-01-preview/QueryPackQueries_API.json).
