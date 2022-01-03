---
id: ImportPipeline
title: ImportPipeline
---
Provides a **ImportPipeline** from the **ContainerRegistry** group
## Examples
### ImportPipelineCreate
```js
provider.ContainerRegistry.makeImportPipeline({
  name: "myImportPipeline",
  properties: () => ({
    location: "westus",
    identity: {
      type: "UserAssigned",
      userAssignedIdentities: {
        "/subscriptions/f9d7ebed-adbd-4cb4-b973-aaf82c136138/resourcegroups/myResourceGroup/providers/Microsoft.ManagedIdentity/userAssignedIdentities/identity2":
          {},
      },
    },
    properties: {
      source: {
        type: "AzureStorageBlobContainer",
        uri: "https://accountname.blob.core.windows.net/containername",
        keyVaultUri: "https://myvault.vault.azure.net/secrets/acrimportsas",
      },
      options: [
        "OverwriteTags",
        "DeleteSourceBlobOnSuccess",
        "ContinueOnErrors",
      ],
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
