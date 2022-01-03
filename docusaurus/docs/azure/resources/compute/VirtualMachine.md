---
id: VirtualMachine
title: VirtualMachine
---
Provides a **VirtualMachine** from the **Compute** group
## Examples
### Create a vm with password authentication.
```js
provider.Compute.makeVirtualMachine({
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
  dependencies: ({ resources }) => ({
    resourceGroup: resources.Resources.ResourceGroup["myResourceGroup"],
    galleryImage: resources.Compute.GalleryImage["myGalleryImage"],
    vault: resources.KeyVault.Vault["myVault"],
    networkSecurityGroup:
      resources.Network.NetworkSecurityGroup["myNetworkSecurityGroup"],
    dscpConfiguration:
      resources.Network.DscpConfiguration["myDscpConfiguration"],
    availabilitySet: resources.Compute.AvailabilitySet["myAvailabilitySet"],
    virtualMachineScaleSet:
      resources.Compute.VirtualMachineScaleSet["myVirtualMachineScaleSet"],
    proximityPlacementGroup:
      resources.Compute.ProximityPlacementGroup["myProximityPlacementGroup"],
    dedicatedHostGroup:
      resources.Compute.DedicatedHostGroup["myDedicatedHostGroup"],
    virtualMachineScaleSetVm:
      resources.Compute.VirtualMachineScaleSetVM["myVirtualMachineScaleSetVM"],
    capacityReservationGroup:
      resources.Compute.CapacityReservationGroup["myCapacityReservationGroup"],
  }),
});

```

### Create a vm with ssh authentication.
```js
provider.Compute.makeVirtualMachine({
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
  dependencies: ({ resources }) => ({
    resourceGroup: resources.Resources.ResourceGroup["myResourceGroup"],
    galleryImage: resources.Compute.GalleryImage["myGalleryImage"],
    vault: resources.KeyVault.Vault["myVault"],
    networkSecurityGroup:
      resources.Network.NetworkSecurityGroup["myNetworkSecurityGroup"],
    dscpConfiguration:
      resources.Network.DscpConfiguration["myDscpConfiguration"],
    availabilitySet: resources.Compute.AvailabilitySet["myAvailabilitySet"],
    virtualMachineScaleSet:
      resources.Compute.VirtualMachineScaleSet["myVirtualMachineScaleSet"],
    proximityPlacementGroup:
      resources.Compute.ProximityPlacementGroup["myProximityPlacementGroup"],
    dedicatedHostGroup:
      resources.Compute.DedicatedHostGroup["myDedicatedHostGroup"],
    virtualMachineScaleSetVm:
      resources.Compute.VirtualMachineScaleSetVM["myVirtualMachineScaleSetVM"],
    capacityReservationGroup:
      resources.Compute.CapacityReservationGroup["myCapacityReservationGroup"],
  }),
});

```

### Create a vm with premium storage.
```js
provider.Compute.makeVirtualMachine({
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
  dependencies: ({ resources }) => ({
    resourceGroup: resources.Resources.ResourceGroup["myResourceGroup"],
    galleryImage: resources.Compute.GalleryImage["myGalleryImage"],
    vault: resources.KeyVault.Vault["myVault"],
    networkSecurityGroup:
      resources.Network.NetworkSecurityGroup["myNetworkSecurityGroup"],
    dscpConfiguration:
      resources.Network.DscpConfiguration["myDscpConfiguration"],
    availabilitySet: resources.Compute.AvailabilitySet["myAvailabilitySet"],
    virtualMachineScaleSet:
      resources.Compute.VirtualMachineScaleSet["myVirtualMachineScaleSet"],
    proximityPlacementGroup:
      resources.Compute.ProximityPlacementGroup["myProximityPlacementGroup"],
    dedicatedHostGroup:
      resources.Compute.DedicatedHostGroup["myDedicatedHostGroup"],
    virtualMachineScaleSetVm:
      resources.Compute.VirtualMachineScaleSetVM["myVirtualMachineScaleSetVM"],
    capacityReservationGroup:
      resources.Compute.CapacityReservationGroup["myCapacityReservationGroup"],
  }),
});

```

### Create a vm in a Virtual Machine Scale Set with customer assigned platformFaultDomain.
```js
provider.Compute.makeVirtualMachine({
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
  dependencies: ({ resources }) => ({
    resourceGroup: resources.Resources.ResourceGroup["myResourceGroup"],
    galleryImage: resources.Compute.GalleryImage["myGalleryImage"],
    vault: resources.KeyVault.Vault["myVault"],
    networkSecurityGroup:
      resources.Network.NetworkSecurityGroup["myNetworkSecurityGroup"],
    dscpConfiguration:
      resources.Network.DscpConfiguration["myDscpConfiguration"],
    availabilitySet: resources.Compute.AvailabilitySet["myAvailabilitySet"],
    virtualMachineScaleSet:
      resources.Compute.VirtualMachineScaleSet["myVirtualMachineScaleSet"],
    proximityPlacementGroup:
      resources.Compute.ProximityPlacementGroup["myProximityPlacementGroup"],
    dedicatedHostGroup:
      resources.Compute.DedicatedHostGroup["myDedicatedHostGroup"],
    virtualMachineScaleSetVm:
      resources.Compute.VirtualMachineScaleSetVM["myVirtualMachineScaleSetVM"],
    capacityReservationGroup:
      resources.Compute.CapacityReservationGroup["myCapacityReservationGroup"],
  }),
});

```

### Create a vm in an availability set.
```js
provider.Compute.makeVirtualMachine({
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
  dependencies: ({ resources }) => ({
    resourceGroup: resources.Resources.ResourceGroup["myResourceGroup"],
    galleryImage: resources.Compute.GalleryImage["myGalleryImage"],
    vault: resources.KeyVault.Vault["myVault"],
    networkSecurityGroup:
      resources.Network.NetworkSecurityGroup["myNetworkSecurityGroup"],
    dscpConfiguration:
      resources.Network.DscpConfiguration["myDscpConfiguration"],
    availabilitySet: resources.Compute.AvailabilitySet["myAvailabilitySet"],
    virtualMachineScaleSet:
      resources.Compute.VirtualMachineScaleSet["myVirtualMachineScaleSet"],
    proximityPlacementGroup:
      resources.Compute.ProximityPlacementGroup["myProximityPlacementGroup"],
    dedicatedHostGroup:
      resources.Compute.DedicatedHostGroup["myDedicatedHostGroup"],
    virtualMachineScaleSetVm:
      resources.Compute.VirtualMachineScaleSetVM["myVirtualMachineScaleSetVM"],
    capacityReservationGroup:
      resources.Compute.CapacityReservationGroup["myCapacityReservationGroup"],
  }),
});

```

