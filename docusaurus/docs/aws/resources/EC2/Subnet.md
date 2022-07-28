---
title: Subnet
---

Provides an [AWS subnet](https://docs.aws.amazon.com/vpc/latest/userguide/VPC_Subnets.html):

## Examples

### Simple subnet

```js
exports.createResources = () => [
  {
    type: "Subnet",
    group: "EC2",
    name: "PubSubnetAz1",
    properties: ({ config }) => ({
      CidrBlock: "10.0.0.0/24",
      AvailabilityZone: `${config.region}a`,
    }),
    dependencies: () => ({
      vpc: "Vpc",
    }),
  },
];
```

### Subnet with attributes:

The list of attributes can found in [ModifySubnetAttributeCommandInput](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-ec2/interfaces/modifysubnetattributecommandinput.html) function parameter.

```js
exports.createResources = () => [
  {
    type: "Subnet",
    group: "EC2",
    name: "PubSubnetAz1",
    properties: ({ config }) => ({
      CidrBlock: "10.0.0.0/24",
      AvailabilityZone: `${config.region}a`,
      MapPublicIpOnLaunch: true,
    }),
    dependencies: () => ({
      vpc: "Vpc",
    }),
  },
];
```

### Subnet with Tags

```js
exports.createResources = () => [
  {
    type: "Subnet",
    group: "EC2",
    name: "PubSubnetAz1",
    properties: ({ config }) => ({
      CidrBlock: "10.0.0.0/24",
      AvailabilityZone: `${config.region}a`,
      MapPublicIpOnLaunch: true,
      Tags: [{ Key: "kubernetes.io/role/elb", Value: "1" }],
    }),
    dependencies: () => ({
      vpc: "Vpc",
    }),
  },
];
```

### Ipv6 only Subnet

```js
exports.createResources = () => [
  {
    type: "Subnet",
    group: "EC2",
    name: "subnet-public",
    properties: ({ config }) => ({
      AvailabilityZone: `${config.region}d`,
      Ipv6Native: true,
      PrivateDnsNameOptionsOnLaunch: {
        HostnameType: "resource-name",
        EnableResourceNameDnsAAAARecord: true,
      },
      Ipv6SubnetPrefix: "01",
    }),
    dependencies: ({}) => ({
      vpc: "vpc-ipv6",
    }),
  },
];
```

## Code Examples

- [simple example](https://github.com/grucloud/grucloud/blob/main/examples/aws/EC2/ec2-vpc)

- [dual ipv4/ipv6](https://github.com/grucloud/grucloud/blob/main/examples/aws/EC2/subnet-ipv4-ipv6)

- [ipv6 only](https://github.com/grucloud/grucloud/blob/main/examples/aws/EC2/subnet-ipv6)

## Properties

- [CreateSubnetCommandInput](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-ec2/interfaces/createsubnetcommandinput.html)

## Dependencies

- [Vpc](./Vpc)

## Used By

- [SecurityGroup](./SecurityGroup.md)
- [EC2](./Instance.md)
- [ECS Service](../ECS/Service.md)
- [ECS TaskSet](../ECS/TaskSet.md)
- [RouteTableAssociation](./RouteTableAssociation.md)
- [NatGateway](./NatGateway.md)
- [Flow Logs](./FlowLogs.md)

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
