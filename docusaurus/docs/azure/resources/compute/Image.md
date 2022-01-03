---
id: Image
title: Image
---
Provides a **Image** from the **Compute** group
## Examples
### Create a virtual machine image from a blob.
```js
provider.Compute.makeImage({
  name: "myImage",
  properties: () => ({
    location: "West US",
    properties: {
      storageProfile: {
        osDisk: {
          osType: "Linux",
          blobUri:
            "https://mystorageaccount.blob.core.windows.net/osimages/osimage.vhd",
          osState: "Generalized",
        },
        zoneResilient: true,
      },
    },
  }),
  dependencies: ({ resources }) => ({
    resourceGroup: resources.Resources.ResourceGroup["myResourceGroup"],
    virtualMachine: resources.Compute.VirtualMachine["myVirtualMachine"],
  }),
});

```

### Create a virtual machine image from a snapshot.
```js
provider.Compute.makeImage({
  name: "myImage",
  properties: () => ({
    location: "West US",
    properties: {
      storageProfile: {
        osDisk: {
          osType: "Linux",
          snapshot: {
            id: "subscriptions/{subscription-id}/resourceGroups/myResourceGroup/providers/Microsoft.Compute/snapshots/mySnapshot",
          },
          osState: "Generalized",
        },
        zoneResilient: false,
      },
    },
  }),
  dependencies: ({ resources }) => ({
    resourceGroup: resources.Resources.ResourceGroup["myResourceGroup"],
    virtualMachine: resources.Compute.VirtualMachine["myVirtualMachine"],
  }),
});

```

### Create a virtual machine image from a managed disk.
```js
provider.Compute.makeImage({
  name: "myImage",
  properties: () => ({
    location: "West US",
    properties: {
      storageProfile: {
        osDisk: {
          osType: "Linux",
          managedDisk: {
            id: "subscriptions/{subscription-id}/resourceGroups/myResourceGroup/providers/Microsoft.Compute/disks/myManagedDisk",
          },
          osState: "Generalized",
        },
        zoneResilient: true,
      },
    },
  }),
  dependencies: ({ resources }) => ({
    resourceGroup: resources.Resources.ResourceGroup["myResourceGroup"],
    virtualMachine: resources.Compute.VirtualMachine["myVirtualMachine"],
  }),
});

```

### Create a virtual machine image from an existing virtual machine.
```js
provider.Compute.makeImage({
  name: "myImage",
  properties: () => ({
    location: "West US",
    properties: {
      sourceVirtualMachine: {
        id: "/subscriptions/{subscription-id}/resourceGroups/myResourceGroup/providers/Microsoft.Compute/virtualMachines/myVM",
      },
    },
  }),
  dependencies: ({ resources }) => ({
    resourceGroup: resources.Resources.ResourceGroup["myResourceGroup"],
    virtualMachine: resources.Compute.VirtualMachine["myVirtualMachine"],
  }),
});

```

### Create a virtual machine image that includes a data disk from a blob.
```js
provider.Compute.makeImage({
  name: "myImage",
  properties: () => ({
    location: "West US",
    properties: {
      storageProfile: {
        osDisk: {
          osType: "Linux",
          blobUri:
            "https://mystorageaccount.blob.core.windows.net/osimages/osimage.vhd",
          osState: "Generalized",
        },
        dataDisks: [
          {
            lun: 1,
            blobUri:
              "https://mystorageaccount.blob.core.windows.net/dataimages/dataimage.vhd",
          },
        ],
        zoneResilient: false,
      },
    },
  }),
  dependencies: ({ resources }) => ({
    resourceGroup: resources.Resources.ResourceGroup["myResourceGroup"],
    virtualMachine: resources.Compute.VirtualMachine["myVirtualMachine"],
  }),
});

```

### Create a virtual machine image that includes a data disk from a snapshot.
```js
provider.Compute.makeImage({
  name: "myImage",
  properties: () => ({
    location: "West US",
    properties: {
      storageProfile: {
        osDisk: {
          osType: "Linux",
          snapshot: {
            id: "subscriptions/{subscription-id}/resourceGroups/myResourceGroup/providers/Microsoft.Compute/snapshots/mySnapshot",
          },
          osState: "Generalized",
        },
        dataDisks: [
          {
            lun: 1,
            snapshot: {
              id: "subscriptions/{subscriptionId}/resourceGroups/myResourceGroup/providers/Microsoft.Compute/snapshots/mySnapshot2",
            },
          },
        ],
        zoneResilient: true,
      },
    },
  }),
  dependencies: ({ resources }) => ({
    resourceGroup: resources.Resources.ResourceGroup["myResourceGroup"],
    virtualMachine: resources.Compute.VirtualMachine["myVirtualMachine"],
  }),
});

```

