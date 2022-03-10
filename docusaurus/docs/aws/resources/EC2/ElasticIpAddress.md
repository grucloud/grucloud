---
id: ElasticIpAddress
title: Elastic Ip Address
---

Provides an [Elastic Ip Address](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/elastic-ip-addresses-eip.html) to be associated to an EC2 instance

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

- [EC2](./Instance.md)
- [Nat Gateway](./NatGateway.md)

## Listing

List only the internet gateway with the _ElasticIpAddress_ filter:

```sh
gc l -t ElasticIpAddress
```

```txt
Listing resources on 1 provider: aws
✓ aws
  ✓ Initialising
  ✓ Listing 1/1
┌────────────────────────────────────────────────────────────────┐
│ 1 EC2::ElasticIpAddress from aws                               │
├────────────────────────────────────────────────────────────────┤
│ name: myip                                                     │
│ managedByUs: Yes                                               │
│ live:                                                          │
│   PublicIp: 54.86.37.0                                         │
│   AllocationId: eipalloc-09ea824e2bac96e70                     │
│   Domain: vpc                                                  │
│   Tags:                                                        │
│     - Key: gc-created-by-provider                              │
│       Value: aws                                               │
│     - Key: gc-managed-by                                       │
│       Value: grucloud                                          │
│     - Key: gc-project-name                                     │
│       Value: dns-record-ip-address                             │
│     - Key: gc-stage                                            │
│       Value: dev                                               │
│     - Key: mykey                                               │
│       Value: myvalue                                           │
│     - Key: Name                                                │
│       Value: myip                                              │
│   PublicIpv4Pool: amazon                                       │
│   NetworkBorderGroup: us-east-1                                │
│                                                                │
└────────────────────────────────────────────────────────────────┘


List Summary:
Provider: aws
┌───────────────────────────────────────────────────────────────┐
│ aws                                                           │
├───────────────────────┬───────────────────────────────────────┤
│ EC2::ElasticIpAddress │ myip                                  │
└───────────────────────┴───────────────────────────────────────┘
1 resource, 1 type, 1 provider
Command "gc l -t ElasticIpAddress" executed in 4s, 138 MB
```
