---
id: ElasticIpAddress
title: Elastic Ip Address
---

Provides an [Elastic Ip Address](https://console.aws.amazon.com/ec2/v2/home?#Addresses:) to be associated to an EC2 instance

```js
exports.createResources = () => [
  {
    type: "ElasticIpAddress",
    group: "EC2",
    name: "eip",
    properties: ({}) => ({
      Tags: [
        {
          Key: "mykey",
          Value: "myvalue",
        },
      ],
    }),
  },
];
```

### Properties

- [AllocateAddressCommandInput](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-ec2/interfaces/allocateaddresscommandinput.html)

### Examples

- [simple example](https://github.com/grucloud/grucloud/blob/main/examples/aws/EC2/ec2/resources.js)
- [example with internet gateway and routing table](https://github.com/grucloud/grucloud/blob/main/examples/aws/EC2/ec2-vpc/resources.js)

- [ip address dns record](https://github.com/grucloud/grucloud/blob/main/examples/aws/Route53/dns-record-ip-address)

### Used By

- [EC2 Elastic Ip Address Association](./ElasticIpAddressAssociation.md)
- [EC2 Nat Gateway](./NatGateway.md)
- [Route53 Record](../Route53/Record.md)

## Listing

List only the elastic IP address with the _ElasticIpAddress_ filter:

```sh
gc l -t ElasticIpAddress
```

```txt
Listing resources on 1 provider: aws
✓ aws
  ✓ Initialising
  ✓ Listing 2/2
┌─────────────────────────────────────────────────────────────────────────┐
│ 1 EC2::ElasticIpAddress from aws                                        │
├─────────────────────────────────────────────────────────────────────────┤
│ name: eip                                                               │
│ managedByUs: Yes                                                        │
│ live:                                                                   │
│   InstanceId: i-079dbd606096303f2                                       │
│   PublicIp: 3.228.154.164                                               │
│   AllocationId: eipalloc-0993474ac0c7bf743                              │
│   AssociationId: eipassoc-0faab88f5a5103704                             │
│   Domain: vpc                                                           │
│   NetworkInterfaceId: eni-092b69907be24f463                             │
│   NetworkInterfaceOwnerId: 840541460064                                 │
│   PrivateIpAddress: 172.31.92.153                                       │
│   Tags:                                                                 │
│     - Key: gc-created-by-provider                                       │
│       Value: aws                                                        │
│     - Key: gc-managed-by                                                │
│       Value: grucloud                                                   │
│     - Key: gc-project-name                                              │
│       Value: @grucloud/example-aws-ec2                                  │
│     - Key: gc-stage                                                     │
│       Value: dev                                                        │
│     - Key: Name                                                         │
│       Value: eip                                                        │
│   PublicIpv4Pool: amazon                                                │
│   NetworkBorderGroup: us-east-1                                         │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘


List Summary:
Provider: aws
┌────────────────────────────────────────────────────────────────────────┐
│ aws                                                                    │
├───────────────────────┬────────────────────────────────────────────────┤
│ EC2::ElasticIpAddress │ eip                                            │
└───────────────────────┴────────────────────────────────────────────────┘
1 resource, 1 type, 1 provider
Command "gc list -t ElasticIpAddress" executed in 6s, 164 MB
```
