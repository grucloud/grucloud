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

- [EC2 SecurityGroup](./SecurityGroup.md)
- [EC2 Instance](./Instance.md)
- [EC2 RouteTableAssociation](./RouteTableAssociation.md)
- [EC2 NatGateway](./NatGateway.md)
- [EC2 Flow Logs](./FlowLogs.md)
- [ECS Service](../ECS/Service.md)
- [ECS TaskSet](../ECS/TaskSet.md)
- [EMRServerless Application](../EMRServerless/Application.md)
- [NetworkManager VpcAttachment](../NetworkManager/VpcAttachment.md)
- [RAM Resource Association](../RAM/ResourceAssociation.md)
- [RDS DBSubnetGroup](../RDS/DBSubnetGroup.md)

## Listing

List the subnets filtering by the type `EC2::Subnet`

```sh
gc list --types EC2::Subnet
```

```txt
Listing resources on 1 provider: aws
✓ aws us-west-2 oregon
  ✓ Initialising
  ✓ Listing 2/2
┌───────────────────────────────────────────────────────────────────────────────────┐
│ 5 EC2::Subnet from aws                                                            │
├───────────────────────────────────────────────────────────────────────────────────┤
│ name: vpc-default::subnet-default-a                                               │
│ managedByUs: NO                                                                   │
│ live:                                                                             │
│   AvailabilityZone: us-west-2a                                                    │
│   AvailabilityZoneId: usw2-az2                                                    │
│   AvailableIpAddressCount: 4091                                                   │
│   CidrBlock: 172.31.16.0/20                                                       │
│   DefaultForAz: true                                                              │
│   MapPublicIpOnLaunch: true                                                       │
│   MapCustomerOwnedIpOnLaunch: false                                               │
│   State: available                                                                │
│   SubnetId: subnet-fe3a088a                                                       │
│   VpcId: vpc-5a011238                                                             │
│   OwnerId: 840541460064                                                           │
│   AssignIpv6AddressOnCreation: false                                              │
│   Ipv6CidrBlockAssociationSet: []                                                 │
│   SubnetArn: arn:aws:ec2:us-west-2:840541460064:subnet/subnet-fe3a088a            │
│   EnableDns64: false                                                              │
│   Ipv6Native: false                                                               │
│   PrivateDnsNameOptionsOnLaunch:                                                  │
│     HostnameType: ip-name                                                         │
│     EnableResourceNameDnsARecord: false                                           │
│     EnableResourceNameDnsAAAARecord: false                                        │
│                                                                                   │
├───────────────────────────────────────────────────────────────────────────────────┤
│ name: vpc-default::subnet-default-b                                               │
│ managedByUs: NO                                                                   │
│ live:                                                                             │
│   AvailabilityZone: us-west-2b                                                    │
│   AvailabilityZoneId: usw2-az1                                                    │
│   AvailableIpAddressCount: 4091                                                   │
│   CidrBlock: 172.31.32.0/20                                                       │
│   DefaultForAz: true                                                              │
│   MapPublicIpOnLaunch: true                                                       │
│   MapCustomerOwnedIpOnLaunch: false                                               │
│   State: available                                                                │
│   SubnetId: subnet-832a39e1                                                       │
│   VpcId: vpc-5a011238                                                             │
│   OwnerId: 840541460064                                                           │
│   AssignIpv6AddressOnCreation: false                                              │
│   Ipv6CidrBlockAssociationSet: []                                                 │
│   SubnetArn: arn:aws:ec2:us-west-2:840541460064:subnet/subnet-832a39e1            │
│   EnableDns64: false                                                              │
│   Ipv6Native: false                                                               │
│   PrivateDnsNameOptionsOnLaunch:                                                  │
│     HostnameType: ip-name                                                         │
│     EnableResourceNameDnsARecord: false                                           │
│     EnableResourceNameDnsAAAARecord: false                                        │
│                                                                                   │
├───────────────────────────────────────────────────────────────────────────────────┤
│ name: vpc-default::subnet-default-c                                               │
│ managedByUs: NO                                                                   │
│ live:                                                                             │
│   AvailabilityZone: us-west-2c                                                    │
│   AvailabilityZoneId: usw2-az3                                                    │
│   AvailableIpAddressCount: 4091                                                   │
│   CidrBlock: 172.31.0.0/20                                                        │
│   DefaultForAz: true                                                              │
│   MapPublicIpOnLaunch: true                                                       │
│   MapCustomerOwnedIpOnLaunch: false                                               │
│   State: available                                                                │
│   SubnetId: subnet-49faa70f                                                       │
│   VpcId: vpc-5a011238                                                             │
│   OwnerId: 840541460064                                                           │
│   AssignIpv6AddressOnCreation: false                                              │
│   Ipv6CidrBlockAssociationSet: []                                                 │
│   SubnetArn: arn:aws:ec2:us-west-2:840541460064:subnet/subnet-49faa70f            │
│   EnableDns64: false                                                              │
│   Ipv6Native: false                                                               │
│   PrivateDnsNameOptionsOnLaunch:                                                  │
│     HostnameType: ip-name                                                         │
│     EnableResourceNameDnsARecord: false                                           │
│     EnableResourceNameDnsAAAARecord: false                                        │
│                                                                                   │
├───────────────────────────────────────────────────────────────────────────────────┤
│ name: vpc-default::subnet-default-d                                               │
│ managedByUs: NO                                                                   │
│ live:                                                                             │
│   AvailabilityZone: us-west-2d                                                    │
│   AvailabilityZoneId: usw2-az4                                                    │
│   AvailableIpAddressCount: 4091                                                   │
│   CidrBlock: 172.31.48.0/20                                                       │
│   DefaultForAz: true                                                              │
│   MapPublicIpOnLaunch: true                                                       │
│   MapCustomerOwnedIpOnLaunch: false                                               │
│   State: available                                                                │
│   SubnetId: subnet-fdeb42d6                                                       │
│   VpcId: vpc-5a011238                                                             │
│   OwnerId: 840541460064                                                           │
│   AssignIpv6AddressOnCreation: false                                              │
│   Ipv6CidrBlockAssociationSet: []                                                 │
│   SubnetArn: arn:aws:ec2:us-west-2:840541460064:subnet/subnet-fdeb42d6            │
│   EnableDns64: false                                                              │
│   Ipv6Native: false                                                               │
│   PrivateDnsNameOptionsOnLaunch:                                                  │
│     HostnameType: ip-name                                                         │
│     EnableResourceNameDnsARecord: false                                           │
│     EnableResourceNameDnsAAAARecord: false                                        │
│                                                                                   │
├───────────────────────────────────────────────────────────────────────────────────┤
│ name: vpc::subnet-private1-us-west-2a                                             │
│ managedByUs: NO                                                                   │
│ live:                                                                             │
│   AvailabilityZone: us-west-2a                                                    │
│   AvailabilityZoneId: usw2-az2                                                    │
│   AvailableIpAddressCount: 4091                                                   │
│   CidrBlock: 10.0.128.0/20                                                        │
│   DefaultForAz: false                                                             │
│   MapPublicIpOnLaunch: false                                                      │
│   MapCustomerOwnedIpOnLaunch: false                                               │
│   State: available                                                                │
│   SubnetId: subnet-00c4b54c3723210d3                                              │
│   VpcId: vpc-02867070ad049645c                                                    │
│   OwnerId: 840541460064                                                           │
│   AssignIpv6AddressOnCreation: false                                              │
│   Ipv6CidrBlockAssociationSet: []                                                 │
│   Tags:                                                                           │
│     - Key: Name                                                                   │
│       Value: subnet-private1-us-west-2a                                           │
│   SubnetArn: arn:aws:ec2:us-west-2:840541460064:subnet/subnet-00c4b54c3723210d3   │
│   EnableDns64: false                                                              │
│   Ipv6Native: false                                                               │
│   PrivateDnsNameOptionsOnLaunch:                                                  │
│     HostnameType: ip-name                                                         │
│     EnableResourceNameDnsARecord: false                                           │
│     EnableResourceNameDnsAAAARecord: false                                        │
│                                                                                   │
└───────────────────────────────────────────────────────────────────────────────────┘


List Summary:
Provider: aws
┌──────────────────────────────────────────────────────────────────────────────────┐
│ aws                                                                              │
├─────────────┬────────────────────────────────────────────────────────────────────┤
│ EC2::Subnet │ vpc-default::subnet-default-a                                      │
│             │ vpc-default::subnet-default-b                                      │
│             │ vpc-default::subnet-default-c                                      │
│             │ vpc-default::subnet-default-d                                      │
│             │ vpc::subnet-private1-us-west-2a                                    │
└─────────────┴────────────────────────────────────────────────────────────────────┘
5 resources, 1 type, 1 provider
Command "gc list --types EC2::Subnet" executed in 6s, 105 MB
```