### Create a vm with Scheduled Events Profile
```js
provider.Compute.makeVirtualMachine({
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
  dependencies: ({ resources }) => ({
    resourceGroup: resources.Resources.ResourceGroup["myResourceGroup"],
    galleryImage: resources.Compute.GalleryImage["myGalleryImage"],
    vault: resources.KeyVault.Vault["myVault"],
    networkSecurityGroup:
      resources.Network.NetworkSecurityGroup["myNetworkSecurityGroup"],
    dscpConfiguration:
      resources.Network.DscpConfiguration["myDscpConfiguration"],
    availabilitySet: resources.Compute.AvailabilitySet["myAvailabilitySet"],
    virtualMachineScaleSet:
      resources.Compute.VirtualMachineScaleSet["myVirtualMachineScaleSet"],
    proximityPlacementGroup:
      resources.Compute.ProximityPlacementGroup["myProximityPlacementGroup"],
    dedicatedHostGroup:
      resources.Compute.DedicatedHostGroup["myDedicatedHostGroup"],
    virtualMachineScaleSetVm:
      resources.Compute.VirtualMachineScaleSetVM["myVirtualMachineScaleSetVM"],
    capacityReservationGroup:
      resources.Compute.CapacityReservationGroup["myCapacityReservationGroup"],
  }),
});

```

### Create a vm with boot diagnostics.
```js
provider.Compute.makeVirtualMachine({
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
  dependencies: ({ resources }) => ({
    resourceGroup: resources.Resources.ResourceGroup["myResourceGroup"],
    galleryImage: resources.Compute.GalleryImage["myGalleryImage"],
    vault: resources.KeyVault.Vault["myVault"],
    networkSecurityGroup:
      resources.Network.NetworkSecurityGroup["myNetworkSecurityGroup"],
    dscpConfiguration:
      resources.Network.DscpConfiguration["myDscpConfiguration"],
    availabilitySet: resources.Compute.AvailabilitySet["myAvailabilitySet"],
    virtualMachineScaleSet:
      resources.Compute.VirtualMachineScaleSet["myVirtualMachineScaleSet"],
    proximityPlacementGroup:
      resources.Compute.ProximityPlacementGroup["myProximityPlacementGroup"],
    dedicatedHostGroup:
      resources.Compute.DedicatedHostGroup["myDedicatedHostGroup"],
    virtualMachineScaleSetVm:
      resources.Compute.VirtualMachineScaleSetVM["myVirtualMachineScaleSetVM"],
    capacityReservationGroup:
      resources.Compute.CapacityReservationGroup["myCapacityReservationGroup"],
  }),
});

```

### Create a vm with managed boot diagnostics.
```js
provider.Compute.makeVirtualMachine({
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
  dependencies: ({ resources }) => ({
    resourceGroup: resources.Resources.ResourceGroup["myResourceGroup"],
    galleryImage: resources.Compute.GalleryImage["myGalleryImage"],
    vault: resources.KeyVault.Vault["myVault"],
    networkSecurityGroup:
      resources.Network.NetworkSecurityGroup["myNetworkSecurityGroup"],
    dscpConfiguration:
      resources.Network.DscpConfiguration["myDscpConfiguration"],
    availabilitySet: resources.Compute.AvailabilitySet["myAvailabilitySet"],
    virtualMachineScaleSet:
      resources.Compute.VirtualMachineScaleSet["myVirtualMachineScaleSet"],
    proximityPlacementGroup:
      resources.Compute.ProximityPlacementGroup["myProximityPlacementGroup"],
    dedicatedHostGroup:
      resources.Compute.DedicatedHostGroup["myDedicatedHostGroup"],
    virtualMachineScaleSetVm:
      resources.Compute.VirtualMachineScaleSetVM["myVirtualMachineScaleSetVM"],
    capacityReservationGroup:
      resources.Compute.CapacityReservationGroup["myCapacityReservationGroup"],
  }),
});

```

### Create a vm with empty data disks.
```js
provider.Compute.makeVirtualMachine({
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
  dependencies: ({ resources }) => ({
    resourceGroup: resources.Resources.ResourceGroup["myResourceGroup"],
    galleryImage: resources.Compute.GalleryImage["myGalleryImage"],
    vault: resources.KeyVault.Vault["myVault"],
    networkSecurityGroup:
      resources.Network.NetworkSecurityGroup["myNetworkSecurityGroup"],
    dscpConfiguration:
      resources.Network.DscpConfiguration["myDscpConfiguration"],
    availabilitySet: resources.Compute.AvailabilitySet["myAvailabilitySet"],
    virtualMachineScaleSet:
      resources.Compute.VirtualMachineScaleSet["myVirtualMachineScaleSet"],
    proximityPlacementGroup:
      resources.Compute.ProximityPlacementGroup["myProximityPlacementGroup"],
    dedicatedHostGroup:
      resources.Compute.DedicatedHostGroup["myDedicatedHostGroup"],
    virtualMachineScaleSetVm:
      resources.Compute.VirtualMachineScaleSetVM["myVirtualMachineScaleSetVM"],
    capacityReservationGroup:
      resources.Compute.CapacityReservationGroup["myCapacityReservationGroup"],
  }),
});

```

