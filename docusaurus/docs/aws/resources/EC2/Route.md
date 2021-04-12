---
id: Route
title: Route
---

Create a route and associate it to an internet gateway or NAT gateway.

## Example code

### Attach a route to an internet gateway

```js
const vpc = await provider.makeVpc({
  name: "vpc",
  properties: () => ({
    CidrBlock: "10.1.0.0/16",
  }),
});

const ig = await provider.makeInternetGateway({
  name: "ig",
  dependencies: { vpc },
});

const subnet = await provider.makeSubnet({
  name: "subnet",
  dependencies: { vpc },
  properties: () => ({
    CidrBlock: "10.1.0.1/24",
  }),
});

const routeTable = await provider.makeRouteTable({
  name: "route-table",
  dependencies: { vpc, subnets: [subnet] },
});

const route = await provider.makeRoute({
  name: "route-ig",
  dependencies: { routeTable, ig },
});
```

### Attach a route to a NAT gateway

```js
const vpc = await provider.makeVpc({
  name: "vpc",
  properties: () => ({
    CidrBlock: "10.1.0.0/16",
  }),
});

const subnetPublic = await provider.makeSubnet({
  name: "subnet-public",
  dependencies: { vpc },
  properties: () => ({
    CidrBlock: "10.1.0.1/24",
  }),
});

const eip = await provider.makeElasticIpAddress({
  name: "myip",
});

const natGateway = await provider.makeNatGateway({
  name: "nat-gateway",
  dependencies: { subnet: subnetPublic, eip },
});

const subnetPrivate = await provider.makeSubnet({
  name: "subnet-private",
  dependencies: { vpc },
  properties: () => ({
    CidrBlock: "10.1.1.1/24",
  }),
});

const routeTablePrivate = await provider.makeRouteTable({
  name: "route-table-private",
  dependencies: { vpc, subnets: [subnetPrivate] },
});

const routeNat = await provider.makeRoute({
  name: "route-nat",
  dependencies: { routeTable: routeTablePrivate, natGateway },
});
```

## Examples

- [simple example](https://github.com/grucloud/grucloud/blob/main/examples/aws/ec2-vpc/iac.js)
- [EKS](https://github.com/grucloud/grucloud/blob/main/examples/aws/eks/iac.js)

## Dependencies

- [RouteTable](./RouteTable)
- [InternetGateway](./InternetGateway)
- [NatGateway](./NatGateway)
