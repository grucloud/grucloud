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
## Swagger Schema
```js
{
  properties: {
    properties: {
      'x-ms-client-flatten': true,
      'x-ms-client-name': 'QueueProperties',
      description: 'Queue resource properties.',
      properties: {
        metadata: {
          type: 'object',
          additionalProperties: { type: 'string' },
          description: 'A name-value pair that represents queue metadata.'
        },
        approximateMessageCount: {
          type: 'integer',
          readOnly: true,
          description: 'Integer indicating an approximate number of messages in the queue. This number is not lower than the actual number of messages in the queue, but could be higher.'
        }
      }
    }
  },
  allOf: [
    {
      title: 'Resource',
      description: 'Common fields that are returned in the response for all Azure Resource Manager resources',
      type: 'object',
      properties: {
        id: {
          readOnly: true,
          type: 'string',
          description: 'Fully qualified resource ID for the resource. Ex - /subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/{resourceProviderNamespace}/{resourceType}/{resourceName}'
        },
        name: {
          readOnly: true,
          type: 'string',
          description: 'The name of the resource'
        },
        type: {
          readOnly: true,
          type: 'string',
          description: 'The type of the resource. E.g. "Microsoft.Compute/virtualMachines" or "Microsoft.Storage/storageAccounts"'
        }
      },
      'x-ms-azure-resource': true
    }
  ]
}
```
## Misc
The resource version is `2021-06-01`.

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/storage/resource-manager/Microsoft.Storage/stable/2021-06-01/queue.json).
