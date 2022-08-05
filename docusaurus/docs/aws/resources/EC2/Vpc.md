---
id: Vpc
title: Vpc
---

Provide a Virtual Private Cloud:

## Examples

### Simple Vpc

```js
exports.createResources = () => [
  {
    type: "Vpc",
    group: "EC2",
    name: "Vpc",
    properties: ({}) => ({
      CidrBlock: "10.0.0.0/16",
      DnsHostnames: true,
    }),
  },
];
```

### Vpc with Tags

```js
const clusterName = "cluster";

exports.createResources = () => [
  {
    type: "Vpc",
    group: "EC2",
    name: "Vpc",
    properties: ({}) => ({
      CidrBlock: "10.0.0.0/16",
      DnsHostnames: true,
      Tags: [{ Key: `kubernetes.io/cluster/${clusterName}`, Value: "shared" }],
    }),
  },
];
```

### Vpc with DnsHostnames and DnsSupport

```js
exports.createResources = () => [
  {
    type: "Vpc",
    group: "EC2",
    name: "Vpc",
    properties: ({}) => ({
      DnsHostnames: true,
      DnsSupport: true,
      CidrBlock: "10.1.0.0/16",
    }),
  },
];

const vpc = provider.EC2.makeVpc({
  name: "vpc",
  properties: () => ({
    DnsHostnames: true,
    DnsSupport: true,
    CidrBlock: "10.1.0.0/16",
  }),
});
```

## Code Examples

- [simple example](https://github.com/grucloud/grucloud/blob/main/examples/aws/EC2/ec2-vpc/resources.js)

## Properties

- [CreateVpcCommandInput](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-ec2/interfaces/createvpccommandinput.html)

## Used By

- [CodeBuild Project](../CodeBuild/Project.md)
- [EC2 Client Vpn Endpoint](../EC2/ClientVpnEndpoint.md)
- [EC2 Dhcp Options Association](./DhcpOptionsAssociation.md)
- [EC2 Flow Logs](./FlowLogs.md)
- [EC2 Internet Gateway Attachment](./InternetGatewayAttachment.md)
- [EC2 Security Group](./SecurityGroup.md)
- [EC2 Subnet](./Subnet.md)
- [EC2 Vpc Peering Connection](./VpcPeeringConnection.md)
- [NetworkManager VpcAttachment](../NetworkManager/VpcAttachment.md)
- [Route53 HostedZone](../Route53/HostedZone.md)

## List

List the vpcs with the _Vpc_ filter:

```sh
gc list -t Vpc
```

```txt
Listing resources on 1 provider: aws
✓ aws
  ✓ Initialising
  ✓ Listing 3/3
┌────────────────────────────────────────────────────────────────────────┐
│ 1 EC2::Vpc from aws                                                    │
├────────────────────────────────────────────────────────────────────────┤
│ name: vpc-default                                                      │
│ managedByUs: NO                                                        │
│ live:                                                                  │
│   CidrBlock: 172.31.0.0/16                                             │
│   DhcpOptionsId: dopt-036a6462c18e0cce0                                │
│   State: available                                                     │
│   VpcId: vpc-0860f958ca006c083                                         │
│   OwnerId: 548529576214                                                │
│   InstanceTenancy: default                                             │
│   CidrBlockAssociationSet:                                             │
│     - AssociationId: vpc-cidr-assoc-0ee57c3c5e6485f3c                  │
│       CidrBlock: 172.31.0.0/16                                         │
│       CidrBlockState:                                                  │
│         State: associated                                              │
│   IsDefault: true                                                      │
│   DnsSupport: true                                                     │
│   DnsHostnames: true                                                   │
│                                                                        │
└────────────────────────────────────────────────────────────────────────┘


List Summary:
Provider: aws
┌───────────────────────────────────────────────────────────────────────┐
│ aws                                                                   │
├──────────┬────────────────────────────────────────────────────────────┤
│ EC2::Vpc │ vpc-default                                                │
└──────────┴────────────────────────────────────────────────────────────┘
1 resource, 1 type, 1 provider
Command "gc l -t Vpc" executed in 4s, 173 MB
```
