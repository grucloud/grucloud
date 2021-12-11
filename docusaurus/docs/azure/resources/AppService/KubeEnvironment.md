---
id: KubeEnvironment
title: Kube Environment
---

Provides a Kube Environment:

```js
provider.AppService.makeKubeEnvironment({
  name: "dev",
  dependencies: ({ resources }) => ({
    resourceGroup: resources.Resources.ResourceGroup["rg"],
    workspace: resources.LogAnalytics.Workspace["logs"],
  }),
});
```

### Examples

- [basic example](https://github.com/grucloud/grucloud/blob/main/examples/azure/container-apps/plantuml/resources.js)

### Properties

- [all properties](https://docs.microsoft.com/en-us/rest/api/appservice/kube-environments/create-or-update)

### Dependencies

- [ResourceGroup](../Resources/ResourceGroup.md)
- [Workspace](../LogAnalytics/Workspace.md)
