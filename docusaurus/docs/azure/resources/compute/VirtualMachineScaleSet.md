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
    managedIdentities: [
      resources.ManagedIdentity.UserAssignedIdentity["myUserAssignedIdentity"],
    ],
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
    managedIdentities: [
      resources.ManagedIdentity.UserAssignedIdentity["myUserAssignedIdentity"],
    ],
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
    managedIdentities: [
      resources.ManagedIdentity.UserAssignedIdentity["myUserAssignedIdentity"],
    ],
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
    managedIdentities: [
      resources.ManagedIdentity.UserAssignedIdentity["myUserAssignedIdentity"],
    ],
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
    managedIdentities: [
      resources.ManagedIdentity.UserAssignedIdentity["myUserAssignedIdentity"],
    ],
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
    managedIdentities: [
      resources.ManagedIdentity.UserAssignedIdentity["myUserAssignedIdentity"],
    ],
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
    managedIdentities: [
      resources.ManagedIdentity.UserAssignedIdentity["myUserAssignedIdentity"],
    ],
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
    managedIdentities: [
      resources.ManagedIdentity.UserAssignedIdentity["myUserAssignedIdentity"],
    ],
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
    managedIdentities: [
      resources.ManagedIdentity.UserAssignedIdentity["myUserAssignedIdentity"],
    ],
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
    managedIdentities: [
      resources.ManagedIdentity.UserAssignedIdentity["myUserAssignedIdentity"],
    ],
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
    managedIdentities: [
      resources.ManagedIdentity.UserAssignedIdentity["myUserAssignedIdentity"],
    ],
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
    managedIdentities: [
      resources.ManagedIdentity.UserAssignedIdentity["myUserAssignedIdentity"],
    ],
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
    managedIdentities: [
      resources.ManagedIdentity.UserAssignedIdentity["myUserAssignedIdentity"],
    ],
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
    managedIdentities: [
      resources.ManagedIdentity.UserAssignedIdentity["myUserAssignedIdentity"],
    ],
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
    managedIdentities: [
      resources.ManagedIdentity.UserAssignedIdentity["myUserAssignedIdentity"],
    ],
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
    managedIdentities: [
      resources.ManagedIdentity.UserAssignedIdentity["myUserAssignedIdentity"],
    ],
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
    managedIdentities: [
      resources.ManagedIdentity.UserAssignedIdentity["myUserAssignedIdentity"],
    ],
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
    managedIdentities: [
      resources.ManagedIdentity.UserAssignedIdentity["myUserAssignedIdentity"],
    ],
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
    managedIdentities: [
      resources.ManagedIdentity.UserAssignedIdentity["myUserAssignedIdentity"],
    ],
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
    managedIdentities: [
      resources.ManagedIdentity.UserAssignedIdentity["myUserAssignedIdentity"],
    ],
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
    managedIdentities: [
      resources.ManagedIdentity.UserAssignedIdentity["myUserAssignedIdentity"],
    ],
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
    managedIdentities: [
      resources.ManagedIdentity.UserAssignedIdentity["myUserAssignedIdentity"],
    ],
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
    managedIdentities: [
      resources.ManagedIdentity.UserAssignedIdentity["myUserAssignedIdentity"],
    ],
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
    managedIdentities: [
      resources.ManagedIdentity.UserAssignedIdentity["myUserAssignedIdentity"],
    ],
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
    managedIdentities: [
      resources.ManagedIdentity.UserAssignedIdentity["myUserAssignedIdentity"],
    ],
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
    managedIdentities: [
      resources.ManagedIdentity.UserAssignedIdentity["myUserAssignedIdentity"],
    ],
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
    managedIdentities: [
      resources.ManagedIdentity.UserAssignedIdentity["myUserAssignedIdentity"],
    ],
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
    managedIdentities: [
      resources.ManagedIdentity.UserAssignedIdentity["myUserAssignedIdentity"],
    ],
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
    managedIdentities: [
      resources.ManagedIdentity.UserAssignedIdentity["myUserAssignedIdentity"],
    ],
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
    managedIdentities: [
      resources.ManagedIdentity.UserAssignedIdentity["myUserAssignedIdentity"],
    ],
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
- [UserAssignedIdentity](../ManagedIdentity/UserAssignedIdentity.md)
- [GalleryImage](../Compute/GalleryImage.md)
- [NetworkSecurityGroup](../Network/NetworkSecurityGroup.md)
- [CapacityReservationGroup](../Compute/CapacityReservationGroup.md)
- [ProximityPlacementGroup](../Compute/ProximityPlacementGroup.md)
- [DedicatedHostGroup](../Compute/DedicatedHostGroup.md)
## Swagger Schema
```js
{
  properties: {
    sku: {
      description: 'The virtual machine scale set sku.',
      properties: {
        name: { type: 'string', description: 'The sku name.' },
        tier: {
          type: 'string',
          description: 'Specifies the tier of virtual machines in a scale set.<br /><br /> Possible Values:<br /><br /> **Standard**<br /><br /> **Basic**'
        },
        capacity: {
          type: 'integer',
          format: 'int64',
          description: 'Specifies the number of virtual machines in the scale set.'
        }
      }
    },
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
        upgradePolicy: {
          description: 'The upgrade policy.',
          properties: {
            mode: {
              type: 'string',
              description: 'Specifies the mode of an upgrade to virtual machines in the scale set.<br /><br /> Possible values are:<br /><br /> **Manual** - You  control the application of updates to virtual machines in the scale set. You do this by using the manualUpgrade action.<br /><br /> **Automatic** - All virtual machines in the scale set are  automatically updated at the same time.',
              enum: [ 'Automatic', 'Manual', 'Rolling' ],
              'x-ms-enum': { name: 'UpgradeMode', modelAsString: false }
            },
            rollingUpgradePolicy: {
              description: 'The configuration parameters used while performing a rolling upgrade.',
              properties: {
                maxBatchInstancePercent: {
                  type: 'integer',
                  format: 'int32',
                  minimum: 5,
                  maximum: 100,
                  description: 'The maximum percent of total virtual machine instances that will be upgraded simultaneously by the rolling upgrade in one batch. As this is a maximum, unhealthy instances in previous or future batches can cause the percentage of instances in a batch to decrease to ensure higher reliability. The default value for this parameter is 20%.'
                },
                maxUnhealthyInstancePercent: {
                  type: 'integer',
                  format: 'int32',
                  minimum: 5,
                  maximum: 100,
                  description: 'The maximum percentage of the total virtual machine instances in the scale set that can be simultaneously unhealthy, either as a result of being upgraded, or by being found in an unhealthy state by the virtual machine health checks before the rolling upgrade aborts. This constraint will be checked prior to starting any batch. The default value for this parameter is 20%.'
                },
                maxUnhealthyUpgradedInstancePercent: {
                  type: 'integer',
                  format: 'int32',
                  minimum: 0,
                  maximum: 100,
                  description: 'The maximum percentage of upgraded virtual machine instances that can be found to be in an unhealthy state. This check will happen after each batch is upgraded. If this percentage is ever exceeded, the rolling update aborts. The default value for this parameter is 20%.'
                },
                pauseTimeBetweenBatches: {
                  type: 'string',
                  description: 'The wait time between completing the update for all virtual machines in one batch and starting the next batch. The time duration should be specified in ISO 8601 format. The default value is 0 seconds (PT0S).'
                },
                enableCrossZoneUpgrade: {
                  type: 'boolean',
                  description: 'Allow VMSS to ignore AZ boundaries when constructing upgrade batches. Take into consideration the Update Domain and maxBatchInstancePercent to determine the batch size.'
                },
                prioritizeUnhealthyInstances: {
                  type: 'boolean',
                  description: 'Upgrade all unhealthy instances in a scale set before any healthy instances.'
                }
              }
            },
            automaticOSUpgradePolicy: {
              description: 'Configuration parameters used for performing automatic OS Upgrade.',
              properties: {
                enableAutomaticOSUpgrade: {
                  type: 'boolean',
                  description: 'Indicates whether OS upgrades should automatically be applied to scale set instances in a rolling fashion when a newer version of the OS image becomes available. Default value is false. <br><br> If this is set to true for Windows based scale sets, [enableAutomaticUpdates](https://docs.microsoft.com/dotnet/api/microsoft.azure.management.compute.models.windowsconfiguration.enableautomaticupdates?view=azure-dotnet) is automatically set to false and cannot be set to true.'
                },
                disableAutomaticRollback: {
                  type: 'boolean',
                  description: 'Whether OS image rollback feature should be disabled. Default value is false.'
                }
              }
            }
          }
        },
        automaticRepairsPolicy: {
          description: 'Policy for automatic repairs.',
          properties: {
            enabled: {
              type: 'boolean',
              description: 'Specifies whether automatic repairs should be enabled on the virtual machine scale set. The default value is false.'
            },
            gracePeriod: {
              type: 'string',
              description: 'The amount of time for which automatic repairs are suspended due to a state change on VM. The grace time starts after the state change has completed. This helps avoid premature or accidental repairs. The time duration should be specified in ISO 8601 format. The minimum allowed grace period is 30 minutes (PT30M), which is also the default value. The maximum allowed grace period is 90 minutes (PT90M).'
            }
          }
        },
        virtualMachineProfile: {
          description: 'The virtual machine profile.',
          properties: {
            osProfile: {
              description: 'Specifies the operating system settings for the virtual machines in the scale set.',
              properties: {
                computerNamePrefix: {
                  type: 'string',
                  description: 'Specifies the computer name prefix for all of the virtual machines in the scale set. Computer name prefixes must be 1 to 15 characters long.'
                },
                adminUsername: {
                  type: 'string',
                  description: 'Specifies the name of the administrator account. <br><br> **Windows-only restriction:** Cannot end in "." <br><br> **Disallowed values:** "administrator", "admin", "user", "user1", "test", "user2", "test1", "user3", "admin1", "1", "123", "a", "actuser", "adm", "admin2", "aspnet", "backup", "console", "david", "guest", "john", "owner", "root", "server", "sql", "support", "support_388945a0", "sys", "test2", "test3", "user4", "user5". <br><br> **Minimum-length (Linux):** 1  character <br><br> **Max-length (Linux):** 64 characters <br><br> **Max-length (Windows):** 20 characters'
                },
                adminPassword: {
                  type: 'string',
                  description: 'Specifies the password of the administrator account. <br><br> **Minimum-length (Windows):** 8 characters <br><br> **Minimum-length (Linux):** 6 characters <br><br> **Max-length (Windows):** 123 characters <br><br> **Max-length (Linux):** 72 characters <br><br> **Complexity requirements:** 3 out of 4 conditions below need to be fulfilled <br> Has lower characters <br>Has upper characters <br> Has a digit <br> Has a special character (Regex match [\\W_]) <br><br> **Disallowed values:** "abc@123", "P@$$w0rd", "P@ssw0rd", "P@ssword123", "Pa$$word", "pass@word1", "Password!", "Password1", "Password22", "iloveyou!" <br><br> For resetting the password, see [How to reset the Remote Desktop service or its login password in a Windows VM](https://docs.microsoft.com/troubleshoot/azure/virtual-machines/reset-rdp) <br><br> For resetting root password, see [Manage users, SSH, and check or repair disks on Azure Linux VMs using the VMAccess Extension](https://docs.microsoft.com/troubleshoot/azure/virtual-machines/troubleshoot-ssh-connection)'
                },
                customData: {
                  type: 'string',
                  description: 'Specifies a base-64 encoded string of custom data. The base-64 encoded string is decoded to a binary array that is saved as a file on the Virtual Machine. The maximum length of the binary array is 65535 bytes. <br><br> For using cloud-init for your VM, see [Using cloud-init to customize a Linux VM during creation](https://docs.microsoft.com/azure/virtual-machines/linux/using-cloud-init)'
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
                      items: [Object],
                      description: 'Specifies additional base-64 encoded XML formatted information that can be included in the Unattend.xml file, which is used by Windows Setup.'
                    },
                    patchSettings: {
                      description: '[Preview Feature] Specifies settings related to VM Guest Patching on Windows.',
                      properties: [Object]
                    },
                    winRM: {
                      description: 'Specifies the Windows Remote Management listeners. This enables remote Windows PowerShell.',
                      properties: [Object]
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
                      properties: [Object]
                    },
                    provisionVMAgent: {
                      type: 'boolean',
                      description: 'Indicates whether virtual machine agent should be provisioned on the virtual machine. <br><br> When this property is not specified in the request body, default behavior is to set it to true.  This will ensure that VM Agent is installed on the VM so that extensions can be added to the VM later.'
                    },
                    patchSettings: {
                      description: '[Preview Feature] Specifies settings related to VM Guest Patching on Linux.',
                      properties: [Object]
                    }
                  }
                },
                secrets: {
                  type: 'array',
                  items: {
                    properties: {
                      sourceVault: [Object],
                      vaultCertificates: [Object]
                    },
                    description: 'Describes a set of certificates which are all in the same Key Vault.'
                  },
                  description: 'Specifies set of certificates that should be installed onto the virtual machines in the scale set. To install certificates on a virtual machine it is recommended to use the [Azure Key Vault virtual machine extension for Linux](https://docs.microsoft.com/azure/virtual-machines/extensions/key-vault-linux) or the [Azure Key Vault virtual machine extension for Windows](https://docs.microsoft.com/azure/virtual-machines/extensions/key-vault-windows).'
                }
              }
            },
            storageProfile: {
              description: 'Specifies the storage settings for the virtual machine disks.',
              properties: {
                imageReference: {
                  description: 'Specifies information about the image to use. You can specify information about platform images, marketplace images, or virtual machine images. This element is required when you want to use a platform image, marketplace image, or virtual machine image, but is not used in other creation operations.',
                  properties: {
                    publisher: {
                      type: 'string',
                      description: 'The image publisher.'
                    },
                    offer: {
                      type: 'string',
                      description: 'Specifies the offer of the platform image or marketplace image used to create the virtual machine.'
                    },
                    sku: { type: 'string', description: 'The image SKU.' },
                    version: {
                      type: 'string',
                      description: "Specifies the version of the platform image or marketplace image used to create the virtual machine. The allowed formats are Major.Minor.Build or 'latest'. Major, Minor, and Build are decimal numbers. Specify 'latest' to use the latest version of an image available at deploy time. Even if you use 'latest', the VM image will not automatically update after deploy time even if a new version becomes available."
                    },
                    exactVersion: {
                      type: 'string',
                      readOnly: true,
                      description: "Specifies in decimal numbers, the version of platform image or marketplace image used to create the virtual machine. This readonly field differs from 'version', only if the value specified in 'version' field is 'latest'."
                    },
                    sharedGalleryImageId: {
                      type: 'string',
                      description: 'Specified the shared gallery image unique id for vm deployment. This can be fetched from shared gallery image GET call.'
                    }
                  },
                  allOf: [
                    {
                      properties: [Object],
                      'x-ms-azure-resource': true
                    }
                  ]
                },
                osDisk: {
                  description: 'Specifies information about the operating system disk used by the virtual machines in the scale set. <br><br> For more information about disks, see [About disks and VHDs for Azure virtual machines](https://docs.microsoft.com/azure/virtual-machines/managed-disks-overview).',
                  properties: {
                    name: { type: 'string', description: 'The disk name.' },
                    caching: {
                      description: 'Specifies the caching requirements. <br><br> Possible values are: <br><br> **None** <br><br> **ReadOnly** <br><br> **ReadWrite** <br><br> Default: **None for Standard storage. ReadOnly for Premium storage**',
                      type: 'string',
                      enum: [Array],
                      'x-ms-enum': [Object]
                    },
                    writeAcceleratorEnabled: {
                      type: 'boolean',
                      description: 'Specifies whether writeAccelerator should be enabled or disabled on the disk.'
                    },
                    createOption: {
                      description: 'Specifies how the virtual machines in the scale set should be created.<br><br> The only allowed value is: **FromImage** \\u2013 This value is used when you are using an image to create the virtual machine. If you are using a platform image, you also use the imageReference element described above. If you are using a marketplace image, you  also use the plan element previously described.',
                      type: 'string',
                      enum: [Array],
                      'x-ms-enum': [Object]
                    },
                    diffDiskSettings: {
                      description: 'Specifies the ephemeral disk Settings for the operating system disk used by the virtual machine scale set.',
                      properties: [Object]
                    },
                    diskSizeGB: {
                      type: 'integer',
                      format: 'int32',
                      description: 'Specifies the size of the operating system disk in gigabytes. This element can be used to overwrite the size of the disk in a virtual machine image. <br><br> This value cannot be larger than 1023 GB'
                    },
                    osType: {
                      type: 'string',
                      description: 'This property allows you to specify the type of the OS that is included in the disk if creating a VM from user-image or a specialized VHD. <br><br> Possible values are: <br><br> **Windows** <br><br> **Linux**',
                      enum: [Array],
                      'x-ms-enum': [Object]
                    },
                    image: {
                      description: 'Specifies information about the unmanaged user image to base the scale set on.',
                      properties: [Object]
                    },
                    vhdContainers: {
                      type: 'array',
                      items: [Object],
                      description: 'Specifies the container urls that are used to store operating system disks for the scale set.'
                    },
                    managedDisk: {
                      description: 'The managed disk parameters.',
                      properties: [Object]
                    }
                  },
                  required: [ 'createOption' ]
                },
                dataDisks: {
                  type: 'array',
                  items: {
                    properties: {
                      name: [Object],
                      lun: [Object],
                      caching: [Object],
                      writeAcceleratorEnabled: [Object],
                      createOption: [Object],
                      diskSizeGB: [Object],
                      managedDisk: [Object],
                      diskIOPSReadWrite: [Object],
                      diskMBpsReadWrite: [Object]
                    },
                    required: [ 'lun', 'createOption' ],
                    description: 'Describes a virtual machine scale set data disk.'
                  },
                  description: 'Specifies the parameters that are used to add data disks to the virtual machines in the scale set. <br><br> For more information about disks, see [About disks and VHDs for Azure virtual machines](https://docs.microsoft.com/azure/virtual-machines/managed-disks-overview).'
                }
              }
            },
            networkProfile: {
              description: 'Specifies properties of the network interfaces of the virtual machines in the scale set.',
              properties: {
                healthProbe: {
                  description: "A reference to a load balancer probe used to determine the health of an instance in the virtual machine scale set. The reference will be in the form: '/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Network/loadBalancers/{loadBalancerName}/probes/{probeName}'.",
                  properties: {
                    id: {
                      type: 'string',
                      description: 'The ARM resource id in the form of /subscriptions/{SubscriptionId}/resourceGroups/{ResourceGroupName}/...'
                    }
                  }
                },
                networkInterfaceConfigurations: {
                  type: 'array',
                  items: {
                    properties: { name: [Object], properties: [Object] },
                    required: [ 'name' ],
                    allOf: [ [Object] ],
                    description: "Describes a virtual machine scale set network profile's network configurations."
                  },
                  description: 'The list of network configurations.'
                },
                networkApiVersion: {
                  type: 'string',
                  description: "specifies the Microsoft.Network API version used when creating networking resources in the Network Interface Configurations for Virtual Machine Scale Set with orchestration mode 'Flexible'",
                  enum: [ '2020-11-01' ],
                  'x-ms-enum': { name: 'NetworkApiVersion', modelAsString: true }
                }
              }
            },
            securityProfile: {
              description: 'Specifies the Security related profile settings for the virtual machines in the scale set.',
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
                  description: 'Specifies the SecurityType of the virtual machine. It is set as TrustedLaunch to enable UefiSettings. <br><br> Default: UefiSettings will not be enabled unless this property is set as TrustedLaunch.',
                  enum: [ 'TrustedLaunch' ],
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
            extensionProfile: {
              description: 'Specifies a collection of settings for extensions installed on virtual machines in the scale set.',
              properties: {
                extensions: {
                  type: 'array',
                  items: {
                    properties: {
                      name: [Object],
                      type: [Object],
                      properties: [Object]
                    },
                    allOf: [ [Object] ],
                    description: 'Describes a Virtual Machine Scale Set Extension.'
                  },
                  description: 'The virtual machine scale set child extension resources.'
                },
                extensionsTimeBudget: {
                  type: 'string',
                  description: 'Specifies the time alloted for all extensions to start. The time duration should be between 15 minutes and 120 minutes (inclusive) and should be specified in ISO 8601 format. The default value is 90 minutes (PT1H30M). <br><br> Minimum api-version: 2020-06-01'
                }
              }
            },
            licenseType: {
              type: 'string',
              description: 'Specifies that the image or disk that is being used was licensed on-premises. <br><br> Possible values for Windows Server operating system are: <br><br> Windows_Client <br><br> Windows_Server <br><br> Possible values for Linux Server operating system are: <br><br> RHEL_BYOS (for RHEL) <br><br> SLES_BYOS (for SUSE) <br><br> For more information, see [Azure Hybrid Use Benefit for Windows Server](https://docs.microsoft.com/azure/virtual-machines/windows/hybrid-use-benefit-licensing) <br><br> [Azure Hybrid Use Benefit for Linux Server](https://docs.microsoft.com/azure/virtual-machines/linux/azure-hybrid-benefit-linux) <br><br> Minimum api-version: 2015-06-15'
            },
            priority: {
              description: 'Specifies the priority for the virtual machines in the scale set. <br><br>Minimum api-version: 2017-10-30-preview',
              type: 'string',
              enum: [ 'Regular', 'Low', 'Spot' ],
              'x-ms-enum': {
                name: 'VirtualMachinePriorityTypes',
                modelAsString: true
              }
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
              description: 'Specifies the billing related details of a Azure Spot VMSS. <br><br>Minimum api-version: 2019-03-01.',
              properties: {
                maxPrice: {
                  type: 'number',
                  format: 'double',
                  description: 'Specifies the maximum price you are willing to pay for a Azure Spot VM/VMSS. This price is in US Dollars. <br><br> This price will be compared with the current Azure Spot price for the VM size. Also, the prices are compared at the time of create/update of Azure Spot VM/VMSS and the operation will only succeed if  the maxPrice is greater than the current Azure Spot price. <br><br> The maxPrice will also be used for evicting a Azure Spot VM/VMSS if the current Azure Spot price goes beyond the maxPrice after creation of VM/VMSS. <br><br> Possible values are: <br><br> - Any decimal value greater than zero. Example: 0.01538 <br><br> -1 – indicates default price to be up-to on-demand. <br><br> You can set the maxPrice to -1 to indicate that the Azure Spot VM/VMSS should not be evicted for price reasons. Also, the default max price is -1 if it is not provided by you. <br><br>Minimum api-version: 2019-03-01.'
                }
              }
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
              description: 'UserData for the virtual machines in the scale set, which must be base-64 encoded. Customer should not pass any secrets in here. <br><br>Minimum api-version: 2021-03-01'
            },
            capacityReservation: {
              description: 'Specifies the capacity reservation related details of a scale set. <br><br>Minimum api-version: 2021-04-01.',
              type: 'object',
              properties: {
                capacityReservationGroup: {
                  properties: {
                    id: { type: 'string', description: 'Resource Id' }
                  },
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
                      tags: [Object],
                      order: [Object],
                      packageReferenceId: [Object],
                      configurationReference: [Object]
                    },
                    required: [ 'packageReferenceId' ],
                    description: 'Specifies the required information to reference a compute gallery application version'
                  },
                  description: 'Specifies the gallery applications that should be made available to the VM/VMSS'
                }
              }
            }
          }
        },
        provisioningState: {
          readOnly: true,
          type: 'string',
          description: 'The provisioning state, which only appears in the response.'
        },
        overprovision: {
          type: 'boolean',
          description: 'Specifies whether the Virtual Machine Scale Set should be overprovisioned.'
        },
        doNotRunExtensionsOnOverprovisionedVMs: {
          type: 'boolean',
          description: 'When Overprovision is enabled, extensions are launched only on the requested number of VMs which are finally kept. This property will hence ensure that the extensions do not run on the extra overprovisioned VMs.'
        },
        uniqueId: {
          readOnly: true,
          type: 'string',
          description: 'Specifies the ID which uniquely identifies a Virtual Machine Scale Set.'
        },
        singlePlacementGroup: {
          type: 'boolean',
          description: 'When true this limits the scale set to a single placement group, of max size 100 virtual machines. NOTE: If singlePlacementGroup is true, it may be modified to false. However, if singlePlacementGroup is false, it may not be modified to true.'
        },
        zoneBalance: {
          type: 'boolean',
          description: 'Whether to force strictly even Virtual Machine distribution cross x-zones in case there is zone outage. zoneBalance property can only be set if the zones property of the scale set contains more than one zone. If there are no zones or only one zone specified, then zoneBalance property should not be set.'
        },
        platformFaultDomainCount: {
          type: 'integer',
          format: 'int32',
          description: 'Fault Domain count for each placement group.'
        },
        proximityPlacementGroup: {
          properties: { id: { type: 'string', description: 'Resource Id' } },
          'x-ms-azure-resource': true,
          description: 'Specifies information about the proximity placement group that the virtual machine scale set should be assigned to. <br><br>Minimum api-version: 2018-04-01.'
        },
        hostGroup: {
          properties: { id: { type: 'string', description: 'Resource Id' } },
          'x-ms-azure-resource': true,
          description: 'Specifies information about the dedicated host group that the virtual machine scale set resides in. <br><br>Minimum api-version: 2020-06-01.'
        },
        additionalCapabilities: {
          description: 'Specifies additional capabilities enabled or disabled on the Virtual Machines in the Virtual Machine Scale Set. For instance: whether the Virtual Machines have the capability to support attaching managed data disks with UltraSSD_LRS storage account type.',
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
        scaleInPolicy: {
          description: 'Specifies the policies applied when scaling in Virtual Machines in the Virtual Machine Scale Set.',
          properties: {
            rules: {
              type: 'array',
              items: {
                type: 'string',
                enum: [ 'Default', 'OldestVM', 'NewestVM' ],
                'x-ms-enum': {
                  name: 'VirtualMachineScaleSetScaleInRules',
                  modelAsString: true
                }
              },
              description: 'The rules to be followed when scaling-in a virtual machine scale set. <br><br> Possible values are: <br><br> **Default** When a virtual machine scale set is scaled in, the scale set will first be balanced across zones if it is a zonal scale set. Then, it will be balanced across Fault Domains as far as possible. Within each Fault Domain, the virtual machines chosen for removal will be the newest ones that are not protected from scale-in. <br><br> **OldestVM** When a virtual machine scale set is being scaled-in, the oldest virtual machines that are not protected from scale-in will be chosen for removal. For zonal virtual machine scale sets, the scale set will first be balanced across zones. Within each zone, the oldest virtual machines that are not protected will be chosen for removal. <br><br> **NewestVM** When a virtual machine scale set is being scaled-in, the newest virtual machines that are not protected from scale-in will be chosen for removal. For zonal virtual machine scale sets, the scale set will first be balanced across zones. Within each zone, the newest virtual machines that are not protected will be chosen for removal. <br><br>'
            },
            forceDeletion: {
              type: 'boolean',
              description: 'This property allows you to specify if virtual machines chosen for removal have to be force deleted when a virtual machine scale set is being scaled-in.(Feature in Preview)'
            }
          }
        },
        orchestrationMode: {
          description: 'Specifies the orchestration mode for the virtual machine scale set.',
          type: 'string',
          enum: [ 'Uniform', 'Flexible' ],
          'x-ms-enum': { name: 'OrchestrationMode', modelAsString: true }
        },
        spotRestorePolicy: {
          description: 'Specifies the Spot Restore properties for the virtual machine scale set.',
          type: 'object',
          properties: {
            enabled: {
              type: 'boolean',
              description: 'Enables the Spot-Try-Restore feature where evicted VMSS SPOT instances will be tried to be restored opportunistically based on capacity availability and pricing constraints'
            },
            restoreTimeout: {
              type: 'string',
              description: 'Timeout value expressed as an ISO 8601 time duration after which the platform will not try to restore the VMSS SPOT instances'
            }
          }
        }
      },
      description: 'Describes the properties of a Virtual Machine Scale Set.'
    },
    identity: {
      description: 'The identity of the virtual machine scale set, if configured.',
      properties: {
        principalId: {
          readOnly: true,
          type: 'string',
          description: 'The principal id of virtual machine scale set identity. This property will only be provided for a system assigned identity.'
        },
        tenantId: {
          readOnly: true,
          type: 'string',
          description: 'The tenant id associated with the virtual machine scale set. This property will only be provided for a system assigned identity.'
        },
        type: {
          type: 'string',
          description: "The type of identity used for the virtual machine scale set. The type 'SystemAssigned, UserAssigned' includes both an implicitly created identity and a set of user assigned identities. The type 'None' will remove any identities from the virtual machine scale set.",
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
            'x-ms-client-name': 'VirtualMachineScaleSetIdentityUserAssignedIdentitiesValue',
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
          description: "The list of user identities associated with the virtual machine scale set. The user identity dictionary key references will be ARM resource ids in the form: '/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.ManagedIdentity/userAssignedIdentities/{identityName}'."
        }
      }
    },
    zones: {
      type: 'array',
      items: { type: 'string' },
      description: 'The virtual machine scale set zones. NOTE: Availability zones can only be set when you create the scale set'
    },
    extendedLocation: {
      description: 'The extended location of the Virtual Machine Scale Set.',
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
  description: 'Describes a Virtual Machine Scale Set.'
}
```
## Misc
The resource version is `2021-07-01`.

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/compute/resource-manager/Microsoft.Compute/stable/2021-07-01/compute.json).
