---
id: SecurityGroup
title: Security Group
---

Create a security group, used to restrict network access to the EC2 instances.

Add new ingress and egress rules with [SecurityGroupRuleIngress](./SecurityGroupRuleIngress) and [SecurityGroupRuleEgress](./SecurityGroupRuleEgress)

```js
exports.createResources = () => [
  {
    type: "SecurityGroup",
    group: "EC2",
    name: "EcsSecurityGroup",
    properties: ({}) => ({
      Description: "Managed By GruCloud",
    }),
    dependencies: () => ({
      vpc: "Vpc",
    }),
  },
];
```

### Examples

- [ec2-vpc](https://github.com/grucloud/grucloud/blob/main/examples/aws/EC2/ec2-vpc)

### Properties

- https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#authorizeSecurityGroupIngress-property

### Dependencies

- [Vpc](./Vpc.md)

### Used By

- [EC2](./Instance.md)
- [SecurityGroupRuleIngress](./SecurityGroupRuleIngress.md)
- [SecurityGroupRuleEgress](./SecurityGroupRuleEgress.md)
