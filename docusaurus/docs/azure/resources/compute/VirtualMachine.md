---
id: VirtualMachine
title: VirtualMachine
---
Provides a **VirtualMachine** from the **Compute** group
## Examples
### Create a vm with password authentication.
```js
exports.createResources = () => [
  {
    type: "VirtualMachine",
    group: "Compute",
    name: "myVirtualMachine",
    properties: () => ({
      location: "westus",
      properties: {
        hardwareProfile: { vmSize: "Standard_D1_v2" },
        storageProfile: {
          imageReference: {
            sku: "2016-Datacenter",
            publisher: "MicrosoftWindowsServer",
            version: "latest",
            offer: "WindowsServer",
          },
          osDisk: {
            caching: "ReadWrite",
            managedDisk: { storageAccountType: "Standard_LRS" },
            name: "myVMosdisk",
            createOption: "FromImage",
          },
        },
        osProfile: {
          adminUsername: "{your-username}",
          computerName: "myVM",
          adminPassword: "{your-password}",
        },
        networkProfile: {
          networkInterfaces: [
            {
              id: "/subscriptions/{subscription-id}/resourceGroups/myResourceGroup/providers/Microsoft.Network/networkInterfaces/{existing-nic-name}",
              properties: { primary: true },
            },
          ],
        },
      },
    }),
    dependencies: ({}) => ({
      resourceGroup: "myResourceGroup",
      disks: ["myDisk"],
      managedIdentities: ["myUserAssignedIdentity"],
      sshPublicKeys: ["mySshPublicKey"],
      galleryImage: "myGalleryImage",
      networkSecurityGroups: ["myNetworkSecurityGroup"],
      proximityPlacementGroup: "myProximityPlacementGroup",
      dedicatedHostGroup: "myDedicatedHostGroup",
      capacityReservationGroup: "myCapacityReservationGroup",
      networkInterfaces: ["myNetworkInterface"],
      availabilitySet: "myAvailabilitySet",
      virtualMachineScaleSet: "myVirtualMachineScaleSet",
      virtualMachineScaleSetVm: "myVirtualMachineScaleSetVM",
    }),
  },
];

```

### Create a vm with ssh authentication.
```js
exports.createResources = () => [
  {
    type: "VirtualMachine",
    group: "Compute",
    name: "myVirtualMachine",
    properties: () => ({
      location: "westus",
      properties: {
        hardwareProfile: { vmSize: "Standard_D1_v2" },
        storageProfile: {
          imageReference: {
            sku: "{image_sku}",
            publisher: "{image_publisher}",
            version: "latest",
            offer: "{image_offer}",
          },
          osDisk: {
            caching: "ReadWrite",
            managedDisk: { storageAccountType: "Standard_LRS" },
            name: "myVMosdisk",
            createOption: "FromImage",
          },
        },
        osProfile: {
          adminUsername: "{your-username}",
          computerName: "myVM",
          linuxConfiguration: {
            ssh: {
              publicKeys: [
                {
                  path: "/home/{your-username}/.ssh/authorized_keys",
                  keyData:
                    "ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQCeClRAk2ipUs/l5voIsDC5q9RI+YSRd1Bvd/O+axgY4WiBzG+4FwJWZm/mLLe5DoOdHQwmU2FrKXZSW4w2sYE70KeWnrFViCOX5MTVvJgPE8ClugNl8RWth/tU849DvM9sT7vFgfVSHcAS2yDRyDlueii+8nF2ym8XWAPltFVCyLHRsyBp5YPqK8JFYIa1eybKsY3hEAxRCA+/7bq8et+Gj3coOsuRmrehav7rE6N12Pb80I6ofa6SM5XNYq4Xk0iYNx7R3kdz0Jj9XgZYWjAHjJmT0gTRoOnt6upOuxK7xI/ykWrllgpXrCPu3Ymz+c+ujaqcxDopnAl2lmf69/J1",
                },
              ],
            },
            disablePasswordAuthentication: true,
          },
        },
        networkProfile: {
          networkInterfaces: [
            {
              id: "/subscriptions/{subscription-id}/resourceGroups/myResourceGroup/providers/Microsoft.Network/networkInterfaces/{existing-nic-name}",
              properties: { primary: true },
            },
          ],
        },
      },
    }),
    dependencies: ({}) => ({
      resourceGroup: "myResourceGroup",
      disks: ["myDisk"],
      managedIdentities: ["myUserAssignedIdentity"],
      sshPublicKeys: ["mySshPublicKey"],
      galleryImage: "myGalleryImage",
      networkSecurityGroups: ["myNetworkSecurityGroup"],
      proximityPlacementGroup: "myProximityPlacementGroup",
      dedicatedHostGroup: "myDedicatedHostGroup",
      capacityReservationGroup: "myCapacityReservationGroup",
      networkInterfaces: ["myNetworkInterface"],
      availabilitySet: "myAvailabilitySet",
      virtualMachineScaleSet: "myVirtualMachineScaleSet",
      virtualMachineScaleSetVm: "myVirtualMachineScaleSetVM",
    }),
  },
];

```

### Create a vm with premium storage.
```js
exports.createResources = () => [
  {
    type: "VirtualMachine",
    group: "Compute",
    name: "myVirtualMachine",
    properties: () => ({
      location: "westus",
      properties: {
        hardwareProfile: { vmSize: "Standard_D1_v2" },
        storageProfile: {
          imageReference: {
            sku: "2016-Datacenter",
            publisher: "MicrosoftWindowsServer",
            version: "latest",
            offer: "WindowsServer",
          },
          osDisk: {
            caching: "ReadWrite",
            managedDisk: { storageAccountType: "Premium_LRS" },
            name: "myVMosdisk",
            createOption: "FromImage",
          },
        },
        osProfile: {
          adminUsername: "{your-username}",
          computerName: "myVM",
          adminPassword: "{your-password}",
        },
        networkProfile: {
          networkInterfaces: [
            {
              id: "/subscriptions/{subscription-id}/resourceGroups/myResourceGroup/providers/Microsoft.Network/networkInterfaces/{existing-nic-name}",
              properties: { primary: true },
            },
          ],
        },
      },
    }),
    dependencies: ({}) => ({
      resourceGroup: "myResourceGroup",
      disks: ["myDisk"],
      managedIdentities: ["myUserAssignedIdentity"],
      sshPublicKeys: ["mySshPublicKey"],
      galleryImage: "myGalleryImage",
      networkSecurityGroups: ["myNetworkSecurityGroup"],
      proximityPlacementGroup: "myProximityPlacementGroup",
      dedicatedHostGroup: "myDedicatedHostGroup",
      capacityReservationGroup: "myCapacityReservationGroup",
      networkInterfaces: ["myNetworkInterface"],
      availabilitySet: "myAvailabilitySet",
      virtualMachineScaleSet: "myVirtualMachineScaleSet",
      virtualMachineScaleSetVm: "myVirtualMachineScaleSetVM",
    }),
  },
];

```

### Create a vm in a Virtual Machine Scale Set with customer assigned platformFaultDomain.
```js
exports.createResources = () => [
  {
    type: "VirtualMachine",
    group: "Compute",
    name: "myVirtualMachine",
    properties: () => ({
      location: "westus",
      properties: {
        hardwareProfile: { vmSize: "Standard_D1_v2" },
        storageProfile: {
          imageReference: {
            sku: "2016-Datacenter",
            publisher: "MicrosoftWindowsServer",
            version: "latest",
            offer: "WindowsServer",
          },
          osDisk: {
            caching: "ReadWrite",
            managedDisk: { storageAccountType: "Standard_LRS" },
            name: "myVMosdisk",
            createOption: "FromImage",
          },
        },
        networkProfile: {
          networkInterfaces: [
            {
              id: "/subscriptions/{subscription-id}/resourceGroups/myResourceGroup/providers/Microsoft.Network/networkInterfaces/{existing-nic-name}",
              properties: { primary: true },
            },
          ],
        },
        osProfile: {
          adminUsername: "{your-username}",
          computerName: "myVM",
          adminPassword: "{your-password}",
        },
        virtualMachineScaleSet: {
          id: "/subscriptions/{subscription-id}/resourceGroups/myResourceGroup/providers/Microsoft.Compute/virtualMachineScaleSets/{existing-flex-vmss-name-with-platformFaultDomainCount-greater-than-1}",
        },
        platformFaultDomain: 1,
      },
    }),
    dependencies: ({}) => ({
      resourceGroup: "myResourceGroup",
      disks: ["myDisk"],
      managedIdentities: ["myUserAssignedIdentity"],
      sshPublicKeys: ["mySshPublicKey"],
      galleryImage: "myGalleryImage",
      networkSecurityGroups: ["myNetworkSecurityGroup"],
      proximityPlacementGroup: "myProximityPlacementGroup",
      dedicatedHostGroup: "myDedicatedHostGroup",
      capacityReservationGroup: "myCapacityReservationGroup",
      networkInterfaces: ["myNetworkInterface"],
      availabilitySet: "myAvailabilitySet",
      virtualMachineScaleSet: "myVirtualMachineScaleSet",
      virtualMachineScaleSetVm: "myVirtualMachineScaleSetVM",
    }),
  },
];

```

### Create a vm in an availability set.
```js
exports.createResources = () => [
  {
    type: "VirtualMachine",
    group: "Compute",
    name: "myVirtualMachine",
    properties: () => ({
      location: "westus",
      properties: {
        hardwareProfile: { vmSize: "Standard_D1_v2" },
        storageProfile: {
          imageReference: {
            sku: "2016-Datacenter",
            publisher: "MicrosoftWindowsServer",
            version: "latest",
            offer: "WindowsServer",
          },
          osDisk: {
            caching: "ReadWrite",
            managedDisk: { storageAccountType: "Standard_LRS" },
            name: "myVMosdisk",
            createOption: "FromImage",
          },
        },
        networkProfile: {
          networkInterfaces: [
            {
              id: "/subscriptions/{subscription-id}/resourceGroups/myResourceGroup/providers/Microsoft.Network/networkInterfaces/{existing-nic-name}",
              properties: { primary: true },
            },
          ],
        },
        osProfile: {
          adminUsername: "{your-username}",
          computerName: "myVM",
          adminPassword: "{your-password}",
        },
        availabilitySet: {
          id: "/subscriptions/{subscription-id}/resourceGroups/myResourceGroup/providers/Microsoft.Compute/availabilitySets/{existing-availability-set-name}",
        },
      },
    }),
    dependencies: ({}) => ({
      resourceGroup: "myResourceGroup",
      disks: ["myDisk"],
      managedIdentities: ["myUserAssignedIdentity"],
      sshPublicKeys: ["mySshPublicKey"],
      galleryImage: "myGalleryImage",
      networkSecurityGroups: ["myNetworkSecurityGroup"],
      proximityPlacementGroup: "myProximityPlacementGroup",
      dedicatedHostGroup: "myDedicatedHostGroup",
      capacityReservationGroup: "myCapacityReservationGroup",
      networkInterfaces: ["myNetworkInterface"],
      availabilitySet: "myAvailabilitySet",
      virtualMachineScaleSet: "myVirtualMachineScaleSet",
      virtualMachineScaleSetVm: "myVirtualMachineScaleSetVM",
    }),
  },
];

```

### Create a vm with Scheduled Events Profile
```js
exports.createResources = () => [
  {
    type: "VirtualMachine",
    group: "Compute",
    name: "myVirtualMachine",
    properties: () => ({
      location: "westus",
      properties: {
        hardwareProfile: { vmSize: "Standard_D1_v2" },
        storageProfile: {
          imageReference: {
            sku: "2016-Datacenter",
            publisher: "MicrosoftWindowsServer",
            version: "latest",
            offer: "WindowsServer",
          },
          osDisk: {
            caching: "ReadWrite",
            managedDisk: { storageAccountType: "Standard_LRS" },
            name: "myVMosdisk",
            createOption: "FromImage",
          },
        },
        networkProfile: {
          networkInterfaces: [
            {
              id: "/subscriptions/{subscription-id}/resourceGroups/myResourceGroup/providers/Microsoft.Network/networkInterfaces/{existing-nic-name}",
              properties: { primary: true },
            },
          ],
        },
        osProfile: {
          adminUsername: "{your-username}",
          computerName: "myVM",
          adminPassword: "{your-password}",
        },
        diagnosticsProfile: {
          bootDiagnostics: {
            storageUri:
              "http://{existing-storage-account-name}.blob.core.windows.net",
            enabled: true,
          },
        },
        scheduledEventsProfile: {
          terminateNotificationProfile: {
            notBeforeTimeout: "PT10M",
            enable: true,
          },
        },
      },
    }),
    dependencies: ({}) => ({
      resourceGroup: "myResourceGroup",
      disks: ["myDisk"],
      managedIdentities: ["myUserAssignedIdentity"],
      sshPublicKeys: ["mySshPublicKey"],
      galleryImage: "myGalleryImage",
      networkSecurityGroups: ["myNetworkSecurityGroup"],
      proximityPlacementGroup: "myProximityPlacementGroup",
      dedicatedHostGroup: "myDedicatedHostGroup",
      capacityReservationGroup: "myCapacityReservationGroup",
      networkInterfaces: ["myNetworkInterface"],
      availabilitySet: "myAvailabilitySet",
      virtualMachineScaleSet: "myVirtualMachineScaleSet",
      virtualMachineScaleSetVm: "myVirtualMachineScaleSetVM",
    }),
  },
];

```

### Create a vm with boot diagnostics.
```js
exports.createResources = () => [
  {
    type: "VirtualMachine",
    group: "Compute",
    name: "myVirtualMachine",
    properties: () => ({
      location: "westus",
      properties: {
        hardwareProfile: { vmSize: "Standard_D1_v2" },
        storageProfile: {
          imageReference: {
            sku: "2016-Datacenter",
            publisher: "MicrosoftWindowsServer",
            version: "latest",
            offer: "WindowsServer",
          },
          osDisk: {
            caching: "ReadWrite",
            managedDisk: { storageAccountType: "Standard_LRS" },
            name: "myVMosdisk",
            createOption: "FromImage",
          },
        },
        networkProfile: {
          networkInterfaces: [
            {
              id: "/subscriptions/{subscription-id}/resourceGroups/myResourceGroup/providers/Microsoft.Network/networkInterfaces/{existing-nic-name}",
              properties: { primary: true },
            },
          ],
        },
        osProfile: {
          adminUsername: "{your-username}",
          computerName: "myVM",
          adminPassword: "{your-password}",
        },
        diagnosticsProfile: {
          bootDiagnostics: {
            storageUri:
              "http://{existing-storage-account-name}.blob.core.windows.net",
            enabled: true,
          },
        },
      },
    }),
    dependencies: ({}) => ({
      resourceGroup: "myResourceGroup",
      disks: ["myDisk"],
      managedIdentities: ["myUserAssignedIdentity"],
      sshPublicKeys: ["mySshPublicKey"],
      galleryImage: "myGalleryImage",
      networkSecurityGroups: ["myNetworkSecurityGroup"],
      proximityPlacementGroup: "myProximityPlacementGroup",
      dedicatedHostGroup: "myDedicatedHostGroup",
      capacityReservationGroup: "myCapacityReservationGroup",
      networkInterfaces: ["myNetworkInterface"],
      availabilitySet: "myAvailabilitySet",
      virtualMachineScaleSet: "myVirtualMachineScaleSet",
      virtualMachineScaleSetVm: "myVirtualMachineScaleSetVM",
    }),
  },
];

```

### Create a vm with managed boot diagnostics.
```js
exports.createResources = () => [
  {
    type: "VirtualMachine",
    group: "Compute",
    name: "myVirtualMachine",
    properties: () => ({
      location: "westus",
      properties: {
        hardwareProfile: { vmSize: "Standard_D1_v2" },
        storageProfile: {
          imageReference: {
            sku: "2016-Datacenter",
            publisher: "MicrosoftWindowsServer",
            version: "latest",
            offer: "WindowsServer",
          },
          osDisk: {
            caching: "ReadWrite",
            managedDisk: { storageAccountType: "Standard_LRS" },
            name: "myVMosdisk",
            createOption: "FromImage",
          },
        },
        networkProfile: {
          networkInterfaces: [
            {
              id: "/subscriptions/{subscription-id}/resourceGroups/myResourceGroup/providers/Microsoft.Network/networkInterfaces/{existing-nic-name}",
              properties: { primary: true },
            },
          ],
        },
        osProfile: {
          adminUsername: "{your-username}",
          computerName: "myVM",
          adminPassword: "{your-password}",
        },
        diagnosticsProfile: { bootDiagnostics: { enabled: true } },
      },
    }),
    dependencies: ({}) => ({
      resourceGroup: "myResourceGroup",
      disks: ["myDisk"],
      managedIdentities: ["myUserAssignedIdentity"],
      sshPublicKeys: ["mySshPublicKey"],
      galleryImage: "myGalleryImage",
      networkSecurityGroups: ["myNetworkSecurityGroup"],
      proximityPlacementGroup: "myProximityPlacementGroup",
      dedicatedHostGroup: "myDedicatedHostGroup",
      capacityReservationGroup: "myCapacityReservationGroup",
      networkInterfaces: ["myNetworkInterface"],
      availabilitySet: "myAvailabilitySet",
      virtualMachineScaleSet: "myVirtualMachineScaleSet",
      virtualMachineScaleSetVm: "myVirtualMachineScaleSetVM",
    }),
  },
];

```

### Create a vm with empty data disks.
```js
exports.createResources = () => [
  {
    type: "VirtualMachine",
    group: "Compute",
    name: "myVirtualMachine",
    properties: () => ({
      location: "westus",
      properties: {
        hardwareProfile: { vmSize: "Standard_D2_v2" },
        storageProfile: {
          imageReference: {
            sku: "2016-Datacenter",
            publisher: "MicrosoftWindowsServer",
            version: "latest",
            offer: "WindowsServer",
          },
          osDisk: {
            caching: "ReadWrite",
            managedDisk: { storageAccountType: "Standard_LRS" },
            name: "myVMosdisk",
            createOption: "FromImage",
          },
          dataDisks: [
            { diskSizeGB: 1023, createOption: "Empty", lun: 0 },
            { diskSizeGB: 1023, createOption: "Empty", lun: 1 },
          ],
        },
        osProfile: {
          adminUsername: "{your-username}",
          computerName: "myVM",
          adminPassword: "{your-password}",
        },
        networkProfile: {
          networkInterfaces: [
            {
              id: "/subscriptions/{subscription-id}/resourceGroups/myResourceGroup/providers/Microsoft.Network/networkInterfaces/{existing-nic-name}",
              properties: { primary: true },
            },
          ],
        },
      },
    }),
    dependencies: ({}) => ({
      resourceGroup: "myResourceGroup",
      disks: ["myDisk"],
      managedIdentities: ["myUserAssignedIdentity"],
      sshPublicKeys: ["mySshPublicKey"],
      galleryImage: "myGalleryImage",
      networkSecurityGroups: ["myNetworkSecurityGroup"],
      proximityPlacementGroup: "myProximityPlacementGroup",
      dedicatedHostGroup: "myDedicatedHostGroup",
      capacityReservationGroup: "myCapacityReservationGroup",
      networkInterfaces: ["myNetworkInterface"],
      availabilitySet: "myAvailabilitySet",
      virtualMachineScaleSet: "myVirtualMachineScaleSet",
      virtualMachineScaleSetVm: "myVirtualMachineScaleSetVM",
    }),
  },
];

```

### Create a vm with a marketplace image plan.
```js
exports.createResources = () => [
  {
    type: "VirtualMachine",
    group: "Compute",
    name: "myVirtualMachine",
    properties: () => ({
      location: "westus",
      plan: {
        publisher: "microsoft-ads",
        product: "windows-data-science-vm",
        name: "windows2016",
      },
      properties: {
        hardwareProfile: { vmSize: "Standard_D1_v2" },
        storageProfile: {
          imageReference: {
            sku: "windows2016",
            publisher: "microsoft-ads",
            version: "latest",
            offer: "windows-data-science-vm",
          },
          osDisk: {
            caching: "ReadWrite",
            managedDisk: { storageAccountType: "Standard_LRS" },
            name: "myVMosdisk",
            createOption: "FromImage",
          },
        },
        osProfile: {
          adminUsername: "{your-username}",
          computerName: "myVM",
          adminPassword: "{your-password}",
        },
        networkProfile: {
          networkInterfaces: [
            {
              id: "/subscriptions/{subscription-id}/resourceGroups/myResourceGroup/providers/Microsoft.Network/networkInterfaces/{existing-nic-name}",
              properties: { primary: true },
            },
          ],
        },
      },
    }),
    dependencies: ({}) => ({
      resourceGroup: "myResourceGroup",
      disks: ["myDisk"],
      managedIdentities: ["myUserAssignedIdentity"],
      sshPublicKeys: ["mySshPublicKey"],
      galleryImage: "myGalleryImage",
      networkSecurityGroups: ["myNetworkSecurityGroup"],
      proximityPlacementGroup: "myProximityPlacementGroup",
      dedicatedHostGroup: "myDedicatedHostGroup",
      capacityReservationGroup: "myCapacityReservationGroup",
      networkInterfaces: ["myNetworkInterface"],
      availabilitySet: "myAvailabilitySet",
      virtualMachineScaleSet: "myVirtualMachineScaleSet",
      virtualMachineScaleSetVm: "myVirtualMachineScaleSetVM",
    }),
  },
];

```

