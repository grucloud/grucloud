---
id: RouteTable
title: Route Table
---

Provides a [Route Table](https://docs.aws.amazon.com/vpc/latest/userguide/VPC_Route_Tables.html)

```js
const vpc = await provider.ec2.makeVpc({
  name: "vpc",
  properties: () => ({
    CidrBlock: "10.1.0.0/16",
  }),
});

const subnet = await provider.ec2.makeSubnet({
  name: "subnet",
  dependencies: { vpc },
  properties: () => ({
    CidrBlock: "10.1.0.1/24",
  }),
});

const routeTable = await provider.ec2.makeRouteTable({
  name: "rt",
  dependencies: { vpc, subnets: [subnet] },
});
```

### Examples

- [simple example](https://github.com/grucloud/grucloud/blob/main/examples/aws/ec2-vpc/iac.js)
- [EKS](https://github.com/grucloud/grucloud/blob/main/packages/modules/aws/eks/iac.js)

### Dependencies

- [Vpc](./Vpc)
- [Subnet](./Subnet)

## Used By

- [Route](./Route)

## List

List only the route tables with the _RouteTable_ filter:

```sh
gc l -t RouteTable
```

```sh
Listing resources on 1 provider: aws
✓ aws
  ✓ Initialising
  ✓ Listing 3/3
┌───────────────────────────────────────────────────────────────────────────────────────┐
│ 1 RouteTable from aws                                                                 │
├──────────────┬─────────────────────────────────────────────────────────────────┬──────┤
│ Name         │ Data                                                            │ Our  │
├──────────────┼─────────────────────────────────────────────────────────────────┼──────┤
│ rtb-668fbc0e │ Associations:                                                   │ NO   │
│              │   - Main: true                                                  │      │
│              │     RouteTableAssociationId: rtbassoc-90bf06fb                  │      │
│              │     RouteTableId: rtb-668fbc0e                                  │      │
│              │     AssociationState:                                           │      │
│              │       State: associated                                         │      │
│              │ PropagatingVgws: []                                             │      │
│              │ RouteTableId: rtb-668fbc0e                                      │      │
│              │ Routes:                                                         │      │
│              │   - DestinationCidrBlock: 172.31.0.0/16                         │      │
│              │     GatewayId: local                                            │      │
│              │     Origin: CreateRouteTable                                    │      │
│              │     State: active                                               │      │
│              │   - DestinationCidrBlock: 0.0.0.0/0                             │      │
│              │     GatewayId: igw-041e0d42bb3b4149c                            │      │
│              │     Origin: CreateRoute                                         │      │
│              │     State: active                                               │      │
│              │ Tags: []                                                        │      │
│              │ VpcId: vpc-bbbafcd3                                             │      │
│              │ OwnerId: 840541460064                                           │      │
│              │                                                                 │      │
└──────────────┴─────────────────────────────────────────────────────────────────┴──────┘


List Summary:
Provider: aws
┌──────────────────────────────────────────────────────────────────────────────────────┐
│ aws                                                                                  │
├────────────────────┬─────────────────────────────────────────────────────────────────┤
│ RouteTable         │ rtb-668fbc0e                                                    │
└────────────────────┴─────────────────────────────────────────────────────────────────┘
1 resource, 1 type, 1 provider
Command "gc l -t RouteTable" executed in 4s
```
