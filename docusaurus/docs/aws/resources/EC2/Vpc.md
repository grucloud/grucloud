---
id: Vpc
title: Vpc
---

Provide a Virtual Private Cloud:

```js
const vpc = await provider.makeVpc({
  name: "vpc",
  properties: () => ({
    CidrBlock: "10.1.0.0/16",
  }),
});
```

### Code Examples

- [simple example](https://github.com/grucloud/grucloud/blob/main/examples/aws/ec2-vpc/iac.js#L13)
- [eks](https://github.com/grucloud/grucloud/blob/main/examples/aws/eks/iac.js)

### Used By

- [Subnet](./Subnet)
- [Security Group](./SecurityGroup)
- [Internet Gateway ](./InternetGateway)
