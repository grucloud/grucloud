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
    properties: ({}) => ({
      GroupName: "EcsSecurityGroup"
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

- [AuthorizeSecurityGroupIngressCommandInput](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-ec2/interfaces/authorizesecuritygroupingresscommandinput.html)

### Dependencies

- [Vpc](./Vpc.md)

### Used By

- [EC2 Client Vpn Endpoint](../EC2/ClientVpnEndpoint.md)
- [EC2 Instance](./Instance.md)
- [EC2 SecurityGroup Rule Ingress](./SecurityGroupRuleIngress.md)
- [EC2 SecurityGroup Rule Egress](./SecurityGroupRuleEgress.md)
- [ECS Service](../ECS/Service.md)
