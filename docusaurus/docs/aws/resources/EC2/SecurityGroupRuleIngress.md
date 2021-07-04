---
title: SecurityGroupRuleIngress
---

Manages a security group ingress rule.

# Example

## Ingress rule for SSH

The following example creates a security rule to allow ingress SSH traffic.

```js
const vpc = provider.ec2.makeVpc({
  name: "vpc",
  properties: () => ({
    CidrBlock: "10.1.0.0/16",
  }),
});

const sg = provider.ec2.makeSecurityGroup({
  name: "securityGroup",
  dependencies: { vpc },
  properties: () => ({
    create: {
      Description: "Security Group",
    },
  }),
});

const sgRuleIngressSsh = provider.ec2.makeSecurityGroupRuleIngress({
  name: "sg-rule-ingress-ssh",
  dependencies: {
    securityGroup: sg,
  },
  properties: () => ({
    IpPermissions: [
      {
        FromPort: 22,
        IpProtocol: "tcp",
        IpRanges: [
          {
            CidrIp: "0.0.0.0/0",
          },
        ],
        Ipv6Ranges: [
          {
            CidrIpv6: "::/0",
          },
        ],
        ToPort: 22,
      },
    ],
  }),
});
```

### Examples

- [ec2 in vpc](https://github.com/grucloud/grucloud/blob/main/examples/aws/ec2-vpc/iac.js#L26)

### Properties

- https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#authorizeSecurityGroupIngress-property

### Dependencies

- [SecurityGroup](./SecurityGroup)

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
