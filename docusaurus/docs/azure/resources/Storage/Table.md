---
id: Table
title: Table
---
Provides a **Table** from the **Storage** group
## Examples
### TableOperationPut
```js
exports.createResources = () => [
  {
    type: "Table",
    group: "Storage",
    name: "myTable",
    dependencies: ({}) => ({
      resourceGroup: "myResourceGroup",
      account: "myStorageAccount",
    }),
  },
];

```
## Dependencies
- [ResourceGroup](../Resources/ResourceGroup.md)
- [StorageAccount](../Storage/StorageAccount.md)
## Swagger Schema
```js
''
```
## Misc
The resource version is `2021-08-01`.

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/storage/resource-manager/Microsoft.Storage/stable/2021-08-01/table.json).