### Create a vm with a marketplace image plan.
```js
provider.Compute.makeVirtualMachine({
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
  dependencies: ({ resources }) => ({
    resourceGroup: resources.Resources.ResourceGroup["myResourceGroup"],
    galleryImage: resources.Compute.GalleryImage["myGalleryImage"],
    vault: resources.KeyVault.Vault["myVault"],
    networkSecurityGroup:
      resources.Network.NetworkSecurityGroup["myNetworkSecurityGroup"],
    dscpConfiguration:
      resources.Network.DscpConfiguration["myDscpConfiguration"],
    availabilitySet: resources.Compute.AvailabilitySet["myAvailabilitySet"],
    virtualMachineScaleSet:
      resources.Compute.VirtualMachineScaleSet["myVirtualMachineScaleSet"],
    proximityPlacementGroup:
      resources.Compute.ProximityPlacementGroup["myProximityPlacementGroup"],
    dedicatedHostGroup:
      resources.Compute.DedicatedHostGroup["myDedicatedHostGroup"],
    virtualMachineScaleSetVm:
      resources.Compute.VirtualMachineScaleSetVM["myVirtualMachineScaleSetVM"],
    capacityReservationGroup:
      resources.Compute.CapacityReservationGroup["myCapacityReservationGroup"],
  }),
});

```

### Create a vm from a custom image.
```js
provider.Compute.makeVirtualMachine({
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
  dependencies: ({ resources }) => ({
    resourceGroup: resources.Resources.ResourceGroup["myResourceGroup"],
    galleryImage: resources.Compute.GalleryImage["myGalleryImage"],
    vault: resources.KeyVault.Vault["myVault"],
    networkSecurityGroup:
      resources.Network.NetworkSecurityGroup["myNetworkSecurityGroup"],
    dscpConfiguration:
      resources.Network.DscpConfiguration["myDscpConfiguration"],
    availabilitySet: resources.Compute.AvailabilitySet["myAvailabilitySet"],
    virtualMachineScaleSet:
      resources.Compute.VirtualMachineScaleSet["myVirtualMachineScaleSet"],
    proximityPlacementGroup:
      resources.Compute.ProximityPlacementGroup["myProximityPlacementGroup"],
    dedicatedHostGroup:
      resources.Compute.DedicatedHostGroup["myDedicatedHostGroup"],
    virtualMachineScaleSetVm:
      resources.Compute.VirtualMachineScaleSetVM["myVirtualMachineScaleSetVM"],
    capacityReservationGroup:
      resources.Compute.CapacityReservationGroup["myCapacityReservationGroup"],
  }),
});

```

### Create a platform-image vm with unmanaged os and data disks.
```js
provider.Compute.makeVirtualMachine({
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
  dependencies: ({ resources }) => ({
    resourceGroup: resources.Resources.ResourceGroup["myResourceGroup"],
    galleryImage: resources.Compute.GalleryImage["myGalleryImage"],
    vault: resources.KeyVault.Vault["myVault"],
    networkSecurityGroup:
      resources.Network.NetworkSecurityGroup["myNetworkSecurityGroup"],
    dscpConfiguration:
      resources.Network.DscpConfiguration["myDscpConfiguration"],
    availabilitySet: resources.Compute.AvailabilitySet["myAvailabilitySet"],
    virtualMachineScaleSet:
      resources.Compute.VirtualMachineScaleSet["myVirtualMachineScaleSet"],
    proximityPlacementGroup:
      resources.Compute.ProximityPlacementGroup["myProximityPlacementGroup"],
    dedicatedHostGroup:
      resources.Compute.DedicatedHostGroup["myDedicatedHostGroup"],
    virtualMachineScaleSetVm:
      resources.Compute.VirtualMachineScaleSetVM["myVirtualMachineScaleSetVM"],
    capacityReservationGroup:
      resources.Compute.CapacityReservationGroup["myCapacityReservationGroup"],
  }),
});

```

### Create a custom-image vm from an unmanaged generalized os image.
```js
provider.Compute.makeVirtualMachine({
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
  dependencies: ({ resources }) => ({
    resourceGroup: resources.Resources.ResourceGroup["myResourceGroup"],
    galleryImage: resources.Compute.GalleryImage["myGalleryImage"],
    vault: resources.KeyVault.Vault["myVault"],
    networkSecurityGroup:
      resources.Network.NetworkSecurityGroup["myNetworkSecurityGroup"],
    dscpConfiguration:
      resources.Network.DscpConfiguration["myDscpConfiguration"],
    availabilitySet: resources.Compute.AvailabilitySet["myAvailabilitySet"],
    virtualMachineScaleSet:
      resources.Compute.VirtualMachineScaleSet["myVirtualMachineScaleSet"],
    proximityPlacementGroup:
      resources.Compute.ProximityPlacementGroup["myProximityPlacementGroup"],
    dedicatedHostGroup:
      resources.Compute.DedicatedHostGroup["myDedicatedHostGroup"],
    virtualMachineScaleSetVm:
      resources.Compute.VirtualMachineScaleSetVM["myVirtualMachineScaleSetVM"],
    capacityReservationGroup:
      resources.Compute.CapacityReservationGroup["myCapacityReservationGroup"],
  }),
});

```

### Create a vm with ephemeral os disk.
```js
provider.Compute.makeVirtualMachine({
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
  dependencies: ({ resources }) => ({
    resourceGroup: resources.Resources.ResourceGroup["myResourceGroup"],
    galleryImage: resources.Compute.GalleryImage["myGalleryImage"],
    vault: resources.KeyVault.Vault["myVault"],
    networkSecurityGroup:
      resources.Network.NetworkSecurityGroup["myNetworkSecurityGroup"],
    dscpConfiguration:
      resources.Network.DscpConfiguration["myDscpConfiguration"],
    availabilitySet: resources.Compute.AvailabilitySet["myAvailabilitySet"],
    virtualMachineScaleSet:
      resources.Compute.VirtualMachineScaleSet["myVirtualMachineScaleSet"],
    proximityPlacementGroup:
      resources.Compute.ProximityPlacementGroup["myProximityPlacementGroup"],
    dedicatedHostGroup:
      resources.Compute.DedicatedHostGroup["myDedicatedHostGroup"],
    virtualMachineScaleSetVm:
      resources.Compute.VirtualMachineScaleSetVM["myVirtualMachineScaleSetVM"],
    capacityReservationGroup:
      resources.Compute.CapacityReservationGroup["myCapacityReservationGroup"],
  }),
});

```

