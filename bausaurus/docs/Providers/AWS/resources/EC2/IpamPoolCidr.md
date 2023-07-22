---
id: IpamPoolCird
title: IPAM Pool CIDR
---

Provides a [VPC IP Address Manager Pool CIDR](https://console.aws.amazon.com/ipam/home?#Pools)

```js
exports.createResources = () => [
  {
    type: "IpamPoolCidr",
    group: "EC2",
    properties: ({}) => ({
      Cidr: "10.0.0.0/28",
    }),
    dependencies: ({}) => ({
      ipamPool: "my-pool",
    }),
  },
];
```

### Examples

- [ipam](https://github.com/grucloud/grucloud/blob/main/examples/aws/EC2/ipam)

### Properties

- [AllocateIpamPoolCidrRequest](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-ec2/modules/allocateipampoolcidrrequest.html)

### Dependencies

- [IpamPool](./IpamPool.md)

## Listing

List the ipam pools CIDR with the _IpamPoolCidr_ filter:

```sh
gc l -t IpamPoolCidr
```

```txt
Listing resources on 1 provider: aws
✓ aws
  ✓ Initialising
  ✓ Listing 2/2
┌───────────────────────────────────────────────────────────────────────────┐
│ 1 EC2::IpamPoolCidr from aws                                              │
├───────────────────────────────────────────────────────────────────────────┤
│ name: 10.0.0.0/28                                                         │
│ managedByUs: Yes                                                          │
│ live:                                                                     │
│   Cidr: 10.0.0.0/28                                                       │
│   State: provisioned                                                      │
│   IpamPoolId: ipam-pool-0126924e76591525f                                 │
│                                                                           │
└───────────────────────────────────────────────────────────────────────────┘


List Summary:
Provider: aws
┌──────────────────────────────────────────────────────────────────────────┐
│ aws                                                                      │
├───────────────────┬──────────────────────────────────────────────────────┤
│ EC2::IpamPoolCidr │ 10.0.0.0/28                                          │
└───────────────────┴──────────────────────────────────────────────────────┘
1 resource, 1 type, 1 provider
Command "gc l -t EC2::IpamPoolCidr" executed in 5s, 172 MB
```
