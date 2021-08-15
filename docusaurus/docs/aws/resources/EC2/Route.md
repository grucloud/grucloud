---
id: Route
title: Route
---

Create a route and associate it to an internet gateway or NAT gateway.

## Example code

### Attach a route to an internet gateway

```js
const vpc = provider.ec2.makeVpc({
  name: "vpc",
  properties: () => ({
    CidrBlock: "10.1.0.0/16",
  }),
});

const ig = provider.ec2.makeInternetGateway({
  name: "ig",
  dependencies: { vpc },
});

const subnet = provider.ec2.makeSubnet({
  name: "subnet",
  dependencies: { vpc },
  properties: () => ({
    CidrBlock: "10.1.0.1/24",
  }),
});

const routeTable = provider.ec2.makeRouteTable({
  name: "route-table",
  dependencies: { vpc, subnets: [subnet] },
});

const route = provider.ec2.makeRoute({
  name: "route-ig",
  dependencies: { routeTable, ig },
});
```

### Attach a route to a NAT gateway

```js
const vpc = provider.ec2.makeVpc({
  name: "vpc",
  properties: () => ({
    CidrBlock: "10.1.0.0/16",
  }),
});

const subnetPublic = provider.ec2.makeSubnet({
  name: "subnet-public",
  dependencies: { vpc },
  properties: () => ({
    CidrBlock: "10.1.0.1/24",
  }),
});

const eip = provider.ec2.makeElasticIpAddress({
  name: "myip",
});

const natGateway = provider.ec2.makeNatGateway({
  name: "nat-gateway",
  dependencies: { subnet: subnetPublic, eip },
});

const subnetPrivate = provider.ec2.makeSubnet({
  name: "subnet-private",
  dependencies: { vpc },
  properties: () => ({
    CidrBlock: "10.1.1.1/24",
  }),
});

const routeTablePrivate = provider.ec2.makeRouteTable({
  name: "route-table-private",
  dependencies: { vpc, subnets: [subnetPrivate] },
});

const routeNat = provider.ec2.makeRoute({
  name: "route-nat",
  dependencies: { routeTable: routeTablePrivate, natGateway },
});
```

## Examples

- [simple example](https://github.com/grucloud/grucloud/blob/main/examples/aws/ec2/ec2-vpc/iac.js)
- [EKS](https://github.com/grucloud/grucloud/blob/main/packages/modules/aws/eks/iac.js)

## Dependencies

- [RouteTable](./RouteTable)
- [InternetGateway](./InternetGateway)
- [NatGateway](./NatGateway)
