---
id: VpcAssociationAuthorization
title: Vpc Association Authorization
---

Provides a [Vpc Association Authorization](https://console.aws.amazon.com/route53/v2/home#Dashboard)

## Examples

```js
exports.createResources = () => [
  {
    type: "VpcAssociationAuthorization",
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

- [CreateVPCAssociationAuthorizationCommandInput](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-route-53/interfaces/createvpcassociationauthorizationcommandinput.html)

## Dependencies

- [Route53 Hosted Zone](./HostedZone.md)
- [Vpc](../EC2/Vpc.md)

## List

list the hosted zones with the **Route53::VpcAssociationAuthorization** filter:

```sh
gc list -t Route53::VpcAssociationAuthorization
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
│ 1 Route53::VpcAssociationAuthorization from aws-primary             │
├─────────────────────────────────────────────────────────────────────┤
│ name: vpc-assoc-auth::test.grucloud.org.::vpc-dev                   │
│ managedByUs: Yes                                                    │
│ live:                                                               │
│   HostedZoneId: Z04103032BNI0JXUAGS82                               │
│   VPC:                                                              │
│     VPCRegion: us-east-2                                            │
│     VPCId: vpc-0b571fb392d22a886                                    │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘


List Summary:
Provider: aws-primary
┌────────────────────────────────────────────────────────────────────┐
│ aws-primary                                                        │
├──────────────────────────────────────┬─────────────────────────────┤
│ Route53::VpcAssociationAuthorization │ vpc-assoc-auth::test.grucl… │
└──────────────────────────────────────┴─────────────────────────────┘
Provider: aws-secondary
┌────────────────────────────────────────────────────────────────────┐
│ aws-secondary                                                      │
└────────────────────────────────────────────────────────────────────┘
1 resource, 1 type, 2 providers
Command "gc l -t Route53::VpcAssociationAuthorization" executed in 7s, 117 MB
```
