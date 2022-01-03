---
id: DiskAccess
title: DiskAccess
---
Provides a **DiskAccess** from the **Compute** group
## Examples
### Create a disk access resource.
```js
provider.Compute.makeDiskAccess({
  name: "myDiskAccess",
  properties: () => ({ location: "West US" }),
  dependencies: ({ resources }) => ({
    resourceGroup: resources.Resources.ResourceGroup["myResourceGroup"],
  }),
});

```
## Dependencies
- [ResourceGroup](../Resources/ResourceGroup.md)
## Misc
The resource version is `2021-04-01`.

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/compute/resource-manager/Microsoft.Compute/stable/2021-04-01/disk.json).
