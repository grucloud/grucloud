---
id: RestorePointCollection
title: RestorePointCollection
---
Provides a **RestorePointCollection** from the **Compute** group
## Examples
### Create or update a restore point collection.
```js
provider.Compute.makeRestorePointCollection({
  name: "myRestorePointCollection",
  properties: () => ({
    location: "norwayeast",
    properties: {
      source: {
        id: "/subscriptions/{subscription-id}/resourceGroups/myResourceGroup/providers/Microsoft.Compute/virtualMachines/myVM",
      },
    },
    tags: { myTag1: "tagValue1" },
  }),
  dependencies: ({ resources }) => ({
    resourceGroup: resources.Resources.ResourceGroup["myResourceGroup"],
    restorePoint: resources.Compute.RestorePoint["myRestorePoint"],
    virtualMachineScaleSetVm:
      resources.Compute.VirtualMachineScaleSetVM["myVirtualMachineScaleSetVM"],
  }),
});

```
## Dependencies
- [ResourceGroup](../Resources/ResourceGroup.md)
- [RestorePoint](../Compute/RestorePoint.md)
- [VirtualMachineScaleSetVM](../Compute/VirtualMachineScaleSetVM.md)
## Misc
The resource version is `2021-07-01`.

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/compute/resource-manager/Microsoft.Compute/stable/2021-07-01/compute.json).