### Create a vm from a custom image.
```js
exports.createResources = () => [
  {
    type: "VirtualMachine",
    group: "Compute",
    name: "myVirtualMachine",
    properties: () => ({
      location: "westus",
      properties: {
        hardwareProfile: { vmSize: "Standard_D1_v2" },
        storageProfile: {
          imageReference: {
            id: "/subscriptions/{subscription-id}/resourceGroups/myResourceGroup/providers/Microsoft.Compute/images/{existing-custom-image-name}",
          },
          osDisk: {
            caching: "ReadWrite",
            managedDisk: { storageAccountType: "Standard_LRS" },
            name: "myVMosdisk",
            createOption: "FromImage",
          },
        },
        osProfile: {
          adminUsername: "{your-username}",
          computerName: "myVM",
          adminPassword: "{your-password}",
        },
        networkProfile: {
          networkInterfaces: [
            {
              id: "/subscriptions/{subscription-id}/resourceGroups/myResourceGroup/providers/Microsoft.Network/networkInterfaces/{existing-nic-name}",
              properties: { primary: true },
            },
          ],
        },
      },
    }),
    dependencies: ({}) => ({
      resourceGroup: "myResourceGroup",
      disks: ["myDisk"],
      managedIdentities: ["myUserAssignedIdentity"],
      sshPublicKeys: ["mySshPublicKey"],
      galleryImage: "myGalleryImage",
      networkSecurityGroups: ["myNetworkSecurityGroup"],
      proximityPlacementGroup: "myProximityPlacementGroup",
      dedicatedHostGroup: "myDedicatedHostGroup",
      capacityReservationGroup: "myCapacityReservationGroup",
      networkInterfaces: ["myNetworkInterface"],
      availabilitySet: "myAvailabilitySet",
      virtualMachineScaleSet: "myVirtualMachineScaleSet",
      virtualMachineScaleSetVm: "myVirtualMachineScaleSetVM",
    }),
  },
];

```

### Create a platform-image vm with unmanaged os and data disks.
```js
exports.createResources = () => [
  {
    type: "VirtualMachine",
    group: "Compute",
    name: "myVirtualMachine",
    properties: () => ({
      location: "westus",
      properties: {
        hardwareProfile: { vmSize: "Standard_D2_v2" },
        storageProfile: {
          imageReference: {
            sku: "2016-Datacenter",
            publisher: "MicrosoftWindowsServer",
            version: "latest",
            offer: "WindowsServer",
          },
          osDisk: {
            caching: "ReadWrite",
            vhd: {
              uri: "http://{existing-storage-account-name}.blob.core.windows.net/{existing-container-name}/myDisk.vhd",
            },
            createOption: "FromImage",
            name: "myVMosdisk",
          },
          dataDisks: [
            {
              diskSizeGB: 1023,
              createOption: "Empty",
              lun: 0,
              vhd: {
                uri: "http://{existing-storage-account-name}.blob.core.windows.net/{existing-container-name}/myDisk0.vhd",
              },
            },
            {
              diskSizeGB: 1023,
              createOption: "Empty",
              lun: 1,
              vhd: {
                uri: "http://{existing-storage-account-name}.blob.core.windows.net/{existing-container-name}/myDisk1.vhd",
              },
            },
          ],
        },
        osProfile: {
          adminUsername: "{your-username}",
          computerName: "myVM",
          adminPassword: "{your-password}",
        },
        networkProfile: {
          networkInterfaces: [
            {
              id: "/subscriptions/{subscription-id}/resourceGroups/myResourceGroup/providers/Microsoft.Network/networkInterfaces/{existing-nic-name}",
              properties: { primary: true },
            },
          ],
        },
      },
    }),
    dependencies: ({}) => ({
      resourceGroup: "myResourceGroup",
      disks: ["myDisk"],
      managedIdentities: ["myUserAssignedIdentity"],
      sshPublicKeys: ["mySshPublicKey"],
      galleryImage: "myGalleryImage",
      networkSecurityGroups: ["myNetworkSecurityGroup"],
      proximityPlacementGroup: "myProximityPlacementGroup",
      dedicatedHostGroup: "myDedicatedHostGroup",
      capacityReservationGroup: "myCapacityReservationGroup",
      networkInterfaces: ["myNetworkInterface"],
      availabilitySet: "myAvailabilitySet",
      virtualMachineScaleSet: "myVirtualMachineScaleSet",
      virtualMachineScaleSetVm: "myVirtualMachineScaleSetVM",
    }),
  },
];

```

### Create a custom-image vm from an unmanaged generalized os image.
```js
exports.createResources = () => [
  {
    type: "VirtualMachine",
    group: "Compute",
    name: "myVirtualMachine",
    properties: () => ({
      location: "westus",
      properties: {
        hardwareProfile: { vmSize: "Standard_D1_v2" },
        storageProfile: {
          osDisk: {
            name: "myVMosdisk",
            image: {
              uri: "http://{existing-storage-account-name}.blob.core.windows.net/{existing-container-name}/{existing-generalized-os-image-blob-name}.vhd",
            },
            osType: "Windows",
            createOption: "FromImage",
            caching: "ReadWrite",
            vhd: {
              uri: "http://{existing-storage-account-name}.blob.core.windows.net/{existing-container-name}/myDisk.vhd",
            },
          },
        },
        osProfile: {
          adminUsername: "{your-username}",
          computerName: "myVM",
          adminPassword: "{your-password}",
        },
        networkProfile: {
          networkInterfaces: [
            {
              id: "/subscriptions/{subscription-id}/resourceGroups/myResourceGroup/providers/Microsoft.Network/networkInterfaces/{existing-nic-name}",
              properties: { primary: true },
            },
          ],
        },
      },
    }),
    dependencies: ({}) => ({
      resourceGroup: "myResourceGroup",
      disks: ["myDisk"],
      managedIdentities: ["myUserAssignedIdentity"],
      sshPublicKeys: ["mySshPublicKey"],
      galleryImage: "myGalleryImage",
      networkSecurityGroups: ["myNetworkSecurityGroup"],
      proximityPlacementGroup: "myProximityPlacementGroup",
      dedicatedHostGroup: "myDedicatedHostGroup",
      capacityReservationGroup: "myCapacityReservationGroup",
      networkInterfaces: ["myNetworkInterface"],
      availabilitySet: "myAvailabilitySet",
      virtualMachineScaleSet: "myVirtualMachineScaleSet",
      virtualMachineScaleSetVm: "myVirtualMachineScaleSetVM",
    }),
  },
];

```

### Create a vm with ephemeral os disk.
```js
exports.createResources = () => [
  {
    type: "VirtualMachine",
    group: "Compute",
    name: "myVirtualMachine",
    properties: () => ({
      location: "westus",
      plan: {
        publisher: "microsoft-ads",
        product: "windows-data-science-vm",
        name: "windows2016",
      },
      properties: {
        hardwareProfile: { vmSize: "Standard_DS1_v2" },
        storageProfile: {
          imageReference: {
            sku: "windows2016",
            publisher: "microsoft-ads",
            version: "latest",
            offer: "windows-data-science-vm",
          },
          osDisk: {
            caching: "ReadOnly",
            diffDiskSettings: { option: "Local" },
            managedDisk: { storageAccountType: "Standard_LRS" },
            createOption: "FromImage",
            name: "myVMosdisk",
          },
        },
        osProfile: {
          adminUsername: "{your-username}",
          computerName: "myVM",
          adminPassword: "{your-password}",
        },
        networkProfile: {
          networkInterfaces: [
            {
              id: "/subscriptions/{subscription-id}/resourceGroups/myResourceGroup/providers/Microsoft.Network/networkInterfaces/{existing-nic-name}",
              properties: { primary: true },
            },
          ],
        },
      },
    }),
    dependencies: ({}) => ({
      resourceGroup: "myResourceGroup",
      disks: ["myDisk"],
      managedIdentities: ["myUserAssignedIdentity"],
      sshPublicKeys: ["mySshPublicKey"],
      galleryImage: "myGalleryImage",
      networkSecurityGroups: ["myNetworkSecurityGroup"],
      proximityPlacementGroup: "myProximityPlacementGroup",
      dedicatedHostGroup: "myDedicatedHostGroup",
      capacityReservationGroup: "myCapacityReservationGroup",
      networkInterfaces: ["myNetworkInterface"],
      availabilitySet: "myAvailabilitySet",
      virtualMachineScaleSet: "myVirtualMachineScaleSet",
      virtualMachineScaleSetVm: "myVirtualMachineScaleSetVM",
    }),
  },
];

```

### Create a vm with DiskEncryptionSet resource id in the os disk and data disk.
```js
exports.createResources = () => [
  {
    type: "VirtualMachine",
    group: "Compute",
    name: "myVirtualMachine",
    properties: () => ({
      location: "westus",
      properties: {
        hardwareProfile: { vmSize: "Standard_D1_v2" },
        storageProfile: {
          imageReference: {
            id: "/subscriptions/{subscription-id}/resourceGroups/myResourceGroup/providers/Microsoft.Compute/images/{existing-custom-image-name}",
          },
          osDisk: {
            caching: "ReadWrite",
            managedDisk: {
              storageAccountType: "Standard_LRS",
              diskEncryptionSet: {
                id: "/subscriptions/{subscription-id}/resourceGroups/myResourceGroup/providers/Microsoft.Compute/diskEncryptionSets/{existing-diskEncryptionSet-name}",
              },
            },
            name: "myVMosdisk",
            createOption: "FromImage",
          },
          dataDisks: [
            {
              caching: "ReadWrite",
              managedDisk: {
                storageAccountType: "Standard_LRS",
                diskEncryptionSet: {
                  id: "/subscriptions/{subscription-id}/resourceGroups/myResourceGroup/providers/Microsoft.Compute/diskEncryptionSets/{existing-diskEncryptionSet-name}",
                },
              },
              diskSizeGB: 1023,
              createOption: "Empty",
              lun: 0,
            },
            {
              caching: "ReadWrite",
              managedDisk: {
                id: "/subscriptions/{subscription-id}/resourceGroups/myResourceGroup/providers/Microsoft.Compute/disks/{existing-managed-disk-name}",
                storageAccountType: "Standard_LRS",
                diskEncryptionSet: {
                  id: "/subscriptions/{subscription-id}/resourceGroups/myResourceGroup/providers/Microsoft.Compute/diskEncryptionSets/{existing-diskEncryptionSet-name}",
                },
              },
              diskSizeGB: 1023,
              createOption: "Attach",
              lun: 1,
            },
          ],
        },
        osProfile: {
          adminUsername: "{your-username}",
          computerName: "myVM",
          adminPassword: "{your-password}",
        },
        networkProfile: {
          networkInterfaces: [
            {
              id: "/subscriptions/{subscription-id}/resourceGroups/myResourceGroup/providers/Microsoft.Network/networkInterfaces/{existing-nic-name}",
              properties: { primary: true },
            },
          ],
        },
      },
    }),
    dependencies: ({}) => ({
      resourceGroup: "myResourceGroup",
      disks: ["myDisk"],
      managedIdentities: ["myUserAssignedIdentity"],
      sshPublicKeys: ["mySshPublicKey"],
      galleryImage: "myGalleryImage",
      networkSecurityGroups: ["myNetworkSecurityGroup"],
      proximityPlacementGroup: "myProximityPlacementGroup",
      dedicatedHostGroup: "myDedicatedHostGroup",
      capacityReservationGroup: "myCapacityReservationGroup",
      networkInterfaces: ["myNetworkInterface"],
      availabilitySet: "myAvailabilitySet",
      virtualMachineScaleSet: "myVirtualMachineScaleSet",
      virtualMachineScaleSetVm: "myVirtualMachineScaleSetVM",
    }),
  },
];

```

### Create a vm with ephemeral os disk provisioning in Resource disk using placement property.
```js
exports.createResources = () => [
  {
    type: "VirtualMachine",
    group: "Compute",
    name: "myVirtualMachine",
    properties: () => ({
      location: "westus",
      plan: {
        publisher: "microsoft-ads",
        product: "windows-data-science-vm",
        name: "windows2016",
      },
      properties: {
        hardwareProfile: { vmSize: "Standard_DS1_v2" },
        storageProfile: {
          imageReference: {
            sku: "windows2016",
            publisher: "microsoft-ads",
            version: "latest",
            offer: "windows-data-science-vm",
          },
          osDisk: {
            caching: "ReadOnly",
            diffDiskSettings: { option: "Local", placement: "ResourceDisk" },
            managedDisk: { storageAccountType: "Standard_LRS" },
            createOption: "FromImage",
            name: "myVMosdisk",
          },
        },
        osProfile: {
          adminUsername: "{your-username}",
          computerName: "myVM",
          adminPassword: "{your-password}",
        },
        networkProfile: {
          networkInterfaces: [
            {
              id: "/subscriptions/{subscription-id}/resourceGroups/myResourceGroup/providers/Microsoft.Network/networkInterfaces/{existing-nic-name}",
              properties: { primary: true },
            },
          ],
        },
      },
    }),
    dependencies: ({}) => ({
      resourceGroup: "myResourceGroup",
      disks: ["myDisk"],
      managedIdentities: ["myUserAssignedIdentity"],
      sshPublicKeys: ["mySshPublicKey"],
      galleryImage: "myGalleryImage",
      networkSecurityGroups: ["myNetworkSecurityGroup"],
      proximityPlacementGroup: "myProximityPlacementGroup",
      dedicatedHostGroup: "myDedicatedHostGroup",
      capacityReservationGroup: "myCapacityReservationGroup",
      networkInterfaces: ["myNetworkInterface"],
      availabilitySet: "myAvailabilitySet",
      virtualMachineScaleSet: "myVirtualMachineScaleSet",
      virtualMachineScaleSetVm: "myVirtualMachineScaleSetVM",
    }),
  },
];

```

### Create a vm with ephemeral os disk provisioning in Cache disk using placement property.
```js
exports.createResources = () => [
  {
    type: "VirtualMachine",
    group: "Compute",
    name: "myVirtualMachine",
    properties: () => ({
      location: "westus",
      plan: {
        publisher: "microsoft-ads",
        product: "windows-data-science-vm",
        name: "windows2016",
      },
      properties: {
        hardwareProfile: { vmSize: "Standard_DS1_v2" },
        storageProfile: {
          imageReference: {
            sku: "windows2016",
            publisher: "microsoft-ads",
            version: "latest",
            offer: "windows-data-science-vm",
          },
          osDisk: {
            caching: "ReadOnly",
            diffDiskSettings: { option: "Local", placement: "CacheDisk" },
            managedDisk: { storageAccountType: "Standard_LRS" },
            createOption: "FromImage",
            name: "myVMosdisk",
          },
        },
        osProfile: {
          adminUsername: "{your-username}",
          computerName: "myVM",
          adminPassword: "{your-password}",
        },
        networkProfile: {
          networkInterfaces: [
            {
              id: "/subscriptions/{subscription-id}/resourceGroups/myResourceGroup/providers/Microsoft.Network/networkInterfaces/{existing-nic-name}",
              properties: { primary: true },
            },
          ],
        },
      },
    }),
    dependencies: ({}) => ({
      resourceGroup: "myResourceGroup",
      disks: ["myDisk"],
      managedIdentities: ["myUserAssignedIdentity"],
      sshPublicKeys: ["mySshPublicKey"],
      galleryImage: "myGalleryImage",
      networkSecurityGroups: ["myNetworkSecurityGroup"],
      proximityPlacementGroup: "myProximityPlacementGroup",
      dedicatedHostGroup: "myDedicatedHostGroup",
      capacityReservationGroup: "myCapacityReservationGroup",
      networkInterfaces: ["myNetworkInterface"],
      availabilitySet: "myAvailabilitySet",
      virtualMachineScaleSet: "myVirtualMachineScaleSet",
      virtualMachineScaleSetVm: "myVirtualMachineScaleSetVM",
    }),
  },
];

```

### Create a vm with Host Encryption using encryptionAtHost property.
```js
exports.createResources = () => [
  {
    type: "VirtualMachine",
    group: "Compute",
    name: "myVirtualMachine",
    properties: () => ({
      location: "westus",
      plan: {
        publisher: "microsoft-ads",
        product: "windows-data-science-vm",
        name: "windows2016",
      },
      properties: {
        hardwareProfile: { vmSize: "Standard_DS1_v2" },
        securityProfile: { encryptionAtHost: true },
        storageProfile: {
          imageReference: {
            sku: "windows2016",
            publisher: "microsoft-ads",
            version: "latest",
            offer: "windows-data-science-vm",
          },
          osDisk: {
            caching: "ReadOnly",
            managedDisk: { storageAccountType: "Standard_LRS" },
            createOption: "FromImage",
            name: "myVMosdisk",
          },
        },
        osProfile: {
          adminUsername: "{your-username}",
          computerName: "myVM",
          adminPassword: "{your-password}",
        },
        networkProfile: {
          networkInterfaces: [
            {
              id: "/subscriptions/{subscription-id}/resourceGroups/myResourceGroup/providers/Microsoft.Network/networkInterfaces/{existing-nic-name}",
              properties: { primary: true },
            },
          ],
        },
      },
    }),
    dependencies: ({}) => ({
      resourceGroup: "myResourceGroup",
      disks: ["myDisk"],
      managedIdentities: ["myUserAssignedIdentity"],
      sshPublicKeys: ["mySshPublicKey"],
      galleryImage: "myGalleryImage",
      networkSecurityGroups: ["myNetworkSecurityGroup"],
      proximityPlacementGroup: "myProximityPlacementGroup",
      dedicatedHostGroup: "myDedicatedHostGroup",
      capacityReservationGroup: "myCapacityReservationGroup",
      networkInterfaces: ["myNetworkInterface"],
      availabilitySet: "myAvailabilitySet",
      virtualMachineScaleSet: "myVirtualMachineScaleSet",
      virtualMachineScaleSetVm: "myVirtualMachineScaleSetVM",
    }),
  },
];

```

### Create a Windows vm with a patch setting patchMode of AutomaticByOS.
```js
exports.createResources = () => [
  {
    type: "VirtualMachine",
    group: "Compute",
    name: "myVirtualMachine",
    properties: () => ({
      location: "westus",
      properties: {
        hardwareProfile: { vmSize: "Standard_D1_v2" },
        storageProfile: {
          imageReference: {
            sku: "2016-Datacenter",
            publisher: "MicrosoftWindowsServer",
            version: "latest",
            offer: "WindowsServer",
          },
          osDisk: {
            caching: "ReadWrite",
            managedDisk: { storageAccountType: "Premium_LRS" },
            name: "myVMosdisk",
            createOption: "FromImage",
          },
        },
        osProfile: {
          adminUsername: "{your-username}",
          computerName: "myVM",
          adminPassword: "{your-password}",
          windowsConfiguration: {
            provisionVMAgent: true,
            enableAutomaticUpdates: true,
            patchSettings: { patchMode: "AutomaticByOS" },
          },
        },
        networkProfile: {
          networkInterfaces: [
            {
              id: "/subscriptions/{subscription-id}/resourceGroups/myResourceGroup/providers/Microsoft.Network/networkInterfaces/nsgExistingNic",
              properties: { primary: true },
            },
          ],
        },
      },
    }),
    dependencies: ({}) => ({
      resourceGroup: "myResourceGroup",
      disks: ["myDisk"],
      managedIdentities: ["myUserAssignedIdentity"],
      sshPublicKeys: ["mySshPublicKey"],
      galleryImage: "myGalleryImage",
      networkSecurityGroups: ["myNetworkSecurityGroup"],
      proximityPlacementGroup: "myProximityPlacementGroup",
      dedicatedHostGroup: "myDedicatedHostGroup",
      capacityReservationGroup: "myCapacityReservationGroup",
      networkInterfaces: ["myNetworkInterface"],
      availabilitySet: "myAvailabilitySet",
      virtualMachineScaleSet: "myVirtualMachineScaleSet",
      virtualMachineScaleSetVm: "myVirtualMachineScaleSetVM",
    }),
  },
];

```

### Create a Windows vm with patch settings patchMode and assessmentMode set to AutomaticByPlatform.
```js
exports.createResources = () => [
  {
    type: "VirtualMachine",
    group: "Compute",
    name: "myVirtualMachine",
    properties: () => ({
      location: "westus",
      properties: {
        hardwareProfile: { vmSize: "Standard_D1_v2" },
        storageProfile: {
          imageReference: {
            sku: "2016-Datacenter",
            publisher: "MicrosoftWindowsServer",
            version: "latest",
            offer: "WindowsServer",
          },
          osDisk: {
            caching: "ReadWrite",
            managedDisk: { storageAccountType: "Premium_LRS" },
            name: "myVMosdisk",
            createOption: "FromImage",
          },
        },
        osProfile: {
          adminUsername: "{your-username}",
          computerName: "myVM",
          adminPassword: "{your-password}",
          windowsConfiguration: {
            provisionVMAgent: true,
            enableAutomaticUpdates: true,
            patchSettings: {
              patchMode: "AutomaticByPlatform",
              assessmentMode: "AutomaticByPlatform",
            },
          },
        },
        networkProfile: {
          networkInterfaces: [
            {
              id: "/subscriptions/{subscription-id}/resourceGroups/myResourceGroup/providers/Microsoft.Network/networkInterfaces/{existing-nic-name}",
              properties: { primary: true },
            },
          ],
        },
      },
    }),
    dependencies: ({}) => ({
      resourceGroup: "myResourceGroup",
      disks: ["myDisk"],
      managedIdentities: ["myUserAssignedIdentity"],
      sshPublicKeys: ["mySshPublicKey"],
      galleryImage: "myGalleryImage",
      networkSecurityGroups: ["myNetworkSecurityGroup"],
      proximityPlacementGroup: "myProximityPlacementGroup",
      dedicatedHostGroup: "myDedicatedHostGroup",
      capacityReservationGroup: "myCapacityReservationGroup",
      networkInterfaces: ["myNetworkInterface"],
      availabilitySet: "myAvailabilitySet",
      virtualMachineScaleSet: "myVirtualMachineScaleSet",
      virtualMachineScaleSetVm: "myVirtualMachineScaleSetVM",
    }),
  },
];

```

