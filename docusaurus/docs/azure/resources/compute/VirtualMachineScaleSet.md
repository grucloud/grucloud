---
id: VirtualMachineScaleSet
title: VirtualMachineScaleSet
---
Provides a **VirtualMachineScaleSet** from the **Compute** group
## Examples
### Create a scale set with password authentication.
```js
provider.Compute.makeVirtualMachineScaleSet({
  name: "myVirtualMachineScaleSet",
  properties: () => ({
    sku: { tier: "Standard", capacity: 3, name: "Standard_D1_v2" },
    location: "westus",
    properties: {
      overprovision: true,
      virtualMachineProfile: {
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
            createOption: "FromImage",
          },
        },
        osProfile: {
          computerNamePrefix: "{vmss-name}",
          adminUsername: "{your-username}",
          adminPassword: "{your-password}",
        },
        networkProfile: {
          networkInterfaceConfigurations: [
            {
              name: "{vmss-name}",
              properties: {
                primary: true,
                enableIPForwarding: true,
                ipConfigurations: [
                  {
                    name: "{vmss-name}",
                    properties: {
                      subnet: {
                        id: "/subscriptions/{subscription-id}/resourceGroups/myResourceGroup/providers/Microsoft.Network/virtualNetworks/{existing-virtual-network-name}/subnets/{existing-subnet-name}",
                      },
                    },
                  },
                ],
              },
            },
          ],
        },
      },
      upgradePolicy: { mode: "Manual" },
    },
  }),
  dependencies: ({ resources }) => ({
    resourceGroup: resources.Resources.ResourceGroup["myResourceGroup"],
    galleryImage: resources.Compute.GalleryImage["myGalleryImage"],
    networkSecurityGroup:
      resources.Network.NetworkSecurityGroup["myNetworkSecurityGroup"],
    capacityReservationGroup:
      resources.Compute.CapacityReservationGroup["myCapacityReservationGroup"],
    proximityPlacementGroup:
      resources.Compute.ProximityPlacementGroup["myProximityPlacementGroup"],
    dedicatedHostGroup:
      resources.Compute.DedicatedHostGroup["myDedicatedHostGroup"],
  }),
});

```

### Create a scale set with ssh authentication.
```js
provider.Compute.makeVirtualMachineScaleSet({
  name: "myVirtualMachineScaleSet",
  properties: () => ({
    sku: { tier: "Standard", capacity: 3, name: "Standard_D1_v2" },
    location: "westus",
    properties: {
      overprovision: true,
      virtualMachineProfile: {
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
            createOption: "FromImage",
          },
        },
        osProfile: {
          computerNamePrefix: "{vmss-name}",
          adminUsername: "{your-username}",
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
          networkInterfaceConfigurations: [
            {
              name: "{vmss-name}",
              properties: {
                primary: true,
                enableIPForwarding: true,
                ipConfigurations: [
                  {
                    name: "{vmss-name}",
                    properties: {
                      subnet: {
                        id: "/subscriptions/{subscription-id}/resourceGroups/myResourceGroup/providers/Microsoft.Network/virtualNetworks/{existing-virtual-network-name}/subnets/{existing-subnet-name}",
                      },
                    },
                  },
                ],
              },
            },
          ],
        },
      },
      upgradePolicy: { mode: "Manual" },
    },
  }),
  dependencies: ({ resources }) => ({
    resourceGroup: resources.Resources.ResourceGroup["myResourceGroup"],
    galleryImage: resources.Compute.GalleryImage["myGalleryImage"],
    networkSecurityGroup:
      resources.Network.NetworkSecurityGroup["myNetworkSecurityGroup"],
    capacityReservationGroup:
      resources.Compute.CapacityReservationGroup["myCapacityReservationGroup"],
    proximityPlacementGroup:
      resources.Compute.ProximityPlacementGroup["myProximityPlacementGroup"],
    dedicatedHostGroup:
      resources.Compute.DedicatedHostGroup["myDedicatedHostGroup"],
  }),
});

```

### Create a scale set with premium storage.
```js
provider.Compute.makeVirtualMachineScaleSet({
  name: "myVirtualMachineScaleSet",
  properties: () => ({
    sku: { tier: "Standard", capacity: 3, name: "Standard_D1_v2" },
    location: "westus",
    properties: {
      overprovision: true,
      virtualMachineProfile: {
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
            createOption: "FromImage",
          },
        },
        osProfile: {
          computerNamePrefix: "{vmss-name}",
          adminUsername: "{your-username}",
          adminPassword: "{your-password}",
        },
        networkProfile: {
          networkInterfaceConfigurations: [
            {
              name: "{vmss-name}",
              properties: {
                primary: true,
                enableIPForwarding: true,
                ipConfigurations: [
                  {
                    name: "{vmss-name}",
                    properties: {
                      subnet: {
                        id: "/subscriptions/{subscription-id}/resourceGroups/myResourceGroup/providers/Microsoft.Network/virtualNetworks/{existing-virtual-network-name}/subnets/{existing-subnet-name}",
                      },
                    },
                  },
                ],
              },
            },
          ],
        },
      },
      upgradePolicy: { mode: "Manual" },
    },
  }),
  dependencies: ({ resources }) => ({
    resourceGroup: resources.Resources.ResourceGroup["myResourceGroup"],
    galleryImage: resources.Compute.GalleryImage["myGalleryImage"],
    networkSecurityGroup:
      resources.Network.NetworkSecurityGroup["myNetworkSecurityGroup"],
    capacityReservationGroup:
      resources.Compute.CapacityReservationGroup["myCapacityReservationGroup"],
    proximityPlacementGroup:
      resources.Compute.ProximityPlacementGroup["myProximityPlacementGroup"],
    dedicatedHostGroup:
      resources.Compute.DedicatedHostGroup["myDedicatedHostGroup"],
  }),
});

```

### Create a scale set with empty data disks on each vm.
```js
provider.Compute.makeVirtualMachineScaleSet({
  name: "myVirtualMachineScaleSet",
  properties: () => ({
    sku: { tier: "Standard", capacity: 3, name: "Standard_D2_v2" },
    location: "westus",
    properties: {
      overprovision: true,
      virtualMachineProfile: {
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
            createOption: "FromImage",
            diskSizeGB: 512,
          },
          dataDisks: [
            { diskSizeGB: 1023, createOption: "Empty", lun: 0 },
            { diskSizeGB: 1023, createOption: "Empty", lun: 1 },
          ],
        },
        osProfile: {
          computerNamePrefix: "{vmss-name}",
          adminUsername: "{your-username}",
          adminPassword: "{your-password}",
        },
        networkProfile: {
          networkInterfaceConfigurations: [
            {
              name: "{vmss-name}",
              properties: {
                primary: true,
                enableIPForwarding: true,
                ipConfigurations: [
                  {
                    name: "{vmss-name}",
                    properties: {
                      subnet: {
                        id: "/subscriptions/{subscription-id}/resourceGroups/myResourceGroup/providers/Microsoft.Network/virtualNetworks/{existing-virtual-network-name}/subnets/{existing-subnet-name}",
                      },
                    },
                  },
                ],
              },
            },
          ],
        },
      },
      upgradePolicy: { mode: "Manual" },
    },
  }),
  dependencies: ({ resources }) => ({
    resourceGroup: resources.Resources.ResourceGroup["myResourceGroup"],
    galleryImage: resources.Compute.GalleryImage["myGalleryImage"],
    networkSecurityGroup:
      resources.Network.NetworkSecurityGroup["myNetworkSecurityGroup"],
    capacityReservationGroup:
      resources.Compute.CapacityReservationGroup["myCapacityReservationGroup"],
    proximityPlacementGroup:
      resources.Compute.ProximityPlacementGroup["myProximityPlacementGroup"],
    dedicatedHostGroup:
      resources.Compute.DedicatedHostGroup["myDedicatedHostGroup"],
  }),
});

```

