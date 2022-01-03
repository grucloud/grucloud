---
id: ExportPipeline
title: ExportPipeline
---
Provides a **ExportPipeline** from the **ContainerRegistry** group
## Examples
### ExportPipelineCreate
```js
provider.ContainerRegistry.makeExportPipeline({
  name: "myExportPipeline",
  properties: () => ({
    location: "westus",
    identity: { type: "SystemAssigned" },
    properties: {
      target: {
        type: "AzureStorageBlobContainer",
        uri: "https://accountname.blob.core.windows.net/containername",
        keyVaultUri: "https://myvault.vault.azure.net/secrets/acrexportsas",
      },
      options: ["OverwriteBlobs"],
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
