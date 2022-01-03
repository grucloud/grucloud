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
  }),
});

```
## Dependencies
- [ResourceGroup](../Resources/ResourceGroup.md)
- [LoadBalancer](../Network/LoadBalancer.md)
## Misc
The resource version is `2021-05-01`.

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/network/resource-manager/Microsoft.Network/stable/2021-05-01/loadBalancer.json).
