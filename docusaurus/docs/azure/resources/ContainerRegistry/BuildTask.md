---
id: BuildTask
title: BuildTask
---
Provides a **BuildTask** from the **ContainerRegistry** group
## Examples
### BuildTasks_Create
```js
provider.ContainerRegistry.makeBuildTask({
  name: "myBuildTask",
  properties: () => ({
    properties: {
      sourceRepository: {
        sourceControlType: "Github",
        repositoryUrl: "https://github.com/Azure/azure-rest-api-specs",
        sourceControlAuthProperties: {
          tokenType: "OAuth",
          token: "xxxxxx",
          scope: "repo",
        },
        isCommitTriggerEnabled: true,
      },
      platform: { osType: "Linux", cpu: 2 },
      alias: "myalias",
      status: "Enabled",
    },
    location: "eastus",
    tags: { testkey: "value" },
  }),
  dependencies: ({ resources }) => ({
    resourceGroup: resources.Resources.ResourceGroup["myResourceGroup"],
    registry: resources.ContainerRegistry.Registry["myRegistry"],
  }),
});

```
## Dependencies
- [ResourceGroup](../Resources/ResourceGroup.md)
- [Registry](../ContainerRegistry/Registry.md)
## Misc
The resource version is `2018-02-01-preview`.

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/containerregistry/resource-manager/Microsoft.ContainerRegistry/preview/2018-02-01-preview/containerregistry_build.json).
