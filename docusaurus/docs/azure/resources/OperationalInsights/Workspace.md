---
id: Workspace
title: Workspace
---

Provides a log analytics workspace:

```js
provider.LogAnalytics.makeWorkspace({
  name: "logs",
  properties: ({ config }) => ({
    properties: {
      sku: {
        name: "pergb2018",
      },
      retentionInDays: 30,
    },
  }),
  dependencies: ({ resources }) => ({
    resourceGroup: resources.Resources.ResourceGroup["rg"],
  }),
});
```

### Examples

- [basic example](https://github.com/grucloud/grucloud/blob/main/examples/azure/container-apps/plantuml/resources.js)

### Properties

- [all properties](https://docs.microsoft.com/en-us/rest/api/loganalytics/workspaces/create-or-update)

### Used By

- [KubeEnvironment](../AppService/KubeEnvironment.md)
- [ResourceGroup](../Resources/ResourceGroup.md)
