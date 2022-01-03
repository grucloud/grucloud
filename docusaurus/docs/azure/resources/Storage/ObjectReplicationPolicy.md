---
id: ObjectReplicationPolicy
title: ObjectReplicationPolicy
---
Provides a **ObjectReplicationPolicy** from the **Storage** group
## Examples
### StorageAccountCreateObjectReplicationPolicyOnDestination
```js
provider.Storage.makeObjectReplicationPolicy({
  name: "myObjectReplicationPolicy",
  properties: () => ({
    properties: {
      sourceAccount: "src1122",
      destinationAccount: "dst112",
      rules: [
        {
          sourceContainer: "scont139",
          destinationContainer: "dcont139",
          filters: { prefixMatch: ["blobA", "blobB"] },
        },
      ],
    },
  }),
  dependencies: ({ resources }) => ({
    resourceGroup: resources.Resources.ResourceGroup["myResourceGroup"],
    account: resources.Storage.StorageAccount["myStorageAccount"],
  }),
});

```

### StorageAccountCreateObjectReplicationPolicyOnSource
```js
provider.Storage.makeObjectReplicationPolicy({
  name: "myObjectReplicationPolicy",
  properties: () => ({
    properties: {
      sourceAccount: "src1122",
      destinationAccount: "dst112",
      rules: [
        {
          ruleId: "d5d18a48-8801-4554-aeaa-74faf65f5ef9",
          sourceContainer: "scont139",
          destinationContainer: "dcont139",
          filters: {
            prefixMatch: ["blobA", "blobB"],
            minCreationTime: "2020-02-19T16:05:00Z",
          },
        },
      ],
    },
  }),
  dependencies: ({ resources }) => ({
    resourceGroup: resources.Resources.ResourceGroup["myResourceGroup"],
    account: resources.Storage.StorageAccount["myStorageAccount"],
  }),
});

```

### StorageAccountUpdateObjectReplicationPolicyOnDestination
```js
provider.Storage.makeObjectReplicationPolicy({
  name: "myObjectReplicationPolicy",
  properties: () => ({
    properties: {
      sourceAccount: "src1122",
      destinationAccount: "dst112",
      rules: [
        {
          ruleId: "d5d18a48-8801-4554-aeaa-74faf65f5ef9",
          sourceContainer: "scont139",
          destinationContainer: "dcont139",
          filters: { prefixMatch: ["blobA", "blobB"] },
        },
        { sourceContainer: "scont179", destinationContainer: "dcont179" },
      ],
    },
  }),
  dependencies: ({ resources }) => ({
    resourceGroup: resources.Resources.ResourceGroup["myResourceGroup"],
    account: resources.Storage.StorageAccount["myStorageAccount"],
  }),
});

```

### StorageAccountUpdateObjectReplicationPolicyOnSource
```js
provider.Storage.makeObjectReplicationPolicy({
  name: "myObjectReplicationPolicy",
  properties: () => ({
    properties: {
      sourceAccount: "src1122",
      destinationAccount: "dst112",
      rules: [
        {
          ruleId: "d5d18a48-8801-4554-aeaa-74faf65f5ef9",
          sourceContainer: "scont139",
          destinationContainer: "dcont139",
          filters: { prefixMatch: ["blobA", "blobB"] },
        },
        {
          ruleId: "cfbb4bc2-8b60-429f-b05a-d1e0942b33b2",
          sourceContainer: "scont179",
          destinationContainer: "dcont179",
        },
      ],
    },
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

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/storage/resource-manager/Microsoft.Storage/stable/2021-06-01/storage.json).