### Create a Windows vm with a patch setting patchMode of Manual.
```js
exports.createResources = () => [
  {
    type: "VirtualMachine",
    group: "Compute",
    name: "myVirtualMachine",
    properties: () => ({
      location: "westus",
      properties: {
        hardwareProfile: { vmSize: "Standard_D1_v2" },
        storageProfile: {
          imageReference: {
            sku: "2016-Datacenter",
            publisher: "MicrosoftWindowsServer",
            version: "latest",
            offer: "WindowsServer",
          },
          osDisk: {
            caching: "ReadWrite",
            managedDisk: { storageAccountType: "Premium_LRS" },
            name: "myVMosdisk",
            createOption: "FromImage",
          },
        },
        osProfile: {
          adminUsername: "{your-username}",
          computerName: "myVM",
          adminPassword: "{your-password}",
          windowsConfiguration: {
            provisionVMAgent: true,
            enableAutomaticUpdates: true,
            patchSettings: { patchMode: "Manual" },
          },
        },
        networkProfile: {
          networkInterfaces: [
            {
              id: "/subscriptions/{subscription-id}/resourceGroups/myResourceGroup/providers/Microsoft.Network/networkInterfaces/{existing-nic-name}",
              properties: { primary: true },
            },
          ],
        },
      },
    }),
    dependencies: ({}) => ({
      resourceGroup: "myResourceGroup",
      disks: ["myDisk"],
      managedIdentities: ["myUserAssignedIdentity"],
      sshPublicKeys: ["mySshPublicKey"],
      galleryImage: "myGalleryImage",
      networkSecurityGroups: ["myNetworkSecurityGroup"],
      proximityPlacementGroup: "myProximityPlacementGroup",
      dedicatedHostGroup: "myDedicatedHostGroup",
      capacityReservationGroup: "myCapacityReservationGroup",
      networkInterfaces: ["myNetworkInterface"],
      availabilitySet: "myAvailabilitySet",
      virtualMachineScaleSet: "myVirtualMachineScaleSet",
      virtualMachineScaleSetVm: "myVirtualMachineScaleSetVM",
    }),
  },
];

```

### Create a Windows vm with a patch setting assessmentMode of ImageDefault.
```js
exports.createResources = () => [
  {
    type: "VirtualMachine",
    group: "Compute",
    name: "myVirtualMachine",
    properties: () => ({
      location: "westus",
      properties: {
        hardwareProfile: { vmSize: "Standard_D1_v2" },
        storageProfile: {
          imageReference: {
            sku: "2016-Datacenter",
            publisher: "MicrosoftWindowsServer",
            version: "latest",
            offer: "WindowsServer",
          },
          osDisk: {
            caching: "ReadWrite",
            managedDisk: { storageAccountType: "Premium_LRS" },
            name: "myVMosdisk",
            createOption: "FromImage",
          },
        },
        osProfile: {
          adminUsername: "{your-username}",
          computerName: "myVM",
          adminPassword: "{your-password}",
          windowsConfiguration: {
            provisionVMAgent: true,
            enableAutomaticUpdates: true,
            patchSettings: { assessmentMode: "ImageDefault" },
          },
        },
        networkProfile: {
          networkInterfaces: [
            {
              id: "/subscriptions/{subscription-id}/resourceGroups/myResourceGroup/providers/Microsoft.Network/networkInterfaces/{existing-nic-name}",
              properties: { primary: true },
            },
          ],
        },
      },
    }),
    dependencies: ({}) => ({
      resourceGroup: "myResourceGroup",
      disks: ["myDisk"],
      managedIdentities: ["myUserAssignedIdentity"],
      sshPublicKeys: ["mySshPublicKey"],
      galleryImage: "myGalleryImage",
      networkSecurityGroups: ["myNetworkSecurityGroup"],
      proximityPlacementGroup: "myProximityPlacementGroup",
      dedicatedHostGroup: "myDedicatedHostGroup",
      capacityReservationGroup: "myCapacityReservationGroup",
      networkInterfaces: ["myNetworkInterface"],
      availabilitySet: "myAvailabilitySet",
      virtualMachineScaleSet: "myVirtualMachineScaleSet",
      virtualMachineScaleSetVm: "myVirtualMachineScaleSetVM",
    }),
  },
];

```

### Create a Windows vm with a patch setting patchMode of AutomaticByPlatform and enableHotpatching set to true.
```js
exports.createResources = () => [
  {
    type: "VirtualMachine",
    group: "Compute",
    name: "myVirtualMachine",
    properties: () => ({
      location: "westus",
      properties: {
        hardwareProfile: { vmSize: "Standard_D1_v2" },
        storageProfile: {
          imageReference: {
            sku: "2016-Datacenter",
            publisher: "MicrosoftWindowsServer",
            version: "latest",
            offer: "WindowsServer",
          },
          osDisk: {
            caching: "ReadWrite",
            managedDisk: { storageAccountType: "Premium_LRS" },
            name: "myVMosdisk",
            createOption: "FromImage",
          },
        },
        osProfile: {
          adminUsername: "{your-username}",
          computerName: "myVM",
          adminPassword: "{your-password}",
          windowsConfiguration: {
            provisionVMAgent: true,
            enableAutomaticUpdates: true,
            patchSettings: {
              patchMode: "AutomaticByPlatform",
              enableHotpatching: true,
            },
          },
        },
        networkProfile: {
          networkInterfaces: [
            {
              id: "/subscriptions/{subscription-id}/resourceGroups/myResourceGroup/providers/Microsoft.Network/networkInterfaces/{existing-nic-name}",
              properties: { primary: true },
            },
          ],
        },
      },
    }),
    dependencies: ({}) => ({
      resourceGroup: "myResourceGroup",
      disks: ["myDisk"],
      managedIdentities: ["myUserAssignedIdentity"],
      sshPublicKeys: ["mySshPublicKey"],
      galleryImage: "myGalleryImage",
      networkSecurityGroups: ["myNetworkSecurityGroup"],
      proximityPlacementGroup: "myProximityPlacementGroup",
      dedicatedHostGroup: "myDedicatedHostGroup",
      capacityReservationGroup: "myCapacityReservationGroup",
      networkInterfaces: ["myNetworkInterface"],
      availabilitySet: "myAvailabilitySet",
      virtualMachineScaleSet: "myVirtualMachineScaleSet",
      virtualMachineScaleSetVm: "myVirtualMachineScaleSetVM",
    }),
  },
];

```

### Create a Linux vm with a patch settings patchMode and assessmentMode set to AutomaticByPlatform.
```js
exports.createResources = () => [
  {
    type: "VirtualMachine",
    group: "Compute",
    name: "myVirtualMachine",
    properties: () => ({
      location: "westus",
      properties: {
        hardwareProfile: { vmSize: "Standard_D2s_v3" },
        storageProfile: {
          imageReference: {
            sku: "16.04-LTS",
            publisher: "Canonical",
            version: "latest",
            offer: "UbuntuServer",
          },
          osDisk: {
            caching: "ReadWrite",
            managedDisk: { storageAccountType: "Premium_LRS" },
            name: "myVMosdisk",
            createOption: "FromImage",
          },
        },
        osProfile: {
          adminUsername: "{your-username}",
          computerName: "myVM",
          adminPassword: "{your-password}",
          linuxConfiguration: {
            provisionVMAgent: true,
            patchSettings: {
              patchMode: "AutomaticByPlatform",
              assessmentMode: "AutomaticByPlatform",
            },
          },
        },
        networkProfile: {
          networkInterfaces: [
            {
              id: "/subscriptions/{subscription-id}/resourceGroups/myResourceGroup/providers/Microsoft.Network/networkInterfaces/{existing-nic-name}",
              properties: { primary: true },
            },
          ],
        },
      },
    }),
    dependencies: ({}) => ({
      resourceGroup: "myResourceGroup",
      disks: ["myDisk"],
      managedIdentities: ["myUserAssignedIdentity"],
      sshPublicKeys: ["mySshPublicKey"],
      galleryImage: "myGalleryImage",
      networkSecurityGroups: ["myNetworkSecurityGroup"],
      proximityPlacementGroup: "myProximityPlacementGroup",
      dedicatedHostGroup: "myDedicatedHostGroup",
      capacityReservationGroup: "myCapacityReservationGroup",
      networkInterfaces: ["myNetworkInterface"],
      availabilitySet: "myAvailabilitySet",
      virtualMachineScaleSet: "myVirtualMachineScaleSet",
      virtualMachineScaleSetVm: "myVirtualMachineScaleSetVM",
    }),
  },
];

```

### Create a Linux vm with a patch setting patchMode of ImageDefault.
```js
exports.createResources = () => [
  {
    type: "VirtualMachine",
    group: "Compute",
    name: "myVirtualMachine",
    properties: () => ({
      location: "westus",
      properties: {
        hardwareProfile: { vmSize: "Standard_D2s_v3" },
        storageProfile: {
          imageReference: {
            sku: "16.04-LTS",
            publisher: "Canonical",
            version: "latest",
            offer: "UbuntuServer",
          },
          osDisk: {
            caching: "ReadWrite",
            managedDisk: { storageAccountType: "Premium_LRS" },
            name: "myVMosdisk",
            createOption: "FromImage",
          },
        },
        osProfile: {
          adminUsername: "{your-username}",
          computerName: "myVM",
          adminPassword: "{your-password}",
          linuxConfiguration: {
            provisionVMAgent: true,
            patchSettings: { patchMode: "ImageDefault" },
          },
        },
        networkProfile: {
          networkInterfaces: [
            {
              id: "/subscriptions/{subscription-id}/resourceGroups/myResourceGroup/providers/Microsoft.Network/networkInterfaces/{existing-nic-name}",
              properties: { primary: true },
            },
          ],
        },
      },
    }),
    dependencies: ({}) => ({
      resourceGroup: "myResourceGroup",
      disks: ["myDisk"],
      managedIdentities: ["myUserAssignedIdentity"],
      sshPublicKeys: ["mySshPublicKey"],
      galleryImage: "myGalleryImage",
      networkSecurityGroups: ["myNetworkSecurityGroup"],
      proximityPlacementGroup: "myProximityPlacementGroup",
      dedicatedHostGroup: "myDedicatedHostGroup",
      capacityReservationGroup: "myCapacityReservationGroup",
      networkInterfaces: ["myNetworkInterface"],
      availabilitySet: "myAvailabilitySet",
      virtualMachineScaleSet: "myVirtualMachineScaleSet",
      virtualMachineScaleSetVm: "myVirtualMachineScaleSetVM",
    }),
  },
];

```

### Create a Linux vm with a patch setting assessmentMode of ImageDefault.
```js
exports.createResources = () => [
  {
    type: "VirtualMachine",
    group: "Compute",
    name: "myVirtualMachine",
    properties: () => ({
      location: "westus",
      properties: {
        hardwareProfile: { vmSize: "Standard_D2s_v3" },
        storageProfile: {
          imageReference: {
            sku: "16.04-LTS",
            publisher: "Canonical",
            version: "latest",
            offer: "UbuntuServer",
          },
          osDisk: {
            caching: "ReadWrite",
            managedDisk: { storageAccountType: "Premium_LRS" },
            name: "myVMosdisk",
            createOption: "FromImage",
          },
        },
        osProfile: {
          adminUsername: "{your-username}",
          computerName: "myVM",
          adminPassword: "{your-password}",
          linuxConfiguration: {
            provisionVMAgent: true,
            patchSettings: { assessmentMode: "ImageDefault" },
          },
        },
        networkProfile: {
          networkInterfaces: [
            {
              id: "/subscriptions/{subscription-id}/resourceGroups/myResourceGroup/providers/Microsoft.Network/networkInterfaces/{existing-nic-name}",
              properties: { primary: true },
            },
          ],
        },
      },
    }),
    dependencies: ({}) => ({
      resourceGroup: "myResourceGroup",
      disks: ["myDisk"],
      managedIdentities: ["myUserAssignedIdentity"],
      sshPublicKeys: ["mySshPublicKey"],
      galleryImage: "myGalleryImage",
      networkSecurityGroups: ["myNetworkSecurityGroup"],
      proximityPlacementGroup: "myProximityPlacementGroup",
      dedicatedHostGroup: "myDedicatedHostGroup",
      capacityReservationGroup: "myCapacityReservationGroup",
      networkInterfaces: ["myNetworkInterface"],
      availabilitySet: "myAvailabilitySet",
      virtualMachineScaleSet: "myVirtualMachineScaleSet",
      virtualMachineScaleSetVm: "myVirtualMachineScaleSetVM",
    }),
  },
];

```

### Create a vm with an extensions time budget.
```js
exports.createResources = () => [
  {
    type: "VirtualMachine",
    group: "Compute",
    name: "myVirtualMachine",
    properties: () => ({
      location: "westus",
      properties: {
        hardwareProfile: { vmSize: "Standard_D1_v2" },
        storageProfile: {
          imageReference: {
            sku: "2016-Datacenter",
            publisher: "MicrosoftWindowsServer",
            version: "latest",
            offer: "WindowsServer",
          },
          osDisk: {
            caching: "ReadWrite",
            managedDisk: { storageAccountType: "Standard_LRS" },
            name: "myVMosdisk",
            createOption: "FromImage",
          },
        },
        networkProfile: {
          networkInterfaces: [
            {
              id: "/subscriptions/{subscription-id}/resourceGroups/myResourceGroup/providers/Microsoft.Network/networkInterfaces/{existing-nic-name}",
              properties: { primary: true },
            },
          ],
        },
        osProfile: {
          adminUsername: "{your-username}",
          computerName: "myVM",
          adminPassword: "{your-password}",
        },
        diagnosticsProfile: {
          bootDiagnostics: {
            storageUri:
              "http://{existing-storage-account-name}.blob.core.windows.net",
            enabled: true,
          },
        },
        extensionsTimeBudget: "PT30M",
      },
    }),
    dependencies: ({}) => ({
      resourceGroup: "myResourceGroup",
      disks: ["myDisk"],
      managedIdentities: ["myUserAssignedIdentity"],
      sshPublicKeys: ["mySshPublicKey"],
      galleryImage: "myGalleryImage",
      networkSecurityGroups: ["myNetworkSecurityGroup"],
      proximityPlacementGroup: "myProximityPlacementGroup",
      dedicatedHostGroup: "myDedicatedHostGroup",
      capacityReservationGroup: "myCapacityReservationGroup",
      networkInterfaces: ["myNetworkInterface"],
      availabilitySet: "myAvailabilitySet",
      virtualMachineScaleSet: "myVirtualMachineScaleSet",
      virtualMachineScaleSetVm: "myVirtualMachineScaleSetVM",
    }),
  },
];

```

### Create a VM with Uefi Settings of secureBoot and vTPM.
```js
exports.createResources = () => [
  {
    type: "VirtualMachine",
    group: "Compute",
    name: "myVirtualMachine",
    properties: () => ({
      location: "westus",
      properties: {
        hardwareProfile: { vmSize: "Standard_D2s_v3" },
        securityProfile: {
          uefiSettings: { secureBootEnabled: true, vTpmEnabled: true },
          securityType: "TrustedLaunch",
        },
        storageProfile: {
          imageReference: {
            sku: "windows10-tvm",
            publisher: "MicrosoftWindowsServer",
            version: "18363.592.2001092016",
            offer: "windowsserver-gen2preview-preview",
          },
          osDisk: {
            caching: "ReadOnly",
            managedDisk: { storageAccountType: "StandardSSD_LRS" },
            createOption: "FromImage",
            name: "myVMosdisk",
          },
        },
        osProfile: {
          adminUsername: "{your-username}",
          computerName: "myVM",
          adminPassword: "{your-password}",
        },
        networkProfile: {
          networkInterfaces: [
            {
              id: "/subscriptions/{subscription-id}/resourceGroups/myResourceGroup/providers/Microsoft.Network/networkInterfaces/{existing-nic-name}",
              properties: { primary: true },
            },
          ],
        },
      },
    }),
    dependencies: ({}) => ({
      resourceGroup: "myResourceGroup",
      disks: ["myDisk"],
      managedIdentities: ["myUserAssignedIdentity"],
      sshPublicKeys: ["mySshPublicKey"],
      galleryImage: "myGalleryImage",
      networkSecurityGroups: ["myNetworkSecurityGroup"],
      proximityPlacementGroup: "myProximityPlacementGroup",
      dedicatedHostGroup: "myDedicatedHostGroup",
      capacityReservationGroup: "myCapacityReservationGroup",
      networkInterfaces: ["myNetworkInterface"],
      availabilitySet: "myAvailabilitySet",
      virtualMachineScaleSet: "myVirtualMachineScaleSet",
      virtualMachineScaleSetVm: "myVirtualMachineScaleSetVM",
    }),
  },
];

```

### Create a vm from a generalized shared image.
```js
exports.createResources = () => [
  {
    type: "VirtualMachine",
    group: "Compute",
    name: "myVirtualMachine",
    properties: () => ({
      location: "westus",
      properties: {
        hardwareProfile: { vmSize: "Standard_D1_v2" },
        storageProfile: {
          imageReference: {
            id: "/subscriptions/{subscription-id}/resourceGroups/myResourceGroup/providers/Microsoft.Compute/galleries/mySharedGallery/images/mySharedImage",
          },
          osDisk: {
            caching: "ReadWrite",
            managedDisk: { storageAccountType: "Standard_LRS" },
            name: "myVMosdisk",
            createOption: "FromImage",
          },
        },
        osProfile: {
          adminUsername: "{your-username}",
          computerName: "myVM",
          adminPassword: "{your-password}",
        },
        networkProfile: {
          networkInterfaces: [
            {
              id: "/subscriptions/{subscription-id}/resourceGroups/myResourceGroup/providers/Microsoft.Network/networkInterfaces/{existing-nic-name}",
              properties: { primary: true },
            },
          ],
        },
      },
    }),
    dependencies: ({}) => ({
      resourceGroup: "myResourceGroup",
      disks: ["myDisk"],
      managedIdentities: ["myUserAssignedIdentity"],
      sshPublicKeys: ["mySshPublicKey"],
      galleryImage: "myGalleryImage",
      networkSecurityGroups: ["myNetworkSecurityGroup"],
      proximityPlacementGroup: "myProximityPlacementGroup",
      dedicatedHostGroup: "myDedicatedHostGroup",
      capacityReservationGroup: "myCapacityReservationGroup",
      networkInterfaces: ["myNetworkInterface"],
      availabilitySet: "myAvailabilitySet",
      virtualMachineScaleSet: "myVirtualMachineScaleSet",
      virtualMachineScaleSetVm: "myVirtualMachineScaleSetVM",
    }),
  },
];

```

### Create a vm from a specialized shared image.
```js
exports.createResources = () => [
  {
    type: "VirtualMachine",
    group: "Compute",
    name: "myVirtualMachine",
    properties: () => ({
      location: "westus",
      properties: {
        hardwareProfile: { vmSize: "Standard_D1_v2" },
        storageProfile: {
          imageReference: {
            id: "/subscriptions/{subscription-id}/resourceGroups/myResourceGroup/providers/Microsoft.Compute/galleries/mySharedGallery/images/mySharedImage",
          },
          osDisk: {
            caching: "ReadWrite",
            managedDisk: { storageAccountType: "Standard_LRS" },
            name: "myVMosdisk",
            createOption: "FromImage",
          },
        },
        networkProfile: {
          networkInterfaces: [
            {
              id: "/subscriptions/{subscription-id}/resourceGroups/myResourceGroup/providers/Microsoft.Network/networkInterfaces/{existing-nic-name}",
              properties: { primary: true },
            },
          ],
        },
      },
    }),
    dependencies: ({}) => ({
      resourceGroup: "myResourceGroup",
      disks: ["myDisk"],
      managedIdentities: ["myUserAssignedIdentity"],
      sshPublicKeys: ["mySshPublicKey"],
      galleryImage: "myGalleryImage",
      networkSecurityGroups: ["myNetworkSecurityGroup"],
      proximityPlacementGroup: "myProximityPlacementGroup",
      dedicatedHostGroup: "myDedicatedHostGroup",
      capacityReservationGroup: "myCapacityReservationGroup",
      networkInterfaces: ["myNetworkInterface"],
      availabilitySet: "myAvailabilitySet",
      virtualMachineScaleSet: "myVirtualMachineScaleSet",
      virtualMachineScaleSetVm: "myVirtualMachineScaleSetVM",
    }),
  },
];

```

