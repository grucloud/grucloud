---
id: MountTarget
title: Mount Target
---

Provides an [EFS Mount Target](https://console.aws.amazon.com/efs/home).

## Examples

```js
exports.createResources = () => [
  {
    type: "MountTarget",
    group: "EFS",
    properties: ({ config }) => ({
      AvailabilityZoneName: `${config.region}a`,
    }),
    dependencies: () => ({
      fileSystem: "fs-0aaaf7b0715648e5b",
      subnet: "EfsLambdaSubnetA",
      securityGroups: ["sam-app-EfsLambdaSecurityGroup-JLAY31AJ7BL9"],
    }),
  },
];
```

## Source Code Examples

- [efs simple](https://github.com/grucloud/grucloud/tree/main/examples/aws/EFS/efs-simple)

## Properties

- [CreateMountTargetCommandInput](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-efs/interfaces/createmounttargetcommandinput.html)

## Dependencies

- [FileSystem](./FileSystem.md)
- [Subnet](../EC2/Subnet.md)
- [SecurityGroup](../EC2/SecurityGroup.md)

## List

```sh
gc l -t MountTarget
```

```txt
Listing resources on 1 provider: aws
✓ aws
  ✓ Initialising
  ✓ Listing 2/2
┌───────────────────────────────────────────────────────────────────────────────┐
│ 2 EFS::MountTarget from aws                                                   │
├───────────────────────────────────────────────────────────────────────────────┤
│ name: mount-target::fs-0aaaf7b0715648e5b::a                                   │
│ managedByUs: NO                                                               │
│ live:                                                                         │
│   AvailabilityZoneId: use1-az4                                                │
│   AvailabilityZoneName: us-east-1a                                            │
│   FileSystemId: fs-0437bd05497b7a628                                          │
│   IpAddress: 10.0.0.151                                                       │
│   LifeCycleState: available                                                   │
│   MountTargetId: fsmt-04ea2793ee9299d99                                       │
│   NetworkInterfaceId: eni-02fd4f9d6a6671b78                                   │
│   OwnerId: 840541460064                                                       │
│   SubnetId: subnet-03fe2af1b1fe74c32                                          │
│   VpcId: vpc-04fa3a03347599fa6                                                │
│   SecurityGroups:                                                             │
│     - "sg-002bc3887be24b4be"                                                  │
│                                                                               │
├───────────────────────────────────────────────────────────────────────────────┤
│ name: mount-target::fs-0aaaf7b0715648e5b::b                                   │
│ managedByUs: NO                                                               │
│ live:                                                                         │
│   AvailabilityZoneId: use1-az6                                                │
│   AvailabilityZoneName: us-east-1b                                            │
│   FileSystemId: fs-0437bd05497b7a628                                          │
│   IpAddress: 10.0.1.22                                                        │
│   LifeCycleState: available                                                   │
│   MountTargetId: fsmt-0070c60e1c1fb4929                                       │
│   NetworkInterfaceId: eni-05068070c6b6a0b07                                   │
│   OwnerId: 840541460064                                                       │
│   SubnetId: subnet-02da456afc1513848                                          │
│   VpcId: vpc-04fa3a03347599fa6                                                │
│   SecurityGroups:                                                             │
│     - "sg-002bc3887be24b4be"                                                  │
│                                                                               │
└───────────────────────────────────────────────────────────────────────────────┘


List Summary:
Provider: aws
┌──────────────────────────────────────────────────────────────────────────────┐
│ aws                                                                          │
├──────────────────┬───────────────────────────────────────────────────────────┤
│ EFS::MountTarget │ mount-target::fs-0aaaf7b0715648e5b::a                     │
│                  │ mount-target::fs-0aaaf7b0715648e5b::b                     │
└──────────────────┴───────────────────────────────────────────────────────────┘
2 resources, 1 type, 1 provider
Command "gc l -t EFS::MountTarget" executed in 5s, 176 MB
```
