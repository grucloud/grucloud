---
id: Rule
title: Rule
---

Provides [Route53 Resolver Rules](https://console.aws.amazon.com/route53resolver/home/outbound-endpoints#/rules)

## Examples

Create a Route53 Resolver Rule:

```js
exports.createResources = () => [
  {
    type: "Rule",
    group: "Route53Resolver",
    properties: ({}) => ({
      DomainName: "network-dev.internal.",
      Name: "root-env",
      RuleType: "FORWARD",
    }),
    dependencies: ({}) => ({
      resolverEndpoint: "Org-Outbound-Resolver-Endpoint",
    }),
  },
];
```

## Source Code Examples

- [simple example](https://github.com/grucloud/grucloud/blob/main/examples/aws/Route53Resolver/route53-resolver)
- [network hub](https://github.com/grucloud/grucloud/blob/main/examples/aws/aws-samples/aws-network-hub-for-terraform)
- [hub and skope with shared service vpc](https://github.com/grucloud/grucloud/blob/main/examples/aws/aws-samples/hub-and-spoke-with-shared-services-vpc-terraform)

## Properties

- [CreateResolverRuleCommandInput](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-route53resolver/interfaces/createresolverrulecommandinput.html)

## Dependencies

- [Endpoint](./Endpoint.md)

## Used By

- [Rule Association](./RuleAssociation.md)

## List

List the rules with the **Route53Resolver::Rule** filter:

```sh
gc list -t Route53Resolver::Rule
```

```txt
Listing resources on 1 provider: aws
✓ aws us-east-1
  ✓ Initialising
  ✓ Listing 1/1
┌──────────────────────────────────────────────────────────────────────────┐
│ 2 Route53Resolver::Rule from aws                                         │
├──────────────────────────────────────────────────────────────────────────┤
│ name: Internet Resolver                                                  │
│ managedByUs: NO                                                          │
│ live:                                                                    │
│   Arn: arn:aws:route53resolver:us-east-1::autodefined-rule/rslvr-autode… │
│   CreatorRequestId:                                                      │
│   DomainName: .                                                          │
│   Id: rslvr-autodefined-rr-internet-resolver                             │
│   Name: Internet Resolver                                                │
│   OwnerId: Route 53 Resolver                                             │
│   RuleType: RECURSIVE                                                    │
│   ShareStatus: NOT_SHARED                                                │
│   Status: COMPLETE                                                       │
│                                                                          │
├──────────────────────────────────────────────────────────────────────────┤
│ name: my-rule                                                            │
│ managedByUs: Yes                                                         │
│ live:                                                                    │
│   Arn: arn:aws:route53resolver:us-east-1:840541460064:resolver-rule/rsl… │
│   CreationTime: 2022-06-24T10:05:47.395984Z                              │
│   CreatorRequestId: grucloud-Fri Jun 24 2022 12:05:45 GMT+0200 (Central… │
│   DomainName: internal.grucloud.org.                                     │
│   Id: rslvr-rr-87420ef83c7a4f078                                         │
│   ModificationTime: 2022-06-24T10:05:47.395984Z                          │
│   Name: my-rule                                                          │
│   OwnerId: 840541460064                                                  │
│   ResolverEndpointId: rslvr-out-345b5ada2e544ff18                        │
│   RuleType: FORWARD                                                      │
│   ShareStatus: NOT_SHARED                                                │
│   Status: COMPLETE                                                       │
│   StatusMessage: [Trace id: 1-62b58c7b-0d8761ec44ba804f0e99fb21] Succes… │
│   TargetIps:                                                             │
│     - Ip: 10.0.0.150                                                     │
│       Port: 53                                                           │
│     - Ip: 10.0.1.121                                                     │
│       Port: 53                                                           │
│   Tags:                                                                  │
│     - Key: gc-created-by-provider                                        │
│       Value: aws                                                         │
│     - Key: gc-managed-by                                                 │
│       Value: grucloud                                                    │
│     - Key: gc-project-name                                               │
│       Value: route53-resolver                                            │
│     - Key: gc-stage                                                      │
│       Value: dev                                                         │
│     - Key: mykey                                                         │
│       Value: myvalue                                                     │
│     - Key: Name                                                          │
│       Value: my-rule                                                     │
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘


List Summary:
Provider: aws
┌─────────────────────────────────────────────────────────────────────────┐
│ aws                                                                     │
├───────────────────────┬─────────────────────────────────────────────────┤
│ Route53Resolver::Rule │ Internet Resolver                               │
│                       │ my-rule                                         │
└───────────────────────┴─────────────────────────────────────────────────┘
2 resources, 1 type, 1 provider
Command "gc list -t Route53Resolver::Rule" executed in 6s, 99 MB
```
