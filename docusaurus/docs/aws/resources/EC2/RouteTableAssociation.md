---
id: RouteTableAssociation
title: Route Table Association
---

Associate a subnet to a [Route Table](https://docs.aws.amazon.com/vpc/latest/userguide/VPC_Route_Tables.html)

## Code

### Route Table associated with a subnet

```js
exports.createResources = () => [
  {
    type: "RouteTableAssociation",
    group: "EC2",
    dependencies: () => ({
      routeTable: "route-table",
      subnet: "subnet",
    }),
  },
];
```

## Examples

- [simple example](https://github.com/grucloud/grucloud/blob/main/examples/aws/ec2/ec2-vpc/iac.js)
- [EKS](https://github.com/grucloud/grucloud/blob/main/packages/modules/aws/eks/iac.js)

## Dependencies

- [RouteTable](./RouteTable.md)
- [Subnet](./Subnet.md)

## List

List only the route tables with the _RouteTableAssociation_ filter:

```sh
gc l -t RouteTableAssociation
```

```txt
Listing resources on 1 provider: aws
✓ aws
  ✓ Initialising
  ✓ Listing 5/5
┌────────────────────────────────────────────────────────────────────────────────┐
│ 2 EC2::RouteTableAssociation from aws                                          │
├────────────────────────────────────────────────────────────────────────────────┤
│ name: rt-assoc::route-table-public::subnet-1                                   │
│ managedByUs: Yes                                                               │
│ live:                                                                          │
│   Main: false                                                                  │
│   RouteTableAssociationId: rtbassoc-0347f6252694e72d0                          │
│   RouteTableId: rtb-0c48ec9583f4e9318                                          │
│   SubnetId: subnet-029068595723f242e                                           │
│   AssociationState:                                                            │
│     State: associated                                                          │
│                                                                                │
├────────────────────────────────────────────────────────────────────────────────┤
│ name: rt-assoc::route-table-public::subnet-2                                   │
│ managedByUs: Yes                                                               │
│ live:                                                                          │
│   Main: false                                                                  │
│   RouteTableAssociationId: rtbassoc-05e975dd7e1adec87                          │
│   RouteTableId: rtb-0c48ec9583f4e9318                                          │
│   SubnetId: subnet-0c9c5cf8b25507188                                           │
│   AssociationState:                                                            │
│     State: associated                                                          │
│                                                                                │
└────────────────────────────────────────────────────────────────────────────────┘


List Summary:
Provider: aws
┌───────────────────────────────────────────────────────────────────────────────┐
│ aws                                                                           │
├────────────────────────────┬──────────────────────────────────────────────────┤
│ EC2::RouteTableAssociation │ rt-assoc::route-table-public::subnet-1           │
│                            │ rt-assoc::route-table-public::subnet-2           │
└────────────────────────────┴──────────────────────────────────────────────────┘
2 resources, 1 type, 1 provider
Command "gc l -t RouteTableAssociation" executed in 5s

```
