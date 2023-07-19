---
id: RuleAssociation
title: Rule Association
---

Provides [Route53 Resolver Rule Association](https://console.aws.amazon.com/route53resolver/home/outbound-endpoints#/rules)

## Examples

Create a Route53 Resolver Rule Association:

```js
exports.createResources = () => [
  {
    type: "RuleAssociation",
    group: "Route53Resolver",
    dependencies: ({}) => ({
      resolverRule: "root-env",
      vpc: "dns_vpc",
    }),
  },
];
```

## Source Code Examples

- [simple example](https://github.com/grucloud/grucloud/blob/main/examples/aws/Route53Resolver/route53-resolver)
- [network hub](https://github.com/grucloud/grucloud/blob/main/examples/aws/aws-samples/aws-network-hub-for-terraform)
- [hub and skope with shared service vpc](https://github.com/grucloud/grucloud/blob/main/examples/aws/aws-samples/hub-and-spoke-with-shared-services-vpc-terraform)

## Properties

- [AssociateResolverRuleCommandInput](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-route53resolver/interfaces/associateresolverrulecommandinput.html)

## Dependencies

- [Rule](./Rule.md)
- [Vpc](../EC2/Vpc.md)

## List

List the rule associations with the **Route53Resolver::RuleAssociation** filter:

```sh
gc list -t Route53Resolver::RuleAssociation
```

```txt
Listing resources on 1 provider: aws
✓ aws us-east-1
  ✓ Initialising
  ✓ Listing 3/3
┌──────────────────────────────────────────────────────────────────────────┐
│ 3 Route53Resolver::RuleAssociation from aws                              │
├──────────────────────────────────────────────────────────────────────────┤
│ name: rule-assoc::Internet Resolver::vpc-default                         │
│ managedByUs: NO                                                          │
│ live:                                                                    │
│   Id: rslvr-autodefined-assoc-vpc-faff3987-internet-resolver             │
│   Name: System Rule Association                                          │
│   ResolverRuleId: rslvr-autodefined-rr-internet-resolver                 │
│   Status: COMPLETE                                                       │
│   StatusMessage:                                                         │
│   VPCId: vpc-faff3987                                                    │
│                                                                          │
├──────────────────────────────────────────────────────────────────────────┤
│ name: rule-assoc::Internet Resolver::vpc-resolver-endpoint               │
│ managedByUs: NO                                                          │
│ live:                                                                    │
│   Id: rslvr-autodefined-assoc-vpc-088337cb2237bd252-internet-resolver    │
│   Name: System Rule Association                                          │
│   ResolverRuleId: rslvr-autodefined-rr-internet-resolver                 │
│   Status: COMPLETE                                                       │
│   StatusMessage:                                                         │
│   VPCId: vpc-088337cb2237bd252                                           │
│                                                                          │
├──────────────────────────────────────────────────────────────────────────┤
│ name: rule-assoc::my-rule::vpc-resolver-endpoint                         │
│ managedByUs: Yes                                                         │
│ live:                                                                    │
│   Id: rslvr-rrassoc-abc1851ff39a4ea39                                    │
│   Name: -                                                                │
│   ResolverRuleId: rslvr-rr-87420ef83c7a4f078                             │
│   Status: COMPLETE                                                       │
│   StatusMessage:                                                         │
│   VPCId: vpc-088337cb2237bd252                                           │
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘


List Summary:
Provider: aws
┌─────────────────────────────────────────────────────────────────────────┐
│ aws                                                                     │
├──────────────────────────────────┬──────────────────────────────────────┤
│ Route53Resolver::RuleAssociation │ rule-assoc::Internet Resolver::vpc-… │
│                                  │ rule-assoc::Internet Resolver::vpc-… │
│                                  │ rule-assoc::my-rule::vpc-resolver-e… │
└──────────────────────────────────┴──────────────────────────────────────┘
3 resources, 1 type, 1 provider
Command "gc list -t Route53Resolver::RuleAssociation" executed in 5s, 106 MB
```