### Create a scale set with an azure load balancer.
```js
provider.Compute.makeVirtualMachineScaleSet({
  name: "myVirtualMachineScaleSet",
  properties: () => ({
    sku: { tier: "Standard", capacity: 3, name: "Standard_D1_v2" },
    location: "westus",
    properties: {
      overprovision: true,
      virtualMachineProfile: {
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
            createOption: "FromImage",
          },
        },
        osProfile: {
          computerNamePrefix: "{vmss-name}",
          adminUsername: "{your-username}",
          adminPassword: "{your-password}",
        },
        networkProfile: {
          networkInterfaceConfigurations: [
            {
              name: "{vmss-name}",
              properties: {
                primary: true,
                enableIPForwarding: true,
                ipConfigurations: [
                  {
                    name: "{vmss-name}",
                    properties: {
                      subnet: {
                        id: "/subscriptions/{subscription-id}/resourceGroups/myResourceGroup/providers/Microsoft.Network/virtualNetworks/{existing-virtual-network-name}/subnets/{existing-subnet-name}",
                      },
                      publicIPAddressConfiguration: {
                        name: "{vmss-name}",
                        properties: { publicIPAddressVersion: "IPv4" },
                      },
                      loadBalancerInboundNatPools: [
                        {
                          id: "/subscriptions/{subscription-id}/resourceGroups/myResourceGroup/providers/Microsoft.Network/loadBalancers/{existing-load-balancer-name}/inboundNatPools/{existing-nat-pool-name}",
                        },
                      ],
                      loadBalancerBackendAddressPools: [
                        {
                          id: "/subscriptions/{subscription-id}/resourceGroups/myResourceGroup/providers/Microsoft.Network/loadBalancers/{existing-load-balancer-name}/backendAddressPools/{existing-backend-address-pool-name}",
                        },
                      ],
                    },
                  },
                ],
              },
            },
          ],
        },
      },
      upgradePolicy: { mode: "Manual" },
    },
  }),
  dependencies: ({ resources }) => ({
    resourceGroup: resources.Resources.ResourceGroup["myResourceGroup"],
    galleryImage: resources.Compute.GalleryImage["myGalleryImage"],
    networkSecurityGroup:
      resources.Network.NetworkSecurityGroup["myNetworkSecurityGroup"],
    capacityReservationGroup:
      resources.Compute.CapacityReservationGroup["myCapacityReservationGroup"],
    proximityPlacementGroup:
      resources.Compute.ProximityPlacementGroup["myProximityPlacementGroup"],
    dedicatedHostGroup:
      resources.Compute.DedicatedHostGroup["myDedicatedHostGroup"],
  }),
});

```

### Create a scale set with an azure application gateway.
```js
provider.Compute.makeVirtualMachineScaleSet({
  name: "myVirtualMachineScaleSet",
  properties: () => ({
    sku: { tier: "Standard", capacity: 3, name: "Standard_D1_v2" },
    location: "westus",
    properties: {
      overprovision: true,
      virtualMachineProfile: {
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
            createOption: "FromImage",
          },
        },
        osProfile: {
          computerNamePrefix: "{vmss-name}",
          adminUsername: "{your-username}",
          adminPassword: "{your-password}",
        },
        networkProfile: {
          networkInterfaceConfigurations: [
            {
              name: "{vmss-name}",
              properties: {
                primary: true,
                enableIPForwarding: true,
                ipConfigurations: [
                  {
                    name: "{vmss-name}",
                    properties: {
                      applicationGatewayBackendAddressPools: [
                        {
                          id: "/subscriptions/{subscription-id}/resourceGroups/myResourceGroup/providers/Microsoft.Network/applicationGateways/{existing-application-gateway-name}/backendAddressPools/{existing-backend-address-pool-name}",
                        },
                      ],
                      subnet: {
                        id: "/subscriptions/{subscription-id}/resourceGroups/myResourceGroup/providers/Microsoft.Network/virtualNetworks/{existing-virtual-network-name}/subnets/{existing-subnet-name}",
                      },
                    },
                  },
                ],
              },
            },
          ],
        },
      },
      upgradePolicy: { mode: "Manual" },
    },
  }),
  dependencies: ({ resources }) => ({
    resourceGroup: resources.Resources.ResourceGroup["myResourceGroup"],
    galleryImage: resources.Compute.GalleryImage["myGalleryImage"],
    networkSecurityGroup:
      resources.Network.NetworkSecurityGroup["myNetworkSecurityGroup"],
    capacityReservationGroup:
      resources.Compute.CapacityReservationGroup["myCapacityReservationGroup"],
    proximityPlacementGroup:
      resources.Compute.ProximityPlacementGroup["myProximityPlacementGroup"],
    dedicatedHostGroup:
      resources.Compute.DedicatedHostGroup["myDedicatedHostGroup"],
  }),
});

```

### Create a scale set with boot diagnostics.
```js
provider.Compute.makeVirtualMachineScaleSet({
  name: "myVirtualMachineScaleSet",
  properties: () => ({
    sku: { tier: "Standard", capacity: 3, name: "Standard_D1_v2" },
    location: "westus",
    properties: {
      overprovision: true,
      virtualMachineProfile: {
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
            createOption: "FromImage",
          },
        },
        diagnosticsProfile: {
          bootDiagnostics: {
            storageUri:
              "http://{existing-storage-account-name}.blob.core.windows.net",
            enabled: true,
          },
        },
        osProfile: {
          computerNamePrefix: "{vmss-name}",
          adminUsername: "{your-username}",
          adminPassword: "{your-password}",
        },
        networkProfile: {
          networkInterfaceConfigurations: [
            {
              name: "{vmss-name}",
              properties: {
                primary: true,
                enableIPForwarding: true,
                ipConfigurations: [
                  {
                    name: "{vmss-name}",
                    properties: {
                      subnet: {
                        id: "/subscriptions/{subscription-id}/resourceGroups/myResourceGroup/providers/Microsoft.Network/virtualNetworks/{existing-virtual-network-name}/subnets/{existing-subnet-name}",
                      },
                    },
                  },
                ],
              },
            },
          ],
        },
      },
      upgradePolicy: { mode: "Manual" },
    },
  }),
  dependencies: ({ resources }) => ({
    resourceGroup: resources.Resources.ResourceGroup["myResourceGroup"],
    galleryImage: resources.Compute.GalleryImage["myGalleryImage"],
    networkSecurityGroup:
      resources.Network.NetworkSecurityGroup["myNetworkSecurityGroup"],
    capacityReservationGroup:
      resources.Compute.CapacityReservationGroup["myCapacityReservationGroup"],
    proximityPlacementGroup:
      resources.Compute.ProximityPlacementGroup["myProximityPlacementGroup"],
    dedicatedHostGroup:
      resources.Compute.DedicatedHostGroup["myDedicatedHostGroup"],
  }),
});

```

### Create a scale set with managed boot diagnostics.
```js
provider.Compute.makeVirtualMachineScaleSet({
  name: "myVirtualMachineScaleSet",
  properties: () => ({
    sku: { tier: "Standard", capacity: 3, name: "Standard_D1_v2" },
    location: "westus",
    properties: {
      overprovision: true,
      virtualMachineProfile: {
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
            createOption: "FromImage",
          },
        },
        diagnosticsProfile: { bootDiagnostics: { enabled: true } },
        osProfile: {
          computerNamePrefix: "{vmss-name}",
          adminUsername: "{your-username}",
          adminPassword: "{your-password}",
        },
        networkProfile: {
          networkInterfaceConfigurations: [
            {
              name: "{vmss-name}",
              properties: {
                primary: true,
                enableIPForwarding: true,
                ipConfigurations: [
                  {
                    name: "{vmss-name}",
                    properties: {
                      subnet: {
                        id: "/subscriptions/{subscription-id}/resourceGroups/myResourceGroup/providers/Microsoft.Network/virtualNetworks/{existing-virtual-network-name}/subnets/{existing-subnet-name}",
                      },
                    },
                  },
                ],
              },
            },
          ],
        },
      },
      upgradePolicy: { mode: "Manual" },
    },
  }),
  dependencies: ({ resources }) => ({
    resourceGroup: resources.Resources.ResourceGroup["myResourceGroup"],
    galleryImage: resources.Compute.GalleryImage["myGalleryImage"],
    networkSecurityGroup:
      resources.Network.NetworkSecurityGroup["myNetworkSecurityGroup"],
    capacityReservationGroup:
      resources.Compute.CapacityReservationGroup["myCapacityReservationGroup"],
    proximityPlacementGroup:
      resources.Compute.ProximityPlacementGroup["myProximityPlacementGroup"],
    dedicatedHostGroup:
      resources.Compute.DedicatedHostGroup["myDedicatedHostGroup"],
  }),
});

```

