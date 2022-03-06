---
title: SecurityGroupRuleEgress
---

Manages a security group egress rule.

# Example

## Ingress rule for SSH

The following example creates a security rule to allow egress traffic.

```js
exports.createResources = () => [
  {
    type: "SecurityGroupRuleEgress",
    group: "EC2",
    name: "sg-rule-cluster-egress",
    properties: ({}) => ({
      IpPermission: {
        IpProtocol: "tcp",
        FromPort: 1024,
        ToPort: 65535,
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
      },
    }),
    dependencies: () => ({
      securityGroup: "security-group-cluster-test",
    }),
  },
];
];
```

### Dependencies

- [SecurityGroup](./SecurityGroup.md)

## Listing

List only the ingress rules with the filter `SecurityGroupRuleEgress`

```sh
gc l -t SecurityGroupRuleEgress
```

```sh
Listing resources on 2 providers: aws, k8s
✓ aws
  Initialising
  ✓ Listing 2/2
✓ k8s
  Initialising
  ✓ Listing
┌─────────────────────────────────────────────────────────────────────────────────────┐
│ 1 SecurityGroupRuleEgress from aws                                                  │
├───────────────────────────────────┬──────────────────────────────────────────┬──────┤
│ Name                              │ Data                                     │ Our  │
├───────────────────────────────────┼──────────────────────────────────────────┼──────┤
│ sg-cluster-rule-egress-starhackit │ IpPermissions:                           │ Yes  │
│                                   │   - FromPort: 1024                       │      │
│                                   │     IpProtocol: tcp                      │      │
│                                   │     IpRanges:                            │      │
│                                   │       - CidrIp: 0.0.0.0/0                │      │
│                                   │     Ipv6Ranges:                          │      │
│                                   │       - CidrIpv6: ::/0                   │      │
│                                   │     ToPort: 65535                        │      │
│                                   │ Tags:                                    │      │
│                                   │   - Key: Name                            │      │
│                                   │     Value: sg-cluster-rule-egress-starh… │      │
│                                   │   - Key: ManagedBy                       │      │
│                                   │     Value: GruCloud                      │      │
│                                   │   - Key: CreatedByProvider               │      │
│                                   │     Value: aws                           │      │
│                                   │   - Key: stage                           │      │
│                                   │     Value: dev                           │      │
│                                   │   - Key: projectName                     │      │
│                                   │     Value: starhackit                    │      │
│                                   │                                          │      │
└───────────────────────────────────┴──────────────────────────────────────────┴──────┘


List Summary:
Provider: k8s
┌────────────────────────────────────────────────────────────────────────────────────┐
│ k8s                                                                                │
└────────────────────────────────────────────────────────────────────────────────────┘
Provider: aws
┌────────────────────────────────────────────────────────────────────────────────────┐
│ aws                                                                                │
├────────────────────┬───────────────────────────────────────────────────────────────┤
│ SecurityGroupRule… │ sg-cluster-rule-egress-starhackit                             │
└────────────────────┴───────────────────────────────────────────────────────────────┘
1 resource, 1 type, 2 providers
Command "gc l -t SecurityGroupRuleEgress" executed in 6s
```
