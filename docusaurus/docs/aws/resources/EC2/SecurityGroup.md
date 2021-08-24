---
id: SecurityGroup
title: Security Group
---

Create a security group, used to restrict network access to the EC2 instances.

Add new ingress and egress rules with [SecurityGroupRuleIngress](./SecurityGroupRuleIngress) and [SecurityGroupRuleEgress](./SecurityGroupRuleEgress)

```js
const sg = provider.ec2.makeSecurityGroup({
  name: "securityGroup",
  dependencies: { vpc },
  properties: () => ({
    Description: "Security Group SSH",
  }),
});
```

### Examples

- [ec2-vpc](https://github.com/grucloud/grucloud/blob/main/examples/aws/ec2/ec2-vpc/iac.js#L26)

### Properties

- https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#authorizeSecurityGroupIngress-property

### Dependencies

- [Vpc](./Vpc)

### Used By

- [EC2](./EC2)
- [SecurityGroupRuleIngress](./SecurityGroupRuleIngress)
- [SecurityGroupRuleEgress](./SecurityGroupRuleEgress)
