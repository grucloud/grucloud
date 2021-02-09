---
title: Subnet
---

Provides a subnet:

## Examples

### Simple subnet

```js
const subnet = await provider.makeSubnet({
  name: "subnet",
  dependencies: { vpc },
  properties: () => ({
    CidrBlock: "10.1.0.1/24",
  }),
});
```

### Subnet with Tags

```js
const clusterName = "cluster";
const vpc = await provider.makeVpc({
  name: "vpc-eks",
  properties: () => ({
    CidrBlock: "10.1.0.0/16",
    Tags: [{ Key: `kubernetes.io/cluster/${clusterName}`, Value: "shared" }],
  }),
});

const subnetPublic = await provider.makeSubnet({
  name: "subnet-public",
  dependencies: { vpc },
  properties: () => ({
    CidrBlock: "10.1.0.1/24",
    AvailabilityZone: "eu-west-2a",
    Tags: [{ Key: "kubernetes.io/role/elb", Value: "1" }],
  }),
});

const subnetPrivate = await provider.makeSubnet({
  name: "subnet-private",
  dependencies: { vpc },
  properties: () => ({
    CidrBlock: "10.1.1.1/24",
    AvailabilityZone: "eu-west-2b",
    Tags: [{ Key: "kubernetes.io/role/internal-elb", Value: "1" }],
  }),
});
```

## Code Examples

- [simple example](https://github.com/grucloud/grucloud/blob/main/examples/aws/ec2-vpc/iac.js#L19)
- [eks](https://github.com/grucloud/grucloud/blob/main/examples/aws/eks/iac.js#L19)

## Dependencies

- [Vpc](./Vpc)

## Used By

- [SecurityGroup](./SecurityGroup)
- [EC2](./EC2)
- [RouteTables](./RouteTables)
- [NatGateway](./NatGateway)
