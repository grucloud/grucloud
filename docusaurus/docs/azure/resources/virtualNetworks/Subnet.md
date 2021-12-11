---
id: Subnet
title: Subnet
---

Provides a subnet.

```js
provider.virtualNetworks.makeSubnet({
  name: "subnet",
  properties: ({ config }) => ({
    properties: {
      addressPrefix: "10.0.0.0/24",
    },
  }),
  dependencies: ({ resources }) => ({
    resourceGroup: resources.Resources.ResourceGroup["resource-group"],
    virtualNetwork: resources.virtualNetworks.VirtualNetwork["virtual-network"],
  }),
});
```

### Examples

- [basic example](https://github.com/grucloud/grucloud/blob/main/examples/azure/vm/resources.js)

### Properties

- [all properties](https://docs.microsoft.com/en-us/rest/api/virtualnetwork/publicipaddresses/createorupdate#request-body)

### Dependencies

- [ResourceGroup](../Resources/ResourceGroup.md)
- [Virtual Network](./VirtualNetwork.md)

### Used By

- [NetworkInterface](./NetworkInterface.md)
