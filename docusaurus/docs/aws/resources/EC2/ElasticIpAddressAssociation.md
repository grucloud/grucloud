---
id: ElasticIpAddressAssociation
title: Elastic Ip Address Association
---

Provides an [Elastic Ip Address Association](https://console.aws.amazon.com/ec2/v2/home?#Addresses:)
This resource associates an elastic IP address to an EC2 instance.

```js
exports.createResources = () => [
  {
    type: "ElasticIpAddressAssociation",
    group: "EC2",
    dependencies: ({}) => ({
      eip: "myip",
      instance: "web-server-ec2-vpc",
    }),
  },
];
```

### Examples

- [simple ec2 example](https://github.com/grucloud/grucloud/blob/main/examples/aws/EC2/ec2)

### Depenencies

- [EC2 Instance](./Instance.md)
- [Elastic IP Address](./ElasticIpAddress.md)

## Listing

List only the elastic IP addresses associations with the _EC2::ElasticIpAddressAssociation_ filter:

```sh
gc l -t EC2::ElasticIpAddressAssociation
```

```txt
Listing resources on 1 provider: aws
✓ aws
  ✓ Initialising
  ✓ Listing 3/3
┌─────────────────────────────────────────────────────────────────────────┐
│ 1 EC2::ElasticIpAddressAssociation from aws                             │
├─────────────────────────────────────────────────────────────────────────┤
│ name: eip-attach::eip::web-server-ec2-example                           │
│ managedByUs: Yes                                                        │
│ live:                                                                   │
│   InstanceId: i-05270666d18a60c37                                       │
│   AllocationId: eipalloc-0084f3b737b18e237                              │
│   AssociationId: eipassoc-041bc14e6cefaadb6                             │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘


List Summary:
Provider: aws
┌────────────────────────────────────────────────────────────────────────┐
│ aws                                                                    │
├──────────────────────────────────┬─────────────────────────────────────┤
│ EC2::ElasticIpAddressAssociation │ eip-attach::eip::web-server-ec2-ex… │
└──────────────────────────────────┴─────────────────────────────────────┘
1 resource, 1 type, 1 provider
Command "gc l -t EC2::ElasticIpAddressAssociation" executed in 4s, 171 MB
```
