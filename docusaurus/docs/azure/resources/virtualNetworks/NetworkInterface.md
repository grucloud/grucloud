---
id: NetworkInterface
title: Network Interface
---

Provides a Network Interface:

```js
provider.virtualNetworks.makeNetworkInterface({
  name: "network-interface",
  properties: ({ config }) => ({
    properties: {
      ipConfigurations: [
        {
          name: "ipconfig",
          properties: {
            privateIPAllocationMethod: "Dynamic",
          },
        },
      ],
    },
  }),
  dependencies: ({ resources }) => ({
    resourceGroup: resources.Resources.ResourceGroup["resource-group"],
    virtualNetwork: resources.virtualNetworks.VirtualNetwork["virtual-network"],
    publicIpAddress: resources.virtualNetworks.PublicIpAddress["ip"],
    securityGroup: resources.virtualNetworks.SecurityGroup["security-group"],
    subnet: resources.virtualNetworks.Subnet["subnet"],
  }),
});
```

### Examples

- [basic example](https://github.com/grucloud/grucloud/blob/main/examples/azure/vm/iac.js#70)

### Properties

- [all properties](https://docs.microsoft.com/en-us/rest/api/virtualnetwork/networkinterfaces/createorupdate#request-body)

### Dependencies

- [ResourceGroup](../Resources/ResourceGroup.md)
- [VirtualNetwork](./VirtualNetwork.md)
- [SecurityGroup](./SecurityGroup.md)
- [PublicIpAddress](./PublicIpAddress.md)
- [Subnet](./Subnet.md)
