---
id: NetworkInterface
title: Network Interface
---

Provides a Network Interface:

```js
provider.Network.makeNetworkInterface({
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
    virtualNetwork: resources.Network.VirtualNetwork["virtual-network"],
    publicIpAddress: resources.Network.PublicIpAddress["ip"],
    securityGroup: resources.Network.SecurityGroup["security-group"],
    subnet: resources.Network.Subnet["subnet"],
  }),
});
```

### Examples

- [basic example](https://github.com/grucloud/grucloud/blob/main/examples/azure/Compute/vm/iac.js)

### Properties

- [all properties](https://docs.microsoft.com/en-us/rest/api/virtualnetwork/networkinterfaces/createorupdate#request-body)

### Dependencies

- [ResourceGroup](../Resources/ResourceGroup.md)
- [VirtualNetwork](./VirtualNetwork.md)
- [SecurityGroup](./SecurityGroup.md)
- [PublicIpAddress](./PublicIpAddress.md)
- [Subnet](./Subnet.md)
