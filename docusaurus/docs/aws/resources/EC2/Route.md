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

- [simple example](https://github.com/grucloud/grucloud/blob/main/examples/aws/ec2/ec2-vpc/iac.js)
- [EKS](https://github.com/grucloud/grucloud/blob/main/packages/modules/aws/eks/iac.js)

## Dependencies

- [RouteTable](./RouteTable.md)
- [InternetGateway](./InternetGateway.md)
- [NatGateway](./NatGateway.md)