### Create a vm with DiskEncryptionSet resource id in the os disk and data disk.
```js
provider.Compute.makeVirtualMachine({
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
  dependencies: ({ resources }) => ({
    resourceGroup: resources.Resources.ResourceGroup["myResourceGroup"],
    galleryImage: resources.Compute.GalleryImage["myGalleryImage"],
    vault: resources.KeyVault.Vault["myVault"],
    networkSecurityGroup:
      resources.Network.NetworkSecurityGroup["myNetworkSecurityGroup"],
    dscpConfiguration:
      resources.Network.DscpConfiguration["myDscpConfiguration"],
    availabilitySet: resources.Compute.AvailabilitySet["myAvailabilitySet"],
    virtualMachineScaleSet:
      resources.Compute.VirtualMachineScaleSet["myVirtualMachineScaleSet"],
    proximityPlacementGroup:
      resources.Compute.ProximityPlacementGroup["myProximityPlacementGroup"],
    dedicatedHostGroup:
      resources.Compute.DedicatedHostGroup["myDedicatedHostGroup"],
    virtualMachineScaleSetVm:
      resources.Compute.VirtualMachineScaleSetVM["myVirtualMachineScaleSetVM"],
    capacityReservationGroup:
      resources.Compute.CapacityReservationGroup["myCapacityReservationGroup"],
  }),
});

```

### Create a vm with ephemeral os disk provisioning in Resource disk using placement property.
```js
provider.Compute.makeVirtualMachine({
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
  dependencies: ({ resources }) => ({
    resourceGroup: resources.Resources.ResourceGroup["myResourceGroup"],
    galleryImage: resources.Compute.GalleryImage["myGalleryImage"],
    vault: resources.KeyVault.Vault["myVault"],
    networkSecurityGroup:
      resources.Network.NetworkSecurityGroup["myNetworkSecurityGroup"],
    dscpConfiguration:
      resources.Network.DscpConfiguration["myDscpConfiguration"],
    availabilitySet: resources.Compute.AvailabilitySet["myAvailabilitySet"],
    virtualMachineScaleSet:
      resources.Compute.VirtualMachineScaleSet["myVirtualMachineScaleSet"],
    proximityPlacementGroup:
      resources.Compute.ProximityPlacementGroup["myProximityPlacementGroup"],
    dedicatedHostGroup:
      resources.Compute.DedicatedHostGroup["myDedicatedHostGroup"],
    virtualMachineScaleSetVm:
      resources.Compute.VirtualMachineScaleSetVM["myVirtualMachineScaleSetVM"],
    capacityReservationGroup:
      resources.Compute.CapacityReservationGroup["myCapacityReservationGroup"],
  }),
});

```

### Create a vm with ephemeral os disk provisioning in Cache disk using placement property.
```js
provider.Compute.makeVirtualMachine({
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
  dependencies: ({ resources }) => ({
    resourceGroup: resources.Resources.ResourceGroup["myResourceGroup"],
    galleryImage: resources.Compute.GalleryImage["myGalleryImage"],
    vault: resources.KeyVault.Vault["myVault"],
    networkSecurityGroup:
      resources.Network.NetworkSecurityGroup["myNetworkSecurityGroup"],
    dscpConfiguration:
      resources.Network.DscpConfiguration["myDscpConfiguration"],
    availabilitySet: resources.Compute.AvailabilitySet["myAvailabilitySet"],
    virtualMachineScaleSet:
      resources.Compute.VirtualMachineScaleSet["myVirtualMachineScaleSet"],
    proximityPlacementGroup:
      resources.Compute.ProximityPlacementGroup["myProximityPlacementGroup"],
    dedicatedHostGroup:
      resources.Compute.DedicatedHostGroup["myDedicatedHostGroup"],
    virtualMachineScaleSetVm:
      resources.Compute.VirtualMachineScaleSetVM["myVirtualMachineScaleSetVM"],
    capacityReservationGroup:
      resources.Compute.CapacityReservationGroup["myCapacityReservationGroup"],
  }),
});

```

### Create a vm with Host Encryption using encryptionAtHost property.
```js
provider.Compute.makeVirtualMachine({
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
  dependencies: ({ resources }) => ({
    resourceGroup: resources.Resources.ResourceGroup["myResourceGroup"],
    galleryImage: resources.Compute.GalleryImage["myGalleryImage"],
    vault: resources.KeyVault.Vault["myVault"],
    networkSecurityGroup:
      resources.Network.NetworkSecurityGroup["myNetworkSecurityGroup"],
    dscpConfiguration:
      resources.Network.DscpConfiguration["myDscpConfiguration"],
    availabilitySet: resources.Compute.AvailabilitySet["myAvailabilitySet"],
    virtualMachineScaleSet:
      resources.Compute.VirtualMachineScaleSet["myVirtualMachineScaleSet"],
    proximityPlacementGroup:
      resources.Compute.ProximityPlacementGroup["myProximityPlacementGroup"],
    dedicatedHostGroup:
      resources.Compute.DedicatedHostGroup["myDedicatedHostGroup"],
    virtualMachineScaleSetVm:
      resources.Compute.VirtualMachineScaleSetVM["myVirtualMachineScaleSetVM"],
    capacityReservationGroup:
      resources.Compute.CapacityReservationGroup["myCapacityReservationGroup"],
  }),
});

```

### Create a Windows vm with a patch setting patchMode of AutomaticByOS.
```js
provider.Compute.makeVirtualMachine({
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
  dependencies: ({ resources }) => ({
    resourceGroup: resources.Resources.ResourceGroup["myResourceGroup"],
    galleryImage: resources.Compute.GalleryImage["myGalleryImage"],
    vault: resources.KeyVault.Vault["myVault"],
    networkSecurityGroup:
      resources.Network.NetworkSecurityGroup["myNetworkSecurityGroup"],
    dscpConfiguration:
      resources.Network.DscpConfiguration["myDscpConfiguration"],
    availabilitySet: resources.Compute.AvailabilitySet["myAvailabilitySet"],
    virtualMachineScaleSet:
      resources.Compute.VirtualMachineScaleSet["myVirtualMachineScaleSet"],
    proximityPlacementGroup:
      resources.Compute.ProximityPlacementGroup["myProximityPlacementGroup"],
    dedicatedHostGroup:
      resources.Compute.DedicatedHostGroup["myDedicatedHostGroup"],
    virtualMachineScaleSetVm:
      resources.Compute.VirtualMachineScaleSetVM["myVirtualMachineScaleSetVM"],
    capacityReservationGroup:
      resources.Compute.CapacityReservationGroup["myCapacityReservationGroup"],
  }),
});

```

