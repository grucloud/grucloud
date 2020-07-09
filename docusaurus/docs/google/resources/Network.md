---
id: Vpc
title: Vpc
---

Manages a [Virtual Private Clould Network](https://cloud.google.com/vpc/docs/vpc)

```js
const vpc = await provider.makeVpc({ name: "vpc" });
```

### Examples

- [basic example](https://github.com/FredericHeem/grucloud/blob/master/examples/google/iac.js)

### Properties

- [all properties](https://cloud.google.com/compute/docs/reference/rest/v1/networks/insert)

### Used By

- [Vm Instance](./VmInstance)
