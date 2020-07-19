---
id: Network
title: Network
---

Manages a [Virtual Private Clould Network](https://cloud.google.com/vpc/docs/vpc)

```js
const network = await provider.makeNetwork({ name: "network" });
```

### Examples

- [basic example](https://github.com/FredericHeem/grucloud/blob/master/examples/google/vm-network/iac.js)

### Properties

- [all properties](https://cloud.google.com/compute/docs/reference/rest/v1/networks/insert)

### Used By

- [Vm Instance](./VmInstance)