### Create a Windows vm with patch settings patchMode and assessmentMode set to AutomaticByPlatform.
```js
provider.Compute.makeVirtualMachine({
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
  dependencies: ({ resources }) => ({
    resourceGroup: resources.Resources.ResourceGroup["myResourceGroup"],
    galleryImage: resources.Compute.GalleryImage["myGalleryImage"],
    vault: resources.KeyVault.Vault["myVault"],
    networkSecurityGroup:
      resources.Network.NetworkSecurityGroup["myNetworkSecurityGroup"],
    dscpConfiguration:
      resources.Network.DscpConfiguration["myDscpConfiguration"],
    availabilitySet: resources.Compute.AvailabilitySet["myAvailabilitySet"],
    virtualMachineScaleSet:
      resources.Compute.VirtualMachineScaleSet["myVirtualMachineScaleSet"],
    proximityPlacementGroup:
      resources.Compute.ProximityPlacementGroup["myProximityPlacementGroup"],
    dedicatedHostGroup:
      resources.Compute.DedicatedHostGroup["myDedicatedHostGroup"],
    virtualMachineScaleSetVm:
      resources.Compute.VirtualMachineScaleSetVM["myVirtualMachineScaleSetVM"],
    capacityReservationGroup:
      resources.Compute.CapacityReservationGroup["myCapacityReservationGroup"],
  }),
});

```

### Create a Windows vm with a patch setting patchMode of Manual.
```js
provider.Compute.makeVirtualMachine({
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
  dependencies: ({ resources }) => ({
    resourceGroup: resources.Resources.ResourceGroup["myResourceGroup"],
    galleryImage: resources.Compute.GalleryImage["myGalleryImage"],
    vault: resources.KeyVault.Vault["myVault"],
    networkSecurityGroup:
      resources.Network.NetworkSecurityGroup["myNetworkSecurityGroup"],
    dscpConfiguration:
      resources.Network.DscpConfiguration["myDscpConfiguration"],
    availabilitySet: resources.Compute.AvailabilitySet["myAvailabilitySet"],
    virtualMachineScaleSet:
      resources.Compute.VirtualMachineScaleSet["myVirtualMachineScaleSet"],
    proximityPlacementGroup:
      resources.Compute.ProximityPlacementGroup["myProximityPlacementGroup"],
    dedicatedHostGroup:
      resources.Compute.DedicatedHostGroup["myDedicatedHostGroup"],
    virtualMachineScaleSetVm:
      resources.Compute.VirtualMachineScaleSetVM["myVirtualMachineScaleSetVM"],
    capacityReservationGroup:
      resources.Compute.CapacityReservationGroup["myCapacityReservationGroup"],
  }),
});

```

### Create a Windows vm with a patch setting assessmentMode of ImageDefault.
```js
provider.Compute.makeVirtualMachine({
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
  dependencies: ({ resources }) => ({
    resourceGroup: resources.Resources.ResourceGroup["myResourceGroup"],
    galleryImage: resources.Compute.GalleryImage["myGalleryImage"],
    vault: resources.KeyVault.Vault["myVault"],
    networkSecurityGroup:
      resources.Network.NetworkSecurityGroup["myNetworkSecurityGroup"],
    dscpConfiguration:
      resources.Network.DscpConfiguration["myDscpConfiguration"],
    availabilitySet: resources.Compute.AvailabilitySet["myAvailabilitySet"],
    virtualMachineScaleSet:
      resources.Compute.VirtualMachineScaleSet["myVirtualMachineScaleSet"],
    proximityPlacementGroup:
      resources.Compute.ProximityPlacementGroup["myProximityPlacementGroup"],
    dedicatedHostGroup:
      resources.Compute.DedicatedHostGroup["myDedicatedHostGroup"],
    virtualMachineScaleSetVm:
      resources.Compute.VirtualMachineScaleSetVM["myVirtualMachineScaleSetVM"],
    capacityReservationGroup:
      resources.Compute.CapacityReservationGroup["myCapacityReservationGroup"],
  }),
});

```

### Create a Windows vm with a patch setting patchMode of AutomaticByPlatform and enableHotpatching set to true.
```js
provider.Compute.makeVirtualMachine({
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
  dependencies: ({ resources }) => ({
    resourceGroup: resources.Resources.ResourceGroup["myResourceGroup"],
    galleryImage: resources.Compute.GalleryImage["myGalleryImage"],
    vault: resources.KeyVault.Vault["myVault"],
    networkSecurityGroup:
      resources.Network.NetworkSecurityGroup["myNetworkSecurityGroup"],
    dscpConfiguration:
      resources.Network.DscpConfiguration["myDscpConfiguration"],
    availabilitySet: resources.Compute.AvailabilitySet["myAvailabilitySet"],
    virtualMachineScaleSet:
      resources.Compute.VirtualMachineScaleSet["myVirtualMachineScaleSet"],
    proximityPlacementGroup:
      resources.Compute.ProximityPlacementGroup["myProximityPlacementGroup"],
    dedicatedHostGroup:
      resources.Compute.DedicatedHostGroup["myDedicatedHostGroup"],
    virtualMachineScaleSetVm:
      resources.Compute.VirtualMachineScaleSetVM["myVirtualMachineScaleSetVM"],
    capacityReservationGroup:
      resources.Compute.CapacityReservationGroup["myCapacityReservationGroup"],
  }),
});

```

