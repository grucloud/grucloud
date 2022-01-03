---
id: NetworkInterface
title: NetworkInterface
---
Provides a **NetworkInterface** from the **Network** group
## Examples
### Create network interface
```js
provider.Network.makeNetworkInterface({
  name: "myNetworkInterface",
  properties: () => ({
    properties: {
      enableAcceleratedNetworking: true,
      ipConfigurations: [
        {
          name: "ipconfig1",
          properties: {
            publicIPAddress: {
              id: "/subscriptions/subid/resourceGroups/rg1/providers/Microsoft.Network/publicIPAddresses/test-ip",
            },
            subnet: {
              id: "/subscriptions/subid/resourceGroups/rg1/providers/Microsoft.Network/virtualNetworks/rg1-vnet/subnets/default",
            },
          },
        },
      ],
    },
    location: "eastus",
  }),
  dependencies: ({ resources }) => ({
    resourceGroup: resources.Resources.ResourceGroup["myResourceGroup"],
    virtualNetwork: resources.Network.VirtualNetwork["myVirtualNetwork"],
    publicIpAddress: resources.Network.PublicIPAddress["myPublicIPAddress"],
    securityGroup:
      resources.Network.NetworkSecurityGroup["myNetworkSecurityGroup"],
    subnet: resources.Network.Subnet["mySubnet"],
  }),
});

```

### Create network interface with Gateway Load Balancer Consumer configured
```js
provider.Network.makeNetworkInterface({
  name: "myNetworkInterface",
  properties: () => ({
    properties: {
      enableAcceleratedNetworking: true,
      ipConfigurations: [
        {
          name: "ipconfig1",
          properties: {
            publicIPAddress: {
              id: "/subscriptions/subid/resourceGroups/rg1/providers/Microsoft.Network/publicIPAddresses/test-ip",
            },
            subnet: {
              id: "/subscriptions/subid/resourceGroups/rg1/providers/Microsoft.Network/virtualNetworks/rg1-vnet/subnets/default",
            },
            gatewayLoadBalancer: {
              id: "/subscriptions/subid/resourceGroups/rg1/providers/Microsoft.Network/loadBalancers/lb/frontendIPConfigurations/fe-lb-provider",
            },
          },
        },
      ],
    },
    location: "eastus",
  }),
  dependencies: ({ resources }) => ({
    resourceGroup: resources.Resources.ResourceGroup["myResourceGroup"],
    virtualNetwork: resources.Network.VirtualNetwork["myVirtualNetwork"],
    publicIpAddress: resources.Network.PublicIPAddress["myPublicIPAddress"],
    securityGroup:
      resources.Network.NetworkSecurityGroup["myNetworkSecurityGroup"],
    subnet: resources.Network.Subnet["mySubnet"],
  }),
});

```
## Dependencies
- [ResourceGroup](../Resources/ResourceGroup.md)
- [VirtualNetwork](../Network/VirtualNetwork.md)
- [PublicIPAddress](../Network/PublicIPAddress.md)
- [NetworkSecurityGroup](../Network/NetworkSecurityGroup.md)
- [Subnet](../Network/Subnet.md)
## Misc
The resource version is `2021-05-01`.

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/network/resource-manager/Microsoft.Network/stable/2021-05-01/networkInterface.json).
