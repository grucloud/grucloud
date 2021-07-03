---
id: NatGateway
title: Nat Gateway
---

Provides an [Nat Gateway](https://docs.aws.amazon.com/vpc/latest/userguide/vpc-nat-gateway.html)

```js
const vpc = await provider.ec2.makeVpc({
  name: "vpc",
  properties: () => ({
    CidrBlock: "10.1.0.0/16",
  }),
});

const subnetPublic = await provider.ec2.makeSubnet({
  name: "public",
  dependencies: { vpc },
  properties: () => ({
    CidrBlock: "10.1.0.1/24",
  }),
});

const eip = await provider.ec2.makeElasticIpAddress({
  name: "myip",
});

const natGateway = await provider.ec2.makeNatGateway({
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

- [RouteTable](./RouteTable)

### List

```sh
gc l -t NatGateway
```

```sh
Listing resources on 1 provider: aws
✓ aws
  ✓ Initialising
  ✓ Listing 5/5
┌──────────────────────────────────────────────────────────────────────────────────┐
│ 1 NatGateway from aws                                                            │
├─────────────┬─────────────────────────────────────────────────────────────┬──────┤
│ Name        │ Data                                                        │ Our  │
├─────────────┼─────────────────────────────────────────────────────────────┼──────┤
│ nat-gateway │ CreateTime: 2021-04-16T19:18:00.000Z                        │ NO   │
│             │ NatGatewayAddresses:                                        │      │
│             │   - AllocationId: eipalloc-09d70cf85e0cd268b                │      │
│             │     NetworkInterfaceId: eni-0325508aa856d2aaa               │      │
│             │     PrivateIp: 192.168.14.211                               │      │
│             │     PublicIp: 18.135.138.10                                 │      │
│             │ NatGatewayId: nat-032b4f385655f59d8                         │      │
│             │ State: available                                            │      │
│             │ SubnetId: subnet-053363a740a209ba8                          │      │
│             │ VpcId: vpc-03b8d521b703d6c46                                │      │
│             │ Tags:                                                       │      │
│             │   - Key: ManagedBy                                          │      │
│             │     Value: GruCloud                                         │      │
│             │   - Key: stage                                              │      │
│             │     Value: dev                                              │      │
│             │   - Key: projectName                                        │      │
│             │     Value: starhackit                                       │      │
│             │   - Key: CreatedByProvider                                  │      │
│             │     Value: aws                                              │      │
│             │   - Key: Name                                               │      │
│             │     Value: nat-gateway                                      │      │
│             │                                                             │      │
└─────────────┴─────────────────────────────────────────────────────────────┴──────┘


List Summary:
Provider: aws
┌─────────────────────────────────────────────────────────────────────────────────┐
│ aws                                                                             │
├────────────────────┬────────────────────────────────────────────────────────────┤
│ NatGateway         │ nat-gateway                                                │
└────────────────────┴────────────────────────────────────────────────────────────┘
1 resource, 1 type, 1 provider
Command "gc l -t NatGateway" executed in 7s
```