### Create a Linux vm with a patch settings patchMode and assessmentMode set to AutomaticByPlatform.
```js
provider.Compute.makeVirtualMachine({
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
  dependencies: ({ resources }) => ({
    resourceGroup: resources.Resources.ResourceGroup["myResourceGroup"],
    galleryImage: resources.Compute.GalleryImage["myGalleryImage"],
    vault: resources.KeyVault.Vault["myVault"],
    networkSecurityGroup:
      resources.Network.NetworkSecurityGroup["myNetworkSecurityGroup"],
    dscpConfiguration:
      resources.Network.DscpConfiguration["myDscpConfiguration"],
    availabilitySet: resources.Compute.AvailabilitySet["myAvailabilitySet"],
    virtualMachineScaleSet:
      resources.Compute.VirtualMachineScaleSet["myVirtualMachineScaleSet"],
    proximityPlacementGroup:
      resources.Compute.ProximityPlacementGroup["myProximityPlacementGroup"],
    dedicatedHostGroup:
      resources.Compute.DedicatedHostGroup["myDedicatedHostGroup"],
    virtualMachineScaleSetVm:
      resources.Compute.VirtualMachineScaleSetVM["myVirtualMachineScaleSetVM"],
    capacityReservationGroup:
      resources.Compute.CapacityReservationGroup["myCapacityReservationGroup"],
  }),
});

```

### Create a Linux vm with a patch setting patchMode of ImageDefault.
```js
provider.Compute.makeVirtualMachine({
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
  dependencies: ({ resources }) => ({
    resourceGroup: resources.Resources.ResourceGroup["myResourceGroup"],
    galleryImage: resources.Compute.GalleryImage["myGalleryImage"],
    vault: resources.KeyVault.Vault["myVault"],
    networkSecurityGroup:
      resources.Network.NetworkSecurityGroup["myNetworkSecurityGroup"],
    dscpConfiguration:
      resources.Network.DscpConfiguration["myDscpConfiguration"],
    availabilitySet: resources.Compute.AvailabilitySet["myAvailabilitySet"],
    virtualMachineScaleSet:
      resources.Compute.VirtualMachineScaleSet["myVirtualMachineScaleSet"],
    proximityPlacementGroup:
      resources.Compute.ProximityPlacementGroup["myProximityPlacementGroup"],
    dedicatedHostGroup:
      resources.Compute.DedicatedHostGroup["myDedicatedHostGroup"],
    virtualMachineScaleSetVm:
      resources.Compute.VirtualMachineScaleSetVM["myVirtualMachineScaleSetVM"],
    capacityReservationGroup:
      resources.Compute.CapacityReservationGroup["myCapacityReservationGroup"],
  }),
});

```

### Create a Linux vm with a patch setting assessmentMode of ImageDefault.
```js
provider.Compute.makeVirtualMachine({
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
  dependencies: ({ resources }) => ({
    resourceGroup: resources.Resources.ResourceGroup["myResourceGroup"],
    galleryImage: resources.Compute.GalleryImage["myGalleryImage"],
    vault: resources.KeyVault.Vault["myVault"],
    networkSecurityGroup:
      resources.Network.NetworkSecurityGroup["myNetworkSecurityGroup"],
    dscpConfiguration:
      resources.Network.DscpConfiguration["myDscpConfiguration"],
    availabilitySet: resources.Compute.AvailabilitySet["myAvailabilitySet"],
    virtualMachineScaleSet:
      resources.Compute.VirtualMachineScaleSet["myVirtualMachineScaleSet"],
    proximityPlacementGroup:
      resources.Compute.ProximityPlacementGroup["myProximityPlacementGroup"],
    dedicatedHostGroup:
      resources.Compute.DedicatedHostGroup["myDedicatedHostGroup"],
    virtualMachineScaleSetVm:
      resources.Compute.VirtualMachineScaleSetVM["myVirtualMachineScaleSetVM"],
    capacityReservationGroup:
      resources.Compute.CapacityReservationGroup["myCapacityReservationGroup"],
  }),
});

```

### Create a vm with an extensions time budget.
```js
provider.Compute.makeVirtualMachine({
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
  dependencies: ({ resources }) => ({
    resourceGroup: resources.Resources.ResourceGroup["myResourceGroup"],
    galleryImage: resources.Compute.GalleryImage["myGalleryImage"],
    vault: resources.KeyVault.Vault["myVault"],
    networkSecurityGroup:
      resources.Network.NetworkSecurityGroup["myNetworkSecurityGroup"],
    dscpConfiguration:
      resources.Network.DscpConfiguration["myDscpConfiguration"],
    availabilitySet: resources.Compute.AvailabilitySet["myAvailabilitySet"],
    virtualMachineScaleSet:
      resources.Compute.VirtualMachineScaleSet["myVirtualMachineScaleSet"],
    proximityPlacementGroup:
      resources.Compute.ProximityPlacementGroup["myProximityPlacementGroup"],
    dedicatedHostGroup:
      resources.Compute.DedicatedHostGroup["myDedicatedHostGroup"],
    virtualMachineScaleSetVm:
      resources.Compute.VirtualMachineScaleSetVM["myVirtualMachineScaleSetVM"],
    capacityReservationGroup:
      resources.Compute.CapacityReservationGroup["myCapacityReservationGroup"],
  }),
});

```

### Create a VM with Uefi Settings of secureBoot and vTPM.
```js
provider.Compute.makeVirtualMachine({
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
  dependencies: ({ resources }) => ({
    resourceGroup: resources.Resources.ResourceGroup["myResourceGroup"],
    galleryImage: resources.Compute.GalleryImage["myGalleryImage"],
    vault: resources.KeyVault.Vault["myVault"],
    networkSecurityGroup:
      resources.Network.NetworkSecurityGroup["myNetworkSecurityGroup"],
    dscpConfiguration:
      resources.Network.DscpConfiguration["myDscpConfiguration"],
    availabilitySet: resources.Compute.AvailabilitySet["myAvailabilitySet"],
    virtualMachineScaleSet:
      resources.Compute.VirtualMachineScaleSet["myVirtualMachineScaleSet"],
    proximityPlacementGroup:
      resources.Compute.ProximityPlacementGroup["myProximityPlacementGroup"],
    dedicatedHostGroup:
      resources.Compute.DedicatedHostGroup["myDedicatedHostGroup"],
    virtualMachineScaleSetVm:
      resources.Compute.VirtualMachineScaleSetVM["myVirtualMachineScaleSetVM"],
    capacityReservationGroup:
      resources.Compute.CapacityReservationGroup["myCapacityReservationGroup"],
  }),
});

```