### Create a VM with network interface configuration
```js
exports.createResources = () => [
  {
    type: "VirtualMachine",
    group: "Compute",
    name: "myVirtualMachine",
    properties: () => ({
      location: "westus",
      properties: {
        hardwareProfile: { vmSize: "Standard_D1_v2" },
        storageProfile: {
          imageReference: {
            sku: "2016-Datacenter",
            publisher: "MicrosoftWindowsServer",
            version: "latest",
            offer: "WindowsServer",
          },
          osDisk: {
            caching: "ReadWrite",
            managedDisk: { storageAccountType: "Standard_LRS" },
            name: "myVMosdisk",
            createOption: "FromImage",
          },
        },
        networkProfile: {
          networkApiVersion: "2020-11-01",
          networkInterfaceConfigurations: [
            {
              name: "{nic-config-name}",
              properties: {
                primary: true,
                deleteOption: "Delete",
                ipConfigurations: [
                  {
                    name: "{ip-config-name}",
                    properties: {
                      primary: true,
                      publicIPAddressConfiguration: {
                        name: "{publicIP-config-name}",
                        sku: { name: "Basic", tier: "Global" },
                        properties: {
                          deleteOption: "Detach",
                          publicIPAllocationMethod: "Static",
                        },
                      },
                    },
                  },
                ],
              },
            },
          ],
        },
        osProfile: {
          adminUsername: "{your-username}",
          computerName: "myVM",
          adminPassword: "{your-password}",
        },
      },
    }),
    dependencies: ({}) => ({
      resourceGroup: "myResourceGroup",
      disks: ["myDisk"],
      managedIdentities: ["myUserAssignedIdentity"],
      sshPublicKeys: ["mySshPublicKey"],
      galleryImage: "myGalleryImage",
      networkSecurityGroups: ["myNetworkSecurityGroup"],
      proximityPlacementGroup: "myProximityPlacementGroup",
      dedicatedHostGroup: "myDedicatedHostGroup",
      capacityReservationGroup: "myCapacityReservationGroup",
      networkInterfaces: ["myNetworkInterface"],
      availabilitySet: "myAvailabilitySet",
      virtualMachineScaleSet: "myVirtualMachineScaleSet",
      virtualMachineScaleSetVm: "myVirtualMachineScaleSetVM",
    }),
  },
];

```

### Create a VM with UserData
```js
exports.createResources = () => [
  {
    type: "VirtualMachine",
    group: "Compute",
    name: "myVirtualMachine",
    properties: () => ({
      location: "westus",
      properties: {
        hardwareProfile: { vmSize: "Standard_D1_v2" },
        storageProfile: {
          imageReference: {
            sku: "2016-Datacenter",
            publisher: "MicrosoftWindowsServer",
            version: "latest",
            offer: "WindowsServer",
          },
          osDisk: {
            caching: "ReadWrite",
            managedDisk: { storageAccountType: "Standard_LRS" },
            name: "vmOSdisk",
            createOption: "FromImage",
          },
        },
        networkProfile: {
          networkInterfaces: [
            {
              id: "/subscriptions/{subscription-id}/resourceGroups/myResourceGroup/providers/Microsoft.Network/networkInterfaces/{existing-nic-name}",
              properties: { primary: true },
            },
          ],
        },
        osProfile: {
          adminUsername: "{your-username}",
          computerName: "{vm-name}",
          adminPassword: "{your-password}",
        },
        diagnosticsProfile: {
          bootDiagnostics: {
            storageUri:
              "http://{existing-storage-account-name}.blob.core.windows.net",
            enabled: true,
          },
        },
        userData: "RXhhbXBsZSBVc2VyRGF0YQ==",
      },
    }),
    dependencies: ({}) => ({
      resourceGroup: "myResourceGroup",
      disks: ["myDisk"],
      managedIdentities: ["myUserAssignedIdentity"],
      sshPublicKeys: ["mySshPublicKey"],
      galleryImage: "myGalleryImage",
      networkSecurityGroups: ["myNetworkSecurityGroup"],
      proximityPlacementGroup: "myProximityPlacementGroup",
      dedicatedHostGroup: "myDedicatedHostGroup",
      capacityReservationGroup: "myCapacityReservationGroup",
      networkInterfaces: ["myNetworkInterface"],
      availabilitySet: "myAvailabilitySet",
      virtualMachineScaleSet: "myVirtualMachineScaleSet",
      virtualMachineScaleSetVm: "myVirtualMachineScaleSetVM",
    }),
  },
];

```

### Create a vm with Application Profile.
```js
exports.createResources = () => [
  {
    type: "VirtualMachine",
    group: "Compute",
    name: "myVirtualMachine",
    properties: () => ({
      location: "westus",
      properties: {
        hardwareProfile: { vmSize: "Standard_D1_v2" },
        storageProfile: {
          imageReference: {
            sku: "{image_sku}",
            publisher: "{image_publisher}",
            version: "latest",
            offer: "{image_offer}",
          },
          osDisk: {
            caching: "ReadWrite",
            managedDisk: { storageAccountType: "Standard_LRS" },
            name: "myVMosdisk",
            createOption: "FromImage",
          },
        },
        applicationProfile: {
          galleryApplications: [
            {
              tags: "myTag1",
              order: 1,
              packageReferenceId:
                "/subscriptions/32c17a9e-aa7b-4ba5-a45b-e324116b6fdb/resourceGroups/myresourceGroupName2/providers/Microsoft.Compute/galleries/myGallery1/applications/MyApplication1/versions/1.0",
              configurationReference:
                "https://mystorageaccount.blob.core.windows.net/configurations/settings.config",
            },
            {
              packageReferenceId:
                "/subscriptions/32c17a9e-aa7b-4ba5-a45b-e324116b6fdg/resourceGroups/myresourceGroupName3/providers/Microsoft.Compute/galleries/myGallery2/applications/MyApplication2/versions/1.1",
            },
          ],
        },
        osProfile: {
          adminUsername: "{your-username}",
          computerName: "myVM",
          adminPassword: "{your-password}",
        },
        networkProfile: {
          networkInterfaces: [
            {
              id: "/subscriptions/{subscription-id}/resourceGroups/myResourceGroup/providers/Microsoft.Network/networkInterfaces/{existing-nic-name}",
              properties: { primary: true },
            },
          ],
        },
      },
    }),
    dependencies: ({}) => ({
      resourceGroup: "myResourceGroup",
      disks: ["myDisk"],
      managedIdentities: ["myUserAssignedIdentity"],
      sshPublicKeys: ["mySshPublicKey"],
      galleryImage: "myGalleryImage",
      networkSecurityGroups: ["myNetworkSecurityGroup"],
      proximityPlacementGroup: "myProximityPlacementGroup",
      dedicatedHostGroup: "myDedicatedHostGroup",
      capacityReservationGroup: "myCapacityReservationGroup",
      networkInterfaces: ["myNetworkInterface"],
      availabilitySet: "myAvailabilitySet",
      virtualMachineScaleSet: "myVirtualMachineScaleSet",
      virtualMachineScaleSetVm: "myVirtualMachineScaleSetVM",
    }),
  },
];

```

### Create a VM with HibernationEnabled
```js
exports.createResources = () => [
  {
    type: "VirtualMachine",
    group: "Compute",
    name: "myVirtualMachine",
    properties: () => ({
      location: "eastus2euap",
      properties: {
        hardwareProfile: { vmSize: "Standard_D2s_v3" },
        additionalCapabilities: { hibernationEnabled: true },
        storageProfile: {
          imageReference: {
            publisher: "MicrosoftWindowsServer",
            offer: "WindowsServer",
            sku: "2019-Datacenter",
            version: "latest",
          },
          osDisk: {
            caching: "ReadWrite",
            managedDisk: { storageAccountType: "Standard_LRS" },
            name: "vmOSdisk",
            createOption: "FromImage",
          },
        },
        networkProfile: {
          networkInterfaces: [
            {
              id: "/subscriptions/{subscription-id}/resourceGroups/myResourceGroup/providers/Microsoft.Network/networkInterfaces/{existing-nic-name}",
              properties: { primary: true },
            },
          ],
        },
        osProfile: {
          adminUsername: "{your-username}",
          computerName: "{vm-name}",
          adminPassword: "{your-password}",
        },
        diagnosticsProfile: {
          bootDiagnostics: {
            storageUri:
              "http://{existing-storage-account-name}.blob.core.windows.net",
            enabled: true,
          },
        },
      },
    }),
    dependencies: ({}) => ({
      resourceGroup: "myResourceGroup",
      disks: ["myDisk"],
      managedIdentities: ["myUserAssignedIdentity"],
      sshPublicKeys: ["mySshPublicKey"],
      galleryImage: "myGalleryImage",
      networkSecurityGroups: ["myNetworkSecurityGroup"],
      proximityPlacementGroup: "myProximityPlacementGroup",
      dedicatedHostGroup: "myDedicatedHostGroup",
      capacityReservationGroup: "myCapacityReservationGroup",
      networkInterfaces: ["myNetworkInterface"],
      availabilitySet: "myAvailabilitySet",
      virtualMachineScaleSet: "myVirtualMachineScaleSet",
      virtualMachineScaleSetVm: "myVirtualMachineScaleSetVM",
    }),
  },
];

```

### Create a VM with VM Size Properties
```js
exports.createResources = () => [
  {
    type: "VirtualMachine",
    group: "Compute",
    name: "myVirtualMachine",
    properties: () => ({
      location: "westus",
      properties: {
        hardwareProfile: {
          vmSize: "Standard_D4_v3",
          vmSizeProperties: { vCPUsAvailable: 1, vCPUsPerCore: 1 },
        },
        storageProfile: {
          imageReference: {
            sku: "2016-Datacenter",
            publisher: "MicrosoftWindowsServer",
            version: "latest",
            offer: "WindowsServer",
          },
          osDisk: {
            caching: "ReadWrite",
            managedDisk: { storageAccountType: "Standard_LRS" },
            name: "myVMosdisk",
            createOption: "FromImage",
          },
        },
        networkProfile: {
          networkInterfaces: [
            {
              id: "/subscriptions/{subscription-id}/resourceGroups/myResourceGroup/providers/Microsoft.Network/networkInterfaces/{existing-nic-name}",
              properties: { primary: true },
            },
          ],
        },
        osProfile: {
          adminUsername: "{your-username}",
          computerName: "myVM",
          adminPassword: "{your-password}",
        },
        diagnosticsProfile: {
          bootDiagnostics: {
            storageUri:
              "http://{existing-storage-account-name}.blob.core.windows.net",
            enabled: true,
          },
        },
        userData: "U29tZSBDdXN0b20gRGF0YQ==",
      },
    }),
    dependencies: ({}) => ({
      resourceGroup: "myResourceGroup",
      disks: ["myDisk"],
      managedIdentities: ["myUserAssignedIdentity"],
      sshPublicKeys: ["mySshPublicKey"],
      galleryImage: "myGalleryImage",
      networkSecurityGroups: ["myNetworkSecurityGroup"],
      proximityPlacementGroup: "myProximityPlacementGroup",
      dedicatedHostGroup: "myDedicatedHostGroup",
      capacityReservationGroup: "myCapacityReservationGroup",
      networkInterfaces: ["myNetworkInterface"],
      availabilitySet: "myAvailabilitySet",
      virtualMachineScaleSet: "myVirtualMachineScaleSet",
      virtualMachineScaleSetVm: "myVirtualMachineScaleSetVM",
    }),
  },
];

```

### Create or update a VM with capacity reservation
```js
exports.createResources = () => [
  {
    type: "VirtualMachine",
    group: "Compute",
    name: "myVirtualMachine",
    properties: () => ({
      location: "westus",
      plan: {
        publisher: "microsoft-ads",
        product: "windows-data-science-vm",
        name: "windows2016",
      },
      properties: {
        hardwareProfile: { vmSize: "Standard_DS1_v2" },
        storageProfile: {
          imageReference: {
            sku: "windows2016",
            publisher: "microsoft-ads",
            version: "latest",
            offer: "windows-data-science-vm",
          },
          osDisk: {
            caching: "ReadOnly",
            managedDisk: { storageAccountType: "Standard_LRS" },
            createOption: "FromImage",
            name: "myVMosdisk",
          },
        },
        capacityReservation: {
          capacityReservationGroup: {
            id: "/subscriptions/{subscription-id}/resourceGroups/myResourceGroup/providers/Microsoft.Compute/CapacityReservationGroups/{crgName}",
          },
        },
        osProfile: {
          adminUsername: "{your-username}",
          computerName: "myVM",
          adminPassword: "{your-password}",
        },
        networkProfile: {
          networkInterfaces: [
            {
              id: "/subscriptions/{subscription-id}/resourceGroups/myResourceGroup/providers/Microsoft.Network/networkInterfaces/{existing-nic-name}",
              properties: { primary: true },
            },
          ],
        },
      },
    }),
    dependencies: ({}) => ({
      resourceGroup: "myResourceGroup",
      disks: ["myDisk"],
      managedIdentities: ["myUserAssignedIdentity"],
      sshPublicKeys: ["mySshPublicKey"],
      galleryImage: "myGalleryImage",
      networkSecurityGroups: ["myNetworkSecurityGroup"],
      proximityPlacementGroup: "myProximityPlacementGroup",
      dedicatedHostGroup: "myDedicatedHostGroup",
      capacityReservationGroup: "myCapacityReservationGroup",
      networkInterfaces: ["myNetworkInterface"],
      availabilitySet: "myAvailabilitySet",
      virtualMachineScaleSet: "myVirtualMachineScaleSet",
      virtualMachineScaleSetVm: "myVirtualMachineScaleSetVM",
    }),
  },
];

```

### Create a VM from a shared gallery image
```js
exports.createResources = () => [
  {
    type: "VirtualMachine",
    group: "Compute",
    name: "myVirtualMachine",
    properties: () => ({
      location: "westus",
      properties: {
        hardwareProfile: { vmSize: "Standard_D1_v2" },
        storageProfile: {
          imageReference: {
            sharedGalleryImageId:
              "/SharedGalleries/sharedGalleryName/Images/sharedGalleryImageName/Versions/sharedGalleryImageVersionName",
          },
          osDisk: {
            caching: "ReadWrite",
            managedDisk: { storageAccountType: "Standard_LRS" },
            name: "myVMosdisk",
            createOption: "FromImage",
          },
        },
        osProfile: {
          adminUsername: "{your-username}",
          computerName: "myVM",
          adminPassword: "{your-password}",
        },
        networkProfile: {
          networkInterfaces: [
            {
              id: "/subscriptions/{subscription-id}/resourceGroups/myResourceGroup/providers/Microsoft.Network/networkInterfaces/{existing-nic-name}",
              properties: { primary: true },
            },
          ],
        },
      },
    }),
    dependencies: ({}) => ({
      resourceGroup: "myResourceGroup",
      disks: ["myDisk"],
      managedIdentities: ["myUserAssignedIdentity"],
      sshPublicKeys: ["mySshPublicKey"],
      galleryImage: "myGalleryImage",
      networkSecurityGroups: ["myNetworkSecurityGroup"],
      proximityPlacementGroup: "myProximityPlacementGroup",
      dedicatedHostGroup: "myDedicatedHostGroup",
      capacityReservationGroup: "myCapacityReservationGroup",
      networkInterfaces: ["myNetworkInterface"],
      availabilitySet: "myAvailabilitySet",
      virtualMachineScaleSet: "myVirtualMachineScaleSet",
      virtualMachineScaleSetVm: "myVirtualMachineScaleSetVM",
    }),
  },
];

```

### Create a VM from a community gallery image
```js
exports.createResources = () => [
  {
    type: "VirtualMachine",
    group: "Compute",
    name: "myVirtualMachine",
    properties: () => ({
      location: "westus",
      properties: {
        hardwareProfile: { vmSize: "Standard_D1_v2" },
        storageProfile: {
          imageReference: {
            communityGalleryImageId:
              "/CommunityGalleries/galleryPublicName/Images/communityGalleryImageName/Versions/communityGalleryImageVersionName",
          },
          osDisk: {
            caching: "ReadWrite",
            managedDisk: { storageAccountType: "Standard_LRS" },
            name: "myVMosdisk",
            createOption: "FromImage",
          },
        },
        osProfile: {
          adminUsername: "{your-username}",
          computerName: "myVM",
          adminPassword: "{your-password}",
        },
        networkProfile: {
          networkInterfaces: [
            {
              id: "/subscriptions/{subscription-id}/resourceGroups/myResourceGroup/providers/Microsoft.Network/networkInterfaces/{existing-nic-name}",
              properties: { primary: true },
            },
          ],
        },
      },
    }),
    dependencies: ({}) => ({
      resourceGroup: "myResourceGroup",
      disks: ["myDisk"],
      managedIdentities: ["myUserAssignedIdentity"],
      sshPublicKeys: ["mySshPublicKey"],
      galleryImage: "myGalleryImage",
      networkSecurityGroups: ["myNetworkSecurityGroup"],
      proximityPlacementGroup: "myProximityPlacementGroup",
      dedicatedHostGroup: "myDedicatedHostGroup",
      capacityReservationGroup: "myCapacityReservationGroup",
      networkInterfaces: ["myNetworkInterface"],
      availabilitySet: "myAvailabilitySet",
      virtualMachineScaleSet: "myVirtualMachineScaleSet",
      virtualMachineScaleSetVm: "myVirtualMachineScaleSetVM",
    }),
  },
];

```

### Create a VM with securityType ConfidentialVM with Platform Managed Keys
```js
exports.createResources = () => [
  {
    type: "VirtualMachine",
    group: "Compute",
    name: "myVirtualMachine",
    properties: () => ({
      location: "westus",
      properties: {
        hardwareProfile: { vmSize: "Standard_DC2as_v5" },
        securityProfile: {
          uefiSettings: { secureBootEnabled: true, vTpmEnabled: true },
          securityType: "ConfidentialVM",
        },
        storageProfile: {
          imageReference: {
            sku: "windows-cvm",
            publisher: "MicrosoftWindowsServer",
            version: "17763.2183.2109130127",
            offer: "2019-datacenter-cvm",
          },
          osDisk: {
            caching: "ReadOnly",
            managedDisk: {
              storageAccountType: "StandardSSD_LRS",
              securityProfile: {
                securityEncryptionType: "DiskWithVMGuestState",
              },
            },
            createOption: "FromImage",
            name: "myVMosdisk",
          },
        },
        osProfile: {
          adminUsername: "{your-username}",
          computerName: "myVM",
          adminPassword: "{your-password}",
        },
        networkProfile: {
          networkInterfaces: [
            {
              id: "/subscriptions/{subscription-id}/resourceGroups/myResourceGroup/providers/Microsoft.Network/networkInterfaces/{existing-nic-name}",
              properties: { primary: true },
            },
          ],
        },
      },
    }),
    dependencies: ({}) => ({
      resourceGroup: "myResourceGroup",
      disks: ["myDisk"],
      managedIdentities: ["myUserAssignedIdentity"],
      sshPublicKeys: ["mySshPublicKey"],
      galleryImage: "myGalleryImage",
      networkSecurityGroups: ["myNetworkSecurityGroup"],
      proximityPlacementGroup: "myProximityPlacementGroup",
      dedicatedHostGroup: "myDedicatedHostGroup",
      capacityReservationGroup: "myCapacityReservationGroup",
      networkInterfaces: ["myNetworkInterface"],
      availabilitySet: "myAvailabilitySet",
      virtualMachineScaleSet: "myVirtualMachineScaleSet",
      virtualMachineScaleSetVm: "myVirtualMachineScaleSetVM",
    }),
  },
];

```