### Create a scale set with a marketplace image plan.
```js
provider.Compute.makeVirtualMachineScaleSet({
  name: "myVirtualMachineScaleSet",
  properties: () => ({
    sku: { tier: "Standard", capacity: 3, name: "Standard_D1_v2" },
    properties: {
      overprovision: true,
      virtualMachineProfile: {
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
            createOption: "FromImage",
          },
        },
        osProfile: {
          computerNamePrefix: "{vmss-name}",
          adminUsername: "{your-username}",
          adminPassword: "{your-password}",
        },
        networkProfile: {
          networkInterfaceConfigurations: [
            {
              name: "{vmss-name}",
              properties: {
                primary: true,
                enableIPForwarding: true,
                ipConfigurations: [
                  {
                    name: "{vmss-name}",
                    properties: {
                      subnet: {
                        id: "/subscriptions/{subscription-id}/resourceGroups/myResourceGroup/providers/Microsoft.Network/virtualNetworks/{existing-virtual-network-name}/subnets/{existing-subnet-name}",
                      },
                    },
                  },
                ],
              },
            },
          ],
        },
      },
      upgradePolicy: { mode: "Manual" },
    },
    plan: {
      publisher: "microsoft-ads",
      product: "windows-data-science-vm",
      name: "windows2016",
    },
    location: "westus",
  }),
  dependencies: ({ resources }) => ({
    resourceGroup: resources.Resources.ResourceGroup["myResourceGroup"],
    galleryImage: resources.Compute.GalleryImage["myGalleryImage"],
    networkSecurityGroup:
      resources.Network.NetworkSecurityGroup["myNetworkSecurityGroup"],
    capacityReservationGroup:
      resources.Compute.CapacityReservationGroup["myCapacityReservationGroup"],
    proximityPlacementGroup:
      resources.Compute.ProximityPlacementGroup["myProximityPlacementGroup"],
    dedicatedHostGroup:
      resources.Compute.DedicatedHostGroup["myDedicatedHostGroup"],
  }),
});

```

### Create a scale set from a custom image.
```js
provider.Compute.makeVirtualMachineScaleSet({
  name: "myVirtualMachineScaleSet",
  properties: () => ({
    sku: { tier: "Standard", capacity: 3, name: "Standard_D1_v2" },
    location: "westus",
    properties: {
      overprovision: true,
      virtualMachineProfile: {
        storageProfile: {
          imageReference: {
            id: "/subscriptions/{subscription-id}/resourceGroups/myResourceGroup/providers/Microsoft.Compute/images/{existing-custom-image-name}",
          },
          osDisk: {
            caching: "ReadWrite",
            managedDisk: { storageAccountType: "Standard_LRS" },
            createOption: "FromImage",
          },
        },
        osProfile: {
          computerNamePrefix: "{vmss-name}",
          adminUsername: "{your-username}",
          adminPassword: "{your-password}",
        },
        networkProfile: {
          networkInterfaceConfigurations: [
            {
              name: "{vmss-name}",
              properties: {
                primary: true,
                enableIPForwarding: true,
                ipConfigurations: [
                  {
                    name: "{vmss-name}",
                    properties: {
                      subnet: {
                        id: "/subscriptions/{subscription-id}/resourceGroups/myResourceGroup/providers/Microsoft.Network/virtualNetworks/{existing-virtual-network-name}/subnets/{existing-subnet-name}",
                      },
                    },
                  },
                ],
              },
            },
          ],
        },
      },
      upgradePolicy: { mode: "Manual" },
    },
  }),
  dependencies: ({ resources }) => ({
    resourceGroup: resources.Resources.ResourceGroup["myResourceGroup"],
    galleryImage: resources.Compute.GalleryImage["myGalleryImage"],
    networkSecurityGroup:
      resources.Network.NetworkSecurityGroup["myNetworkSecurityGroup"],
    capacityReservationGroup:
      resources.Compute.CapacityReservationGroup["myCapacityReservationGroup"],
    proximityPlacementGroup:
      resources.Compute.ProximityPlacementGroup["myProximityPlacementGroup"],
    dedicatedHostGroup:
      resources.Compute.DedicatedHostGroup["myDedicatedHostGroup"],
  }),
});

```

### Create a platform-image scale set with unmanaged os disks.
```js
provider.Compute.makeVirtualMachineScaleSet({
  name: "myVirtualMachineScaleSet",
  properties: () => ({
    sku: { tier: "Standard", capacity: 3, name: "Standard_D1_v2" },
    location: "westus",
    properties: {
      overprovision: true,
      virtualMachineProfile: {
        storageProfile: {
          imageReference: {
            sku: "2016-Datacenter",
            publisher: "MicrosoftWindowsServer",
            version: "latest",
            offer: "WindowsServer",
          },
          osDisk: {
            caching: "ReadWrite",
            createOption: "FromImage",
            name: "osDisk",
            vhdContainers: [
              "http://{existing-storage-account-name-0}.blob.core.windows.net/vhdContainer",
              "http://{existing-storage-account-name-1}.blob.core.windows.net/vhdContainer",
              "http://{existing-storage-account-name-2}.blob.core.windows.net/vhdContainer",
              "http://{existing-storage-account-name-3}.blob.core.windows.net/vhdContainer",
              "http://{existing-storage-account-name-4}.blob.core.windows.net/vhdContainer",
            ],
          },
        },
        osProfile: {
          computerNamePrefix: "{vmss-name}",
          adminUsername: "{your-username}",
          adminPassword: "{your-password}",
        },
        networkProfile: {
          networkInterfaceConfigurations: [
            {
              name: "{vmss-name}",
              properties: {
                primary: true,
                enableIPForwarding: true,
                ipConfigurations: [
                  {
                    name: "{vmss-name}",
                    properties: {
                      subnet: {
                        id: "/subscriptions/{subscription-id}/resourceGroups/myResourceGroup/providers/Microsoft.Network/virtualNetworks/{existing-virtual-network-name}/subnets/{existing-subnet-name}",
                      },
                    },
                  },
                ],
              },
            },
          ],
        },
      },
      upgradePolicy: { mode: "Manual" },
    },
  }),
  dependencies: ({ resources }) => ({
    resourceGroup: resources.Resources.ResourceGroup["myResourceGroup"],
    galleryImage: resources.Compute.GalleryImage["myGalleryImage"],
    networkSecurityGroup:
      resources.Network.NetworkSecurityGroup["myNetworkSecurityGroup"],
    capacityReservationGroup:
      resources.Compute.CapacityReservationGroup["myCapacityReservationGroup"],
    proximityPlacementGroup:
      resources.Compute.ProximityPlacementGroup["myProximityPlacementGroup"],
    dedicatedHostGroup:
      resources.Compute.DedicatedHostGroup["myDedicatedHostGroup"],
  }),
});

```

