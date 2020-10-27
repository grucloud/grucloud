---
id: NetworkInterface
title: Network Interface
---

Provides a Network Interface:

```js
const networkInterface = await provider.makeNetworkInterface({
  name: `network-interface`,
  dependencies: {
    resourceGroup,
    virtualNetwork,
    securityGroup,
    subnet: `subnet`,
    publicIpAddress,
  },
  properties: () => ({
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
});
```

### Examples

- [basic example](https://github.com/grucloud/grucloud/blob/main/examples/azure/iac.js#70)

### Properties

- [all properties](https://docs.microsoft.com/en-us/rest/api/virtualnetwork/networkinterfaces/createorupdate#request-body)

### Dependencies

- [ResourceGroup](./ResourceGroup)
- [VirtualNetwork](./VirtualNetwork)
- [SecurityGroup](./SecurityGroup)
- [PublicIpAddress](./PublicIpAddress)
