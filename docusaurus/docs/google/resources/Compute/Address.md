---
title: Address
---

Provides a public Ip address:

```js
const ip = provider.compute.makeAddress({ name: "ip-webserver" });
```

### Examples

- [basic example](https://github.com/grucloud/grucloud/blob/main/examples/google/vm/iac.js#L7)

### Properties

- [all properties](https://cloud.google.com/compute/docs/reference/rest/v1/addresses/insert#request-body)

### Used By

- [Vm Instance](./VmInstance.md)