### Create a custom-image scale set from an unmanaged generalized os image.
```js
provider.Compute.makeVirtualMachineScaleSet({
  name: "myVirtualMachineScaleSet",
  properties: () => ({
    sku: { tier: "Standard", capacity: 3, name: "Standard_D1_v2" },
    location: "westus",
    properties: {
      overprovision: true,
      virtualMachineProfile: {
        storageProfile: {
          osDisk: {
            caching: "ReadWrite",
            image: {
              uri: "http://{existing-storage-account-name}.blob.core.windows.net/{existing-container-name}/{existing-generalized-os-image-blob-name}.vhd",
            },
            createOption: "FromImage",
            name: "osDisk",
          },
        },
        osProfile: {
          computerNamePrefix: "{vmss-name}",
          adminUsername: "{your-username}",
          adminPassword: "{your-password}",
        },
        networkProfile: {
          networkInterfaceConfigurations: [
            {
              name: "{vmss-name}",
              properties: {
                primary: true,
                enableIPForwarding: true,
                ipConfigurations: [
                  {
                    name: "{vmss-name}",
                    properties: {
                      subnet: {
                        id: "/subscriptions/{subscription-id}/resourceGroups/myResourceGroup/providers/Microsoft.Network/virtualNetworks/{existing-virtual-network-name}/subnets/{existing-subnet-name}",
                      },
                    },
                  },
                ],
              },
            },
          ],
        },
      },
      upgradePolicy: { mode: "Manual" },
    },
  }),
  dependencies: ({ resources }) => ({
    resourceGroup: resources.Resources.ResourceGroup["myResourceGroup"],
    galleryImage: resources.Compute.GalleryImage["myGalleryImage"],
    networkSecurityGroup:
      resources.Network.NetworkSecurityGroup["myNetworkSecurityGroup"],
    capacityReservationGroup:
      resources.Compute.CapacityReservationGroup["myCapacityReservationGroup"],
    proximityPlacementGroup:
      resources.Compute.ProximityPlacementGroup["myProximityPlacementGroup"],
    dedicatedHostGroup:
      resources.Compute.DedicatedHostGroup["myDedicatedHostGroup"],
  }),
});

```

### Create a scale set with virtual machines in different zones.
```js
provider.Compute.makeVirtualMachineScaleSet({
  name: "myVirtualMachineScaleSet",
  properties: () => ({
    sku: { tier: "Standard", capacity: 2, name: "Standard_A1_v2" },
    location: "centralus",
    properties: {
      overprovision: true,
      virtualMachineProfile: {
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
            createOption: "FromImage",
            diskSizeGB: 512,
          },
          dataDisks: [
            { diskSizeGB: 1023, createOption: "Empty", lun: 0 },
            { diskSizeGB: 1023, createOption: "Empty", lun: 1 },
          ],
        },
        osProfile: {
          computerNamePrefix: "{vmss-name}",
          adminUsername: "{your-username}",
          adminPassword: "{your-password}",
        },
        networkProfile: {
          networkInterfaceConfigurations: [
            {
              name: "{vmss-name}",
              properties: {
                primary: true,
                enableIPForwarding: true,
                ipConfigurations: [
                  {
                    name: "{vmss-name}",
                    properties: {
                      subnet: {
                        id: "/subscriptions/{subscription-id}/resourceGroups/myResourceGroup/providers/Microsoft.Network/virtualNetworks/{existing-virtual-network-name}/subnets/{existing-subnet-name}",
                      },
                    },
                  },
                ],
              },
            },
          ],
        },
      },
      upgradePolicy: { mode: "Automatic" },
    },
    zones: ["1", "3"],
  }),
  dependencies: ({ resources }) => ({
    resourceGroup: resources.Resources.ResourceGroup["myResourceGroup"],
    galleryImage: resources.Compute.GalleryImage["myGalleryImage"],
    networkSecurityGroup:
      resources.Network.NetworkSecurityGroup["myNetworkSecurityGroup"],
    capacityReservationGroup:
      resources.Compute.CapacityReservationGroup["myCapacityReservationGroup"],
    proximityPlacementGroup:
      resources.Compute.ProximityPlacementGroup["myProximityPlacementGroup"],
    dedicatedHostGroup:
      resources.Compute.DedicatedHostGroup["myDedicatedHostGroup"],
  }),
});

```

### Create a scale set with ephemeral os disks.
```js
provider.Compute.makeVirtualMachineScaleSet({
  name: "myVirtualMachineScaleSet",
  properties: () => ({
    sku: { tier: "Standard", capacity: 3, name: "Standard_DS1_v2" },
    properties: {
      overprovision: true,
      virtualMachineProfile: {
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
          },
        },
        osProfile: {
          computerNamePrefix: "{vmss-name}",
          adminUsername: "{your-username}",
          adminPassword: "{your-password}",
        },
        networkProfile: {
          networkInterfaceConfigurations: [
            {
              name: "{vmss-name}",
              properties: {
                primary: true,
                enableIPForwarding: true,
                ipConfigurations: [
                  {
                    name: "{vmss-name}",
                    properties: {
                      subnet: {
                        id: "/subscriptions/{subscription-id}/resourceGroups/myResourceGroup/providers/Microsoft.Network/virtualNetworks/{existing-virtual-network-name}/subnets/{existing-subnet-name}",
                      },
                    },
                  },
                ],
              },
            },
          ],
        },
      },
      upgradePolicy: { mode: "Manual" },
    },
    plan: {
      publisher: "microsoft-ads",
      product: "windows-data-science-vm",
      name: "windows2016",
    },
    location: "westus",
  }),
  dependencies: ({ resources }) => ({
    resourceGroup: resources.Resources.ResourceGroup["myResourceGroup"],
    galleryImage: resources.Compute.GalleryImage["myGalleryImage"],
    networkSecurityGroup:
      resources.Network.NetworkSecurityGroup["myNetworkSecurityGroup"],
    capacityReservationGroup:
      resources.Compute.CapacityReservationGroup["myCapacityReservationGroup"],
    proximityPlacementGroup:
      resources.Compute.ProximityPlacementGroup["myProximityPlacementGroup"],
    dedicatedHostGroup:
      resources.Compute.DedicatedHostGroup["myDedicatedHostGroup"],
  }),
});

```

### Create a scale set with terminate scheduled events enabled.
```js
provider.Compute.makeVirtualMachineScaleSet({
  name: "myVirtualMachineScaleSet",
  properties: () => ({
    sku: { tier: "Standard", capacity: 3, name: "Standard_D1_v2" },
    location: "westus",
    properties: {
      overprovision: true,
      virtualMachineProfile: {
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
            createOption: "FromImage",
          },
        },
        osProfile: {
          computerNamePrefix: "{vmss-name}",
          adminUsername: "{your-username}",
          adminPassword: "{your-password}",
        },
        networkProfile: {
          networkInterfaceConfigurations: [
            {
              name: "{vmss-name}",
              properties: {
                primary: true,
                enableIPForwarding: true,
                ipConfigurations: [
                  {
                    name: "{vmss-name}",
                    properties: {
                      subnet: {
                        id: "/subscriptions/{subscription-id}/resourceGroups/myResourceGroup/providers/Microsoft.Network/virtualNetworks/{existing-virtual-network-name}/subnets/{existing-subnet-name}",
                      },
                    },
                  },
                ],
              },
            },
          ],
        },
        scheduledEventsProfile: {
          terminateNotificationProfile: {
            enable: true,
            notBeforeTimeout: "PT5M",
          },
        },
      },
      upgradePolicy: { mode: "Manual" },
    },
  }),
  dependencies: ({ resources }) => ({
    resourceGroup: resources.Resources.ResourceGroup["myResourceGroup"],
    galleryImage: resources.Compute.GalleryImage["myGalleryImage"],
    networkSecurityGroup:
      resources.Network.NetworkSecurityGroup["myNetworkSecurityGroup"],
    capacityReservationGroup:
      resources.Compute.CapacityReservationGroup["myCapacityReservationGroup"],
    proximityPlacementGroup:
      resources.Compute.ProximityPlacementGroup["myProximityPlacementGroup"],
    dedicatedHostGroup:
      resources.Compute.DedicatedHostGroup["myDedicatedHostGroup"],
  }),
});

```

