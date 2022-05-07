---
id: IpamPool
title: IPAM Pool
---

Provides a [VPC IP Address Manager Pool](https://console.aws.amazon.com/ipam/home?#Pools)

```js
exports.createResources = () => [
  {
    type: "IpamPool",
    group: "EC2",
    name: "my-pool",
    properties: ({ config }) => ({
      IpamScopeType: "private",
      IpamRegion: `${config.region}`,
      Description: "",
      AutoImport: false,
      AddressFamily: "ipv4",
      AllocationMinNetmaskLength: 0,
      AllocationMaxNetmaskLength: 32,
    }),
    dependencies: ({}) => ({
      ipamScope: "my-ipam-scope",
    }),
  },
];
```

### Examples

- [ipam](https://github.com/grucloud/grucloud/blob/main/examples/aws/EC2/ipam)

### Properties

- [CreateIpamPoolCommandInput](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-ec2/interfaces/createipampoolcommandinput.html)

### Dependencies

- [IpamScope](./IpamScope.md)

### Used By

- [IpamPoolCidr](./IpamPoolCidr.md)

### Listing

List the ipam pools with the _IpamPool_ filter:

```sh
gc l -t IpamPool
```

```txt
Listing resources on 1 provider: aws
✓ aws
  ✓ Initialising
  ✓ Listing 1/1
┌───────────────────────────────────────────────────────────────────────────┐
│ 1 EC2::IpamPool from aws                                                  │
├───────────────────────────────────────────────────────────────────────────┤
│ name: my-pool                                                             │
│ managedByUs: Yes                                                          │
│ live:                                                                     │
│   OwnerId: 548529576214                                                   │
│   IpamPoolId: ipam-pool-0126924e76591525f                                 │
│   IpamPoolArn: arn:aws:ec2::548529576214:ipam-pool/ipam-pool-0126924e765… │
│   IpamScopeArn: arn:aws:ec2::548529576214:ipam-scope/ipam-scope-008b2e37… │
│   IpamScopeType: private                                                  │
│   IpamArn: arn:aws:ec2::548529576214:ipam/ipam-02835b52166df82d6          │
│   IpamRegion: us-east-1                                                   │
│   Locale: None                                                            │
│   PoolDepth: 1                                                            │
│   State: create-complete                                                  │
│   Description:                                                            │
│   AutoImport: false                                                       │
│   AddressFamily: ipv4                                                     │
│   AllocationMinNetmaskLength: 0                                           │
│   AllocationMaxNetmaskLength: 32                                          │
│   Tags:                                                                   │
│     - Key: gc-created-by-provider                                         │
│       Value: aws                                                          │
│     - Key: gc-managed-by                                                  │
│       Value: grucloud                                                     │
│     - Key: gc-project-name                                                │
│       Value: ipam                                                         │
│     - Key: gc-stage                                                       │
│       Value: dev                                                          │
│     - Key: Name                                                           │
│       Value: my-pool                                                      │
│                                                                           │
└───────────────────────────────────────────────────────────────────────────┘


List Summary:
Provider: aws
┌──────────────────────────────────────────────────────────────────────────┐
│ aws                                                                      │
├───────────────┬──────────────────────────────────────────────────────────┤
│ EC2::IpamPool │ my-pool                                                  │
└───────────────┴──────────────────────────────────────────────────────────┘
1 resource, 1 type, 1 provider
Command "gc l -t EC2::IpamPool" executed in 5s, 174 MB
```
