---
id: VpcPeeringConnectionAccepter
title: Vpc Peering Connection Accepter
---

Provides a [Vpc Peering Connection Accepter](https://console.aws.amazon.com/vpc/home?#PeeringConnections:)

### Sample

```js
exports.createResources = () => [
  {
    type: "VpcPeeringConnectionAccepter",
    group: "EC2",
    dependencies: ({}) => ({
      vpcPeeringConnection: "vpc-peering::my-vpc::vpc-peer",
    }),
  },
];
```

### Examples

- [vpc-peering](https://github.com/grucloud/grucloud/blob/main/examples/aws/EC2/vpc-peering)

### Properties

- [AcceptVpcPeeringConnectionCommandInput](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-ec2/interfaces/acceptvpcpeeringconnectioncommandinput.html)

### Dependencies

- [Vpc Peering Connection](./VpcPeeringConnection.md)

### Used By

### List

```sh
gc l -t EC2::VpcPeeringConnectionAccepter
```

```sh
Listing resources on 2 providers: aws-primary, aws-secondary
✓ aws-primary us-east-1 regionA
  ✓ Initialising
  ✓ Listing 3/3
✓ aws-secondary us-west-2 regionB
  ✓ Initialising
  ✓ Listing 3/3
┌────────────────────────────────────────────────────────────────────────────────────────┐
│ 1 EC2::VpcPeeringConnectionAccepter from aws-secondary                                 │
├────────────────────────────────────────────────────────────────────────────────────────┤
│ name: vpc-peering-accepter::vpc-peering::my-vpc::vpc-peer                              │
│ managedByUs: Yes                                                                       │
│ live:                                                                                  │
│   AccepterVpcInfo:                                                                     │
│     CidrBlock: 10.1.0.0/16                                                             │
│     CidrBlockSet:                                                                      │
│       - CidrBlock: 10.1.0.0/16                                                         │
│     OwnerId: 840541460064                                                              │
│     PeeringOptions:                                                                    │
│       AllowDnsResolutionFromRemoteVpc: false                                           │
│       AllowEgressFromLocalClassicLinkToRemoteVpc: false                                │
│       AllowEgressFromLocalVpcToRemoteClassicLink: false                                │
│     VpcId: vpc-0dbe3000cd501841f                                                       │
│     Region: us-west-2                                                                  │
│   RequesterVpcInfo:                                                                    │
│     CidrBlock: 10.0.0.0/16                                                             │
│     CidrBlockSet:                                                                      │
│       - CidrBlock: 10.0.0.0/16                                                         │
│     OwnerId: 840541460064                                                              │
│     PeeringOptions:                                                                    │
│       AllowDnsResolutionFromRemoteVpc: false                                           │
│       AllowEgressFromLocalClassicLinkToRemoteVpc: false                                │
│       AllowEgressFromLocalVpcToRemoteClassicLink: false                                │
│     VpcId: vpc-07177689fb2b89baa                                                       │
│     Region: us-east-1                                                                  │
│   Status:                                                                              │
│     Code: active                                                                       │
│     Message: Active                                                                    │
│   Tags: []                                                                             │
│   VpcPeeringConnectionId: pcx-0e7232624e04c731f                                        │
│                                                                                        │
└────────────────────────────────────────────────────────────────────────────────────────┘


List Summary:
Provider: aws-primary
┌───────────────────────────────────────────────────────────────────────────────────────┐
│ aws-primary                                                                           │
└───────────────────────────────────────────────────────────────────────────────────────┘
Provider: aws-secondary
┌───────────────────────────────────────────────────────────────────────────────────────┐
│ aws-secondary                                                                         │
├───────────────────────────────────┬───────────────────────────────────────────────────┤
│ EC2::VpcPeeringConnectionAccepter │ vpc-peering-accepter::vpc-peering::my-vpc::vpc-p… │
└───────────────────────────────────┴───────────────────────────────────────────────────┘
1 resource, 1 type, 2 providers
Command "gc l -t EC2::VpcPeeringConnectionAccepter" executed in 7s, 104 MB
```