### Create a scale set with automatic repairs enabled
```js
provider.Compute.makeVirtualMachineScaleSet({
  name: "myVirtualMachineScaleSet",
  properties: () => ({
    sku: { tier: "Standard", capacity: 3, name: "Standard_D1_v2" },
    location: "westus",
    properties: {
      overprovision: true,
      virtualMachineProfile: {
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
            createOption: "FromImage",
          },
        },
        osProfile: {
          computerNamePrefix: "{vmss-name}",
          adminUsername: "{your-username}",
          adminPassword: "{your-password}",
        },
        networkProfile: {
          networkInterfaceConfigurations: [
            {
              name: "{vmss-name}",
              properties: {
                primary: true,
                enableIPForwarding: true,
                ipConfigurations: [
                  {
                    name: "{vmss-name}",
                    properties: {
                      subnet: {
                        id: "/subscriptions/{subscription-id}/resourceGroups/myResourceGroup/providers/Microsoft.Network/virtualNetworks/{existing-virtual-network-name}/subnets/{existing-subnet-name}",
                      },
                    },
                  },
                ],
              },
            },
          ],
        },
      },
      upgradePolicy: { mode: "Manual" },
      automaticRepairsPolicy: { enabled: true, gracePeriod: "PT30M" },
    },
  }),
  dependencies: ({ resources }) => ({
    resourceGroup: resources.Resources.ResourceGroup["myResourceGroup"],
    galleryImage: resources.Compute.GalleryImage["myGalleryImage"],
    networkSecurityGroup:
      resources.Network.NetworkSecurityGroup["myNetworkSecurityGroup"],
    capacityReservationGroup:
      resources.Compute.CapacityReservationGroup["myCapacityReservationGroup"],
    proximityPlacementGroup:
      resources.Compute.ProximityPlacementGroup["myProximityPlacementGroup"],
    dedicatedHostGroup:
      resources.Compute.DedicatedHostGroup["myDedicatedHostGroup"],
  }),
});

```

### Create a scale set with DiskEncryptionSet resource in os disk and data disk.
```js
provider.Compute.makeVirtualMachineScaleSet({
  name: "myVirtualMachineScaleSet",
  properties: () => ({
    sku: { tier: "Standard", capacity: 3, name: "Standard_DS1_v2" },
    properties: {
      overprovision: true,
      virtualMachineProfile: {
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
          ],
        },
        osProfile: {
          computerNamePrefix: "{vmss-name}",
          adminUsername: "{your-username}",
          adminPassword: "{your-password}",
        },
        networkProfile: {
          networkInterfaceConfigurations: [
            {
              name: "{vmss-name}",
              properties: {
                primary: true,
                enableIPForwarding: true,
                ipConfigurations: [
                  {
                    name: "{vmss-name}",
                    properties: {
                      subnet: {
                        id: "/subscriptions/{subscription-id}/resourceGroups/myResourceGroup/providers/Microsoft.Network/virtualNetworks/{existing-virtual-network-name}/subnets/{existing-subnet-name}",
                      },
                    },
                  },
                ],
              },
            },
          ],
        },
      },
      upgradePolicy: { mode: "Manual" },
    },
    location: "westus",
  }),
  dependencies: ({ resources }) => ({
    resourceGroup: resources.Resources.ResourceGroup["myResourceGroup"],
    galleryImage: resources.Compute.GalleryImage["myGalleryImage"],
    networkSecurityGroup:
      resources.Network.NetworkSecurityGroup["myNetworkSecurityGroup"],
    capacityReservationGroup:
      resources.Compute.CapacityReservationGroup["myCapacityReservationGroup"],
    proximityPlacementGroup:
      resources.Compute.ProximityPlacementGroup["myProximityPlacementGroup"],
    dedicatedHostGroup:
      resources.Compute.DedicatedHostGroup["myDedicatedHostGroup"],
  }),
});

```

### Create a scale set with ephemeral os disks using placement property.
```js
provider.Compute.makeVirtualMachineScaleSet({
  name: "myVirtualMachineScaleSet",
  properties: () => ({
    sku: { tier: "Standard", capacity: 3, name: "Standard_DS1_v2" },
    properties: {
      overprovision: true,
      virtualMachineProfile: {
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
          },
        },
        osProfile: {
          computerNamePrefix: "{vmss-name}",
          adminUsername: "{your-username}",
          adminPassword: "{your-password}",
        },
        networkProfile: {
          networkInterfaceConfigurations: [
            {
              name: "{vmss-name}",
              properties: {
                primary: true,
                enableIPForwarding: true,
                ipConfigurations: [
                  {
                    name: "{vmss-name}",
                    properties: {
                      subnet: {
                        id: "/subscriptions/{subscription-id}/resourceGroups/myResourceGroup/providers/Microsoft.Network/virtualNetworks/{existing-virtual-network-name}/subnets/{existing-subnet-name}",
                      },
                    },
                  },
                ],
              },
            },
          ],
        },
      },
      upgradePolicy: { mode: "Manual" },
    },
    plan: {
      publisher: "microsoft-ads",
      product: "windows-data-science-vm",
      name: "windows2016",
    },
    location: "westus",
  }),
  dependencies: ({ resources }) => ({
    resourceGroup: resources.Resources.ResourceGroup["myResourceGroup"],
    galleryImage: resources.Compute.GalleryImage["myGalleryImage"],
    networkSecurityGroup:
      resources.Network.NetworkSecurityGroup["myNetworkSecurityGroup"],
    capacityReservationGroup:
      resources.Compute.CapacityReservationGroup["myCapacityReservationGroup"],
    proximityPlacementGroup:
      resources.Compute.ProximityPlacementGroup["myProximityPlacementGroup"],
    dedicatedHostGroup:
      resources.Compute.DedicatedHostGroup["myDedicatedHostGroup"],
  }),
});

```

### Create a scale set with extension time budget.
```js
provider.Compute.makeVirtualMachineScaleSet({
  name: "myVirtualMachineScaleSet",
  properties: () => ({
    sku: { tier: "Standard", capacity: 3, name: "Standard_D1_v2" },
    location: "westus",
    properties: {
      overprovision: true,
      virtualMachineProfile: {
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
            createOption: "FromImage",
          },
        },
        diagnosticsProfile: {
          bootDiagnostics: {
            storageUri:
              "http://{existing-storage-account-name}.blob.core.windows.net",
            enabled: true,
          },
        },
        osProfile: {
          computerNamePrefix: "{vmss-name}",
          adminUsername: "{your-username}",
          adminPassword: "{your-password}",
        },
        extensionProfile: {
          extensions: [
            {
              name: "{extension-name}",
              properties: {
                autoUpgradeMinorVersion: false,
                publisher: "{extension-Publisher}",
                type: "{extension-Type}",
                typeHandlerVersion: "{handler-version}",
                settings: {},
              },
            },
          ],
          extensionsTimeBudget: "PT1H20M",
        },
        networkProfile: {
          networkInterfaceConfigurations: [
            {
              name: "{vmss-name}",
              properties: {
                primary: true,
                enableIPForwarding: true,
                ipConfigurations: [
                  {
                    name: "{vmss-name}",
                    properties: {
                      subnet: {
                        id: "/subscriptions/{subscription-id}/resourceGroups/myResourceGroup/providers/Microsoft.Network/virtualNetworks/{existing-virtual-network-name}/subnets/{existing-subnet-name}",
                      },
                    },
                  },
                ],
              },
            },
          ],
        },
      },
      upgradePolicy: { mode: "Manual" },
    },
  }),
  dependencies: ({ resources }) => ({
    resourceGroup: resources.Resources.ResourceGroup["myResourceGroup"],
    galleryImage: resources.Compute.GalleryImage["myGalleryImage"],
    networkSecurityGroup:
      resources.Network.NetworkSecurityGroup["myNetworkSecurityGroup"],
    capacityReservationGroup:
      resources.Compute.CapacityReservationGroup["myCapacityReservationGroup"],
    proximityPlacementGroup:
      resources.Compute.ProximityPlacementGroup["myProximityPlacementGroup"],
    dedicatedHostGroup:
      resources.Compute.DedicatedHostGroup["myDedicatedHostGroup"],
  }),
});

```

