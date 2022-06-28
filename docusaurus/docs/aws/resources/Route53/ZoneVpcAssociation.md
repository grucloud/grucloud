---
id: ZoneVpcAssociation
title: Zone Vpc Association
---

Provides a [Hosted Zone Vpc Association](https://console.aws.amazon.com/route53/v2/home#Dashboard)

## Examples

```js
exports.createResources = () => [
  {
    type: "ZoneVpcAssociation",
    group: "Route53",
    dependencies: ({}) => ({
      hostedZone: "test.grucloud.org.",
      vpc: "vpc-dev",
    }),
  },
];
```

## Source Code Examples

- [vpc-association-authorization](https://github.com/grucloud/grucloud/tree/main/examples/aws/Route53/vpc-association-authorization)

## Properties

- [AssociateVPCWithHostedZoneCommandInput](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-route-53/interfaces/associatevpcwithhostedzonecommandinput.html)

## Dependencies

- [Route53 Hosted Zone](./HostedZone.md)
- [Vpc](../EC2/Vpc.md)

## List

list the hosted zones with the **Route53::ZoneVpcAssociation** filter:

```sh
gc list -t Route53::ZoneVpcAssociation
```

```txt
Listing resources on 2 providers: aws-primary, aws-secondary
✓ aws-primary us-east-1 regionA
  ✓ Initialising
  ✓ Listing 3/3
✓ aws-secondary us-east-2 region-dev-B
  ✓ Initialising
  ✓ Listing 3/3
┌─────────────────────────────────────────────────────────────────────┐
│ 1 Route53::ZoneVpcAssociation from aws-primary                      │
├─────────────────────────────────────────────────────────────────────┤
│ name: zone-assoc::test.grucloud.org.::vpc-hostedzone                │
│ managedByUs: NO                                                     │
│ live:                                                               │
│   HostedZoneId: Z04103032BNI0JXUAGS82                               │
│   Name: test.grucloud.org.                                          │
│   Owner:                                                            │
│     OwningAccount: 840541460064                                     │
│   VPC:                                                              │
│     VPCId: vpc-0f232d259438ea26a                                    │
│     VPCRegion: us-east-1                                            │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘


┌─────────────────────────────────────────────────────────────────────┐
│ 1 Route53::ZoneVpcAssociation from aws-secondary                    │
├─────────────────────────────────────────────────────────────────────┤
│ name: zone-assoc::test.grucloud.org.::vpc-dev                       │
│ managedByUs: Yes                                                    │
│ live:                                                               │
│   HostedZoneId: Z04103032BNI0JXUAGS82                               │
│   Name: test.grucloud.org.                                          │
│   Owner:                                                            │
│     OwningAccount: 840541460064                                     │
│   VPC:                                                              │
│     VPCId: vpc-0b571fb392d22a886                                    │
│     VPCRegion: us-east-2                                            │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘


List Summary:
Provider: aws-primary
┌────────────────────────────────────────────────────────────────────┐
│ aws-primary                                                        │
├─────────────────────────────┬──────────────────────────────────────┤
│ Route53::ZoneVpcAssociation │ zone-assoc::test.grucloud.org.::vpc… │
└─────────────────────────────┴──────────────────────────────────────┘
Provider: aws-secondary
┌────────────────────────────────────────────────────────────────────┐
│ aws-secondary                                                      │
├─────────────────────────────┬──────────────────────────────────────┤
│ Route53::ZoneVpcAssociation │ zone-assoc::test.grucloud.org.::vpc… │
└─────────────────────────────┴──────────────────────────────────────┘
2 resources, 2 types, 2 providers
Command "gc list -t Route53::ZoneVpcAssociation" executed in 8s, 117 MB
```
