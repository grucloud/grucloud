---
id: Route
title: Route
---

Create a route and associate it to an internet gateway or NAT gateway.

## Example code

### Attach a route to an internet gateway

```js
exports.createResources = () => [
  {
    type: "Route",
    group: "EC2",
    properties: ({}) => ({
      DestinationCidrBlock: "0.0.0.0/0",
    }),
    dependencies: () => ({
      routeTable: "route-table",
      ig: "ig",
    }),
  },
];
```

### Attach a route to a NAT gateway

```js
exports.createResources = () => [
  {
    type: "Route",
    group: "EC2",
    properties: ({}) => ({
      DestinationCidrBlock: "0.0.0.0/0",
    }),
    dependencies: () => ({
      routeTable: "PrivateRouteTableUSEAST1D",
      natGateway: "NATGateway",
    }),
  },
];
```

### Attach a route to a VPC Endpoint

```js
exports.createResources = () => [
  {
    type: "Route",
    group: "EC2",
    dependencies: () => ({
      routeTable: "project-vpc-endpoint-rtb-private1-us-east-1a",
      vpcEndpoint: "project-vpc-endpoint-vpce-s3",
    }),
  },
];
```

### Use a prefix list

```js
exports.createResources = () => [
  {
    type: "Route",
    group: "EC2",
    dependencies: ({}) => ({
      routeTable: "vpc-default::rt-default",
      ig: "ig-default",
      prefixList: "my-prefix",
    }),
  },
];
```

### Attach a route to an EC2 Instance

```js
exports.createResources = () => [
  {
    type: "Route",
    group: "EC2",
    properties: ({}) => ({
      DestinationCidrBlock: "0.0.0.0/0",
    }),
    dependencies: ({}) => ({
      routeTable: "vpc-default::rt-default",
      ec2Instance: "my-instance",
    }),
  },
];
```

### Attach a route to a VPC Peering Connection

```js
exports.createResources = () => [
  {
    type: "Route",
    group: "EC2",
    properties: ({}) => ({
      DestinationCidrBlock: "10.0.0.0/16",
    }),
    dependencies: ({}) => ({
      routeTable: "vpc-peer::rt-default",
      vpcPeeringConnection: "vpc-peering::my-vpc::vpc-peer",
    }),
  },
];
```

## Examples

- [simple example](https://github.com/grucloud/grucloud/blob/main/examples/aws/EC2/ec2-vpc)
- [vpc endpoint](https://github.com/grucloud/grucloud/blob/main/examples/aws/EC2/vpc-endpoint)
- [transit gateway](https://github.com/grucloud/grucloud/blob/main/examples/aws/EC2/transit-gateway)
- [egress-only-internet-gateway](https://github.com/grucloud/grucloud/blob/main/examples/aws/EC2/egress-only-internet-gateway)
- [route to instance](https://github.com/grucloud/grucloud/blob/main/examples/aws/EC2/route-to-instance)
- [route with prefix list](https://github.com/grucloud/grucloud/blob/main/examples/aws/EC2/route-prefix-list)
- [route to a vpc peering connection](https://github.com/grucloud/grucloud/blob/main/examples/aws/EC2/vpc-peering)

## Properties

- [CreateRouteCommandInput](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-ec2/interfaces/createroutecommandinput.html)

## Dependencies

- [EC2 Egress Only Internet Gateway](./EgressOnlyInternetGateway.md)
- [EC2 Instance](./Instance.md)
- [EC2 Internet Gateway](./InternetGateway.md)
- [EC2 Managed Prefix List](./ManagedPrefixList.md)
- [EC2 Nat Gateway](./NatGateway.md)
- [EC2 Route Table](./RouteTable.md)
- [EC2 Transit Gateway](./TransitGateway.md)
- [EC2 Vpc Endpoint](./VpcEndpoint.md)
- [NetworkManager CoreNetwork](../NetworkManager/CoreNetwork.md)

## List

```sh
gc l -t EC2::Route
```

```txt
Listing resources on 1 provider: aws
✓ aws us-east-1
  ✓ Initialising
  ✓ Listing 13/13
┌──────────────────────────────────────────────────────────────────────────────────────────────┐
│ 4 EC2::Route from aws                                                                        │
├──────────────────────────────────────────────────────────────────────────────────────────────┤
│ name: vpc-default::rt-default::local::172.31.0.0/16                                          │
│ managedByUs: NO                                                                              │
│ live:                                                                                        │
│   DestinationCidrBlock: 172.31.0.0/16                                                        │
│   GatewayId: local                                                                           │
│   Origin: CreateRouteTable                                                                   │
│   State: active                                                                              │
│   RouteTableId: rtb-19753867                                                                 │
│                                                                                              │
├──────────────────────────────────────────────────────────────────────────────────────────────┤
│ name: vpc-ec2-example::route-table::igw::0.0.0.0/0                                           │
│ managedByUs: Yes                                                                             │
│ live:                                                                                        │
│   DestinationCidrBlock: 0.0.0.0/0                                                            │
│   GatewayId: igw-0e01961b98c435457                                                           │
│   Origin: CreateRoute                                                                        │
│   State: active                                                                              │
│   RouteTableId: rtb-0bc05587c5359f095                                                        │
│                                                                                              │
├──────────────────────────────────────────────────────────────────────────────────────────────┤
│ name: vpc-ec2-example::route-table::local::10.1.0.0/16                                       │
│ managedByUs: NO                                                                              │
│ live:                                                                                        │
│   DestinationCidrBlock: 10.1.0.0/16                                                          │
│   GatewayId: local                                                                           │
│   Origin: CreateRouteTable                                                                   │
│   State: active                                                                              │
│   RouteTableId: rtb-0bc05587c5359f095                                                        │
│                                                                                              │
├──────────────────────────────────────────────────────────────────────────────────────────────┤
```
