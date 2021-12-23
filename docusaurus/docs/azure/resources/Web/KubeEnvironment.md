---
id: KubeEnvironment
title: Kube Environment
---

Provides a Kube Environment:

```js
provider.Web.makeKubeEnvironment({
  name: "dev",
  dependencies: ({ resources }) => ({
    resourceGroup: resources.Resources.ResourceGroup["rg"],
    workspace: resources.OperationalInsights.Workspace["logs"],
  }),
});
```

### Examples

- [basic example](https://github.com/grucloud/grucloud/blob/main/examples/azure/Web/containerapps/plantuml/resources.js)

### Properties

- [all properties](https://docs.microsoft.com/en-us/rest/api/appservice/kube-environments/create-or-update)

### Dependencies

- [ResourceGroup](../Resources/ResourceGroup.md)
- [Workspace](../OperationalInsights/Workspace.md)
