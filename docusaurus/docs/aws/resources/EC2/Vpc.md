---
title: Vpc
---

Provide a Virtual Private Cloud:

```js
const vpc = provider.makeVpc({
  name: "vpc",
  properties: () => ({
    CidrBlock: "10.1.0.0/16",
  }),
});
```

### Example

- [simple example](https://github.com/grucloud/grucloud/blob/master/examples/aws/ec2-vpc/iac.js#L13)

### Used By

- [Subnet](./Subnet)
- [SecurityGroup](./SecurityGroup)
