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

## Examples

- [simple example](https://github.com/grucloud/grucloud/blob/main/examples/aws/EC2/ec2-vpc)

## Properties

- [CreateRouteCommandInput](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-ec2/interfaces/createroutecommandinput.html)

## Dependencies

- [RouteTable](./RouteTable.md)
- [InternetGateway](./InternetGateway.md)
- [NatGateway](./NatGateway.md)
