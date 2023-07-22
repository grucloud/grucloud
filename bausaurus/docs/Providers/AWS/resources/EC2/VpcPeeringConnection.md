---
id: VpcPeeringConnection
title: Vpc Peering Connection
---

Provides a [Vpc Peering Connection](https://console.aws.amazon.com/vpc/home?#PeeringConnections:)

### Sample

```js
exports.createResources = () => [
  {
    type: "VpcPeeringConnection",
    group: "EC2",
    properties: ({ config }) => ({
      AccepterVpcInfo: {
        CidrBlock: "10.1.0.0/16",
        CidrBlockSet: [
          {
            CidrBlock: "10.1.0.0/16",
          },
        ],
        OwnerId: `${config.accountId()}`,
        PeeringOptions: {
          AllowDnsResolutionFromRemoteVpc: false,
          AllowEgressFromLocalClassicLinkToRemoteVpc: false,
          AllowEgressFromLocalVpcToRemoteClassicLink: false,
        },
        Region: config.regionSecondary,
      },
      RequesterVpcInfo: {
        OwnerId: `${config.accountId()}`,
        Region: config.region,
      },
    }),
    dependencies: ({}) => ({
      vpc: "my-vpc",
      vpcPeer: "vpc-peer",
    }),
  },
];
```

### Examples

- [vpc-peering](https://github.com/grucloud/grucloud/blob/main/examples/aws/EC2/vpc-peering)

### Properties

- [CreateVpcPeeringConnectionCommandInput](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-ec2/interfaces/createvpcpeeringconnectioncommandinput.html)

### Dependencies

- [Vpc](./Vpc.md)

### Used By

- [VpcPeeringConnectionAccepter](./VpcPeeringConnectionAccepter.md)

### List

```sh
gc l -t EC2::VpcPeeringConnection
```

```sh
Listing resources on 2 providers: aws-primary, aws-secondary
✓ aws-primary us-east-1 regionA
  ✓ Initialising
  ✓ Listing 2/2
✓ aws-secondary us-west-2 regionB
  ✓ Initialising
  ✓ Listing 2/2
┌────────────────────────────────────────────────────────────────────────────────────────┐
│ 1 EC2::VpcPeeringConnection from aws-primary                                           │
├────────────────────────────────────────────────────────────────────────────────────────┤
│ name: vpc-peering::my-vpc::vpc-peer                                                    │
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
│   Tags:                                                                                │
│     - Key: gc-created-by-provider                                                      │
│       Value: aws-primary                                                               │
│     - Key: gc-managed-by                                                               │
│       Value: grucloud                                                                  │
│     - Key: gc-project-name                                                             │
│       Value: vpc-peering                                                               │
│     - Key: gc-stage                                                                    │
│       Value: dev                                                                       │
│   VpcPeeringConnectionId: pcx-0e7232624e04c731f                                        │
│                                                                                        │
└────────────────────────────────────────────────────────────────────────────────────────┘


List Summary:
Provider: aws-primary
┌───────────────────────────────────────────────────────────────────────────────────────┐
│ aws-primary                                                                           │
├───────────────────────────┬───────────────────────────────────────────────────────────┤
│ EC2::VpcPeeringConnection │ vpc-peering::my-vpc::vpc-peer                             │
└───────────────────────────┴───────────────────────────────────────────────────────────┘
Provider: aws-secondary
┌───────────────────────────────────────────────────────────────────────────────────────┐
│ aws-secondary                                                                         │
└───────────────────────────────────────────────────────────────────────────────────────┘
1 resource, 1 type, 2 providers
Command "gc l -t EC2::VpcPeeringConnection" executed in 8s, 102 MB

```
