---
id: TaskRun
title: TaskRun
---
Provides a **TaskRun** from the **ContainerRegistry** group
## Examples
### TaskRuns_Create
```js
provider.ContainerRegistry.makeTaskRun({
  name: "myTaskRun",
  properties: () => ({
    properties: {
      forceUpdateTag: "test",
      runRequest: {
        type: "EncodedTaskRunRequest",
        encodedTaskContent:
          "c3RlcHM6IAogIC0gY21kOiB7eyAuVmFsdWVzLmNvbW1hbmQgfX0K",
        encodedValuesContent:
          "Y29tbWFuZDogYmFzaCBlY2hvIHt7LlJ1bi5SZWdpc3RyeX19Cg==",
        values: [],
        platform: { os: "Linux", architecture: "amd64" },
        credentials: {},
      },
    },
  }),
  dependencies: ({ resources }) => ({
    resourceGroup: resources.Resources.ResourceGroup["myResourceGroup"],
    pipelineRun: resources.ContainerRegistry.PipelineRun["myPipelineRun"],
    registry: resources.ContainerRegistry.Registry["myRegistry"],
  }),
});

```
## Dependencies
- [ResourceGroup](../Resources/ResourceGroup.md)
- [PipelineRun](../ContainerRegistry/PipelineRun.md)
- [Registry](../ContainerRegistry/Registry.md)
## Misc
The resource version is `2019-06-01-preview`.

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/containerregistry/resource-manager/Microsoft.ContainerRegistry/preview/2019-06-01-preview/containerregistry_build.json).