### Create a vm from a generalized shared image.
```js
provider.Compute.makeVirtualMachine({
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
  dependencies: ({ resources }) => ({
    resourceGroup: resources.Resources.ResourceGroup["myResourceGroup"],
    galleryImage: resources.Compute.GalleryImage["myGalleryImage"],
    vault: resources.KeyVault.Vault["myVault"],
    networkSecurityGroup:
      resources.Network.NetworkSecurityGroup["myNetworkSecurityGroup"],
    dscpConfiguration:
      resources.Network.DscpConfiguration["myDscpConfiguration"],
    availabilitySet: resources.Compute.AvailabilitySet["myAvailabilitySet"],
    virtualMachineScaleSet:
      resources.Compute.VirtualMachineScaleSet["myVirtualMachineScaleSet"],
    proximityPlacementGroup:
      resources.Compute.ProximityPlacementGroup["myProximityPlacementGroup"],
    dedicatedHostGroup:
      resources.Compute.DedicatedHostGroup["myDedicatedHostGroup"],
    virtualMachineScaleSetVm:
      resources.Compute.VirtualMachineScaleSetVM["myVirtualMachineScaleSetVM"],
    capacityReservationGroup:
      resources.Compute.CapacityReservationGroup["myCapacityReservationGroup"],
  }),
});

```

### Create a vm from a specialized shared image.
```js
provider.Compute.makeVirtualMachine({
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
  dependencies: ({ resources }) => ({
    resourceGroup: resources.Resources.ResourceGroup["myResourceGroup"],
    galleryImage: resources.Compute.GalleryImage["myGalleryImage"],
    vault: resources.KeyVault.Vault["myVault"],
    networkSecurityGroup:
      resources.Network.NetworkSecurityGroup["myNetworkSecurityGroup"],
    dscpConfiguration:
      resources.Network.DscpConfiguration["myDscpConfiguration"],
    availabilitySet: resources.Compute.AvailabilitySet["myAvailabilitySet"],
    virtualMachineScaleSet:
      resources.Compute.VirtualMachineScaleSet["myVirtualMachineScaleSet"],
    proximityPlacementGroup:
      resources.Compute.ProximityPlacementGroup["myProximityPlacementGroup"],
    dedicatedHostGroup:
      resources.Compute.DedicatedHostGroup["myDedicatedHostGroup"],
    virtualMachineScaleSetVm:
      resources.Compute.VirtualMachineScaleSetVM["myVirtualMachineScaleSetVM"],
    capacityReservationGroup:
      resources.Compute.CapacityReservationGroup["myCapacityReservationGroup"],
  }),
});

```

### Create a VM with network interface configuration
```js
provider.Compute.makeVirtualMachine({
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
  dependencies: ({ resources }) => ({
    resourceGroup: resources.Resources.ResourceGroup["myResourceGroup"],
    galleryImage: resources.Compute.GalleryImage["myGalleryImage"],
    vault: resources.KeyVault.Vault["myVault"],
    networkSecurityGroup:
      resources.Network.NetworkSecurityGroup["myNetworkSecurityGroup"],
    dscpConfiguration:
      resources.Network.DscpConfiguration["myDscpConfiguration"],
    availabilitySet: resources.Compute.AvailabilitySet["myAvailabilitySet"],
    virtualMachineScaleSet:
      resources.Compute.VirtualMachineScaleSet["myVirtualMachineScaleSet"],
    proximityPlacementGroup:
      resources.Compute.ProximityPlacementGroup["myProximityPlacementGroup"],
    dedicatedHostGroup:
      resources.Compute.DedicatedHostGroup["myDedicatedHostGroup"],
    virtualMachineScaleSetVm:
      resources.Compute.VirtualMachineScaleSetVM["myVirtualMachineScaleSetVM"],
    capacityReservationGroup:
      resources.Compute.CapacityReservationGroup["myCapacityReservationGroup"],
  }),
});

```

### Create a VM with UserData
```js
provider.Compute.makeVirtualMachine({
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
  dependencies: ({ resources }) => ({
    resourceGroup: resources.Resources.ResourceGroup["myResourceGroup"],
    galleryImage: resources.Compute.GalleryImage["myGalleryImage"],
    vault: resources.KeyVault.Vault["myVault"],
    networkSecurityGroup:
      resources.Network.NetworkSecurityGroup["myNetworkSecurityGroup"],
    dscpConfiguration:
      resources.Network.DscpConfiguration["myDscpConfiguration"],
    availabilitySet: resources.Compute.AvailabilitySet["myAvailabilitySet"],
    virtualMachineScaleSet:
      resources.Compute.VirtualMachineScaleSet["myVirtualMachineScaleSet"],
    proximityPlacementGroup:
      resources.Compute.ProximityPlacementGroup["myProximityPlacementGroup"],
    dedicatedHostGroup:
      resources.Compute.DedicatedHostGroup["myDedicatedHostGroup"],
    virtualMachineScaleSetVm:
      resources.Compute.VirtualMachineScaleSetVM["myVirtualMachineScaleSetVM"],
    capacityReservationGroup:
      resources.Compute.CapacityReservationGroup["myCapacityReservationGroup"],
  }),
});

```

### Create a vm with Application Profile.
```js
provider.Compute.makeVirtualMachine({
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
  dependencies: ({ resources }) => ({
    resourceGroup: resources.Resources.ResourceGroup["myResourceGroup"],
    galleryImage: resources.Compute.GalleryImage["myGalleryImage"],
    vault: resources.KeyVault.Vault["myVault"],
    networkSecurityGroup:
      resources.Network.NetworkSecurityGroup["myNetworkSecurityGroup"],
    dscpConfiguration:
      resources.Network.DscpConfiguration["myDscpConfiguration"],
    availabilitySet: resources.Compute.AvailabilitySet["myAvailabilitySet"],
    virtualMachineScaleSet:
      resources.Compute.VirtualMachineScaleSet["myVirtualMachineScaleSet"],
    proximityPlacementGroup:
      resources.Compute.ProximityPlacementGroup["myProximityPlacementGroup"],
    dedicatedHostGroup:
      resources.Compute.DedicatedHostGroup["myDedicatedHostGroup"],
    virtualMachineScaleSetVm:
      resources.Compute.VirtualMachineScaleSetVM["myVirtualMachineScaleSetVM"],
    capacityReservationGroup:
      resources.Compute.CapacityReservationGroup["myCapacityReservationGroup"],
  }),
});

```

