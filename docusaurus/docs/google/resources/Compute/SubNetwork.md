---
id: SubNetwork
title: SubNetwork
---

Manages a [SubNetwork](https://cloud.google.com/compute/docs/reference/rest/v1/subnetworks)

```js
provider.ec2.makeSubnetwork({
  name: "subnetwork-dev",
  dependencies: { network: "vnet" },
  properties: () => ({
    ipCidrRange: "10.164.0.0/20",
  }),
});
```

### Examples

- [basic example](https://github.com/grucloud/grucloud/blob/main/examples/google/vm-network)

### Properties

- [all properties](https://cloud.google.com/compute/docs/reference/rest/v1/subnetworks/insert)

### Dependencies

- [Network](./Network.md)

### Used By

- [VmInstance](./VmInstance.md)
