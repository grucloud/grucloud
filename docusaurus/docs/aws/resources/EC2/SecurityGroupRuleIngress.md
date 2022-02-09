---
title: SecurityGroupRuleIngress
---

Manages a security group ingress rule.

# Example

## Ingress rule for SSH

The following example creates a security rule to allow ingress SSH traffic.

```js
exports.createResources = () => [
  {
    type: "SecurityGroupRuleIngress",
    group: "EC2",
    name: "EcsSecurityGroup-rule-ingress-tcp-80-v4",
    properties: ({}) => ({
      IpPermission: {
        IpProtocol: "tcp",
        FromPort: 80,
        ToPort: 80,
        IpRanges: [
          {
            CidrIp: "0.0.0.0/0",
          },
        ],
      },
    }),
    dependencies: () => ({
      securityGroup: "EcsSecurityGroup",
    }),
  },
];
```

### Examples

- [ec2 in vpc](https://github.com/grucloud/grucloud/blob/main/examples/aws/ec2/ec2-vpc/iac.js#L26)

### Properties

- https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#authorizeSecurityGroupIngress-property

### Dependencies

- [SecurityGroup](./SecurityGroup.md)

## Listing

List only the ingress rules with the filter `SecurityGroupRuleIngress`

```sh
gc l -t SecurityGroupRuleIngress
```

```sh
Listing resources on 1 provider: aws
✓ aws
  Initialising
  ✓ Listing 2/2
┌─────────────────────────────────────────────────────────────────────────────────────┐
│ 2 SecurityGroupRuleIngress from aws                                                 │
├──────────────────────┬───────────────────────────────────────────────────────┬──────┤
│ Name                 │ Data                                                  │ Our  │
├──────────────────────┼───────────────────────────────────────────────────────┼──────┤
│ sg-rule-ingress-ssh  │ IpPermissions:                                        │ Yes  │
│                      │   - FromPort: 22                                      │      │
│                      │     IpProtocol: tcp                                   │      │
│                      │     IpRanges:                                         │      │
│                      │       - CidrIp: 0.0.0.0/0                             │      │
│                      │     Ipv6Ranges:                                       │      │
│                      │       - CidrIpv6: ::/0                                │      │
│                      │     ToPort: 22                                        │      │
│                      │ Tags:                                                 │      │
│                      │   - Key: Name                                         │      │
│                      │     Value: sg-rule-ingress-ssh                        │      │
│                      │   - Key: ManagedBy                                    │      │
│                      │     Value: GruCloud                                   │      │
│                      │   - Key: CreatedByProvider                            │      │
│                      │     Value: aws                                        │      │
│                      │   - Key: stage                                        │      │
│                      │     Value: dev                                        │      │
│                      │   - Key: projectName                                  │      │
│                      │     Value: @grucloud/example-aws-ec2-vpc              │      │
│                      │                                                       │      │
├──────────────────────┼───────────────────────────────────────────────────────┼──────┤
│ sg-rule-ingress-icmp │ IpPermissions:                                        │ Yes  │
│                      │   - FromPort: -1                                      │      │
│                      │     IpProtocol: icmp                                  │      │
│                      │     IpRanges:                                         │      │
│                      │       - CidrIp: 0.0.0.0/0                             │      │
│                      │     Ipv6Ranges:                                       │      │
│                      │       - CidrIpv6: ::/0                                │      │
│                      │     ToPort: -1                                        │      │
│                      │ Tags:                                                 │      │
│                      │   - Key: Name                                         │      │
│                      │     Value: sg-rule-ingress-icmp                       │      │
│                      │   - Key: ManagedBy                                    │      │
│                      │     Value: GruCloud                                   │      │
│                      │   - Key: CreatedByProvider                            │      │
│                      │     Value: aws                                        │      │
│                      │   - Key: stage                                        │      │
│                      │     Value: dev                                        │      │
│                      │   - Key: projectName                                  │      │
│                      │     Value: @grucloud/example-aws-ec2-vpc              │      │
│                      │                                                       │      │
└──────────────────────┴───────────────────────────────────────────────────────┴──────┘


List Summary:
Provider: aws
┌────────────────────────────────────────────────────────────────────────────────────┐
│ aws                                                                                │
├────────────────────┬───────────────────────────────────────────────────────────────┤
│ SecurityGroupRule… │ sg-rule-ingress-ssh                                           │
│                    │ sg-rule-ingress-icmp                                          │
└────────────────────┴───────────────────────────────────────────────────────────────┘
2 resources, 1 type, 1 provider
Command "gc l -t SecurityGroupRuleIngress" executed in 3s
```
