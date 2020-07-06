---
id: VirtualNetwork
title: Virtual Network
---

Provides a virtual network.

```js
const virtualNetwork = await provider.makeVirtualNetwork({
  name: `virtual-network`,
  dependencies: { resourceGroup },
  properties: () => ({
    properties: {
      addressSpace: { addressPrefixes: ["10.0.0.0/16"] },
      subnets: [
        {
          name: `subnet`,
          properties: {
            addressPrefix: "10.0.0.0/24",
          },
        },
      ],
    },
  }),
});
```

### Examples

- [basic example](https://github.com/FredericHeem/grucloud/blob/master/examples/azure/iac.js#14)

### Properties

- [all properties](https://docs.microsoft.com/en-us/rest/api/virtualnetwork/virtualnetworks/createorupdate#request-body)

### Dependencies

- [ResourceGroup](./ResourceGroup)

### Used By

- [NetworkInterface](./NetworkInterface)
