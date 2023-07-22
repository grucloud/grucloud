---
id: IpamScope
title: IPAM Scope
---

Provides a [VPC IP Address Manager Scope](https://console.aws.amazon.com/ipam/home?#Scopes)

```js
exports.createResources = () => [
  {
    type: "IpamScope",
    group: "EC2",
    name: "my-ipam-scope",
    properties: ({ config }) => ({
      IpamRegion: `${config.region}`,
      IpamScopeType: "private",
      IsDefault: false,
      Description: "",
    }),
    dependencies: ({}) => ({
      ipam: "ipam",
    }),
  },
];
```

### Examples

- [ipam](https://github.com/grucloud/grucloud/blob/main/examples/aws/EC2/ipam)

### Properties

- [CreateIpamScopeCommandInput](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-ec2/interfaces/createipamscopecommandinput.html)

### Dependencies

- [Ipam](./Ipam.md)

### Used By

- [Ipam Pool](./IpamPool.md)

## Listing

List the ipam scopes with the _IpamScope_ filter:

```sh
gc l -t IpamScope
```

```txt
Listing resources on 1 provider: aws
✓ aws
  ✓ Initialising
  ✓ Listing 1/1
┌──────────────────────────────────────────────────────────────────────────────┐
│ 3 EC2::IpamScope from aws                                                    │
├──────────────────────────────────────────────────────────────────────────────┤
│ name: ipam-scope-04dd070caa9d40f75                                           │
│ managedByUs: NO                                                              │
│ live:                                                                        │
│   OwnerId: 548529576214                                                      │
│   IpamScopeId: ipam-scope-04dd070caa9d40f75                                  │
│   IpamScopeArn: arn:aws:ec2::548529576214:ipam-scope/ipam-scope-04dd070caa9… │
│   IpamArn: arn:aws:ec2::548529576214:ipam/ipam-05e91ed4dde7d50c5             │
│   IpamRegion: us-east-1                                                      │
│   IpamScopeType: private                                                     │
│   IsDefault: true                                                            │
│   PoolCount: 0                                                               │
│   State: create-complete                                                     │
│   Tags: []                                                                   │
│                                                                              │
├──────────────────────────────────────────────────────────────────────────────┤
│ name: ipam-scope-06d9e85d28b710534                                           │
│ managedByUs: NO                                                              │
│ live:                                                                        │
│   OwnerId: 548529576214                                                      │
│   IpamScopeId: ipam-scope-06d9e85d28b710534                                  │
│   IpamScopeArn: arn:aws:ec2::548529576214:ipam-scope/ipam-scope-06d9e85d28b… │
│   IpamArn: arn:aws:ec2::548529576214:ipam/ipam-05e91ed4dde7d50c5             │
│   IpamRegion: us-east-1                                                      │
│   IpamScopeType: public                                                      │
│   IsDefault: true                                                            │
│   PoolCount: 0                                                               │
│   State: create-complete                                                     │
│   Tags: []                                                                   │
│                                                                              │
├──────────────────────────────────────────────────────────────────────────────┤
│ name: my-ipam-scope                                                          │
│ managedByUs: Yes                                                             │
│ live:                                                                        │
│   OwnerId: 548529576214                                                      │
│   IpamScopeId: ipam-scope-0cda16456545069f5                                  │
│   IpamScopeArn: arn:aws:ec2::548529576214:ipam-scope/ipam-scope-0cda1645654… │
│   IpamArn: arn:aws:ec2::548529576214:ipam/ipam-05e91ed4dde7d50c5             │
│   IpamRegion: us-east-1                                                      │
│   IpamScopeType: private                                                     │
│   IsDefault: false                                                           │
│   Description:                                                               │
│   PoolCount: 0                                                               │
│   State: create-complete                                                     │
│   Tags:                                                                      │
│     - Key: gc-created-by-provider                                            │
│       Value: aws                                                             │
│     - Key: gc-managed-by                                                     │
│       Value: grucloud                                                        │
│     - Key: gc-project-name                                                   │
│       Value: ipam                                                            │
│     - Key: gc-stage                                                          │
│       Value: dev                                                             │
│     - Key: Name                                                              │
│       Value: my-ipam-scope                                                   │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘


List Summary:
Provider: aws
┌─────────────────────────────────────────────────────────────────────────────┐
│ aws                                                                         │
├────────────────┬────────────────────────────────────────────────────────────┤
│ EC2::IpamScope │ ipam-scope-04dd070caa9d40f75                               │
│                │ ipam-scope-06d9e85d28b710534                               │
│                │ my-ipam-scope                                              │
└────────────────┴────────────────────────────────────────────────────────────┘
3 resources, 1 type, 1 provider
Command "gc l -t IpamScope" executed in 4s, 163 MB
```
