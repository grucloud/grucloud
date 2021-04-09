---
title: Subnet
---

Provides an [AWS subnet](https://docs.aws.amazon.com/vpc/latest/userguide/VPC_Subnets.html):

## Examples

### Simple subnet

```js
const vpc = await provider.makeVpc({
  name: "vpc",
  properties: () => ({
    CidrBlock: "10.1.0.0/16",
  }),
});

const subnet = await provider.makeSubnet({
  name: "subnet",
  dependencies: { vpc },
  properties: () => ({
    CidrBlock: "10.1.0.1/24",
  }),
});
```

### Subnet with attributes:

The list of attributes can found in [modifySubnetAttribute](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#modifySubnetAttribute-property) function parameter.

```js
const vpc = await provider.makeVpc({
  name: "vpc",
  attributes: () => ({
    MapPublicIpOnLaunch: {
      Value: true,
    },
  }),
  properties: () => ({
    CidrBlock: "10.1.0.0/16",
  }),
});

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
  attributes: () => ({
    MapPublicIpOnLaunch: {
      Value: true,
    },
  }),
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

- [simple example](https://github.com/grucloud/grucloud/blob/main/examples/aws/ec2-vpc/iac.js)
- [module-aws-vpc](https://github.com/grucloud/grucloud/blob/main/packages/modules/aws/vpc/iac.js)

## Dependencies

- [Vpc](./Vpc)

## Used By

- [SecurityGroup](./SecurityGroup)
- [EC2](./EC2)
- [RouteTable](./RouteTable)
- [NatGateway](./NatGateway)

## Listing

List the subnets filtering by the type `Subnet`

```sh
gc list --types Subnet
```

```sh
Listing resources on 1 provider: aws
✓ aws
  ✓ Initialising
  ✓ Listing 2/2
┌──────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ 5 Subnet from aws                                                                                    │
├──────────────────┬────────────────────────────────────────────────────────────────────────────┬──────┤
│ Name             │ Data                                                                       │ Our  │
├──────────────────┼────────────────────────────────────────────────────────────────────────────┼──────┤
│ subnet-public-1  │ AvailabilityZone: eu-west-2a                                               │ Yes  │
│                  │ AvailabilityZoneId: euw2-az2                                               │      │
│                  │ AvailableIpAddressCount: 8186                                              │      │
│                  │ CidrBlock: 192.168.0.0/19                                                  │      │
│                  │ DefaultForAz: false                                                        │      │
│                  │ MapPublicIpOnLaunch: true                                                  │      │
│                  │ MapCustomerOwnedIpOnLaunch: false                                          │      │
│                  │ State: available                                                           │      │
│                  │ SubnetId: subnet-0bc901f569ce3e55c                                         │      │
│                  │ VpcId: vpc-06d8eb1ddef9ed0f1                                               │      │
│                  │ OwnerId: 840541460064                                                      │      │
│                  │ AssignIpv6AddressOnCreation: false                                         │      │
│                  │ Ipv6CidrBlockAssociationSet: []                                            │      │
│                  │ Tags:                                                                      │      │
│                  │   - Key: kubernetes.io/role/elb                                            │      │
│                  │     Value: 1                                                               │      │
│                  │   - Key: ManagedBy                                                         │      │
│                  │     Value: GruCloud                                                        │      │
│                  │   - Key: Name                                                              │      │
│                  │     Value: subnet-public-1                                                 │      │
│                  │   - Key: stage                                                             │      │
│                  │     Value: dev                                                             │      │
│                  │   - Key: CreatedByProvider                                                 │      │
│                  │     Value: aws                                                             │      │
│                  │   - Key: projectName                                                       │      │
│                  │     Value: @grucloud/example-module-aws-eks                                │      │
│                  │   - Key: kubernetes.io/cluster/cluster                                     │      │
│                  │     Value: shared                                                          │      │
│                  │ SubnetArn: arn:aws:ec2:eu-west-2:840541460064:subnet/subnet-0bc901f569ce3… │      │
│                  │                                                                            │      │
├──────────────────┼────────────────────────────────────────────────────────────────────────────┼──────┤
│ subnet-private-2 │ AvailabilityZone: eu-west-2b                                               │ Yes  │
│                  │ AvailabilityZoneId: euw2-az3                                               │      │
│                  │ AvailableIpAddressCount: 8187                                              │      │
│                  │ CidrBlock: 192.168.128.0/19                                                │      │
│                  │ DefaultForAz: false                                                        │      │
│                  │ MapPublicIpOnLaunch: false                                                 │      │
│                  │ MapCustomerOwnedIpOnLaunch: false                                          │      │
│                  │ State: available                                                           │      │
│                  │ SubnetId: subnet-0335cd853ab7b2cd1                                         │      │
│                  │ VpcId: vpc-06d8eb1ddef9ed0f1                                               │      │
│                  │ OwnerId: 840541460064                                                      │      │
│                  │ AssignIpv6AddressOnCreation: false                                         │      │
│                  │ Ipv6CidrBlockAssociationSet: []                                            │      │
│                  │ Tags:                                                                      │      │
│                  │   - Key: ManagedBy                                                         │      │
│                  │     Value: GruCloud                                                        │      │
│                  │   - Key: projectName                                                       │      │
│                  │     Value: @grucloud/example-module-aws-eks                                │      │
│                  │   - Key: kubernetes.io/cluster/cluster                                     │      │
│                  │     Value: shared                                                          │      │
│                  │   - Key: CreatedByProvider                                                 │      │
│                  │     Value: aws                                                             │      │
│                  │   - Key: Name                                                              │      │
│                  │     Value: subnet-private-2                                                │      │
│                  │   - Key: kubernetes.io/role/internal-elb                                   │      │
│                  │     Value: 1                                                               │      │
│                  │   - Key: stage                                                             │      │
│                  │     Value: dev                                                             │      │
│                  │ SubnetArn: arn:aws:ec2:eu-west-2:840541460064:subnet/subnet-0335cd853ab7b… │      │
│                  │                                                                            │      │
├──────────────────┼────────────────────────────────────────────────────────────────────────────┼──────┤
│ subnet-private-1 │ AvailabilityZone: eu-west-2a                                               │ Yes  │
│                  │ AvailabilityZoneId: euw2-az2                                               │      │
│                  │ AvailableIpAddressCount: 8187                                              │      │
│                  │ CidrBlock: 192.168.96.0/19                                                 │      │
│                  │ DefaultForAz: false                                                        │      │
│                  │ MapPublicIpOnLaunch: false                                                 │      │
│                  │ MapCustomerOwnedIpOnLaunch: false                                          │      │
│                  │ State: available                                                           │      │
│                  │ SubnetId: subnet-0e600c9492fbf10c7                                         │      │
│                  │ VpcId: vpc-06d8eb1ddef9ed0f1                                               │      │
│                  │ OwnerId: 840541460064                                                      │      │
│                  │ AssignIpv6AddressOnCreation: false                                         │      │
│                  │ Ipv6CidrBlockAssociationSet: []                                            │      │
│                  │ Tags:                                                                      │      │
│                  │   - Key: projectName                                                       │      │
│                  │     Value: @grucloud/example-module-aws-eks                                │      │
│                  │   - Key: ManagedBy                                                         │      │
│                  │     Value: GruCloud                                                        │      │
│                  │   - Key: kubernetes.io/cluster/cluster                                     │      │
│                  │     Value: shared                                                          │      │
│                  │   - Key: Name                                                              │      │
│                  │     Value: subnet-private-1                                                │      │
│                  │   - Key: CreatedByProvider                                                 │      │
│                  │     Value: aws                                                             │      │
│                  │   - Key: kubernetes.io/role/internal-elb                                   │      │
│                  │     Value: 1                                                               │      │
│                  │   - Key: stage                                                             │      │
│                  │     Value: dev                                                             │      │
│                  │ SubnetArn: arn:aws:ec2:eu-west-2:840541460064:subnet/subnet-0e600c9492fbf… │      │
│                  │                                                                            │      │
├──────────────────┼────────────────────────────────────────────────────────────────────────────┼──────┤
│ subnet-public-2  │ AvailabilityZone: eu-west-2b                                               │ Yes  │
│                  │ AvailabilityZoneId: euw2-az3                                               │      │
│                  │ AvailableIpAddressCount: 8187                                              │      │
│                  │ CidrBlock: 192.168.32.0/19                                                 │      │
│                  │ DefaultForAz: false                                                        │      │
│                  │ MapPublicIpOnLaunch: true                                                  │      │
│                  │ MapCustomerOwnedIpOnLaunch: false                                          │      │
│                  │ State: available                                                           │      │
│                  │ SubnetId: subnet-0a56a7f4e874f99fc                                         │      │
│                  │ VpcId: vpc-06d8eb1ddef9ed0f1                                               │      │
│                  │ OwnerId: 840541460064                                                      │      │
│                  │ AssignIpv6AddressOnCreation: false                                         │      │
│                  │ Ipv6CidrBlockAssociationSet: []                                            │      │
│                  │ Tags:                                                                      │      │
│                  │   - Key: kubernetes.io/role/elb                                            │      │
│                  │     Value: 1                                                               │      │
│                  │   - Key: CreatedByProvider                                                 │      │
│                  │     Value: aws                                                             │      │
│                  │   - Key: stage                                                             │      │
│                  │     Value: dev                                                             │      │
│                  │   - Key: kubernetes.io/cluster/cluster                                     │      │
│                  │     Value: shared                                                          │      │
│                  │   - Key: projectName                                                       │      │
│                  │     Value: @grucloud/example-module-aws-eks                                │      │
│                  │   - Key: ManagedBy                                                         │      │
│                  │     Value: GruCloud                                                        │      │
│                  │   - Key: Name                                                              │      │
│                  │     Value: subnet-public-2                                                 │      │
│                  │ SubnetArn: arn:aws:ec2:eu-west-2:840541460064:subnet/subnet-0a56a7f4e874f… │      │
│                  │                                                                            │      │
├──────────────────┼────────────────────────────────────────────────────────────────────────────┼──────┤
│ default          │ AvailabilityZone: eu-west-2a                                               │ NO   │
│                  │ AvailabilityZoneId: euw2-az2                                               │      │
│                  │ AvailableIpAddressCount: 4091                                              │      │
│                  │ CidrBlock: 172.31.0.0/20                                                   │      │
│                  │ DefaultForAz: true                                                         │      │
│                  │ MapPublicIpOnLaunch: true                                                  │      │
│                  │ MapCustomerOwnedIpOnLaunch: false                                          │      │
│                  │ State: available                                                           │      │
│                  │ SubnetId: subnet-0f6f085fc384bf8ce                                         │      │
│                  │ VpcId: vpc-bbbafcd3                                                        │      │
│                  │ OwnerId: 840541460064                                                      │      │
│                  │ AssignIpv6AddressOnCreation: false                                         │      │
│                  │ Ipv6CidrBlockAssociationSet: []                                            │      │
│                  │ Tags: []                                                                   │      │
│                  │ SubnetArn: arn:aws:ec2:eu-west-2:840541460064:subnet/subnet-0f6f085fc384b… │      │
│                  │                                                                            │      │
└──────────────────┴────────────────────────────────────────────────────────────────────────────┴──────┘


List Summary:
Provider: aws
┌─────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ aws                                                                                                 │
├────────────────────┬────────────────────────────────────────────────────────────────────────────────┤
│ Subnet             │ subnet-public-1                                                                │
│                    │ subnet-private-2                                                               │
│                    │ subnet-private-1                                                               │
│                    │ subnet-public-2                                                                │
│                    │ default                                                                        │
└────────────────────┴────────────────────────────────────────────────────────────────────────────────┘
5 resources, 1 type, 1 provider
Command "gc list --types Subnet" executed in 5s
```
