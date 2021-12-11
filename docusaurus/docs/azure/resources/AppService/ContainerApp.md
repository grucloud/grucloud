---
id: ContainerApp
title: Container App
---

Provides a Container App:

```js
provider.AppService.makeContainerApp({
  name: "plantuml",
  properties: ({ config }) => ({
    properties: {
      configuration: {
        ingress: {
          external: true,
          targetPort: 8080,
        },
      },
      template: {
        containers: [
          {
            image: "docker.io/plantuml/plantuml-server:jetty-v1.2021.15",
            name: "plantuml",
            resources: {
              cpu: 0.5,
              memory: "1Gi",
            },
          },
        ],
        scale: {
          maxReplicas: 10,
        },
      },
    },
  }),
  dependencies: ({ resources }) => ({
    resourceGroup: resources.Resources.ResourceGroup["rg"],
    kubeEnvironment: resources.AppService.KubeEnvironment["dev"],
  }),
});
```

### Examples

- [basic example](https://github.com/grucloud/grucloud/blob/main/examples/azure/container-apps/plantuml/resources.js)

### Properties

- [all properties](https://docs.microsoft.com/en-us/rest/api/appservice/kube-environments/create-or-update)

### Dependencies

- [ResourceGroup](../Resources/ResourceGroup.md)
- [KubeEnvironment](./KubeEnvironment.md)
