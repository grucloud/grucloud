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
    properties: ({}) => ({
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
    }),
    dependencies: () => ({
      securityGroup: "sg::Vpc::security-group-cluster-test",
    }),
  },
];
```

### Dependencies

- [EC2 SecurityGroup](./SecurityGroup.md)
- [EC2 ManagedPrefixList](./ManagedPrefixList.md)

## Listing

List only the ingress rules with the filter `SecurityGroupRuleEgress`

```sh
gc l -t EC2::SecurityGroupRuleEgress
```

```txt
Listing resources on 1 provider: aws
✓ aws us-east-1
  ✓ Initialising
  ✓ Listing 3/3
┌──────────────────────────────────────────────────────────────────────────────────────────┐
│ 4 EC2::SecurityGroupRuleEgress from aws                                                  │
├──────────────────────────────────────────────────────────────────────────────────────────┤
│ name: sg::vpclink-ex-vpc::default-rule-egress-all                                        │
│ managedByUs: NO                                                                          │
│ live:                                                                                    │
│   GroupId: sg-0807ac732d3e193d3                                                          │
│   GroupName: default                                                                     │
│   IpProtocol: -1                                                                         │
│   IpRanges:                                                                              │
│     - CidrIp: 0.0.0.0/0                                                                  │
│   UserIdGroupPairs: []                                                                   │
│                                                                                          │
├──────────────────────────────────────────────────────────────────────────────────────────┤
│ name: sg::vpclink-ex-vpc::sam-app-ECSSecurityGroup-1FYEJS4ML4TYJ-rule-egress-all         │
│ managedByUs: NO                                                                          │
│ live:                                                                                    │
│   GroupId: sg-0ed32b4daab4b0d89                                                          │
│   GroupName: sam-app-ECSSecurityGroup-1FYEJS4ML4TYJ                                      │
│   IpProtocol: -1                                                                         │
│   IpRanges:                                                                              │
│     - CidrIp: 0.0.0.0/0                                                                  │
│   UserIdGroupPairs: []                                                                   │
│                                                                                          │
├──────────────────────────────────────────────────────────────────────────────────────────┤
│ name: sg::vpclink-ex-vpc::sam-app-LoadBalancerSG-10GJVKU6RNTZ4-rule-egress-all           │
│ managedByUs: NO                                                                          │
│ live:                                                                                    │
│   GroupId: sg-0d33d0925a8df9124                                                          │
│   GroupName: sam-app-LoadBalancerSG-10GJVKU6RNTZ4                                        │
│   IpProtocol: -1                                                                         │
│   IpRanges:                                                                              │
│     - CidrIp: 0.0.0.0/0                                                                  │
│   UserIdGroupPairs: []                                                                   │
│                                                                                          │
├──────────────────────────────────────────────────────────────────────────────────────────┤
│ name: sg::vpclink-ex-vpc::sam-app-LoadBalancerSG-10GJVKU6RNTZ4-rule-egress-tcp-80        │
│ managedByUs: NO                                                                          │
│ live:                                                                                    │
│   GroupId: sg-0d33d0925a8df9124                                                          │
│   GroupName: sam-app-LoadBalancerSG-10GJVKU6RNTZ4                                        │
│   FromPort: 80                                                                           │
│   IpProtocol: tcp                                                                        │
│   ToPort: 80                                                                             │
│   UserIdGroupPairs:                                                                      │
│     -                                                                                    │
│       GroupId: sg-0ed32b4daab4b0d89                                                      │
│       UserId: 840541460064                                                               │
│                                                                                          │
└──────────────────────────────────────────────────────────────────────────────────────────┘


List Summary:
Provider: aws
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│ aws                                                                                     │
├──────────────────────────────┬──────────────────────────────────────────────────────────┤
│ EC2::SecurityGroupRuleEgress │ sg::vpclink-ex-vpc::default-rule-egress-all              │
│                              │ sg::vpclink-ex-vpc::sam-app-ECSSecurityGroup-1FYEJS4ML4… │
│                              │ sg::vpclink-ex-vpc::sam-app-LoadBalancerSG-10GJVKU6RNTZ… │
│                              │ sg::vpclink-ex-vpc::sam-app-LoadBalancerSG-10GJVKU6RNTZ… │
└──────────────────────────────┴──────────────────────────────────────────────────────────┘
4 resources, 1 type, 1 provider
Command "gc l -t EC2::SecurityGroupRuleEgress" executed in 4s, 106 MB
```
