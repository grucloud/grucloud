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

## Examples

- [simple example](https://github.com/grucloud/grucloud/blob/main/examples/aws/EC2/ec2-vpc)
- [vpc endpoint](https://github.com/grucloud/grucloud/blob/main/examples/aws/EC2/vpc-endpoint)
- [transit gateway](https://github.com/grucloud/grucloud/blob/main/examples/aws/EC2/transit-gateway)
- [egress-only-internet-gateway](https://github.com/grucloud/grucloud/blob/main/examples/aws/EC2/egress-only-internet-gateway)

## Properties

- [CreateRouteCommandInput](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-ec2/interfaces/createroutecommandinput.html)

## Dependencies

- [Route Table](./RouteTable.md)
- [Internet Gateway](./InternetGateway.md)
- [Nat Gateway](./NatGateway.md)
- [Vpc Endpoint](./VpcEndpoint.md)
- [Transit Gateway](./TransitGateway.md)
- [EgressOnlyInternetGateway](./EgressOnlyInternetGateway.md)
