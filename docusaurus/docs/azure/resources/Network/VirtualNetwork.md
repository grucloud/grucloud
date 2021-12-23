---
id: VirtualNetwork
title: Virtual Network
---

Provides a virtual network.

```js
const virtualNetwork = provider.makeVirtualNetwork({
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

- [basic example](https://github.com/grucloud/grucloud/blob/main/examples/azure/Compute/vm/resources.js)

### Properties

- [all properties](https://docs.microsoft.com/en-us/rest/api/virtualnetwork/virtualnetworks/createorupdate#request-body)

### Dependencies

- [ResourceGroup](../Resources/ResourceGroup.md)

### Used By

- [NetworkInterface](./NetworkInterface.md)
