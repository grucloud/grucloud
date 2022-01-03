---
id: BuildStep
title: BuildStep
---
Provides a **BuildStep** from the **ContainerRegistry** group
## Examples
### BuildSteps_Create
```js
provider.ContainerRegistry.makeBuildStep({
  name: "myBuildStep",
  properties: () => ({
    properties: {
      type: "Docker",
      imageNames: ["azurerest:testtag"],
      dockerFilePath: "subfolder/Dockerfile",
      contextPath: "dockerfiles",
      isPushEnabled: true,
      noCache: true,
      buildArguments: [
        {
          type: "DockerBuildArgument",
          name: "mytestargument",
          value: "mytestvalue",
          isSecret: false,
        },
        {
          type: "DockerBuildArgument",
          name: "mysecrettestargument",
          value: "mysecrettestvalue",
          isSecret: true,
        },
      ],
    },
  }),
  dependencies: ({ resources }) => ({
    resourceGroup: resources.Resources.ResourceGroup["myResourceGroup"],
    registry: resources.ContainerRegistry.Registry["myRegistry"],
    buildTask: resources.ContainerRegistry.BuildTask["myBuildTask"],
  }),
});

```
## Dependencies
- [ResourceGroup](../Resources/ResourceGroup.md)
- [Registry](../ContainerRegistry/Registry.md)
- [BuildTask](../ContainerRegistry/BuildTask.md)
## Misc
The resource version is `2018-02-01-preview`.

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/containerregistry/resource-manager/Microsoft.ContainerRegistry/preview/2018-02-01-preview/containerregistry_build.json).
