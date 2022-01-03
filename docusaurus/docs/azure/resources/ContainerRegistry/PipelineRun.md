---
id: PipelineRun
title: PipelineRun
---
Provides a **PipelineRun** from the **ContainerRegistry** group
## Examples
### PipelineRunCreate_Export
```js
provider.ContainerRegistry.makePipelineRun({
  name: "myPipelineRun",
  properties: () => ({
    properties: {
      request: {
        pipelineResourceId:
          "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/myResourceGroup/providers/Microsoft.ContainerRegistry/registries/myRegistry/exportPipelines/myExportPipeline",
        target: { type: "AzureStorageBlob", name: "myblob.tar.gz" },
        artifacts: [
          "sourceRepository/hello-world",
          "sourceRepository2@sha256:00000000000000000000000000000000000",
        ],
      },
    },
  }),
  dependencies: ({ resources }) => ({
    resourceGroup: resources.Resources.ResourceGroup["myResourceGroup"],
    registry: resources.ContainerRegistry.Registry["myRegistry"],
  }),
});

```

### PipelineRunCreate_Import
```js
provider.ContainerRegistry.makePipelineRun({
  name: "myPipelineRun",
  properties: () => ({
    properties: {
      request: {
        pipelineResourceId:
          "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/myResourceGroup/providers/Microsoft.ContainerRegistry/registries/myRegistry/importPipelines/myImportPipeline",
        source: { type: "AzureStorageBlob", name: "myblob.tar.gz" },
        catalogDigest: "sha256@",
      },
      forceUpdateTag: "2020-03-04T17:23:21.9261521+00:00",
    },
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
The resource version is `2021-08-01-preview`.

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/containerregistry/resource-manager/Microsoft.ContainerRegistry/preview/2021-08-01-preview/containerregistry.json).
