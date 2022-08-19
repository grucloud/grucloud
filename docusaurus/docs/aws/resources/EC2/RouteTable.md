---
id: RouteTable
title: Route Table
---

Provides a [Route Table](https://docs.aws.amazon.com/vpc/latest/userguide/VPC_Route_Tables.html)

## Code

### Route Table associated with a subnet

```js
exports.createResources = () => [
  {
    type: "RouteTable",
    group: "EC2",
    name: "route-table",
    dependencies: () => ({
      vpc: "vpc-ec2-example",
    }),
  },
];
```

## Examples

- [simple example](https://github.com/grucloud/grucloud/blob/main/examples/aws/EC2/ec2-vpc)

## Properties

- [CreateRouteTableCommandInput](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-ec2/interfaces/createroutetablecommandinput.html)

## Dependencies

- [Vpc](./Vpc)

## Used By

- [RouteTableAssociation](./RouteTableAssociation.md)
- [Route](./Route.md)
- [VpnGatewayRoutePropagation](./VpnGatewayRoutePropagation.md)

## List

List only the route tables with the _RouteTable_ filter:

```sh
gc l -t RouteTable
```

```sh
Listing resources on 1 provider: aws
✓ aws us-east-1
  ✓ Initialising
  ✓ Listing 2/2
┌──────────────────────────────────────────────────────────────────────────────────────────────┐
│ 3 EC2::RouteTable from aws                                                                   │
├──────────────────────────────────────────────────────────────────────────────────────────────┤
│ name: vpc-default::rt-default                                                                │
│ managedByUs: NO                                                                              │
│ live:                                                                                        │
│   Associations:                                                                              │
│     - Main: true                                                                             │
│       RouteTableAssociationId: rtbassoc-0c932e7d                                             │
│       RouteTableId: rtb-19753867                                                             │
│       AssociationState:                                                                      │
│         State: associated                                                                    │
│   PropagatingVgws: []                                                                        │
│   RouteTableId: rtb-19753867                                                                 │
│   Routes:                                                                                    │
│     - DestinationCidrBlock: 172.31.0.0/16                                                    │
│       GatewayId: local                                                                       │
│       Origin: CreateRouteTable                                                               │
│       State: active                                                                          │
│   Tags: []                                                                                   │
│   VpcId: vpc-faff3987                                                                        │
│   OwnerId: 840541460064                                                                      │
│                                                                                              │
├──────────────────────────────────────────────────────────────────────────────────────────────┤
│ name: vpc-ec2-example::route-table                                                           │
│ managedByUs: Yes                                                                             │
│ live:                                                                                        │
│   Associations:                                                                              │
│     - Main: false                                                                            │
│       RouteTableAssociationId: rtbassoc-0ff919801ac7d1f22                                    │
│       RouteTableId: rtb-0bc05587c5359f095                                                    │
│       SubnetId: subnet-0e92eb3bc07c60d8c                                                     │
│       AssociationState:                                                                      │
│         State: associated                                                                    │
│   PropagatingVgws: []                                                                        │
│   RouteTableId: rtb-0bc05587c5359f095                                                        │
│   Routes:                                                                                    │
│     - DestinationCidrBlock: 10.1.0.0/16                                                      │
│       GatewayId: local                                                                       │
│       Origin: CreateRouteTable                                                               │
│       State: active                                                                          │
│     - DestinationCidrBlock: 0.0.0.0/0                                                        │
│       GatewayId: igw-0e01961b98c435457                                                       │
│       Origin: CreateRoute                                                                    │
│       State: active                                                                          │
│   Tags:                                                                                      │
│     - Key: gc-created-by-provider                                                            │
│       Value: aws                                                                             │
│     - Key: gc-managed-by                                                                     │
│       Value: grucloud                                                                        │
│     - Key: gc-project-name                                                                   │
│       Value: @grucloud/example-aws-ec2-vpc                                                   │
│     - Key: gc-stage                                                                          │
│       Value: dev                                                                             │
│     - Key: Name                                                                              │
│       Value: route-table                                                                     │
│   VpcId: vpc-0dcfae98aa5bd7705                                                               │
│   OwnerId: 840541460064                                                                      │
│                                                                                              │
├──────────────────────────────────────────────────────────────────────────────────────────────┤
│ name: vpc-ec2-example::rt-default                                                            │
│ managedByUs: NO                                                                              │
│ live:                                                                                        │
│   Associations:                                                                              │
│     - Main: true                                                                             │
│       RouteTableAssociationId: rtbassoc-0bd8b4d9778bc08d7                                    │
│       RouteTableId: rtb-02a7e5c87183aec23                                                    │
│       AssociationState:                                                                      │
│         State: associated                                                                    │
│   PropagatingVgws: []                                                                        │
│   RouteTableId: rtb-02a7e5c87183aec23                                                        │
│   Routes:                                                                                    │
│     - DestinationCidrBlock: 10.1.0.0/16                                                      │
│       GatewayId: local                                                                       │
│       Origin: CreateRouteTable                                                               │
│       State: active                                                                          │
│   Tags: []                                                                                   │
│   VpcId: vpc-0dcfae98aa5bd7705                                                               │
│   OwnerId: 840541460064                                                                      │
│                                                                                              │
└──────────────────────────────────────────────────────────────────────────────────────────────┘


List Summary:
Provider: aws
┌─────────────────────────────────────────────────────────────────────────────────────────────┐
│ aws                                                                                         │
├─────────────────┬───────────────────────────────────────────────────────────────────────────┤
│ EC2::RouteTable │ vpc-default::rt-default                                                   │
│                 │ vpc-ec2-example::route-table                                              │
│                 │ vpc-ec2-example::rt-default                                               │
└─────────────────┴───────────────────────────────────────────────────────────────────────────┘
3 resources, 1 type, 1 provider
Command "gc l -t EC2::RouteTable" executed in 5s, 105 MB
```
