---
title: Subnet
---

Provides a subnet:

```js
const subnet = await provider.makeSubnet({
  name: "subnet",
  dependencies: { vpc },
  properties: () => ({
    CidrBlock: "10.1.0.1/24",
  }),
});
```

### Examples

- [simple example](https://github.com/grucloud/grucloud/blob/main/examples/aws/ec2-vpc/iac.js#L19)

### Dependencies

- [Vpc](./Vpc)

### Used By

- [SecurityGroup](./SecurityGroup)
- [EC2](./EC2)
