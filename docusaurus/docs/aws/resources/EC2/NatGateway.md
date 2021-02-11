---
id: NatGateway
title: Nat Gateway
---

Provides an [Nat Gateway](https://docs.aws.amazon.com/vpc/latest/userguide/vpc-nat-gateway.html)

```js
const vpc = await provider.makeVpc({
  name: "vpc",
  properties: () => ({
    CidrBlock: "10.1.0.0/16",
  }),
});

const subnetPublic = await provider.makeSubnet({
  name: "public",
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
```

### Examples

- [EKS](https://github.com/grucloud/grucloud/blob/main/examples/aws/eks/iac.js)

### Dependencies

- [ElasticIpAddress](./ElasticIpAddress)
- [Subnet](./Subnet)

### Used By

- [RouteTables](./RouteTables)
