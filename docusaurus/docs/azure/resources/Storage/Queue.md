---
id: Queue
title: Queue
---
Provides a **Queue** from the **Storage** group
## Examples
### QueueOperationPut
```js
provider.Storage.makeQueue({
  name: "myQueue",
  dependencies: ({ resources }) => ({
    resourceGroup: resources.Resources.ResourceGroup["myResourceGroup"],
    account: resources.Storage.StorageAccount["myStorageAccount"],
  }),
});

```

### QueueOperationPutWithMetadata
```js
provider.Storage.makeQueue({
  name: "myQueue",
  properties: () => ({
    properties: { metadata: { sample1: "meta1", sample2: "meta2" } },
  }),
  dependencies: ({ resources }) => ({
    resourceGroup: resources.Resources.ResourceGroup["myResourceGroup"],
    account: resources.Storage.StorageAccount["myStorageAccount"],
  }),
});

```
## Dependencies
- [ResourceGroup](../Resources/ResourceGroup.md)
- [StorageAccount](../Storage/StorageAccount.md)
## Misc
The resource version is `2021-06-01`.

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/storage/resource-manager/Microsoft.Storage/stable/2021-06-01/queue.json).
