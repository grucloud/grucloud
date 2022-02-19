---
id: NatGateway
title: Nat Gateway
---

Provides an [Nat Gateway](https://docs.aws.amazon.com/vpc/latest/userguide/vpc-nat-gateway.html)

```js
exports.createResources = () => [
  {
    type: "NatGateway",
    group: "EC2",
    name: "nat-gateway",
    dependencies: () => ({
      subnet: "subnet-public-a",
      eip: "eip",
    }),
  },
];
```

### Examples

- [VPC Module](https://github.com/grucloud/grucloud/blob/main/packages/modules/aws/vpc/iac.js)

### Dependencies

- [ElasticIpAddress](./ElasticIpAddress.md)
- [Subnet](./Subnet.md)

### Used By

- [RouteTable](./RouteTable.md)

### List

```sh
gc l -t NatGateway
```

```sh
Listing resources on 1 provider: aws
✓ aws
  ✓ Initialising
  ✓ Listing 1/1
┌────────────────────────────────────────────────────────────────┐
│ 1 EC2::NatGateway from aws                                     │
├────────────────────────────────────────────────────────────────┤
│ name: nat-gateway                                              │
│ managedByUs: Yes                                               │
│ live:                                                          │
│   CreateTime: 2022-02-19T05:51:47.000Z                         │
│   NatGatewayAddresses:                                         │
│     - AllocationId: eipalloc-0f1ae0002f1d00a01                 │
│       NetworkInterfaceId: eni-0dae115001a68f8e0                │
│       PrivateIp: 192.168.17.249                                │
│       PublicIp: 54.162.250.104                                 │
│   NatGatewayId: nat-054c80ea67bbdea71                          │
│   State: available                                             │
│   SubnetId: subnet-0cffca87fe74ee14b                           │
│   VpcId: vpc-0e4bf3af536917eac                                 │
│   Tags:                                                        │
│     - Key: gc-created-by-provider                              │
│       Value: aws                                               │
│     - Key: gc-managed-by                                       │
│       Value: grucloud                                          │
│     - Key: gc-project-name                                     │
│       Value: @grucloud/example-aws-vpc                         │
│     - Key: gc-stage                                            │
│       Value: dev                                               │
│     - Key: Name                                                │
│       Value: nat-gateway                                       │
│   ConnectivityType: public                                     │
│                                                                │
└────────────────────────────────────────────────────────────────┘


List Summary:
Provider: aws
┌───────────────────────────────────────────────────────────────┐
│ aws                                                           │
├─────────────────┬─────────────────────────────────────────────┤
│ EC2::NatGateway │ nat-gateway                                 │
└─────────────────┴─────────────────────────────────────────────┘
1 resource, 1 type, 1 provider
Command "gc l -t NatGateway" executed in 2s
```
