---
id: RestorePoint
title: RestorePoint
---
Provides a **RestorePoint** from the **Compute** group
## Examples
### Create a restore point
```js
provider.Compute.makeRestorePoint({
  name: "myRestorePoint",
  properties: () => ({
    properties: {
      excludeDisks: [
        {
          id: "/subscriptions/{subscription-id}/resourceGroups/myResourceGroup/providers/Microsoft.Compute/disks/disk123",
        },
      ],
    },
  }),
  dependencies: ({ resources }) => ({
    resourceGroup: resources.Resources.ResourceGroup["myResourceGroup"],
    disk: resources.Compute.Disk["myDisk"],
    virtualMachineScaleSetVm:
      resources.Compute.VirtualMachineScaleSetVM["myVirtualMachineScaleSetVM"],
    restorePointCollection:
      resources.Compute.RestorePointCollection["myRestorePointCollection"],
  }),
});

```
## Dependencies
- [ResourceGroup](../Resources/ResourceGroup.md)
- [Disk](../Compute/Disk.md)
- [VirtualMachineScaleSetVM](../Compute/VirtualMachineScaleSetVM.md)
- [RestorePointCollection](../Compute/RestorePointCollection.md)
## Misc
The resource version is `2021-07-01`.

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/compute/resource-manager/Microsoft.Compute/stable/2021-07-01/compute.json).
