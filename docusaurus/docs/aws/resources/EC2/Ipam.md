---
id: Ipam
title: IPAM
---

Provides a [VPC IP Address Manager](https://console.aws.amazon.com/ipam/home#:)

```js
exports.createResources = () => [
  {
    type: "Ipam",
    group: "EC2",
    name: "ipam",
    properties: ({ config }) => ({
      IpamRegion: `${config.region}`,
      Description: "",
      OperatingRegions: [
        {
          RegionName: "us-east-1",
        },
      ],
    }),
  },
];
```

### Examples

- [ipam](https://github.com/grucloud/grucloud/blob/main/examples/aws/EC2/ipam)

### Properties

- [CreateIpamCommandInput](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-ec2/interfaces/createipamcommandinput.html)

### Used By

- [Vpc](./Vpc.md)

## Listing

List the ipams with the _Ipam_ filter:

```sh
gc l -t Ipam
```

```txt
Listing resources on 1 provider: aws
✓ aws
  ✓ Initialising
  ✓ Listing 1/1
┌───────────────────────────────────────────────────────────────────────┐
│ 1 EC2::Ipam from aws                                                  │
├───────────────────────────────────────────────────────────────────────┤
│ name: ipam                                                            │
│ managedByUs: Yes                                                      │
│ live:                                                                 │
│   OwnerId: 548529576214                                               │
│   IpamId: ipam-0410696e1d9d50050                                      │
│   IpamArn: arn:aws:ec2::548529576214:ipam/ipam-0410696e1d9d50050      │
│   IpamRegion: us-east-1                                               │
│   PublicDefaultScopeId: ipam-scope-05ae5da3c6b99b0bd                  │
│   PrivateDefaultScopeId: ipam-scope-0e06a9c81ecdc617a                 │
│   ScopeCount: 2                                                       │
│   Description:                                                        │
│   OperatingRegions:                                                   │
│     - RegionName: us-east-1                                           │
│   State: create-complete                                              │
│   Tags:                                                               │
│     - Key: gc-created-by-provider                                     │
│       Value: aws                                                      │
│     - Key: gc-managed-by                                              │
│       Value: grucloud                                                 │
│     - Key: gc-project-name                                            │
│       Value: ipam                                                     │
│     - Key: gc-stage                                                   │
│       Value: dev                                                      │
│     - Key: Name                                                       │
│       Value: ipam                                                     │
│                                                                       │
└───────────────────────────────────────────────────────────────────────┘


List Summary:
Provider: aws
┌──────────────────────────────────────────────────────────────────────┐
│ aws                                                                  │
├───────────┬──────────────────────────────────────────────────────────┤
│ EC2::Ipam │ ipam                                                     │
└───────────┴──────────────────────────────────────────────────────────┘
1 resource, 1 type, 1 provider
Command "gc list -t Ipam" executed in 3s, 155 MB
```
