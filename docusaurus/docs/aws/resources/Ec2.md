---
title: Ec2
---

Provides an EC2 instance resource, a.k.a virtual machine.

```js
const server = provider.makeEC2({
  name: "myserver",
  properties: {
    VolumeSize: 50,
    InstanceType: "t2.micro",
    ImageId: "ami-0917237b4e71c5759", // Ubuntu 20.04
  },
  dependencies: { keyPair, subnet, securityGroups: { sg } },
});
```

### Examples

- [simple example](https://github.com/FredericHeem/grucloud/blob/master/examples/aws/iac.js#L57)

### Properties

### Dependencies

- [SecurityGroup](./SecurityGroup)
- [Subnet](./Subnet)
- [KeyPair](./KeyPair)
