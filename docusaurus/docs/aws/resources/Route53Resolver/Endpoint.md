---
id: Endpoint
title: Endpoint
---

Provides Route53 Resolver [Inbound Endpoint](https://console.aws.amazon.com/route53resolver/home/inbound-endpoints) and [Outbound Endpoint](https://console.aws.amazon.com/route53resolver/home/outbound-endpoints)

## Examples

Create a Route53 Resolver Endpoint:

```js
exports.createResources = () => [
  {
    type: "Endpoint",
    group: "Route53Resolver",
    properties: ({ getId }) => ({
      Direction: "OUTBOUND",
      Name: "endpoint",
      IpAddresses: [
        {
          SubnetId: `${getId({
            type: "Subnet",
            group: "EC2",
            name: "vpc-resolver-endpoint::subnet-1",
          })}`,
        },
        {
          SubnetId: `${getId({
            type: "Subnet",
            group: "EC2",
            name: "vpc-resolver-endpoint::subnet-2",
          })}`,
        },
      ],
    }),
    dependencies: ({}) => ({
      securityGroups: ["sg::vpc-resolver-endpoint::dns"],
      subnets: [
        "vpc-resolver-endpoint::subnet-1",
        "vpc-resolver-endpoint::subnet-2",
      ],
    }),
  },
];
```

## Source Code Examples

- [simple example](https://github.com/grucloud/grucloud/blob/main/examples/aws/Route53Resolver/route53-resolver)
- [network hub](https://github.com/grucloud/grucloud/blob/main/examples/aws/aws-samples/aws-network-hub-for-terraform)
- [hub and skope with shared service vpc](https://github.com/grucloud/grucloud/blob/main/examples/aws/aws-samples/hub-and-spoke-with-shared-services-vpc-terraform)

## Properties

- [CreateResolverEndpointCommandInput](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-route53resolver/interfaces/createresolverendpointcommandinput.html)

## Dependencies

- [Subnet](../EC2/Subnet.md)
- [SecurityGroup](../EC2/SecurityGroup.md)

## Used By

- [Route53 Resolver Rule](./Rule.md)

## List

List the endpoints with the **Route53Resolver::Endpoint** filter:

```sh
gc list -t Route53Resolver::Endpoint
```

```txt
Listing resources on 1 provider: aws
✓ aws us-east-1
  ✓ Initialising
  ✓ Listing 1/1
┌──────────────────────────────────────────────────────────────────────────┐
│ 1 Route53Resolver::Endpoint from aws                                     │
├──────────────────────────────────────────────────────────────────────────┤
│ name: endpoint                                                           │
│ managedByUs: Yes                                                         │
│ live:                                                                    │
│   Arn: arn:aws:route53resolver:us-east-1:840541460064:resolver-endpoint… │
│   CreationTime: 2022-06-24T10:03:59.084517Z                              │
│   CreatorRequestId: grucloud-Fri Jun 24 2022 12:03:56 GMT+0200 (Central… │
│   Direction: OUTBOUND                                                    │
│   HostVPCId: vpc-088337cb2237bd252                                       │
│   Id: rslvr-out-345b5ada2e544ff18                                        │
│   IpAddressCount: 2                                                      │
│   ModificationTime: 2022-06-24T10:05:39.684Z                             │
│   Name: endpoint                                                         │
│   SecurityGroupIds:                                                      │
│     - "sg-0213123caec9f72c7"                                             │
│   Status: OPERATIONAL                                                    │
│   StatusMessage: This Resolver Endpoint is operational.                  │
│   IpAddresses:                                                           │
│     - CreationTime: 2022-06-24T10:03:59.085972Z                          │
│       Ip: 10.0.0.150                                                     │
│       IpId: rni-14a4b8deb01f4d70b                                        │
│       ModificationTime: 2022-06-24T10:05:39.684Z                         │
│       Status: ATTACHED                                                   │
│       StatusMessage: This IP address is operational.                     │
│       SubnetId: subnet-010a99494359f8947                                 │
│     - CreationTime: 2022-06-24T10:03:59.090503Z                          │
│       Ip: 10.0.1.121                                                     │
│       IpId: rni-661732aedf2c45e29                                        │
│       ModificationTime: 2022-06-24T10:05:39.660Z                         │
│       Status: ATTACHED                                                   │
│       StatusMessage: This IP address is operational.                     │
│       SubnetId: subnet-0eb0283d9477cd399                                 │
│   Tags:                                                                  │
│     - Key: gc-created-by-provider                                        │
│       Value: aws                                                         │
│     - Key: gc-managed-by                                                 │
│       Value: grucloud                                                    │
│     - Key: gc-project-name                                               │
│       Value: route53-resolver                                            │
│     - Key: gc-stage                                                      │
│       Value: dev                                                         │
│     - Key: Name                                                          │
│       Value: endpoint                                                    │
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘


List Summary:
Provider: aws
┌─────────────────────────────────────────────────────────────────────────┐
│ aws                                                                     │
├───────────────────────────┬─────────────────────────────────────────────┤
│ Route53Resolver::Endpoint │ endpoint                                    │
└───────────────────────────┴─────────────────────────────────────────────┘
1 resource, 1 type, 1 provider
Command "gc list -t Route53Resolver::Endpoint" executed in 5s, 99 MB
```