### Create a scale set with Host Encryption using encryptionAtHost property.
```js
provider.Compute.makeVirtualMachineScaleSet({
  name: "myVirtualMachineScaleSet",
  properties: () => ({
    sku: { tier: "Standard", capacity: 3, name: "Standard_DS1_v2" },
    properties: {
      overprovision: true,
      virtualMachineProfile: {
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
          },
        },
        securityProfile: { encryptionAtHost: true },
        osProfile: {
          computerNamePrefix: "{vmss-name}",
          adminUsername: "{your-username}",
          adminPassword: "{your-password}",
        },
        networkProfile: {
          networkInterfaceConfigurations: [
            {
              name: "{vmss-name}",
              properties: {
                primary: true,
                enableIPForwarding: true,
                ipConfigurations: [
                  {
                    name: "{vmss-name}",
                    properties: {
                      subnet: {
                        id: "/subscriptions/{subscription-id}/resourceGroups/myResourceGroup/providers/Microsoft.Network/virtualNetworks/{existing-virtual-network-name}/subnets/{existing-subnet-name}",
                      },
                    },
                  },
                ],
              },
            },
          ],
        },
      },
      upgradePolicy: { mode: "Manual" },
    },
    plan: {
      publisher: "microsoft-ads",
      product: "windows-data-science-vm",
      name: "windows2016",
    },
    location: "westus",
  }),
  dependencies: ({ resources }) => ({
    resourceGroup: resources.Resources.ResourceGroup["myResourceGroup"],
    galleryImage: resources.Compute.GalleryImage["myGalleryImage"],
    networkSecurityGroup:
      resources.Network.NetworkSecurityGroup["myNetworkSecurityGroup"],
    capacityReservationGroup:
      resources.Compute.CapacityReservationGroup["myCapacityReservationGroup"],
    proximityPlacementGroup:
      resources.Compute.ProximityPlacementGroup["myProximityPlacementGroup"],
    dedicatedHostGroup:
      resources.Compute.DedicatedHostGroup["myDedicatedHostGroup"],
  }),
});

```

### Create a scale set with Fpga Network Interfaces.
```js
provider.Compute.makeVirtualMachineScaleSet({
  name: "myVirtualMachineScaleSet",
  properties: () => ({
    sku: { tier: "Standard", capacity: 3, name: "Standard_D1_v2" },
    location: "westus",
    properties: {
      overprovision: true,
      virtualMachineProfile: {
        storageProfile: {
          imageReference: {
            id: "/subscriptions/{subscription-id}/resourceGroups/myResourceGroup/providers/Microsoft.Compute/images/{existing-custom-image-name}",
          },
          osDisk: {
            caching: "ReadWrite",
            managedDisk: { storageAccountType: "Standard_LRS" },
            createOption: "FromImage",
          },
        },
        osProfile: {
          computerNamePrefix: "{vmss-name}",
          adminUsername: "{your-username}",
          adminPassword: "{your-password}",
        },
        networkProfile: {
          networkInterfaceConfigurations: [
            {
              name: "{vmss-name}",
              properties: {
                primary: true,
                enableIPForwarding: true,
                ipConfigurations: [
                  {
                    name: "{vmss-name}",
                    properties: {
                      subnet: {
                        id: "/subscriptions/{subscription-id}/resourceGroups/myResourceGroup/providers/Microsoft.Network/virtualNetworks/{existing-virtual-network-name}/subnets/{existing-subnet-name}",
                      },
                    },
                  },
                ],
              },
            },
            {
              name: "{fpgaNic-Name}",
              properties: {
                primary: false,
                enableAcceleratedNetworking: false,
                enableIPForwarding: false,
                enableFpga: true,
                ipConfigurations: [
                  {
                    name: "{fpgaNic-Name}",
                    properties: {
                      primary: true,
                      subnet: {
                        id: "/subscriptions/{subscription-id}/resourceGroups/myResourceGroup/providers/Microsoft.Network/virtualNetworks/{existing-virtual-network-name}/subnets/{existing-fpga-subnet-name}",
                      },
                      privateIPAddressVersion: "IPv4",
                    },
                  },
                ],
              },
            },
          ],
        },
      },
      upgradePolicy: { mode: "Manual" },
    },
  }),
  dependencies: ({ resources }) => ({
    resourceGroup: resources.Resources.ResourceGroup["myResourceGroup"],
    galleryImage: resources.Compute.GalleryImage["myGalleryImage"],
    networkSecurityGroup:
      resources.Network.NetworkSecurityGroup["myNetworkSecurityGroup"],
    capacityReservationGroup:
      resources.Compute.CapacityReservationGroup["myCapacityReservationGroup"],
    proximityPlacementGroup:
      resources.Compute.ProximityPlacementGroup["myProximityPlacementGroup"],
    dedicatedHostGroup:
      resources.Compute.DedicatedHostGroup["myDedicatedHostGroup"],
  }),
});

```

### Create a scale set with Uefi Settings of secureBoot and vTPM.
```js
provider.Compute.makeVirtualMachineScaleSet({
  name: "myVirtualMachineScaleSet",
  properties: () => ({
    sku: { tier: "Standard", capacity: 3, name: "Standard_D2s_v3" },
    properties: {
      overprovision: true,
      virtualMachineProfile: {
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
          },
        },
        securityProfile: {
          uefiSettings: { secureBootEnabled: true, vTpmEnabled: true },
          securityType: "TrustedLaunch",
        },
        osProfile: {
          computerNamePrefix: "{vmss-name}",
          adminUsername: "{your-username}",
          adminPassword: "{your-password}",
        },
        networkProfile: {
          networkInterfaceConfigurations: [
            {
              name: "{vmss-name}",
              properties: {
                primary: true,
                enableIPForwarding: true,
                ipConfigurations: [
                  {
                    name: "{vmss-name}",
                    properties: {
                      subnet: {
                        id: "/subscriptions/{subscription-id}/resourceGroups/myResourceGroup/providers/Microsoft.Network/virtualNetworks/{existing-virtual-network-name}/subnets/{existing-subnet-name}",
                      },
                    },
                  },
                ],
              },
            },
          ],
        },
      },
      upgradePolicy: { mode: "Manual" },
    },
    location: "westus",
  }),
  dependencies: ({ resources }) => ({
    resourceGroup: resources.Resources.ResourceGroup["myResourceGroup"],
    galleryImage: resources.Compute.GalleryImage["myGalleryImage"],
    networkSecurityGroup:
      resources.Network.NetworkSecurityGroup["myNetworkSecurityGroup"],
    capacityReservationGroup:
      resources.Compute.CapacityReservationGroup["myCapacityReservationGroup"],
    proximityPlacementGroup:
      resources.Compute.ProximityPlacementGroup["myProximityPlacementGroup"],
    dedicatedHostGroup:
      resources.Compute.DedicatedHostGroup["myDedicatedHostGroup"],
  }),
});

```

### Create a scale set from a generalized shared image.
```js
provider.Compute.makeVirtualMachineScaleSet({
  name: "myVirtualMachineScaleSet",
  properties: () => ({
    sku: { tier: "Standard", capacity: 3, name: "Standard_D1_v2" },
    location: "westus",
    properties: {
      overprovision: true,
      virtualMachineProfile: {
        storageProfile: {
          imageReference: {
            id: "/subscriptions/{subscription-id}/resourceGroups/myResourceGroup/providers/Microsoft.Compute/galleries/mySharedGallery/images/mySharedImage",
          },
          osDisk: {
            caching: "ReadWrite",
            managedDisk: { storageAccountType: "Standard_LRS" },
            createOption: "FromImage",
          },
        },
        osProfile: {
          computerNamePrefix: "{vmss-name}",
          adminUsername: "{your-username}",
          adminPassword: "{your-password}",
        },
        networkProfile: {
          networkInterfaceConfigurations: [
            {
              name: "{vmss-name}",
              properties: {
                primary: true,
                enableIPForwarding: true,
                ipConfigurations: [
                  {
                    name: "{vmss-name}",
                    properties: {
                      subnet: {
                        id: "/subscriptions/{subscription-id}/resourceGroups/myResourceGroup/providers/Microsoft.Network/virtualNetworks/{existing-virtual-network-name}/subnets/{existing-subnet-name}",
                      },
                    },
                  },
                ],
              },
            },
          ],
        },
      },
      upgradePolicy: { mode: "Manual" },
    },
  }),
  dependencies: ({ resources }) => ({
    resourceGroup: resources.Resources.ResourceGroup["myResourceGroup"],
    galleryImage: resources.Compute.GalleryImage["myGalleryImage"],
    networkSecurityGroup:
      resources.Network.NetworkSecurityGroup["myNetworkSecurityGroup"],
    capacityReservationGroup:
      resources.Compute.CapacityReservationGroup["myCapacityReservationGroup"],
    proximityPlacementGroup:
      resources.Compute.ProximityPlacementGroup["myProximityPlacementGroup"],
    dedicatedHostGroup:
      resources.Compute.DedicatedHostGroup["myDedicatedHostGroup"],
  }),
});

```

