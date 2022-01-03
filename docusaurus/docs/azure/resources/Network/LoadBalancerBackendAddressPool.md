---
id: LoadBalancerBackendAddressPool
title: LoadBalancerBackendAddressPool
---
Provides a **LoadBalancerBackendAddressPool** from the **Network** group
## Examples
### Update load balancer backend pool with backend addresses containing virtual network and  IP address.
```js
provider.Network.makeLoadBalancerBackendAddressPool({
  name: "myLoadBalancerBackendAddressPool",
  properties: () => ({
    properties: {
      loadBalancerBackendAddresses: [
        {
          name: "address1",
          properties: {
            virtualNetwork: {
              id: "/subscriptions/subid/resourceGroups/rg1/providers/Microsoft.Network/virtualNetworks/vnetlb",
            },
            ipAddress: "10.0.0.4",
          },
        },
        {
          name: "address2",
          properties: {
            virtualNetwork: {
              id: "/subscriptions/subid/resourceGroups/rg1/providers/Microsoft.Network/virtualNetworks/vnetlb",
            },
            ipAddress: "10.0.0.5",
          },
        },
      ],
    },
  }),
  dependencies: ({ resources }) => ({
    resourceGroup: resources.Resources.ResourceGroup["myResourceGroup"],
    loadBalancer: resources.Network.LoadBalancer["myLoadBalancer"],
    virtualNetwork: resources.Network.VirtualNetwork["myVirtualNetwork"],
    subnet: resources.Network.Subnet["mySubnet"],
    networkInterface: resources.Network.NetworkInterface["myNetworkInterface"],
    natGateway: resources.Network.NatGateway["myNatGateway"],
    ddosCustomPolicy: resources.Network.DdosCustomPolicy["myDdosCustomPolicy"],
    publicIpPrefix: resources.Network.PublicIPPrefix["myPublicIPPrefix"],
  }),
});

```
## Dependencies
- [ResourceGroup](../Resources/ResourceGroup.md)
- [LoadBalancer](../Network/LoadBalancer.md)
- [VirtualNetwork](../Network/VirtualNetwork.md)
- [Subnet](../Network/Subnet.md)
- [NetworkInterface](../Network/NetworkInterface.md)
- [NatGateway](../Network/NatGateway.md)
- [DdosCustomPolicy](../Network/DdosCustomPolicy.md)
- [PublicIPPrefix](../Network/PublicIPPrefix.md)
## Misc
The resource version is `2021-05-01`.

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/network/resource-manager/Microsoft.Network/stable/2021-05-01/loadBalancer.json).