### Create a VM with securityType ConfidentialVM with Customer Managed Keys
```js
exports.createResources = () => [
  {
    type: "VirtualMachine",
    group: "Compute",
    name: "myVirtualMachine",
    properties: () => ({
      location: "westus",
      properties: {
        hardwareProfile: { vmSize: "Standard_DC2as_v5" },
        securityProfile: {
          uefiSettings: { secureBootEnabled: true, vTpmEnabled: true },
          securityType: "ConfidentialVM",
        },
        storageProfile: {
          imageReference: {
            sku: "windows-cvm",
            publisher: "MicrosoftWindowsServer",
            version: "17763.2183.2109130127",
            offer: "2019-datacenter-cvm",
          },
          osDisk: {
            caching: "ReadOnly",
            managedDisk: {
              storageAccountType: "StandardSSD_LRS",
              securityProfile: {
                securityEncryptionType: "DiskWithVMGuestState",
                diskEncryptionSet: {
                  id: "/subscriptions/{subscription-id}/resourceGroups/myResourceGroup/providers/Microsoft.Compute/diskEncryptionSets/{existing-diskEncryptionSet-name}",
                },
              },
            },
            createOption: "FromImage",
            name: "myVMosdisk",
          },
        },
        osProfile: {
          adminUsername: "{your-username}",
          computerName: "myVM",
          adminPassword: "{your-password}",
        },
        networkProfile: {
          networkInterfaces: [
            {
              id: "/subscriptions/{subscription-id}/resourceGroups/myResourceGroup/providers/Microsoft.Network/networkInterfaces/{existing-nic-name}",
              properties: { primary: true },
            },
          ],
        },
      },
    }),
    dependencies: ({}) => ({
      resourceGroup: "myResourceGroup",
      disks: ["myDisk"],
      managedIdentities: ["myUserAssignedIdentity"],
      sshPublicKeys: ["mySshPublicKey"],
      galleryImage: "myGalleryImage",
      networkSecurityGroups: ["myNetworkSecurityGroup"],
      proximityPlacementGroup: "myProximityPlacementGroup",
      dedicatedHostGroup: "myDedicatedHostGroup",
      capacityReservationGroup: "myCapacityReservationGroup",
      networkInterfaces: ["myNetworkInterface"],
      availabilitySet: "myAvailabilitySet",
      virtualMachineScaleSet: "myVirtualMachineScaleSet",
      virtualMachineScaleSetVm: "myVirtualMachineScaleSetVM",
    }),
  },
];

```
## Dependencies
- [ResourceGroup](../Resources/ResourceGroup.md)
- [Disk](../Compute/Disk.md)
- [UserAssignedIdentity](../ManagedIdentity/UserAssignedIdentity.md)
- [SshPublicKey](../Compute/SshPublicKey.md)
- [GalleryImage](../Compute/GalleryImage.md)
- [NetworkSecurityGroup](../Network/NetworkSecurityGroup.md)
- [ProximityPlacementGroup](../Compute/ProximityPlacementGroup.md)
- [DedicatedHostGroup](../Compute/DedicatedHostGroup.md)
- [CapacityReservationGroup](../Compute/CapacityReservationGroup.md)
- [NetworkInterface](../Network/NetworkInterface.md)
- [AvailabilitySet](../Compute/AvailabilitySet.md)
- [VirtualMachineScaleSet](../Compute/VirtualMachineScaleSet.md)
- [VirtualMachineScaleSetVM](../Compute/VirtualMachineScaleSetVM.md)
## Swagger Schema
```js
{
  properties: {
    plan: {
      description: 'Specifies information about the marketplace image used to create the virtual machine. This element is only used for marketplace images. Before you can use a marketplace image from an API, you must enable the image for programmatic use.  In the Azure portal, find the marketplace image that you want to use and then click **Want to deploy programmatically, Get Started ->**. Enter any required information and then click **Save**.',
      properties: {
        name: { type: 'string', description: 'The plan ID.' },
        publisher: { type: 'string', description: 'The publisher ID.' },
        product: {
          type: 'string',
          description: 'Specifies the product of the image from the marketplace. This is the same value as Offer under the imageReference element.'
        },
        promotionCode: { type: 'string', description: 'The promotion code.' }
      }
    },
    properties: {
      'x-ms-client-flatten': true,
      properties: {
        hardwareProfile: {
          description: 'Specifies the hardware settings for the virtual machine.',
          properties: {
            vmSize: {
              type: 'string',
              description: 'Specifies the size of the virtual machine. <br><br> The enum data type is currently deprecated and will be removed by December 23rd 2023. <br><br> Recommended way to get the list of available sizes is using these APIs: <br><br> [List all available virtual machine sizes in an availability set](https://docs.microsoft.com/rest/api/compute/availabilitysets/listavailablesizes) <br><br> [List all available virtual machine sizes in a region]( https://docs.microsoft.com/rest/api/compute/resourceskus/list) <br><br> [List all available virtual machine sizes for resizing](https://docs.microsoft.com/rest/api/compute/virtualmachines/listavailablesizes). For more information about virtual machine sizes, see [Sizes for virtual machines](https://docs.microsoft.com/azure/virtual-machines/sizes). <br><br> The available VM sizes depend on region and availability set.',
              enum: [
                'Basic_A0',
                'Basic_A1',
                'Basic_A2',
                'Basic_A3',
                'Basic_A4',
                'Standard_A0',
                'Standard_A1',
                'Standard_A2',
                'Standard_A3',
                'Standard_A4',
                'Standard_A5',
                'Standard_A6',
                'Standard_A7',
                'Standard_A8',
                'Standard_A9',
                'Standard_A10',
                'Standard_A11',
                'Standard_A1_v2',
                'Standard_A2_v2',
                'Standard_A4_v2',
                'Standard_A8_v2',
                'Standard_A2m_v2',
                'Standard_A4m_v2',
                'Standard_A8m_v2',
                'Standard_B1s',
                'Standard_B1ms',
                'Standard_B2s',
                'Standard_B2ms',
                'Standard_B4ms',
                'Standard_B8ms',
                'Standard_D1',
                'Standard_D2',
                'Standard_D3',
                'Standard_D4',
                'Standard_D11',
                'Standard_D12',
                'Standard_D13',
                'Standard_D14',
                'Standard_D1_v2',
                'Standard_D2_v2',
                'Standard_D3_v2',
                'Standard_D4_v2',
                'Standard_D5_v2',
                'Standard_D2_v3',
                'Standard_D4_v3',
                'Standard_D8_v3',
                'Standard_D16_v3',
                'Standard_D32_v3',
                'Standard_D64_v3',
                'Standard_D2s_v3',
                'Standard_D4s_v3',
                'Standard_D8s_v3',
                'Standard_D16s_v3',
                'Standard_D32s_v3',
                'Standard_D64s_v3',
                'Standard_D11_v2',
                'Standard_D12_v2',
                'Standard_D13_v2',
                'Standard_D14_v2',
                'Standard_D15_v2',
                'Standard_DS1',
                'Standard_DS2',
                'Standard_DS3',
                'Standard_DS4',
                'Standard_DS11',
                'Standard_DS12',
                'Standard_DS13',
                'Standard_DS14',
                'Standard_DS1_v2',
                'Standard_DS2_v2',
                'Standard_DS3_v2',
                'Standard_DS4_v2',
                'Standard_DS5_v2',
                'Standard_DS11_v2',
                'Standard_DS12_v2',
                'Standard_DS13_v2',
                'Standard_DS14_v2',
                'Standard_DS15_v2',
                'Standard_DS13-4_v2',
                'Standard_DS13-2_v2',
                'Standard_DS14-8_v2',
                'Standard_DS14-4_v2',
                'Standard_E2_v3',
                'Standard_E4_v3',
                'Standard_E8_v3',
                'Standard_E16_v3',
                'Standard_E32_v3',
                'Standard_E64_v3',
                'Standard_E2s_v3',
                'Standard_E4s_v3',
                'Standard_E8s_v3',
                'Standard_E16s_v3',
                'Standard_E32s_v3',
                'Standard_E64s_v3',
                'Standard_E32-16_v3',
                'Standard_E32-8s_v3',
                'Standard_E64-32s_v3',
                'Standard_E64-16s_v3',
                'Standard_F1',
                'Standard_F2',
                ... 66 more items
              ],
              'x-ms-enum': { name: 'VirtualMachineSizeTypes', modelAsString: true }
            },
            vmSizeProperties: {
              description: 'Specifies the properties for customizing the size of the virtual machine. Minimum api-version: 2021-07-01. <br><br> This feature is still in preview mode and is not supported for VirtualMachineScaleSet. <br><br> Please follow the instructions in [VM Customization](https://aka.ms/vmcustomization) for more details.',
              type: 'object',
              properties: {
                vCPUsAvailable: {
                  type: 'integer',
                  format: 'int32',
                  description: 'Specifies the number of vCPUs available for the VM. <br><br> When this property is not specified in the request body the default behavior is to set it to the value of vCPUs available for that VM size exposed in api response of [List all available virtual machine sizes in a region](https://docs.microsoft.com/en-us/rest/api/compute/resource-skus/list) .'
                },
                vCPUsPerCore: {
                  type: 'integer',
                  format: 'int32',
                  description: 'Specifies the vCPU to physical core ratio. <br><br> When this property is not specified in the request body the default behavior is set to the value of vCPUsPerCore for the VM Size exposed in api response of [List all available virtual machine sizes in a region](https://docs.microsoft.com/en-us/rest/api/compute/resource-skus/list) <br><br> Setting this property to 1 also means that hyper-threading is disabled.'
                }
              }
            }
          }
        },
        storageProfile: {
          description: 'Specifies the storage settings for the virtual machine disks.',
          properties: {
            imageReference: {
              description: 'Specifies information about the image to use. You can specify information about platform images, marketplace images, or virtual machine images. This element is required when you want to use a platform image, marketplace image, or virtual machine image, but is not used in other creation operations.',
              properties: {
                publisher: { type: 'string', description: 'The image publisher.' },
                offer: {
                  type: 'string',
                  description: 'Specifies the offer of the platform image or marketplace image used to create the virtual machine.'
                },
                sku: { type: 'string', description: 'The image SKU.' },
                version: {
                  type: 'string',
                  description: "Specifies the version of the platform image or marketplace image used to create the virtual machine. The allowed formats are Major.Minor.Build or 'latest'. Major, Minor, and Build are decimal numbers. Specify 'latest' to use the latest version of an image available at deploy time. Even if you use 'latest', the VM image will not automatically update after deploy time even if a new version becomes available. Please do not use field 'version' for gallery image deployment, gallery image should always use 'id' field for deployment, to use 'latest' version of gallery image, just set '/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Compute/galleries/{galleryName}/images/{imageName}' in the 'id' field without version input."
                },
                exactVersion: {
                  type: 'string',
                  readOnly: true,
                  description: "Specifies in decimal numbers, the version of platform image or marketplace image used to create the virtual machine. This readonly field differs from 'version', only if the value specified in 'version' field is 'latest'."
                },
                sharedGalleryImageId: {
                  type: 'string',
                  description: 'Specified the shared gallery image unique id for vm deployment. This can be fetched from shared gallery image GET call.'
                },
                communityGalleryImageId: {
                  type: 'string',
                  description: 'Specified the community gallery image unique id for vm deployment. This can be fetched from community gallery image GET call.'
                }
              },
              allOf: [
                {
                  properties: {
                    id: { type: 'string', description: 'Resource Id' }
                  },
                  'x-ms-azure-resource': true
                }
              ]
            },
            osDisk: {
              description: 'Specifies information about the operating system disk used by the virtual machine. <br><br> For more information about disks, see [About disks and VHDs for Azure virtual machines](https://docs.microsoft.com/azure/virtual-machines/managed-disks-overview).',
              properties: {
                osType: {
                  type: 'string',
                  description: 'This property allows you to specify the type of the OS that is included in the disk if creating a VM from user-image or a specialized VHD. <br><br> Possible values are: <br><br> **Windows** <br><br> **Linux**',
                  enum: [ 'Windows', 'Linux' ],
                  'x-ms-enum': {
                    name: 'OperatingSystemTypes',
                    modelAsString: false
                  }
                },
                encryptionSettings: {
                  description: 'Specifies the encryption settings for the OS Disk. <br><br> Minimum api-version: 2015-06-15',
                  properties: {
                    diskEncryptionKey: {
                      description: 'Specifies the location of the disk encryption key, which is a Key Vault Secret.',
                      properties: {
                        secretUrl: {
                          type: 'string',
                          description: 'The URL referencing a secret in a Key Vault.'
                        },
                        sourceVault: {
                          properties: {
                            id: {
                              type: 'string',
                              description: 'Resource Id'
                            }
                          },
                          'x-ms-azure-resource': true,
                          description: 'The relative URL of the Key Vault containing the secret.'
                        }
                      },
                      required: [ 'secretUrl', 'sourceVault' ]
                    },
                    keyEncryptionKey: {
                      description: 'Specifies the location of the key encryption key in Key Vault.',
                      properties: {
                        keyUrl: {
                          type: 'string',
                          description: 'The URL referencing a key encryption key in Key Vault.'
                        },
                        sourceVault: {
                          properties: {
                            id: {
                              type: 'string',
                              description: 'Resource Id'
                            }
                          },
                          'x-ms-azure-resource': true,
                          description: 'The relative URL of the Key Vault containing the key.'
                        }
                      },
                      required: [ 'keyUrl', 'sourceVault' ]
                    },
                    enabled: {
                      type: 'boolean',
                      description: 'Specifies whether disk encryption should be enabled on the virtual machine.'
                    }
                  }
                },
                name: { type: 'string', description: 'The disk name.' },
                vhd: {
                  description: 'The virtual hard disk.',
                  properties: {
                    uri: {
                      type: 'string',
                      description: "Specifies the virtual hard disk's uri."
                    }
                  }
                },
                image: {
                  description: 'The source user image virtual hard disk. The virtual hard disk will be copied before being attached to the virtual machine. If SourceImage is provided, the destination virtual hard drive must not exist.',
                  properties: {
                    uri: {
                      type: 'string',
                      description: "Specifies the virtual hard disk's uri."
                    }
                  }
                },
                caching: {
                  description: 'Specifies the caching requirements. <br><br> Possible values are: <br><br> **None** <br><br> **ReadOnly** <br><br> **ReadWrite** <br><br> Default: **None** for Standard storage. **ReadOnly** for Premium storage.',
                  type: 'string',
                  enum: [ 'None', 'ReadOnly', 'ReadWrite' ],
                  'x-ms-enum': { name: 'CachingTypes', modelAsString: false }
                },
                writeAcceleratorEnabled: {
                  type: 'boolean',
                  description: 'Specifies whether writeAccelerator should be enabled or disabled on the disk.'
                },
                diffDiskSettings: {
                  description: 'Specifies the ephemeral Disk Settings for the operating system disk used by the virtual machine.',
                  properties: {
                    option: {
                      description: 'Specifies the ephemeral disk settings for operating system disk.',
                      type: 'string',
                      enum: [ 'Local' ],
                      'x-ms-enum': { name: 'DiffDiskOptions', modelAsString: true }
                    },
                    placement: {
                      description: 'Specifies the ephemeral disk placement for operating system disk.<br><br> Possible values are: <br><br> **CacheDisk** <br><br> **ResourceDisk** <br><br> Default: **CacheDisk** if one is configured for the VM size otherwise **ResourceDisk** is used.<br><br> Refer to VM size documentation for Windows VM at https://docs.microsoft.com/azure/virtual-machines/windows/sizes and Linux VM at https://docs.microsoft.com/azure/virtual-machines/linux/sizes to check which VM sizes exposes a cache disk.',
                      type: 'string',
                      enum: [ 'CacheDisk', 'ResourceDisk' ],
                      'x-ms-enum': {
                        name: 'DiffDiskPlacement',
                        modelAsString: true
                      }
                    }
                  }
                },
                createOption: {
                  description: 'Specifies how the virtual machine should be created.<br><br> Possible values are:<br><br> **Attach** \\u2013 This value is used when you are using a specialized disk to create the virtual machine.<br><br> **FromImage** \\u2013 This value is used when you are using an image to create the virtual machine. If you are using a platform image, you also use the imageReference element described above. If you are using a marketplace image, you  also use the plan element previously described.',
                  type: 'string',
                  enum: [ 'FromImage', 'Empty', 'Attach' ],
                  'x-ms-enum': {
                    name: 'DiskCreateOptionTypes',
                    modelAsString: true
                  }
                },
                diskSizeGB: {
                  type: 'integer',
                  format: 'int32',
                  description: 'Specifies the size of an empty data disk in gigabytes. This element can be used to overwrite the size of the disk in a virtual machine image. <br><br> This value cannot be larger than 1023 GB'
                },
                managedDisk: {
                  description: 'The managed disk parameters.',
                  properties: {
                    storageAccountType: {
                      description: 'Specifies the storage account type for the managed disk. NOTE: UltraSSD_LRS can only be used with data disks, it cannot be used with OS Disk.',
                      type: 'string',
                      enum: [
                        'Standard_LRS',
                        'Premium_LRS',
                        'StandardSSD_LRS',
                        'UltraSSD_LRS',
                        'Premium_ZRS',
                        'StandardSSD_ZRS'
                      ],
                      'x-ms-enum': {
                        name: 'StorageAccountTypes',
                        modelAsString: true
                      }
                    },
                    diskEncryptionSet: {
                      description: 'Specifies the customer managed disk encryption set resource id for the managed disk.',
                      allOf: [
                        {
                          properties: {
                            id: {
                              type: 'string',
                              description: 'Resource Id'
                            }
                          },
                          'x-ms-azure-resource': true
                        }
                      ]
                    },
                    securityProfile: {
                      description: 'Specifies the security profile for the managed disk.',
                      type: 'object',
                      properties: {
                        securityEncryptionType: {
                          type: 'string',
                          description: 'Specifies the EncryptionType of the managed disk. <br> It is set to DiskWithVMGuestState for encryption of the managed disk along with VMGuestState blob, and VMGuestStateOnly for encryption of just the VMGuestState blob. <br><br> NOTE: It can be set for only Confidential VMs.',
                          enum: [
                            'VMGuestStateOnly',
                            'DiskWithVMGuestState'
                          ],
                          'x-ms-enum': {
                            name: 'securityEncryptionTypes',
                            modelAsString: true
                          }
                        },
                        diskEncryptionSet: {
                          description: 'Specifies the customer managed disk encryption set resource id for the managed disk that is used for Customer Managed Key encrypted ConfidentialVM OS Disk and VMGuest blob.',
                          allOf: [
                            {
                              properties: { id: [Object] },
                              'x-ms-azure-resource': true
                            }
                          ]
                        }
                      }
                    }
                  },
                  allOf: [
                    {
                      properties: {
                        id: { type: 'string', description: 'Resource Id' }
                      },
                      'x-ms-azure-resource': true
                    }
                  ]
                },
                deleteOption: {
                  description: 'Specifies whether OS Disk should be deleted or detached upon VM deletion. <br><br> Possible values: <br><br> **Delete** If this value is used, the OS disk is deleted when VM is deleted.<br><br> **Detach** If this value is used, the os disk is retained after VM is deleted. <br><br> The default value is set to **detach**. For an ephemeral OS Disk, the default value is set to **Delete**. User cannot change the delete option for ephemeral OS Disk.',
                  type: 'string',
                  enum: [ 'Delete', 'Detach' ],
                  'x-ms-enum': {
                    name: 'DiskDeleteOptionTypes',
                    modelAsString: true
                  }
                }
              },
              required: [ 'createOption' ]
            },
            dataDisks: {
              type: 'array',
              items: {
                properties: {
                  lun: {
                    type: 'integer',
                    format: 'int32',
                    description: 'Specifies the logical unit number of the data disk. This value is used to identify data disks within the VM and therefore must be unique for each data disk attached to a VM.'
                  },
                  name: { type: 'string', description: 'The disk name.' },
                  vhd: {
                    description: 'The virtual hard disk.',
                    properties: {
                      uri: {
                        type: 'string',
                        description: "Specifies the virtual hard disk's uri."
                      }
                    }
                  },
                  image: {
                    description: 'The source user image virtual hard disk. The virtual hard disk will be copied before being attached to the virtual machine. If SourceImage is provided, the destination virtual hard drive must not exist.',
                    properties: {
                      uri: {
                        type: 'string',
                        description: "Specifies the virtual hard disk's uri."
                      }
                    }
                  },
                  caching: {
                    description: 'Specifies the caching requirements. <br><br> Possible values are: <br><br> **None** <br><br> **ReadOnly** <br><br> **ReadWrite** <br><br> Default: **None for Standard storage. ReadOnly for Premium storage**',
                    type: 'string',
                    enum: [ 'None', 'ReadOnly', 'ReadWrite' ],
                    'x-ms-enum': { name: 'CachingTypes', modelAsString: false }
                  },
                  writeAcceleratorEnabled: {
                    type: 'boolean',
                    description: 'Specifies whether writeAccelerator should be enabled or disabled on the disk.'
                  },
                  createOption: {
                    description: 'Specifies how the virtual machine should be created.<br><br> Possible values are:<br><br> **Attach** \\u2013 This value is used when you are using a specialized disk to create the virtual machine.<br><br> **FromImage** \\u2013 This value is used when you are using an image to create the virtual machine. If you are using a platform image, you also use the imageReference element described above. If you are using a marketplace image, you  also use the plan element previously described.',
                    type: 'string',
                    enum: [ 'FromImage', 'Empty', 'Attach' ],
                    'x-ms-enum': {
                      name: 'DiskCreateOptionTypes',
                      modelAsString: true
                    }
                  },
                  diskSizeGB: {
                    type: 'integer',
                    format: 'int32',
                    description: 'Specifies the size of an empty data disk in gigabytes. This element can be used to overwrite the size of the disk in a virtual machine image. <br><br> This value cannot be larger than 1023 GB'
                  },
                  managedDisk: {
                    description: 'The managed disk parameters.',
                    properties: {
                      storageAccountType: {
                        description: 'Specifies the storage account type for the managed disk. NOTE: UltraSSD_LRS can only be used with data disks, it cannot be used with OS Disk.',
                        type: 'string',
                        enum: [
                          'Standard_LRS',
                          'Premium_LRS',
                          'StandardSSD_LRS',
                          'UltraSSD_LRS',
                          'Premium_ZRS',
                          'StandardSSD_ZRS'
                        ],
                        'x-ms-enum': {
                          name: 'StorageAccountTypes',
                          modelAsString: true
                        }
                      },
                      diskEncryptionSet: {
                        description: 'Specifies the customer managed disk encryption set resource id for the managed disk.',
                        allOf: [
                          {
                            properties: {
                              id: {
                                type: 'string',
                                description: 'Resource Id'
                              }
                            },
                            'x-ms-azure-resource': true
                          }
                        ]
                      },
                      securityProfile: {
                        description: 'Specifies the security profile for the managed disk.',
                        type: 'object',
                        properties: {
                          securityEncryptionType: {
                            type: 'string',
                            description: 'Specifies the EncryptionType of the managed disk. <br> It is set to DiskWithVMGuestState for encryption of the managed disk along with VMGuestState blob, and VMGuestStateOnly for encryption of just the VMGuestState blob. <br><br> NOTE: It can be set for only Confidential VMs.',
                            enum: [
                              'VMGuestStateOnly',
                              'DiskWithVMGuestState'
                            ],
                            'x-ms-enum': {
                              name: 'securityEncryptionTypes',
                              modelAsString: true
                            }
                          },
                          diskEncryptionSet: {
                            description: 'Specifies the customer managed disk encryption set resource id for the managed disk that is used for Customer Managed Key encrypted ConfidentialVM OS Disk and VMGuest blob.',
                            allOf: [
                              {
                                properties: [Object],
                                'x-ms-azure-resource': true
                              }
                            ]
                          }
                        }
                      }
                    },
                    allOf: [
                      {
                        properties: {
                          id: {
                            type: 'string',
                            description: 'Resource Id'
                          }
                        },
                        'x-ms-azure-resource': true
                      }
                    ]
                  },
                  toBeDetached: {
                    type: 'boolean',
                    description: 'Specifies whether the data disk is in process of detachment from the VirtualMachine/VirtualMachineScaleset'
                  },
                  diskIOPSReadWrite: {
                    type: 'integer',
                    readOnly: true,
                    format: 'int64',
                    description: 'Specifies the Read-Write IOPS for the managed disk when StorageAccountType is UltraSSD_LRS. Returned only for VirtualMachine ScaleSet VM disks. Can be updated only via updates to the VirtualMachine Scale Set.'
                  },
                  diskMBpsReadWrite: {
                    type: 'integer',
                    readOnly: true,
                    format: 'int64',
                    description: 'Specifies the bandwidth in MB per second for the managed disk when StorageAccountType is UltraSSD_LRS. Returned only for VirtualMachine ScaleSet VM disks. Can be updated only via updates to the VirtualMachine Scale Set.'
                  },
                  detachOption: {
                    description: "Specifies the detach behavior to be used while detaching a disk or which is already in the process of detachment from the virtual machine. Supported values: **ForceDetach**. <br><br> detachOption: **ForceDetach** is applicable only for managed data disks. If a previous detachment attempt of the data disk did not complete due to an unexpected failure from the virtual machine and the disk is still not released then use force-detach as a last resort option to detach the disk forcibly from the VM. All writes might not have been flushed when using this detach behavior. <br><br> This feature is still in preview mode and is not supported for VirtualMachineScaleSet. To force-detach a data disk update toBeDetached to 'true' along with setting detachOption: 'ForceDetach'.",
                    type: 'string',
                    enum: [ 'ForceDetach' ],
                    'x-ms-enum': {
                      name: 'DiskDetachOptionTypes',
                      modelAsString: true
                    }
                  },
                  deleteOption: {
                    description: 'Specifies whether data disk should be deleted or detached upon VM deletion.<br><br> Possible values: <br><br> **Delete** If this value is used, the data disk is deleted when VM is deleted.<br><br> **Detach** If this value is used, the data disk is retained after VM is deleted.<br><br> The default value is set to **detach**',
                    type: 'string',
                    enum: [ 'Delete', 'Detach' ],
                    'x-ms-enum': {
                      name: 'DiskDeleteOptionTypes',
                      modelAsString: true
                    }
                  }
                },
                required: [ 'lun', 'createOption' ],
                description: 'Describes a data disk.'
              },
              'x-ms-identifiers': [ 'lun' ],
              description: 'Specifies the parameters that are used to add a data disk to a virtual machine. <br><br> For more information about disks, see [About disks and VHDs for Azure virtual machines](https://docs.microsoft.com/azure/virtual-machines/managed-disks-overview).'
            }
          }
        },
        additionalCapabilities: {
          description: 'Specifies additional capabilities enabled or disabled on the virtual machine.',
          properties: {
            ultraSSDEnabled: {
              type: 'boolean',
              description: 'The flag that enables or disables a capability to have one or more managed data disks with UltraSSD_LRS storage account type on the VM or VMSS. Managed disks with storage account type UltraSSD_LRS can be added to a virtual machine or virtual machine scale set only if this property is enabled.'
            },
            hibernationEnabled: {
              type: 'boolean',
              description: 'The flag that enables or disables hibernation capability on the VM.'
            }
          }
        },
        osProfile: {
          description: 'Specifies the operating system settings used while creating the virtual machine. Some of the settings cannot be changed once VM is provisioned.',
          properties: {
            computerName: {
              type: 'string',
              description: 'Specifies the host OS name of the virtual machine. <br><br> This name cannot be updated after the VM is created. <br><br> **Max-length (Windows):** 15 characters <br><br> **Max-length (Linux):** 64 characters. <br><br> For naming conventions and restrictions see [Azure infrastructure services implementation guidelines](https://docs.microsoft.com/azure/azure-resource-manager/management/resource-name-rules).'
            },
            adminUsername: {
              type: 'string',
              description: 'Specifies the name of the administrator account. <br><br> This property cannot be updated after the VM is created. <br><br> **Windows-only restriction:** Cannot end in "." <br><br> **Disallowed values:** "administrator", "admin", "user", "user1", "test", "user2", "test1", "user3", "admin1", "1", "123", "a", "actuser", "adm", "admin2", "aspnet", "backup", "console", "david", "guest", "john", "owner", "root", "server", "sql", "support", "support_388945a0", "sys", "test2", "test3", "user4", "user5". <br><br> **Minimum-length (Linux):** 1  character <br><br> **Max-length (Linux):** 64 characters <br><br> **Max-length (Windows):** 20 characters.'
            },
            adminPassword: {
              type: 'string',
              description: 'Specifies the password of the administrator account. <br><br> **Minimum-length (Windows):** 8 characters <br><br> **Minimum-length (Linux):** 6 characters <br><br> **Max-length (Windows):** 123 characters <br><br> **Max-length (Linux):** 72 characters <br><br> **Complexity requirements:** 3 out of 4 conditions below need to be fulfilled <br> Has lower characters <br>Has upper characters <br> Has a digit <br> Has a special character (Regex match [\\W_]) <br><br> **Disallowed values:** "abc@123", "P@$$w0rd", "P@ssw0rd", "P@ssword123", "Pa$$word", "pass@word1", "Password!", "Password1", "Password22", "iloveyou!" <br><br> For resetting the password, see [How to reset the Remote Desktop service or its login password in a Windows VM](https://docs.microsoft.com/troubleshoot/azure/virtual-machines/reset-rdp) <br><br> For resetting root password, see [Manage users, SSH, and check or repair disks on Azure Linux VMs using the VMAccess Extension](https://docs.microsoft.com/troubleshoot/azure/virtual-machines/troubleshoot-ssh-connection)'
            },
            customData: {
              type: 'string',
              description: 'Specifies a base-64 encoded string of custom data. The base-64 encoded string is decoded to a binary array that is saved as a file on the Virtual Machine. The maximum length of the binary array is 65535 bytes. <br><br> **Note: Do not pass any secrets or passwords in customData property** <br><br> This property cannot be updated after the VM is created. <br><br> customData is passed to the VM to be saved as a file, for more information see [Custom Data on Azure VMs](https://azure.microsoft.com/blog/custom-data-and-cloud-init-on-windows-azure/) <br><br> For using cloud-init for your Linux VM, see [Using cloud-init to customize a Linux VM during creation](https://docs.microsoft.com/azure/virtual-machines/linux/using-cloud-init)'
            },
            windowsConfiguration: {
              description: 'Specifies Windows operating system settings on the virtual machine.',
              properties: {
                provisionVMAgent: {
                  type: 'boolean',
                  description: 'Indicates whether virtual machine agent should be provisioned on the virtual machine. <br><br> When this property is not specified in the request body, default behavior is to set it to true.  This will ensure that VM Agent is installed on the VM so that extensions can be added to the VM later.'
                },
                enableAutomaticUpdates: {
                  type: 'boolean',
                  description: 'Indicates whether Automatic Updates is enabled for the Windows virtual machine. Default value is true. <br><br> For virtual machine scale sets, this property can be updated and updates will take effect on OS reprovisioning.'
                },
                timeZone: {
                  type: 'string',
                  description: 'Specifies the time zone of the virtual machine. e.g. "Pacific Standard Time". <br><br> Possible values can be [TimeZoneInfo.Id](https://docs.microsoft.com/dotnet/api/system.timezoneinfo.id?#System_TimeZoneInfo_Id) value from time zones returned by [TimeZoneInfo.GetSystemTimeZones](https://docs.microsoft.com/dotnet/api/system.timezoneinfo.getsystemtimezones).'
                },
                additionalUnattendContent: {
                  type: 'array',
                  items: {
                    properties: {
                      passName: {
                        type: 'string',
                        description: 'The pass name. Currently, the only allowable value is OobeSystem.',
                        enum: [ 'OobeSystem' ],
                        'x-ms-enum': { name: 'PassNames', modelAsString: false }
                      },
                      componentName: {
                        type: 'string',
                        description: 'The component name. Currently, the only allowable value is Microsoft-Windows-Shell-Setup.',
                        enum: [ 'Microsoft-Windows-Shell-Setup' ],
                        'x-ms-enum': {
                          name: 'ComponentNames',
                          modelAsString: false
                        }
                      },
                      settingName: {
                        type: 'string',
                        description: 'Specifies the name of the setting to which the content applies. Possible values are: FirstLogonCommands and AutoLogon.',
                        enum: [ 'AutoLogon', 'FirstLogonCommands' ],
                        'x-ms-enum': { name: 'SettingNames', modelAsString: false }
                      },
                      content: {
                        type: 'string',
                        description: 'Specifies the XML formatted content that is added to the unattend.xml file for the specified path and component. The XML must be less than 4KB and must include the root element for the setting or feature that is being inserted.'
                      }
                    },
                    description: 'Specifies additional XML formatted information that can be included in the Unattend.xml file, which is used by Windows Setup. Contents are defined by setting name, component name, and the pass in which the content is applied.'
                  },
                  'x-ms-identifiers': [],
                  description: 'Specifies additional base-64 encoded XML formatted information that can be included in the Unattend.xml file, which is used by Windows Setup.'
                },
                patchSettings: {
                  description: '[Preview Feature] Specifies settings related to VM Guest Patching on Windows.',
                  properties: {
                    patchMode: {
                      type: 'string',
                      description: 'Specifies the mode of VM Guest Patching to IaaS virtual machine or virtual machines associated to virtual machine scale set with OrchestrationMode as Flexible.<br /><br /> Possible values are:<br /><br /> **Manual** - You  control the application of patches to a virtual machine. You do this by applying patches manually inside the VM. In this mode, automatic updates are disabled; the property WindowsConfiguration.enableAutomaticUpdates must be false<br /><br /> **AutomaticByOS** - The virtual machine will automatically be updated by the OS. The property WindowsConfiguration.enableAutomaticUpdates must be true. <br /><br /> **AutomaticByPlatform** - the virtual machine will automatically updated by the platform. The properties provisionVMAgent and WindowsConfiguration.enableAutomaticUpdates must be true ',
                      enum: [
                        'Manual',
                        'AutomaticByOS',
                        'AutomaticByPlatform'
                      ],
                      'x-ms-enum': {
                        name: 'WindowsVMGuestPatchMode',
                        modelAsString: true
                      }
                    },
                    enableHotpatching: {
                      type: 'boolean',
                      description: "Enables customers to patch their Azure VMs without requiring a reboot. For enableHotpatching, the 'provisionVMAgent' must be set to true and 'patchMode' must be set to 'AutomaticByPlatform'."
                    },
                    assessmentMode: {
                      type: 'string',
                      description: 'Specifies the mode of VM Guest patch assessment for the IaaS virtual machine.<br /><br /> Possible values are:<br /><br /> **ImageDefault** - You control the timing of patch assessments on a virtual machine.<br /><br /> **AutomaticByPlatform** - The platform will trigger periodic patch assessments. The property provisionVMAgent must be true. ',
                      enum: [ 'ImageDefault', 'AutomaticByPlatform' ],
                      'x-ms-enum': {
                        name: 'WindowsPatchAssessmentMode',
                        modelAsString: true
                      }
                    }
                  }
                },
                winRM: {
                  description: 'Specifies the Windows Remote Management listeners. This enables remote Windows PowerShell.',
                  properties: {
                    listeners: {
                      type: 'array',
                      items: {
                        properties: {
                          protocol: {
                            type: 'string',
                            description: 'Specifies the protocol of WinRM listener. <br><br> Possible values are: <br>**http** <br><br> **https**',
                            enum: [ 'Http', 'Https' ],
                            'x-ms-enum': {
                              name: 'ProtocolTypes',
                              modelAsString: false
                            }
                          },
                          certificateUrl: {
                            type: 'string',
                            description: 'This is the URL of a certificate that has been uploaded to Key Vault as a secret. For adding a secret to the Key Vault, see [Add a key or secret to the key vault](https://docs.microsoft.com/azure/key-vault/key-vault-get-started/#add). In this case, your certificate needs to be It is the Base64 encoding of the following JSON Object which is encoded in UTF-8: <br><br> {<br>  "data":"<Base64-encoded-certificate>",<br>  "dataType":"pfx",<br>  "password":"<pfx-file-password>"<br>} <br> To install certificates on a virtual machine it is recommended to use the [Azure Key Vault virtual machine extension for Linux](https://docs.microsoft.com/azure/virtual-machines/extensions/key-vault-linux) or the [Azure Key Vault virtual machine extension for Windows](https://docs.microsoft.com/azure/virtual-machines/extensions/key-vault-windows).'
                          }
                        },
                        description: 'Describes Protocol and thumbprint of Windows Remote Management listener'
                      },
                      'x-ms-identifiers': [],
                      description: 'The list of Windows Remote Management listeners'
                    }
                  }
                }
              }
            },
            linuxConfiguration: {
              description: 'Specifies the Linux operating system settings on the virtual machine. <br><br>For a list of supported Linux distributions, see [Linux on Azure-Endorsed Distributions](https://docs.microsoft.com/azure/virtual-machines/linux/endorsed-distros).',
              properties: {
                disablePasswordAuthentication: {
                  type: 'boolean',
                  description: 'Specifies whether password authentication should be disabled.'
                },
                ssh: {
                  description: 'Specifies the ssh key configuration for a Linux OS.',
                  properties: {
                    publicKeys: {
                      type: 'array',
                      items: {
                        properties: {
                          path: {
                            type: 'string',
                            description: 'Specifies the full path on the created VM where ssh public key is stored. If the file already exists, the specified key is appended to the file. Example: /home/user/.ssh/authorized_keys'
                          },
                          keyData: {
                            type: 'string',
                            description: 'SSH public key certificate used to authenticate with the VM through ssh. The key needs to be at least 2048-bit and in ssh-rsa format. <br><br> For creating ssh keys, see [Create SSH keys on Linux and Mac for Linux VMs in Azure]https://docs.microsoft.com/azure/virtual-machines/linux/create-ssh-keys-detailed).'
                          }
                        },
                        description: 'Contains information about SSH certificate public key and the path on the Linux VM where the public key is placed.'
                      },
                      'x-ms-identifiers': [ 'path' ],
                      description: 'The list of SSH public keys used to authenticate with linux based VMs.'
                    }
                  }
                },
                provisionVMAgent: {
                  type: 'boolean',
                  description: 'Indicates whether virtual machine agent should be provisioned on the virtual machine. <br><br> When this property is not specified in the request body, default behavior is to set it to true.  This will ensure that VM Agent is installed on the VM so that extensions can be added to the VM later.'
                },
                patchSettings: {
                  description: '[Preview Feature] Specifies settings related to VM Guest Patching on Linux.',
                  properties: {
                    patchMode: {
                      type: 'string',
                      description: "Specifies the mode of VM Guest Patching to IaaS virtual machine or virtual machines associated to virtual machine scale set with OrchestrationMode as Flexible.<br /><br /> Possible values are:<br /><br /> **ImageDefault** - The virtual machine's default patching configuration is used. <br /><br /> **AutomaticByPlatform** - The virtual machine will be automatically updated by the platform. The property provisionVMAgent must be true",
                      enum: [ 'ImageDefault', 'AutomaticByPlatform' ],
                      'x-ms-enum': {
                        name: 'LinuxVMGuestPatchMode',
                        modelAsString: true
                      }
                    },
                    assessmentMode: {
                      type: 'string',
                      description: 'Specifies the mode of VM Guest Patch Assessment for the IaaS virtual machine.<br /><br /> Possible values are:<br /><br /> **ImageDefault** - You control the timing of patch assessments on a virtual machine. <br /><br /> **AutomaticByPlatform** - The platform will trigger periodic patch assessments. The property provisionVMAgent must be true.',
                      enum: [ 'ImageDefault', 'AutomaticByPlatform' ],
                      'x-ms-enum': {
                        name: 'LinuxPatchAssessmentMode',
                        modelAsString: true
                      }
                    }
                  }
                }
              }
            },
            secrets: {
              type: 'array',
              items: {
                properties: {
                  sourceVault: {
                    properties: {
                      id: { type: 'string', description: 'Resource Id' }
                    },
                    'x-ms-azure-resource': true,
                    description: 'The relative URL of the Key Vault containing all of the certificates in VaultCertificates.'
                  },
                  vaultCertificates: {
                    type: 'array',
                    items: {
                      properties: {
                        certificateUrl: {
                          type: 'string',
                          description: 'This is the URL of a certificate that has been uploaded to Key Vault as a secret. For adding a secret to the Key Vault, see [Add a key or secret to the key vault](https://docs.microsoft.com/azure/key-vault/key-vault-get-started/#add). In this case, your certificate needs to be It is the Base64 encoding of the following JSON Object which is encoded in UTF-8: <br><br> {<br>  "data":"<Base64-encoded-certificate>",<br>  "dataType":"pfx",<br>  "password":"<pfx-file-password>"<br>} <br> To install certificates on a virtual machine it is recommended to use the [Azure Key Vault virtual machine extension for Linux](https://docs.microsoft.com/azure/virtual-machines/extensions/key-vault-linux) or the [Azure Key Vault virtual machine extension for Windows](https://docs.microsoft.com/azure/virtual-machines/extensions/key-vault-windows).'
                        },
                        certificateStore: {
                          type: 'string',
                          description: 'For Windows VMs, specifies the certificate store on the Virtual Machine to which the certificate should be added. The specified certificate store is implicitly in the LocalMachine account. <br><br>For Linux VMs, the certificate file is placed under the /var/lib/waagent directory, with the file name &lt;UppercaseThumbprint&gt;.crt for the X509 certificate file and &lt;UppercaseThumbprint&gt;.prv for private key. Both of these files are .pem formatted.'
                        }
                      },
                      description: 'Describes a single certificate reference in a Key Vault, and where the certificate should reside on the VM.'
                    },
                    'x-ms-identifiers': [ 'certificateUrl' ],
                    description: 'The list of key vault references in SourceVault which contain certificates.'
                  }
                },
                description: 'Describes a set of certificates which are all in the same Key Vault.'
              },
              'x-ms-identifiers': [ 'sourceVault/id' ],
              description: 'Specifies set of certificates that should be installed onto the virtual machine. To install certificates on a virtual machine it is recommended to use the [Azure Key Vault virtual machine extension for Linux](https://docs.microsoft.com/azure/virtual-machines/extensions/key-vault-linux) or the [Azure Key Vault virtual machine extension for Windows](https://docs.microsoft.com/azure/virtual-machines/extensions/key-vault-windows).'
            },
            allowExtensionOperations: {
              type: 'boolean',
              description: 'Specifies whether extension operations should be allowed on the virtual machine. <br><br>This may only be set to False when no extensions are present on the virtual machine.'
            },
            requireGuestProvisionSignal: {
              type: 'boolean',
              description: 'Specifies whether the guest provision signal is required to infer provision success of the virtual machine.  **Note: This property is for private testing only, and all customers must not set the property to false.**'
            }
          }
        },
        networkProfile: {
          description: 'Specifies the network interfaces of the virtual machine.',
          properties: {
            networkInterfaces: {
              type: 'array',
              items: {
                properties: {
                  properties: {
                    'x-ms-client-flatten': true,
                    properties: {
                      primary: {
                        type: 'boolean',
                        description: 'Specifies the primary network interface in case the virtual machine has more than 1 network interface.'
                      },
                      deleteOption: {
                        type: 'string',
                        description: 'Specify what happens to the network interface when the VM is deleted',
                        enum: [ 'Delete', 'Detach' ],
                        'x-ms-enum': { name: 'DeleteOptions', modelAsString: true }
                      }
                    },
                    description: 'Describes a network interface reference properties.'
                  }
                },
                allOf: [
                  {
                    properties: {
                      id: { type: 'string', description: 'Resource Id' }
                    },
                    'x-ms-azure-resource': true
                  }
                ],
                description: 'Describes a network interface reference.'
              },
              description: 'Specifies the list of resource Ids for the network interfaces associated with the virtual machine.'
            },
            networkApiVersion: {
              type: 'string',
              description: 'specifies the Microsoft.Network API version used when creating networking resources in the Network Interface Configurations',
              enum: [ '2020-11-01' ],
              'x-ms-enum': { name: 'NetworkApiVersion', modelAsString: true }
            },
            networkInterfaceConfigurations: {
              type: 'array',
              items: {
                properties: {
                  name: {
                    type: 'string',
                    description: 'The network interface configuration name.'
                  },
                  properties: {
                    'x-ms-client-flatten': true,
                    properties: {
                      primary: {
                        type: 'boolean',
                        description: 'Specifies the primary network interface in case the virtual machine has more than 1 network interface.'
                      },
                      deleteOption: {
                        type: 'string',
                        description: 'Specify what happens to the network interface when the VM is deleted',
                        enum: [ 'Delete', 'Detach' ],
                        'x-ms-enum': { name: 'DeleteOptions', modelAsString: true }
                      },
                      enableAcceleratedNetworking: {
                        type: 'boolean',
                        description: 'Specifies whether the network interface is accelerated networking-enabled.'
                      },
                      enableFpga: {
                        type: 'boolean',
                        description: 'Specifies whether the network interface is FPGA networking-enabled.'
                      },
                      enableIPForwarding: {
                        type: 'boolean',
                        description: 'Whether IP forwarding enabled on this NIC.'
                      },
                      networkSecurityGroup: {
                        properties: {
                          id: {
                            type: 'string',
                            description: 'Resource Id'
                          }
                        },
                        'x-ms-azure-resource': true,
                        description: 'The network security group.'
                      },
                      dnsSettings: {
                        description: 'The dns settings to be applied on the network interfaces.',
                        properties: {
                          dnsServers: {
                            type: 'array',
                            items: { type: 'string' },
                            description: 'List of DNS servers IP addresses'
                          }
                        }
                      },
                      ipConfigurations: {
                        type: 'array',
                        items: {
                          properties: {
                            name: {
                              type: 'string',
                              description: 'The IP configuration name.'
                            },
                            properties: {
                              'x-ms-client-flatten': true,
                              properties: {
                                subnet: [Object],
                                primary: [Object],
                                publicIPAddressConfiguration: [Object],
                                privateIPAddressVersion: [Object],
                                applicationSecurityGroups: [Object],
                                applicationGatewayBackendAddressPools: [Object],
                                loadBalancerBackendAddressPools: [Object]
                              },
                              description: 'Describes a virtual machine network interface IP configuration properties.'
                            }
                          },
                          required: [ 'name' ],
                          description: "Describes a virtual machine network profile's IP configuration."
                        },
                        'x-ms-identifiers': [ 'name' ],
                        description: 'Specifies the IP configurations of the network interface.'
                      },
                      dscpConfiguration: {
                        properties: {
                          id: {
                            type: 'string',
                            description: 'Resource Id'
                          }
                        },
                        'x-ms-azure-resource': true
                      }
                    },
                    required: [ 'ipConfigurations' ],
                    description: "Describes a virtual machine network profile's IP configuration."
                  }
                },
                required: [ 'name' ],
                description: 'Describes a virtual machine network interface configurations.'
              },
              'x-ms-identifiers': [ 'name' ],
              description: 'Specifies the networking configurations that will be used to create the virtual machine networking resources.'
            }
          }
        },
        securityProfile: {
          description: 'Specifies the Security related profile settings for the virtual machine.',
          properties: {
            uefiSettings: {
              description: 'Specifies the security settings like secure boot and vTPM used while creating the virtual machine. <br><br>Minimum api-version: 2020-12-01',
              properties: {
                secureBootEnabled: {
                  type: 'boolean',
                  description: 'Specifies whether secure boot should be enabled on the virtual machine. <br><br>Minimum api-version: 2020-12-01'
                },
                vTpmEnabled: {
                  type: 'boolean',
                  description: 'Specifies whether vTPM should be enabled on the virtual machine. <br><br>Minimum api-version: 2020-12-01'
                }
              }
            },
            encryptionAtHost: {
              type: 'boolean',
              description: 'This property can be used by user in the request to enable or disable the Host Encryption for the virtual machine or virtual machine scale set. This will enable the encryption for all the disks including Resource/Temp disk at host itself. <br><br> Default: The Encryption at host will be disabled unless this property is set to true for the resource.'
            },
            securityType: {
              type: 'string',
              description: 'Specifies the SecurityType of the virtual machine. It has to be set to any specified value to enable UefiSettings. <br><br> Default: UefiSettings will not be enabled unless this property is set.',
              enum: [ 'TrustedLaunch', 'ConfidentialVM' ],
              'x-ms-enum': { name: 'SecurityTypes', modelAsString: true }
            }
          }
        },
        diagnosticsProfile: {
          description: 'Specifies the boot diagnostic settings state. <br><br>Minimum api-version: 2015-06-15.',
          properties: {
            bootDiagnostics: {
              description: 'Boot Diagnostics is a debugging feature which allows you to view Console Output and Screenshot to diagnose VM status. <br>**NOTE**: If storageUri is being specified then ensure that the storage account is in the same region and subscription as the VM. <br><br> You can easily view the output of your console log. <br><br> Azure also enables you to see a screenshot of the VM from the hypervisor.',
              properties: {
                enabled: {
                  type: 'boolean',
                  description: 'Whether boot diagnostics should be enabled on the Virtual Machine.'
                },
                storageUri: {
                  type: 'string',
                  description: 'Uri of the storage account to use for placing the console output and screenshot. <br><br>If storageUri is not specified while enabling boot diagnostics, managed storage will be used.'
                }
              }
            }
          }
        },
        availabilitySet: {
          properties: { id: { type: 'string', description: 'Resource Id' } },
          'x-ms-azure-resource': true,
          description: 'Specifies information about the availability set that the virtual machine should be assigned to. Virtual machines specified in the same availability set are allocated to different nodes to maximize availability. For more information about availability sets, see [Availability sets overview](https://docs.microsoft.com/azure/virtual-machines/availability-set-overview). <br><br> For more information on Azure planned maintenance, see [Maintenance and updates for Virtual Machines in Azure](https://docs.microsoft.com/azure/virtual-machines/maintenance-and-updates) <br><br> Currently, a VM can only be added to availability set at creation time. The availability set to which the VM is being added should be under the same resource group as the availability set resource. An existing VM cannot be added to an availability set. <br><br>This property cannot exist along with a non-null properties.virtualMachineScaleSet reference.'
        },
        virtualMachineScaleSet: {
          properties: { id: { type: 'string', description: 'Resource Id' } },
          'x-ms-azure-resource': true,
          description: 'Specifies information about the virtual machine scale set that the virtual machine should be assigned to. Virtual machines specified in the same virtual machine scale set are allocated to different nodes to maximize availability. Currently, a VM can only be added to virtual machine scale set at creation time. An existing VM cannot be added to a virtual machine scale set. <br><br>This property cannot exist along with a non-null properties.availabilitySet reference. <br><br>Minimum api‐version: 2019‐03‐01'
        },
        proximityPlacementGroup: {
          properties: { id: { type: 'string', description: 'Resource Id' } },
          'x-ms-azure-resource': true,
          description: 'Specifies information about the proximity placement group that the virtual machine should be assigned to. <br><br>Minimum api-version: 2018-04-01.'
        },
        priority: {
          description: 'Specifies the priority for the virtual machine. <br><br>Minimum api-version: 2019-03-01',
          type: 'string',
          enum: [ 'Regular', 'Low', 'Spot' ],
          'x-ms-enum': { name: 'VirtualMachinePriorityTypes', modelAsString: true }
        },
        evictionPolicy: {
          description: "Specifies the eviction policy for the Azure Spot virtual machine and Azure Spot scale set. <br><br>For Azure Spot virtual machines, both 'Deallocate' and 'Delete' are supported and the minimum api-version is 2019-03-01. <br><br>For Azure Spot scale sets, both 'Deallocate' and 'Delete' are supported and the minimum api-version is 2017-10-30-preview.",
          type: 'string',
          enum: [ 'Deallocate', 'Delete' ],
          'x-ms-enum': {
            name: 'VirtualMachineEvictionPolicyTypes',
            modelAsString: true
          }
        },
        billingProfile: {
          description: 'Specifies the billing related details of a Azure Spot virtual machine. <br><br>Minimum api-version: 2019-03-01.',
          properties: {
            maxPrice: {
              type: 'number',
              format: 'double',
              description: 'Specifies the maximum price you are willing to pay for a Azure Spot VM/VMSS. This price is in US Dollars. <br><br> This price will be compared with the current Azure Spot price for the VM size. Also, the prices are compared at the time of create/update of Azure Spot VM/VMSS and the operation will only succeed if  the maxPrice is greater than the current Azure Spot price. <br><br> The maxPrice will also be used for evicting a Azure Spot VM/VMSS if the current Azure Spot price goes beyond the maxPrice after creation of VM/VMSS. <br><br> Possible values are: <br><br> - Any decimal value greater than zero. Example: 0.01538 <br><br> -1 – indicates default price to be up-to on-demand. <br><br> You can set the maxPrice to -1 to indicate that the Azure Spot VM/VMSS should not be evicted for price reasons. Also, the default max price is -1 if it is not provided by you. <br><br>Minimum api-version: 2019-03-01.'
            }
          }
        },
        host: {
          properties: { id: { type: 'string', description: 'Resource Id' } },
          'x-ms-azure-resource': true,
          description: 'Specifies information about the dedicated host that the virtual machine resides in. <br><br>Minimum api-version: 2018-10-01.'
        },
        hostGroup: {
          properties: { id: { type: 'string', description: 'Resource Id' } },
          'x-ms-azure-resource': true,
          description: 'Specifies information about the dedicated host group that the virtual machine resides in. <br><br>Minimum api-version: 2020-06-01. <br><br>NOTE: User cannot specify both host and hostGroup properties.'
        },
        provisioningState: {
          readOnly: true,
          type: 'string',
          description: 'The provisioning state, which only appears in the response.'
        },
        instanceView: {
          readOnly: true,
          description: 'The virtual machine instance view.',
          properties: {
            platformUpdateDomain: {
              type: 'integer',
              format: 'int32',
              description: 'Specifies the update domain of the virtual machine.'
            },
            platformFaultDomain: {
              type: 'integer',
              format: 'int32',
              description: 'Specifies the fault domain of the virtual machine.'
            },
            computerName: {
              type: 'string',
              description: 'The computer name assigned to the virtual machine.'
            },
            osName: {
              type: 'string',
              description: 'The Operating System running on the virtual machine.'
            },
            osVersion: {
              type: 'string',
              description: 'The version of Operating System running on the virtual machine.'
            },
            hyperVGeneration: {
              type: 'string',
              description: 'Specifies the HyperVGeneration Type associated with a resource',
              enum: [ 'V1', 'V2' ],
              'x-ms-enum': { name: 'HyperVGenerationType', modelAsString: true }
            },
            rdpThumbPrint: {
              type: 'string',
              description: 'The Remote desktop certificate thumbprint.'
            },
            vmAgent: {
              description: 'The VM Agent running on the virtual machine.',
              properties: {
                vmAgentVersion: {
                  type: 'string',
                  description: 'The VM Agent full version.'
                },
                extensionHandlers: {
                  type: 'array',
                  items: {
                    properties: {
                      type: {
                        type: 'string',
                        description: 'Specifies the type of the extension; an example is "CustomScriptExtension".'
                      },
                      typeHandlerVersion: {
                        type: 'string',
                        description: 'Specifies the version of the script handler.'
                      },
                      status: {
                        properties: {
                          code: {
                            type: 'string',
                            description: 'The status code.'
                          },
                          level: {
                            type: 'string',
                            description: 'The level code.',
                            enum: [ 'Info', 'Warning', 'Error' ],
                            'x-ms-enum': {
                              name: 'StatusLevelTypes',
                              modelAsString: false
                            }
                          },
                          displayStatus: {
                            type: 'string',
                            description: 'The short localizable label for the status.'
                          },
                          message: {
                            type: 'string',
                            description: 'The detailed status message, including for alerts and error messages.'
                          },
                          time: {
                            type: 'string',
                            format: 'date-time',
                            description: 'The time of the status.'
                          }
                        },
                        description: 'Instance view status.'
                      }
                    },
                    description: 'The instance view of a virtual machine extension handler.'
                  },
                  'x-ms-identifiers': [],
                  description: 'The virtual machine extension handler instance view.'
                },
                statuses: {
                  type: 'array',
                  items: {
                    properties: {
                      code: {
                        type: 'string',
                        description: 'The status code.'
                      },
                      level: {
                        type: 'string',
                        description: 'The level code.',
                        enum: [ 'Info', 'Warning', 'Error' ],
                        'x-ms-enum': {
                          name: 'StatusLevelTypes',
                          modelAsString: false
                        }
                      },
                      displayStatus: {
                        type: 'string',
                        description: 'The short localizable label for the status.'
                      },
                      message: {
                        type: 'string',
                        description: 'The detailed status message, including for alerts and error messages.'
                      },
                      time: {
                        type: 'string',
                        format: 'date-time',
                        description: 'The time of the status.'
                      }
                    },
                    description: 'Instance view status.'
                  },
                  'x-ms-identifiers': [],
                  description: 'The resource status information.'
                }
              }
            },
            maintenanceRedeployStatus: {
              description: 'The Maintenance Operation status on the virtual machine.',
              properties: {
                isCustomerInitiatedMaintenanceAllowed: {
                  type: 'boolean',
                  description: 'True, if customer is allowed to perform Maintenance.'
                },
                preMaintenanceWindowStartTime: {
                  type: 'string',
                  format: 'date-time',
                  description: 'Start Time for the Pre Maintenance Window.'
                },
                preMaintenanceWindowEndTime: {
                  type: 'string',
                  format: 'date-time',
                  description: 'End Time for the Pre Maintenance Window.'
                },
                maintenanceWindowStartTime: {
                  type: 'string',
                  format: 'date-time',
                  description: 'Start Time for the Maintenance Window.'
                },
                maintenanceWindowEndTime: {
                  type: 'string',
                  format: 'date-time',
                  description: 'End Time for the Maintenance Window.'
                },
                lastOperationResultCode: {
                  type: 'string',
                  description: 'The Last Maintenance Operation Result Code.',
                  enum: [
                    'None',
                    'RetryLater',
                    'MaintenanceAborted',
                    'MaintenanceCompleted'
                  ],
                  'x-ms-enum': {
                    name: 'MaintenanceOperationResultCodeTypes',
                    modelAsString: false
                  }
                },
                lastOperationMessage: {
                  type: 'string',
                  description: 'Message returned for the last Maintenance Operation.'
                }
              }
            },
            disks: {
              type: 'array',
              items: {
                properties: {
                  name: { type: 'string', description: 'The disk name.' },
                  encryptionSettings: {
                    type: 'array',
                    items: {
                      properties: {
                        diskEncryptionKey: {
                          description: 'Specifies the location of the disk encryption key, which is a Key Vault Secret.',
                          properties: {
                            secretUrl: {
                              type: 'string',
                              description: 'The URL referencing a secret in a Key Vault.'
                            },
                            sourceVault: {
                              properties: { id: [Object] },
                              'x-ms-azure-resource': true,
                              description: 'The relative URL of the Key Vault containing the secret.'
                            }
                          },
                          required: [ 'secretUrl', 'sourceVault' ]
                        },
                        keyEncryptionKey: {
                          description: 'Specifies the location of the key encryption key in Key Vault.',
                          properties: {
                            keyUrl: {
                              type: 'string',
                              description: 'The URL referencing a key encryption key in Key Vault.'
                            },
                            sourceVault: {
                              properties: { id: [Object] },
                              'x-ms-azure-resource': true,
                              description: 'The relative URL of the Key Vault containing the key.'
                            }
                          },
                          required: [ 'keyUrl', 'sourceVault' ]
                        },
                        enabled: {
                          type: 'boolean',
                          description: 'Specifies whether disk encryption should be enabled on the virtual machine.'
                        }
                      },
                      description: 'Describes a Encryption Settings for a Disk'
                    },
                    'x-ms-identifiers': [ 'diskEncryptionKey/sourceVault/id' ],
                    description: 'Specifies the encryption settings for the OS Disk. <br><br> Minimum api-version: 2015-06-15'
                  },
                  statuses: {
                    type: 'array',
                    items: {
                      properties: {
                        code: {
                          type: 'string',
                          description: 'The status code.'
                        },
                        level: {
                          type: 'string',
                          description: 'The level code.',
                          enum: [ 'Info', 'Warning', 'Error' ],
                          'x-ms-enum': {
                            name: 'StatusLevelTypes',
                            modelAsString: false
                          }
                        },
                        displayStatus: {
                          type: 'string',
                          description: 'The short localizable label for the status.'
                        },
                        message: {
                          type: 'string',
                          description: 'The detailed status message, including for alerts and error messages.'
                        },
                        time: {
                          type: 'string',
                          format: 'date-time',
                          description: 'The time of the status.'
                        }
                      },
                      description: 'Instance view status.'
                    },
                    'x-ms-identifiers': [],
                    description: 'The resource status information.'
                  }
                },
                description: 'The instance view of the disk.'
              },
              'x-ms-identifiers': [ 'name' ],
              description: 'The virtual machine disk information.'
            },
            extensions: {
              type: 'array',
              items: {
                properties: {
                  name: {
                    type: 'string',
                    description: 'The virtual machine extension name.'
                  },
                  type: {
                    type: 'string',
                    description: 'Specifies the type of the extension; an example is "CustomScriptExtension".'
                  },
                  typeHandlerVersion: {
                    type: 'string',
                    description: 'Specifies the version of the script handler.'
                  },
                  substatuses: {
                    type: 'array',
                    items: {
                      properties: {
                        code: {
                          type: 'string',
                          description: 'The status code.'
                        },
                        level: {
                          type: 'string',
                          description: 'The level code.',
                          enum: [ 'Info', 'Warning', 'Error' ],
                          'x-ms-enum': {
                            name: 'StatusLevelTypes',
                            modelAsString: false
                          }
                        },
                        displayStatus: {
                          type: 'string',
                          description: 'The short localizable label for the status.'
                        },
                        message: {
                          type: 'string',
                          description: 'The detailed status message, including for alerts and error messages.'
                        },
                        time: {
                          type: 'string',
                          format: 'date-time',
                          description: 'The time of the status.'
                        }
                      },
                      description: 'Instance view status.'
                    },
                    'x-ms-identifiers': [],
                    description: 'The resource status information.'
                  },
                  statuses: {
                    type: 'array',
                    items: {
                      properties: {
                        code: {
                          type: 'string',
                          description: 'The status code.'
                        },
                        level: {
                          type: 'string',
                          description: 'The level code.',
                          enum: [ 'Info', 'Warning', 'Error' ],
                          'x-ms-enum': {
                            name: 'StatusLevelTypes',
                            modelAsString: false
                          }
                        },
                        displayStatus: {
                          type: 'string',
                          description: 'The short localizable label for the status.'
                        },
                        message: {
                          type: 'string',
                          description: 'The detailed status message, including for alerts and error messages.'
                        },
                        time: {
                          type: 'string',
                          format: 'date-time',
                          description: 'The time of the status.'
                        }
                      },
                      description: 'Instance view status.'
                    },
                    'x-ms-identifiers': [],
                    description: 'The resource status information.'
                  }
                },
                description: 'The instance view of a virtual machine extension.'
              },
              'x-ms-identifiers': [ 'name', 'type' ],
              description: 'The extensions information.'
            },
            vmHealth: {
              readOnly: true,
              description: 'The health status for the VM.',
              properties: {
                status: {
                  properties: {
                    code: { type: 'string', description: 'The status code.' },
                    level: {
                      type: 'string',
                      description: 'The level code.',
                      enum: [ 'Info', 'Warning', 'Error' ],
                      'x-ms-enum': {
                        name: 'StatusLevelTypes',
                        modelAsString: false
                      }
                    },
                    displayStatus: {
                      type: 'string',
                      description: 'The short localizable label for the status.'
                    },
                    message: {
                      type: 'string',
                      description: 'The detailed status message, including for alerts and error messages.'
                    },
                    time: {
                      type: 'string',
                      format: 'date-time',
                      description: 'The time of the status.'
                    }
                  },
                  description: 'Instance view status.',
                  readOnly: true
                }
              }
            },
            bootDiagnostics: {
              description: 'Boot Diagnostics is a debugging feature which allows you to view Console Output and Screenshot to diagnose VM status. <br><br> You can easily view the output of your console log. <br><br> Azure also enables you to see a screenshot of the VM from the hypervisor.',
              properties: {
                consoleScreenshotBlobUri: {
                  readOnly: true,
                  type: 'string',
                  description: 'The console screenshot blob URI. <br><br>NOTE: This will **not** be set if boot diagnostics is currently enabled with managed storage.'
                },
                serialConsoleLogBlobUri: {
                  readOnly: true,
                  type: 'string',
                  description: 'The serial console log blob Uri. <br><br>NOTE: This will **not** be set if boot diagnostics is currently enabled with managed storage.'
                },
                status: {
                  properties: {
                    code: { type: 'string', description: 'The status code.' },
                    level: {
                      type: 'string',
                      description: 'The level code.',
                      enum: [ 'Info', 'Warning', 'Error' ],
                      'x-ms-enum': {
                        name: 'StatusLevelTypes',
                        modelAsString: false
                      }
                    },
                    displayStatus: {
                      type: 'string',
                      description: 'The short localizable label for the status.'
                    },
                    message: {
                      type: 'string',
                      description: 'The detailed status message, including for alerts and error messages.'
                    },
                    time: {
                      type: 'string',
                      format: 'date-time',
                      description: 'The time of the status.'
                    }
                  },
                  description: 'Instance view status.',
                  readOnly: true
                }
              }
            },
            assignedHost: {
              type: 'string',
              readOnly: true,
              description: 'Resource id of the dedicated host, on which the virtual machine is allocated through automatic placement, when the virtual machine is associated with a dedicated host group that has automatic placement enabled. <br><br>Minimum api-version: 2020-06-01.'
            },
            statuses: {
              type: 'array',
              items: {
                properties: {
                  code: { type: 'string', description: 'The status code.' },
                  level: {
                    type: 'string',
                    description: 'The level code.',
                    enum: [ 'Info', 'Warning', 'Error' ],
                    'x-ms-enum': { name: 'StatusLevelTypes', modelAsString: false }
                  },
                  displayStatus: {
                    type: 'string',
                    description: 'The short localizable label for the status.'
                  },
                  message: {
                    type: 'string',
                    description: 'The detailed status message, including for alerts and error messages.'
                  },
                  time: {
                    type: 'string',
                    format: 'date-time',
                    description: 'The time of the status.'
                  }
                },
                description: 'Instance view status.'
              },
              'x-ms-identifiers': [],
              description: 'The resource status information.'
            },
            patchStatus: {
              description: '[Preview Feature] The status of virtual machine patch operations.',
              properties: {
                availablePatchSummary: {
                  description: 'The available patch summary of the latest assessment operation for the virtual machine.',
                  properties: {
                    status: {
                      type: 'string',
                      readOnly: true,
                      description: 'The overall success or failure status of the operation. It remains "InProgress" until the operation completes. At that point it will become "Unknown", "Failed", "Succeeded", or "CompletedWithWarnings."',
                      enum: [
                        'Unknown',
                        'InProgress',
                        'Failed',
                        'Succeeded',
                        'CompletedWithWarnings'
                      ],
                      'x-ms-enum': {
                        name: 'PatchOperationStatus',
                        modelAsString: true
                      }
                    },
                    assessmentActivityId: {
                      type: 'string',
                      readOnly: true,
                      description: 'The activity ID of the operation that produced this result. It is used to correlate across CRP and extension logs.'
                    },
                    rebootPending: {
                      type: 'boolean',
                      readOnly: true,
                      description: 'The overall reboot status of the VM. It will be true when partially installed patches require a reboot to complete installation but the reboot has not yet occurred.'
                    },
                    criticalAndSecurityPatchCount: {
                      type: 'integer',
                      readOnly: true,
                      format: 'int32',
                      description: 'The number of critical or security patches that have been detected as available and not yet installed.'
                    },
                    otherPatchCount: {
                      type: 'integer',
                      readOnly: true,
                      format: 'int32',
                      description: 'The number of all available patches excluding critical and security.'
                    },
                    startTime: {
                      type: 'string',
                      readOnly: true,
                      format: 'date-time',
                      description: 'The UTC timestamp when the operation began.'
                    },
                    lastModifiedTime: {
                      type: 'string',
                      readOnly: true,
                      format: 'date-time',
                      description: 'The UTC timestamp when the operation began.'
                    },
                    error: {
                      properties: {
                        details: {
                          type: 'array',
                          items: {
                            properties: {
                              code: {
                                type: 'string',
                                description: 'The error code.'
                              },
                              target: {
                                type: 'string',
                                description: 'The target of the particular error.'
                              },
                              message: {
                                type: 'string',
                                description: 'The error message.'
                              }
                            },
                            description: 'Api error base.'
                          },
                          'x-ms-identifiers': [ 'message', 'target' ],
                          description: 'The Api error details'
                        },
                        innererror: {
                          description: 'The Api inner error',
                          properties: {
                            exceptiontype: {
                              type: 'string',
                              description: 'The exception type.'
                            },
                            errordetail: {
                              type: 'string',
                              description: 'The internal error message or exception dump.'
                            }
                          }
                        },
                        code: {
                          type: 'string',
                          description: 'The error code.'
                        },
                        target: {
                          type: 'string',
                          description: 'The target of the particular error.'
                        },
                        message: {
                          type: 'string',
                          description: 'The error message.'
                        }
                      },
                      description: 'Api error.',
                      readOnly: true
                    }
                  }
                },
                lastPatchInstallationSummary: {
                  description: 'The installation summary of the latest installation operation for the virtual machine.',
                  properties: {
                    status: {
                      type: 'string',
                      readOnly: true,
                      description: 'The overall success or failure status of the operation. It remains "InProgress" until the operation completes. At that point it will become "Unknown", "Failed", "Succeeded", or "CompletedWithWarnings."',
                      enum: [
                        'Unknown',
                        'InProgress',
                        'Failed',
                        'Succeeded',
                        'CompletedWithWarnings'
                      ],
                      'x-ms-enum': {
                        name: 'PatchOperationStatus',
                        modelAsString: true
                      }
                    },
                    installationActivityId: {
                      type: 'string',
                      readOnly: true,
                      description: 'The activity ID of the operation that produced this result. It is used to correlate across CRP and extension logs.'
                    },
                    maintenanceWindowExceeded: {
                      type: 'boolean',
                      readOnly: true,
                      description: 'Describes whether the operation ran out of time before it completed all its intended actions'
                    },
                    notSelectedPatchCount: {
                      type: 'integer',
                      readOnly: true,
                      format: 'int32',
                      description: "The number of all available patches but not going to be installed because it didn't match a classification or inclusion list entry."
                    },
                    excludedPatchCount: {
                      type: 'integer',
                      readOnly: true,
                      format: 'int32',
                      description: 'The number of all available patches but excluded explicitly by a customer-specified exclusion list match.'
                    },
                    pendingPatchCount: {
                      type: 'integer',
                      readOnly: true,
                      format: 'int32',
                      description: 'The number of all available patches expected to be installed over the course of the patch installation operation.'
                    },
                    installedPatchCount: {
                      type: 'integer',
                      readOnly: true,
                      format: 'int32',
                      description: 'The count of patches that successfully installed.'
                    },
                    failedPatchCount: {
                      type: 'integer',
                      readOnly: true,
                      format: 'int32',
                      description: 'The count of patches that failed installation.'
                    },
                    startTime: {
                      type: 'string',
                      readOnly: true,
                      format: 'date-time',
                      description: 'The UTC timestamp when the operation began.'
                    },
                    lastModifiedTime: {
                      type: 'string',
                      readOnly: true,
                      format: 'date-time',
                      description: 'The UTC timestamp when the operation began.'
                    },
                    error: {
                      properties: {
                        details: {
                          type: 'array',
                          items: {
                            properties: {
                              code: {
                                type: 'string',
                                description: 'The error code.'
                              },
                              target: {
                                type: 'string',
                                description: 'The target of the particular error.'
                              },
                              message: {
                                type: 'string',
                                description: 'The error message.'
                              }
                            },
                            description: 'Api error base.'
                          },
                          'x-ms-identifiers': [ 'message', 'target' ],
                          description: 'The Api error details'
                        },
                        innererror: {
                          description: 'The Api inner error',
                          properties: {
                            exceptiontype: {
                              type: 'string',
                              description: 'The exception type.'
                            },
                            errordetail: {
                              type: 'string',
                              description: 'The internal error message or exception dump.'
                            }
                          }
                        },
                        code: {
                          type: 'string',
                          description: 'The error code.'
                        },
                        target: {
                          type: 'string',
                          description: 'The target of the particular error.'
                        },
                        message: {
                          type: 'string',
                          description: 'The error message.'
                        }
                      },
                      description: 'Api error.',
                      readOnly: true
                    }
                  }
                },
                configurationStatuses: {
                  description: 'The enablement status of the specified patchMode',
                  readOnly: true,
                  type: 'array',
                  items: {
                    properties: {
                      code: {
                        type: 'string',
                        description: 'The status code.'
                      },
                      level: {
                        type: 'string',
                        description: 'The level code.',
                        enum: [ 'Info', 'Warning', 'Error' ],
                        'x-ms-enum': {
                          name: 'StatusLevelTypes',
                          modelAsString: false
                        }
                      },
                      displayStatus: {
                        type: 'string',
                        description: 'The short localizable label for the status.'
                      },
                      message: {
                        type: 'string',
                        description: 'The detailed status message, including for alerts and error messages.'
                      },
                      time: {
                        type: 'string',
                        format: 'date-time',
                        description: 'The time of the status.'
                      }
                    },
                    description: 'Instance view status.'
                  },
                  'x-ms-identifiers': []
                }
              }
            }
          }
        },
        licenseType: {
          type: 'string',
          description: 'Specifies that the image or disk that is being used was licensed on-premises. <br><br> Possible values for Windows Server operating system are: <br><br> Windows_Client <br><br> Windows_Server <br><br> Possible values for Linux Server operating system are: <br><br> RHEL_BYOS (for RHEL) <br><br> SLES_BYOS (for SUSE) <br><br> For more information, see [Azure Hybrid Use Benefit for Windows Server](https://docs.microsoft.com/azure/virtual-machines/windows/hybrid-use-benefit-licensing) <br><br> [Azure Hybrid Use Benefit for Linux Server](https://docs.microsoft.com/azure/virtual-machines/linux/azure-hybrid-benefit-linux) <br><br> Minimum api-version: 2015-06-15'
        },
        vmId: {
          readOnly: true,
          type: 'string',
          description: 'Specifies the VM unique ID which is a 128-bits identifier that is encoded and stored in all Azure IaaS VMs SMBIOS and can be read using platform BIOS commands.'
        },
        extensionsTimeBudget: {
          type: 'string',
          description: 'Specifies the time alloted for all extensions to start. The time duration should be between 15 minutes and 120 minutes (inclusive) and should be specified in ISO 8601 format. The default value is 90 minutes (PT1H30M). <br><br> Minimum api-version: 2020-06-01'
        },
        platformFaultDomain: {
          type: 'integer',
          format: 'int32',
          description: "Specifies the scale set logical fault domain into which the Virtual Machine will be created. By default, the Virtual Machine will by automatically assigned to a fault domain that best maintains balance across available fault domains.<br><li>This is applicable only if the 'virtualMachineScaleSet' property of this Virtual Machine is set.<li>The Virtual Machine Scale Set that is referenced, must have 'platformFaultDomainCount' &gt; 1.<li>This property cannot be updated once the Virtual Machine is created.<li>Fault domain assignment can be viewed in the Virtual Machine Instance View.<br><br>Minimum api‐version: 2020‐12‐01"
        },
        scheduledEventsProfile: {
          description: 'Specifies Scheduled Event related configurations.',
          type: 'object',
          properties: {
            terminateNotificationProfile: {
              description: 'Specifies Terminate Scheduled Event related configurations.',
              type: 'object',
              properties: {
                notBeforeTimeout: {
                  type: 'string',
                  description: 'Configurable length of time a Virtual Machine being deleted will have to potentially approve the Terminate Scheduled Event before the event is auto approved (timed out). The configuration must be specified in ISO 8601 format, the default value is 5 minutes (PT5M)'
                },
                enable: {
                  type: 'boolean',
                  description: 'Specifies whether the Terminate Scheduled event is enabled or disabled.'
                }
              }
            }
          }
        },
        userData: {
          type: 'string',
          description: 'UserData for the VM, which must be base-64 encoded. Customer should not pass any secrets in here. <br><br>Minimum api-version: 2021-03-01'
        },
        capacityReservation: {
          description: 'Specifies information about the capacity reservation that is used to allocate virtual machine. <br><br>Minimum api-version: 2021-04-01.',
          type: 'object',
          properties: {
            capacityReservationGroup: {
              properties: { id: { type: 'string', description: 'Resource Id' } },
              'x-ms-azure-resource': true,
              description: 'Specifies the capacity reservation group resource id that should be used for allocating the virtual machine or scaleset vm instances provided enough capacity has been reserved. Please refer to https://aka.ms/CapacityReservation for more details.'
            }
          }
        },
        applicationProfile: {
          description: 'Specifies the gallery applications that should be made available to the VM/VMSS',
          type: 'object',
          properties: {
            galleryApplications: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  tags: {
                    type: 'string',
                    description: 'Optional, Specifies a passthrough value for more generic context.'
                  },
                  order: {
                    type: 'integer',
                    format: 'int32',
                    description: 'Optional, Specifies the order in which the packages have to be installed'
                  },
                  packageReferenceId: {
                    type: 'string',
                    description: 'Specifies the GalleryApplicationVersion resource id on the form of /subscriptions/{SubscriptionId}/resourceGroups/{ResourceGroupName}/providers/Microsoft.Compute/galleries/{galleryName}/applications/{application}/versions/{version}'
                  },
                  configurationReference: {
                    type: 'string',
                    description: 'Optional, Specifies the uri to an azure blob that will replace the default configuration for the package if provided'
                  }
                },
                required: [ 'packageReferenceId' ],
                description: 'Specifies the required information to reference a compute gallery application version'
              },
              'x-ms-identifiers': [ 'packageReferenceId' ],
              description: 'Specifies the gallery applications that should be made available to the VM/VMSS'
            }
          }
        },
        timeCreated: {
          readOnly: true,
          type: 'string',
          format: 'date-time',
          description: 'Specifies the time at which the Virtual Machine resource was created.<br><br>Minimum api-version: 2021-11-01.'
        }
      },
      description: 'Describes the properties of a Virtual Machine.'
    },
    resources: {
      readOnly: true,
      type: 'array',
      items: {
        properties: {
          properties: {
            'x-ms-client-flatten': true,
            properties: {
              forceUpdateTag: {
                type: 'string',
                description: 'How the extension handler should be forced to update even if the extension configuration has not changed.'
              },
              publisher: {
                type: 'string',
                description: 'The name of the extension handler publisher.'
              },
              type: {
                type: 'string',
                description: 'Specifies the type of the extension; an example is "CustomScriptExtension".'
              },
              typeHandlerVersion: {
                type: 'string',
                description: 'Specifies the version of the script handler.'
              },
              autoUpgradeMinorVersion: {
                type: 'boolean',
                description: 'Indicates whether the extension should use a newer minor version if one is available at deployment time. Once deployed, however, the extension will not upgrade minor versions unless redeployed, even with this property set to true.'
              },
              enableAutomaticUpgrade: {
                type: 'boolean',
                description: 'Indicates whether the extension should be automatically upgraded by the platform if there is a newer version of the extension available.'
              },
              settings: {
                type: 'object',
                description: 'Json formatted public settings for the extension.'
              },
              protectedSettings: {
                type: 'object',
                description: 'The extension can contain either protectedSettings or protectedSettingsFromKeyVault or no protected settings at all.'
              },
              provisioningState: {
                readOnly: true,
                type: 'string',
                description: 'The provisioning state, which only appears in the response.'
              },
              instanceView: {
                description: 'The virtual machine extension instance view.',
                properties: {
                  name: {
                    type: 'string',
                    description: 'The virtual machine extension name.'
                  },
                  type: {
                    type: 'string',
                    description: 'Specifies the type of the extension; an example is "CustomScriptExtension".'
                  },
                  typeHandlerVersion: {
                    type: 'string',
                    description: 'Specifies the version of the script handler.'
                  },
                  substatuses: {
                    type: 'array',
                    items: {
                      properties: {
                        code: {
                          type: 'string',
                          description: 'The status code.'
                        },
                        level: {
                          type: 'string',
                          description: 'The level code.',
                          enum: [ 'Info', 'Warning', 'Error' ],
                          'x-ms-enum': {
                            name: 'StatusLevelTypes',
                            modelAsString: false
                          }
                        },
                        displayStatus: {
                          type: 'string',
                          description: 'The short localizable label for the status.'
                        },
                        message: {
                          type: 'string',
                          description: 'The detailed status message, including for alerts and error messages.'
                        },
                        time: {
                          type: 'string',
                          format: 'date-time',
                          description: 'The time of the status.'
                        }
                      },
                      description: 'Instance view status.'
                    },
                    'x-ms-identifiers': [],
                    description: 'The resource status information.'
                  },
                  statuses: {
                    type: 'array',
                    items: {
                      properties: {
                        code: {
                          type: 'string',
                          description: 'The status code.'
                        },
                        level: {
                          type: 'string',
                          description: 'The level code.',
                          enum: [ 'Info', 'Warning', 'Error' ],
                          'x-ms-enum': {
                            name: 'StatusLevelTypes',
                            modelAsString: false
                          }
                        },
                        displayStatus: {
                          type: 'string',
                          description: 'The short localizable label for the status.'
                        },
                        message: {
                          type: 'string',
                          description: 'The detailed status message, including for alerts and error messages.'
                        },
                        time: {
                          type: 'string',
                          format: 'date-time',
                          description: 'The time of the status.'
                        }
                      },
                      description: 'Instance view status.'
                    },
                    'x-ms-identifiers': [],
                    description: 'The resource status information.'
                  }
                }
              },
              suppressFailures: {
                type: 'boolean',
                description: 'Indicates whether failures stemming from the extension will be suppressed (Operational failures such as not connecting to the VM will not be suppressed regardless of this value). The default is false.'
              },
              protectedSettingsFromKeyVault: {
                type: 'object',
                description: 'The extensions protected settings that are passed by reference, and consumed from key vault'
              }
            },
            description: 'Describes the properties of a Virtual Machine Extension.'
          }
        },
        allOf: [
          {
            description: 'The Resource model definition.',
            properties: {
              id: {
                readOnly: true,
                type: 'string',
                description: 'Resource Id'
              },
              name: {
                readOnly: true,
                type: 'string',
                description: 'Resource name'
              },
              type: {
                readOnly: true,
                type: 'string',
                description: 'Resource type'
              },
              location: { type: 'string', description: 'Resource location' },
              tags: {
                type: 'object',
                additionalProperties: { type: 'string' },
                description: 'Resource tags'
              }
            },
            required: [ 'location' ],
            'x-ms-azure-resource': true
          }
        ],
        description: 'Describes a Virtual Machine Extension.'
      },
      description: 'The virtual machine child extension resources.'
    },
    identity: {
      description: 'The identity of the virtual machine, if configured.',
      properties: {
        principalId: {
          readOnly: true,
          type: 'string',
          description: 'The principal id of virtual machine identity. This property will only be provided for a system assigned identity.'
        },
        tenantId: {
          readOnly: true,
          type: 'string',
          description: 'The tenant id associated with the virtual machine. This property will only be provided for a system assigned identity.'
        },
        type: {
          type: 'string',
          description: "The type of identity used for the virtual machine. The type 'SystemAssigned, UserAssigned' includes both an implicitly created identity and a set of user assigned identities. The type 'None' will remove any identities from the virtual machine.",
          enum: [
            'SystemAssigned',
            'UserAssigned',
            'SystemAssigned, UserAssigned',
            'None'
          ],
          'x-ms-enum': { name: 'ResourceIdentityType', modelAsString: false }
        },
        userAssignedIdentities: {
          type: 'object',
          additionalProperties: {
            type: 'object',
            'x-ms-client-name': 'userAssignedIdentitiesValue',
            properties: {
              principalId: {
                readOnly: true,
                type: 'string',
                description: 'The principal id of user assigned identity.'
              },
              clientId: {
                readOnly: true,
                type: 'string',
                description: 'The client id of user assigned identity.'
              }
            }
          },
          description: "The list of user identities associated with the Virtual Machine. The user identity dictionary key references will be ARM resource ids in the form: '/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.ManagedIdentity/userAssignedIdentities/{identityName}'."
        }
      }
    },
    zones: {
      type: 'array',
      items: { type: 'string' },
      description: 'The virtual machine zones.'
    },
    extendedLocation: {
      description: 'The extended location of the Virtual Machine.',
      properties: {
        name: {
          type: 'string',
          description: 'The name of the extended location.'
        },
        type: {
          description: 'The type of the extended location.',
          type: 'string',
          enum: [ 'EdgeZone' ],
          'x-ms-enum': { name: 'ExtendedLocationTypes', modelAsString: true }
        }
      }
    }
  },
  allOf: [
    {
      description: 'The Resource model definition.',
      properties: {
        id: { readOnly: true, type: 'string', description: 'Resource Id' },
        name: {
          readOnly: true,
          type: 'string',
          description: 'Resource name'
        },
        type: {
          readOnly: true,
          type: 'string',
          description: 'Resource type'
        },
        location: { type: 'string', description: 'Resource location' },
        tags: {
          type: 'object',
          additionalProperties: { type: 'string' },
          description: 'Resource tags'
        }
      },
      required: [ 'location' ],
      'x-ms-azure-resource': true
    }
  ],
  description: 'Describes a Virtual Machine.'
}
```
## Misc
The resource version is `2021-11-01`.

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/compute/resource-manager/Microsoft.Compute/stable/2021-11-01/compute.json).
