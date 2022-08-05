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
      IpProtocol: "tcp",
      FromPort: 80,
      ToPort: 80,
      IpRanges: [
        {
          CidrIp: "0.0.0.0/0",
        },
      ],
    }),
    dependencies: () => ({
      securityGroup: "sg::Vpc::EcsSecurityGroup",
    }),
  },
];
```

### Examples

- [ec2 in vpc](https://github.com/grucloud/grucloud/blob/main/examples/aws/EC2/ec2-vpc)

### Dependencies

- [EC2 SecurityGroup](./SecurityGroup.md)
- [EC2 ManagedPrefixList](./ManagedPrefixList.md)

## Listing

List only the ingress rules with the filter `EC2::SecurityGroupRuleIngress`

```sh
gc l -t EC2::SecurityGroupRuleIngress
```

```txt
Listing resources on 1 provider: aws
✓ aws us-east-1
  ✓ Initialising
  ✓ Listing 3/3
┌──────────────────────────────────────────────────────────────────────────────────────────┐
│ 3 EC2::SecurityGroupRuleIngress from aws                                                 │
├──────────────────────────────────────────────────────────────────────────────────────────┤
│ name: sg::vpclink-ex-vpc::default-rule-ingress-all                                       │
│ managedByUs: NO                                                                          │
│ live:                                                                                    │
│   GroupId: sg-0807ac732d3e193d3                                                          │
│   GroupName: default                                                                     │
│   IpProtocol: -1                                                                         │
│   UserIdGroupPairs:                                                                      │
│     -                                                                                    │
│       GroupId: sg-0807ac732d3e193d3                                                      │
│       UserId: 840541460064                                                               │
│                                                                                          │
├──────────────────────────────────────────────────────────────────────────────────────────┤
│ name: sg::vpclink-ex-vpc::sam-app-ECSSecurityGroup-1FYEJS4ML4TYJ-rule-ingress-tcp-80     │
│ managedByUs: NO                                                                          │
│ live:                                                                                    │
│   GroupId: sg-0ed32b4daab4b0d89                                                          │
│   GroupName: sam-app-ECSSecurityGroup-1FYEJS4ML4TYJ                                      │
│   FromPort: 80                                                                           │
│   IpProtocol: tcp                                                                        │
│   ToPort: 80                                                                             │
│   UserIdGroupPairs:                                                                      │
│     -                                                                                    │
│       GroupId: sg-0d33d0925a8df9124                                                      │
│       UserId: 840541460064                                                               │
│                                                                                          │
├──────────────────────────────────────────────────────────────────────────────────────────┤
│ name: sg::vpclink-ex-vpc::sam-app-LoadBalancerSG-10GJVKU6RNTZ4-rule-ingress-tcp-80       │
│ managedByUs: NO                                                                          │
│ live:                                                                                    │
│   GroupId: sg-0d33d0925a8df9124                                                          │
│   GroupName: sam-app-LoadBalancerSG-10GJVKU6RNTZ4                                        │
│   FromPort: 80                                                                           │
│   IpProtocol: tcp                                                                        │
│   IpRanges:                                                                              │
│     - CidrIp: 0.0.0.0/0                                                                  │
│       Description: Allow from anyone on port 80                                          │
│   ToPort: 80                                                                             │
│   UserIdGroupPairs: []                                                                   │
│                                                                                          │
└──────────────────────────────────────────────────────────────────────────────────────────┘


List Summary:
Provider: aws
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│ aws                                                                                     │
├───────────────────────────────┬─────────────────────────────────────────────────────────┤
│ EC2::SecurityGroupRuleIngress │ sg::vpclink-ex-vpc::default-rule-ingress-all            │
│                               │ sg::vpclink-ex-vpc::sam-app-ECSSecurityGroup-1FYEJS4ML… │
│                               │ sg::vpclink-ex-vpc::sam-app-LoadBalancerSG-10GJVKU6RNT… │
└───────────────────────────────┴─────────────────────────────────────────────────────────┘
3 resources, 1 type, 1 provider
Command "gc l -t EC2::SecurityGroupRuleIngress" executed in 4s, 106 MB
```