### Create a virtual machine image that includes a data disk from a managed disk.
```js
provider.Compute.makeImage({
  name: "myImage",
  properties: () => ({
    location: "West US",
    properties: {
      storageProfile: {
        osDisk: {
          osType: "Linux",
          managedDisk: {
            id: "subscriptions/{subscription-id}/resourceGroups/myResourceGroup/providers/Microsoft.Compute/disks/myManagedDisk",
          },
          osState: "Generalized",
        },
        dataDisks: [
          {
            lun: 1,
            managedDisk: {
              id: "subscriptions/{subscriptionId}/resourceGroups/myResourceGroup/providers/Microsoft.Compute/disks/myManagedDisk2",
            },
          },
        ],
        zoneResilient: false,
      },
    },
  }),
  dependencies: ({ resources }) => ({
    resourceGroup: resources.Resources.ResourceGroup["myResourceGroup"],
    virtualMachine: resources.Compute.VirtualMachine["myVirtualMachine"],
  }),
});

```

### Create a virtual machine image from a blob with DiskEncryptionSet resource.
```js
provider.Compute.makeImage({
  name: "myImage",
  properties: () => ({
    location: "West US",
    properties: {
      storageProfile: {
        osDisk: {
          osType: "Linux",
          blobUri:
            "https://mystorageaccount.blob.core.windows.net/osimages/osimage.vhd",
          diskEncryptionSet: {
            id: "/subscriptions/{subscription-id}/resourceGroups/myResourceGroup/providers/Microsoft.Compute/diskEncryptionSets/{existing-diskEncryptionSet-name}",
          },
          osState: "Generalized",
        },
      },
    },
  }),
  dependencies: ({ resources }) => ({
    resourceGroup: resources.Resources.ResourceGroup["myResourceGroup"],
    virtualMachine: resources.Compute.VirtualMachine["myVirtualMachine"],
  }),
});

```

### Create a virtual machine image from a snapshot with DiskEncryptionSet resource.
```js
provider.Compute.makeImage({
  name: "myImage",
  properties: () => ({
    location: "West US",
    properties: {
      storageProfile: {
        osDisk: {
          osType: "Linux",
          snapshot: {
            id: "subscriptions/{subscription-id}/resourceGroups/myResourceGroup/providers/Microsoft.Compute/snapshots/mySnapshot",
          },
          diskEncryptionSet: {
            id: "/subscriptions/{subscription-id}/resourceGroups/myResourceGroup/providers/Microsoft.Compute/diskEncryptionSets/{existing-diskEncryptionSet-name}",
          },
          osState: "Generalized",
        },
      },
    },
  }),
  dependencies: ({ resources }) => ({
    resourceGroup: resources.Resources.ResourceGroup["myResourceGroup"],
    virtualMachine: resources.Compute.VirtualMachine["myVirtualMachine"],
  }),
});

```

### Create a virtual machine image from a managed disk with DiskEncryptionSet resource.
```js
provider.Compute.makeImage({
  name: "myImage",
  properties: () => ({
    location: "West US",
    properties: {
      storageProfile: {
        osDisk: {
          osType: "Linux",
          managedDisk: {
            id: "subscriptions/{subscription-id}/resourceGroups/myResourceGroup/providers/Microsoft.Compute/disks/myManagedDisk",
          },
          diskEncryptionSet: {
            id: "/subscriptions/{subscription-id}/resourceGroups/myResourceGroup/providers/Microsoft.Compute/diskEncryptionSets/{existing-diskEncryptionSet-name}",
          },
          osState: "Generalized",
        },
      },
    },
  }),
  dependencies: ({ resources }) => ({
    resourceGroup: resources.Resources.ResourceGroup["myResourceGroup"],
    virtualMachine: resources.Compute.VirtualMachine["myVirtualMachine"],
  }),
});

```
## Dependencies
- [ResourceGroup](../Resources/ResourceGroup.md)
- [VirtualMachine](../Compute/VirtualMachine.md)
## Misc
The resource version is `2021-07-01`.

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/compute/resource-manager/Microsoft.Compute/stable/2021-07-01/compute.json).