### Create a scale set from a specialized shared image.
```js
provider.Compute.makeVirtualMachineScaleSet({
  name: "myVirtualMachineScaleSet",
  properties: () => ({
    sku: { tier: "Standard", capacity: 3, name: "Standard_D1_v2" },
    location: "westus",
    properties: {
      overprovision: true,
      virtualMachineProfile: {
        storageProfile: {
          imageReference: {
            id: "/subscriptions/{subscription-id}/resourceGroups/myResourceGroup/providers/Microsoft.Compute/galleries/mySharedGallery/images/mySharedImage",
          },
          osDisk: {
            caching: "ReadWrite",
            managedDisk: { storageAccountType: "Standard_LRS" },
            createOption: "FromImage",
          },
        },
        networkProfile: {
          networkInterfaceConfigurations: [
            {
              name: "{vmss-name}",
              properties: {
                primary: true,
                enableIPForwarding: true,
                ipConfigurations: [
                  {
                    name: "{vmss-name}",
                    properties: {
                      subnet: {
                        id: "/subscriptions/{subscription-id}/resourceGroups/myResourceGroup/providers/Microsoft.Network/virtualNetworks/{existing-virtual-network-name}/subnets/{existing-subnet-name}",
                      },
                    },
                  },
                ],
              },
            },
          ],
        },
      },
      upgradePolicy: { mode: "Manual" },
    },
  }),
  dependencies: ({ resources }) => ({
    resourceGroup: resources.Resources.ResourceGroup["myResourceGroup"],
    galleryImage: resources.Compute.GalleryImage["myGalleryImage"],
    networkSecurityGroup:
      resources.Network.NetworkSecurityGroup["myNetworkSecurityGroup"],
    capacityReservationGroup:
      resources.Compute.CapacityReservationGroup["myCapacityReservationGroup"],
    proximityPlacementGroup:
      resources.Compute.ProximityPlacementGroup["myProximityPlacementGroup"],
    dedicatedHostGroup:
      resources.Compute.DedicatedHostGroup["myDedicatedHostGroup"],
  }),
});

```

### Create a scale set with userData.
```js
provider.Compute.makeVirtualMachineScaleSet({
  name: "myVirtualMachineScaleSet",
  properties: () => ({
    sku: { tier: "Standard", capacity: 3, name: "Standard_D1_v2" },
    location: "westus",
    properties: {
      overprovision: true,
      upgradePolicy: { mode: "Manual" },
      virtualMachineProfile: {
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
            createOption: "FromImage",
          },
        },
        userData: "RXhhbXBsZSBVc2VyRGF0YQ==",
        osProfile: {
          computerNamePrefix: "{vmss-name}",
          adminUsername: "{your-username}",
          adminPassword: "{your-password}",
        },
        networkProfile: {
          networkInterfaceConfigurations: [
            {
              name: "{vmss-name}",
              properties: {
                primary: true,
                enableIPForwarding: true,
                ipConfigurations: [
                  {
                    name: "{vmss-name}",
                    properties: {
                      subnet: {
                        id: "/subscriptions/{subscription-id}/resourceGroups/myResourceGroup/providers/Microsoft.Network/virtualNetworks/{existing-virtual-network-name}/subnets/{existing-subnet-name}",
                      },
                    },
                  },
                ],
              },
            },
          ],
        },
      },
    },
  }),
  dependencies: ({ resources }) => ({
    resourceGroup: resources.Resources.ResourceGroup["myResourceGroup"],
    galleryImage: resources.Compute.GalleryImage["myGalleryImage"],
    networkSecurityGroup:
      resources.Network.NetworkSecurityGroup["myNetworkSecurityGroup"],
    capacityReservationGroup:
      resources.Compute.CapacityReservationGroup["myCapacityReservationGroup"],
    proximityPlacementGroup:
      resources.Compute.ProximityPlacementGroup["myProximityPlacementGroup"],
    dedicatedHostGroup:
      resources.Compute.DedicatedHostGroup["myDedicatedHostGroup"],
  }),
});

```

### Create a scale set with Application Profile
```js
provider.Compute.makeVirtualMachineScaleSet({
  name: "myVirtualMachineScaleSet",
  properties: () => ({
    sku: { tier: "Standard", capacity: 3, name: "Standard_D1_v2" },
    location: "westus",
    properties: {
      overprovision: true,
      virtualMachineProfile: {
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
          computerNamePrefix: "{vmss-name}",
          adminUsername: "{your-username}",
          adminPassword: "{your-password}",
        },
        networkProfile: {
          networkInterfaceConfigurations: [
            {
              name: "{vmss-name}",
              properties: {
                primary: true,
                enableIPForwarding: true,
                ipConfigurations: [
                  {
                    name: "{vmss-name}",
                    properties: {
                      subnet: {
                        id: "/subscriptions/{subscription-id}/resourceGroups/myResourceGroup/providers/Microsoft.Network/virtualNetworks/{existing-virtual-network-name}/subnets/{existing-subnet-name}",
                      },
                    },
                  },
                ],
              },
            },
          ],
        },
      },
      upgradePolicy: { mode: "Manual" },
    },
  }),
  dependencies: ({ resources }) => ({
    resourceGroup: resources.Resources.ResourceGroup["myResourceGroup"],
    galleryImage: resources.Compute.GalleryImage["myGalleryImage"],
    networkSecurityGroup:
      resources.Network.NetworkSecurityGroup["myNetworkSecurityGroup"],
    capacityReservationGroup:
      resources.Compute.CapacityReservationGroup["myCapacityReservationGroup"],
    proximityPlacementGroup:
      resources.Compute.ProximityPlacementGroup["myProximityPlacementGroup"],
    dedicatedHostGroup:
      resources.Compute.DedicatedHostGroup["myDedicatedHostGroup"],
  }),
});

```

### Create a scale set with scaleInPolicy.
```js
provider.Compute.makeVirtualMachineScaleSet({
  name: "myVirtualMachineScaleSet",
  properties: () => ({
    sku: { tier: "Standard", capacity: 3, name: "Standard_D1_v2" },
    location: "westus",
    properties: {
      overprovision: true,
      virtualMachineProfile: {
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
            createOption: "FromImage",
          },
        },
        osProfile: {
          computerNamePrefix: "{vmss-name}",
          adminUsername: "{your-username}",
          adminPassword: "{your-password}",
        },
        networkProfile: {
          networkInterfaceConfigurations: [
            {
              name: "{vmss-name}",
              properties: {
                primary: true,
                enableIPForwarding: true,
                ipConfigurations: [
                  {
                    name: "{vmss-name}",
                    properties: {
                      subnet: {
                        id: "/subscriptions/{subscription-id}/resourceGroups/myResourceGroup/providers/Microsoft.Network/virtualNetworks/{existing-virtual-network-name}/subnets/{existing-subnet-name}",
                      },
                    },
                  },
                ],
              },
            },
          ],
        },
      },
      upgradePolicy: { mode: "Manual" },
      scaleInPolicy: { rules: ["OldestVM"], forceDeletion: true },
    },
  }),
  dependencies: ({ resources }) => ({
    resourceGroup: resources.Resources.ResourceGroup["myResourceGroup"],
    galleryImage: resources.Compute.GalleryImage["myGalleryImage"],
    networkSecurityGroup:
      resources.Network.NetworkSecurityGroup["myNetworkSecurityGroup"],
    capacityReservationGroup:
      resources.Compute.CapacityReservationGroup["myCapacityReservationGroup"],
    proximityPlacementGroup:
      resources.Compute.ProximityPlacementGroup["myProximityPlacementGroup"],
    dedicatedHostGroup:
      resources.Compute.DedicatedHostGroup["myDedicatedHostGroup"],
  }),
});

```