### Create a VM with HibernationEnabled
```js
provider.Compute.makeVirtualMachine({
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
  dependencies: ({ resources }) => ({
    resourceGroup: resources.Resources.ResourceGroup["myResourceGroup"],
    galleryImage: resources.Compute.GalleryImage["myGalleryImage"],
    vault: resources.KeyVault.Vault["myVault"],
    networkSecurityGroup:
      resources.Network.NetworkSecurityGroup["myNetworkSecurityGroup"],
    dscpConfiguration:
      resources.Network.DscpConfiguration["myDscpConfiguration"],
    availabilitySet: resources.Compute.AvailabilitySet["myAvailabilitySet"],
    virtualMachineScaleSet:
      resources.Compute.VirtualMachineScaleSet["myVirtualMachineScaleSet"],
    proximityPlacementGroup:
      resources.Compute.ProximityPlacementGroup["myProximityPlacementGroup"],
    dedicatedHostGroup:
      resources.Compute.DedicatedHostGroup["myDedicatedHostGroup"],
    virtualMachineScaleSetVm:
      resources.Compute.VirtualMachineScaleSetVM["myVirtualMachineScaleSetVM"],
    capacityReservationGroup:
      resources.Compute.CapacityReservationGroup["myCapacityReservationGroup"],
  }),
});

```

### Create a VM with VM Size Properties
```js
provider.Compute.makeVirtualMachine({
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
  dependencies: ({ resources }) => ({
    resourceGroup: resources.Resources.ResourceGroup["myResourceGroup"],
    galleryImage: resources.Compute.GalleryImage["myGalleryImage"],
    vault: resources.KeyVault.Vault["myVault"],
    networkSecurityGroup:
      resources.Network.NetworkSecurityGroup["myNetworkSecurityGroup"],
    dscpConfiguration:
      resources.Network.DscpConfiguration["myDscpConfiguration"],
    availabilitySet: resources.Compute.AvailabilitySet["myAvailabilitySet"],
    virtualMachineScaleSet:
      resources.Compute.VirtualMachineScaleSet["myVirtualMachineScaleSet"],
    proximityPlacementGroup:
      resources.Compute.ProximityPlacementGroup["myProximityPlacementGroup"],
    dedicatedHostGroup:
      resources.Compute.DedicatedHostGroup["myDedicatedHostGroup"],
    virtualMachineScaleSetVm:
      resources.Compute.VirtualMachineScaleSetVM["myVirtualMachineScaleSetVM"],
    capacityReservationGroup:
      resources.Compute.CapacityReservationGroup["myCapacityReservationGroup"],
  }),
});

```

### Create or update a VM with capacity reservation
```js
provider.Compute.makeVirtualMachine({
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
  dependencies: ({ resources }) => ({
    resourceGroup: resources.Resources.ResourceGroup["myResourceGroup"],
    galleryImage: resources.Compute.GalleryImage["myGalleryImage"],
    vault: resources.KeyVault.Vault["myVault"],
    networkSecurityGroup:
      resources.Network.NetworkSecurityGroup["myNetworkSecurityGroup"],
    dscpConfiguration:
      resources.Network.DscpConfiguration["myDscpConfiguration"],
    availabilitySet: resources.Compute.AvailabilitySet["myAvailabilitySet"],
    virtualMachineScaleSet:
      resources.Compute.VirtualMachineScaleSet["myVirtualMachineScaleSet"],
    proximityPlacementGroup:
      resources.Compute.ProximityPlacementGroup["myProximityPlacementGroup"],
    dedicatedHostGroup:
      resources.Compute.DedicatedHostGroup["myDedicatedHostGroup"],
    virtualMachineScaleSetVm:
      resources.Compute.VirtualMachineScaleSetVM["myVirtualMachineScaleSetVM"],
    capacityReservationGroup:
      resources.Compute.CapacityReservationGroup["myCapacityReservationGroup"],
  }),
});

```

### Create a VM from a shared gallery image
```js
provider.Compute.makeVirtualMachine({
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
  dependencies: ({ resources }) => ({
    resourceGroup: resources.Resources.ResourceGroup["myResourceGroup"],
    galleryImage: resources.Compute.GalleryImage["myGalleryImage"],
    vault: resources.KeyVault.Vault["myVault"],
    networkSecurityGroup:
      resources.Network.NetworkSecurityGroup["myNetworkSecurityGroup"],
    dscpConfiguration:
      resources.Network.DscpConfiguration["myDscpConfiguration"],
    availabilitySet: resources.Compute.AvailabilitySet["myAvailabilitySet"],
    virtualMachineScaleSet:
      resources.Compute.VirtualMachineScaleSet["myVirtualMachineScaleSet"],
    proximityPlacementGroup:
      resources.Compute.ProximityPlacementGroup["myProximityPlacementGroup"],
    dedicatedHostGroup:
      resources.Compute.DedicatedHostGroup["myDedicatedHostGroup"],
    virtualMachineScaleSetVm:
      resources.Compute.VirtualMachineScaleSetVM["myVirtualMachineScaleSetVM"],
    capacityReservationGroup:
      resources.Compute.CapacityReservationGroup["myCapacityReservationGroup"],
  }),
});

```
## Dependencies
- [ResourceGroup](../Resources/ResourceGroup.md)
- [GalleryImage](../Compute/GalleryImage.md)
- [Vault](../KeyVault/Vault.md)
- [NetworkSecurityGroup](../Network/NetworkSecurityGroup.md)
- [DscpConfiguration](../Network/DscpConfiguration.md)
- [AvailabilitySet](../Compute/AvailabilitySet.md)
- [VirtualMachineScaleSet](../Compute/VirtualMachineScaleSet.md)
- [ProximityPlacementGroup](../Compute/ProximityPlacementGroup.md)
- [DedicatedHostGroup](../Compute/DedicatedHostGroup.md)
- [VirtualMachineScaleSetVM](../Compute/VirtualMachineScaleSetVM.md)
- [CapacityReservationGroup](../Compute/CapacityReservationGroup.md)
## Misc
The resource version is `2021-07-01`.

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/compute/resource-manager/Microsoft.Compute/stable/2021-07-01/compute.json).