### Create a VMSS with an extension that has suppressFailures enabled
```js
provider.Compute.makeVirtualMachineScaleSet({
  name: "myVirtualMachineScaleSet",
  properties: () => ({
    sku: { tier: "Standard", capacity: 3, name: "Standard_D1_v2" },
    location: "westus",
    properties: {
      overprovision: true,
      virtualMachineProfile: {
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
            createOption: "FromImage",
          },
        },
        diagnosticsProfile: {
          bootDiagnostics: {
            storageUri:
              "http://{existing-storage-account-name}.blob.core.windows.net",
            enabled: true,
          },
        },
        osProfile: {
          computerNamePrefix: "{vmss-name}",
          adminUsername: "{your-username}",
          adminPassword: "{your-password}",
        },
        extensionProfile: {
          extensions: [
            {
              name: "{extension-name}",
              properties: {
                autoUpgradeMinorVersion: false,
                publisher: "{extension-Publisher}",
                type: "{extension-Type}",
                typeHandlerVersion: "{handler-version}",
                settings: {},
                suppressFailures: true,
              },
            },
          ],
        },
        networkProfile: {
          networkInterfaceConfigurations: [
            {
              name: "{vmss-name}",
              properties: {
                primary: true,
                enableIPForwarding: true,
                ipConfigurations: [
                  {
                    name: "{vmss-name}",
                    properties: {
                      subnet: {
                        id: "/subscriptions/{subscription-id}/resourceGroups/myResourceGroup/providers/Microsoft.Network/virtualNetworks/{existing-virtual-network-name}/subnets/{existing-subnet-name}",
                      },
                    },
                  },
                ],
              },
            },
          ],
        },
      },
      upgradePolicy: { mode: "Manual" },
    },
  }),
  dependencies: ({ resources }) => ({
    resourceGroup: resources.Resources.ResourceGroup["myResourceGroup"],
    galleryImage: resources.Compute.GalleryImage["myGalleryImage"],
    networkSecurityGroup:
      resources.Network.NetworkSecurityGroup["myNetworkSecurityGroup"],
    capacityReservationGroup:
      resources.Compute.CapacityReservationGroup["myCapacityReservationGroup"],
    proximityPlacementGroup:
      resources.Compute.ProximityPlacementGroup["myProximityPlacementGroup"],
    dedicatedHostGroup:
      resources.Compute.DedicatedHostGroup["myDedicatedHostGroup"],
  }),
});

```

### Create or update a scale set with capacity reservation.
```js
provider.Compute.makeVirtualMachineScaleSet({
  name: "myVirtualMachineScaleSet",
  properties: () => ({
    sku: { tier: "Standard", capacity: 3, name: "Standard_DS1_v2" },
    location: "westus",
    properties: {
      overprovision: true,
      virtualMachineProfile: {
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
            createOption: "FromImage",
          },
        },
        osProfile: {
          computerNamePrefix: "{vmss-name}",
          adminUsername: "{your-username}",
          adminPassword: "{your-password}",
        },
        networkProfile: {
          networkInterfaceConfigurations: [
            {
              name: "{vmss-name}",
              properties: {
                primary: true,
                enableIPForwarding: true,
                ipConfigurations: [
                  {
                    name: "{vmss-name}",
                    properties: {
                      subnet: {
                        id: "/subscriptions/{subscription-id}/resourceGroups/myResourceGroup/providers/Microsoft.Network/virtualNetworks/{existing-virtual-network-name}/subnets/{existing-subnet-name}",
                      },
                    },
                  },
                ],
              },
            },
          ],
        },
        capacityReservation: {
          capacityReservationGroup: {
            id: "subscriptions/{subscription-id}/resourceGroups/myResourceGroup/providers/Microsoft.Compute/CapacityReservationGroups/{crgName}",
          },
        },
      },
      upgradePolicy: { mode: "Manual" },
    },
  }),
  dependencies: ({ resources }) => ({
    resourceGroup: resources.Resources.ResourceGroup["myResourceGroup"],
    galleryImage: resources.Compute.GalleryImage["myGalleryImage"],
    networkSecurityGroup:
      resources.Network.NetworkSecurityGroup["myNetworkSecurityGroup"],
    capacityReservationGroup:
      resources.Compute.CapacityReservationGroup["myCapacityReservationGroup"],
    proximityPlacementGroup:
      resources.Compute.ProximityPlacementGroup["myProximityPlacementGroup"],
    dedicatedHostGroup:
      resources.Compute.DedicatedHostGroup["myDedicatedHostGroup"],
  }),
});

```

### Create a scale set with spot restore policy
```js
provider.Compute.makeVirtualMachineScaleSet({
  name: "myVirtualMachineScaleSet",
  properties: () => ({
    sku: { tier: "Standard", capacity: 2, name: "Standard_A8m_v2" },
    location: "westus",
    properties: {
      overprovision: true,
      virtualMachineProfile: {
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
            createOption: "FromImage",
          },
        },
        osProfile: {
          computerNamePrefix: "{vmss-name}",
          adminUsername: "{your-username}",
          adminPassword: "{your-password}",
        },
        networkProfile: {
          networkInterfaceConfigurations: [
            {
              name: "{vmss-name}",
              properties: {
                primary: true,
                enableIPForwarding: true,
                ipConfigurations: [
                  {
                    name: "{vmss-name}",
                    properties: {
                      subnet: {
                        id: "/subscriptions/{subscription-id}/resourceGroups/myResourceGroup/providers/Microsoft.Network/virtualNetworks/{existing-virtual-network-name}/subnets/{existing-subnet-name}",
                      },
                    },
                  },
                ],
              },
            },
          ],
        },
        priority: "Spot",
        evictionPolicy: "Deallocate",
        billingProfile: { maxPrice: -1 },
      },
      upgradePolicy: { mode: "Manual" },
      spotRestorePolicy: { enabled: true, restoreTimeout: "PT1H" },
    },
  }),
  dependencies: ({ resources }) => ({
    resourceGroup: resources.Resources.ResourceGroup["myResourceGroup"],
    galleryImage: resources.Compute.GalleryImage["myGalleryImage"],
    networkSecurityGroup:
      resources.Network.NetworkSecurityGroup["myNetworkSecurityGroup"],
    capacityReservationGroup:
      resources.Compute.CapacityReservationGroup["myCapacityReservationGroup"],
    proximityPlacementGroup:
      resources.Compute.ProximityPlacementGroup["myProximityPlacementGroup"],
    dedicatedHostGroup:
      resources.Compute.DedicatedHostGroup["myDedicatedHostGroup"],
  }),
});

```
## Dependencies
- [ResourceGroup](../Resources/ResourceGroup.md)
- [GalleryImage](../Compute/GalleryImage.md)
- [NetworkSecurityGroup](../Network/NetworkSecurityGroup.md)
- [CapacityReservationGroup](../Compute/CapacityReservationGroup.md)
- [ProximityPlacementGroup](../Compute/ProximityPlacementGroup.md)
- [DedicatedHostGroup](../Compute/DedicatedHostGroup.md)
## Misc
The resource version is `2021-07-01`.

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/compute/resource-manager/Microsoft.Compute/stable/2021-07-01/compute.json).
