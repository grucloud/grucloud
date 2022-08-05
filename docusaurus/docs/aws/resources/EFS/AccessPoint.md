---
id: AccessPoint
title: Access Point
---

Provides an [EFS Access Point](https://console.aws.amazon.com/efs/home).

## Examples

```js
exports.createResources = () => [
  {
    type: "AccessPoint",
    group: "EFS",
    name: "fsap-0b3ae155f60ccbb8c",
    properties: ({}) => ({
      PosixUser: {
        Gid: 1000,
        SecondaryGids: [],
        Uid: 1000,
      },
      RootDirectory: {
        CreationInfo: {
          OwnerGid: 1000,
          OwnerUid: 1000,
          Permissions: "755",
        },
        Path: "/lambda",
      },
    }),
    dependencies: () => ({
      fileSystem: "fs-0aaaf7b0715648e5b",
    }),
  },
];
```

## Source Code Examples

- [efs simple](https://github.com/grucloud/grucloud/tree/main/examples/aws/EFS/efs-simple)

## Properties

- [CreateAccessPointCommandInput](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-efs/interfaces/createaccesspointcommandinput.html)

## Dependencies

- [EFS FileSystem](./FileSystem.md)

## List

```sh
gc l -t EFS::AccessPoint
```

```txt
Listing resources on 1 provider: aws
✓ aws us-east-1
  ✓ Initialising
  ✓ Listing 1/1
┌───────────────────────────────────────────────────────────────────────────┐
│ 1 EFS::AccessPoint from aws                                               │
├───────────────────────────────────────────────────────────────────────────┤
│ name: fsap-0ef29121aa02af8f7                                              │
│ managedByUs: Yes                                                          │
│ live:                                                                     │
│   AccessPointArn: arn:aws:elasticfilesystem:us-east-1:840541460064:acces… │
│   AccessPointId: fsap-0d23a703748154860                                   │
│   ClientToken: 6a822b54-0d29-4d1f-95a4-a33a3f5ef623                       │
│   FileSystemId: fs-0045b8249835e7dd5                                      │
│   LifeCycleState: available                                               │
│   Name: fsap-0ef29121aa02af8f7                                            │
│   OwnerId: 840541460064                                                   │
│   PosixUser:                                                              │
│     Gid: 1000                                                             │
│     SecondaryGids: []                                                     │
│     Uid: 1000                                                             │
│   RootDirectory:                                                          │
│     CreationInfo:                                                         │
│       OwnerGid: 1000                                                      │
│       OwnerUid: 1000                                                      │
│       Permissions: 755                                                    │
│     Path: /lambda                                                         │
│   Tags:                                                                   │
│     - Key: gc-created-by-provider                                         │
│       Value: aws                                                          │
│     - Key: gc-managed-by                                                  │
│       Value: grucloud                                                     │
│     - Key: gc-project-name                                                │
│       Value: efs-simple                                                   │
│     - Key: gc-stage                                                       │
│       Value: dev                                                          │
│     - Key: Name                                                           │
│       Value: fsap-0ef29121aa02af8f7                                       │
│                                                                           │
└───────────────────────────────────────────────────────────────────────────┘


List Summary:
Provider: aws
┌──────────────────────────────────────────────────────────────────────────┐
│ aws                                                                      │
├──────────────────┬───────────────────────────────────────────────────────┤
│ EFS::AccessPoint │ fsap-0ef29121aa02af8f7                                │
└──────────────────┴───────────────────────────────────────────────────────┘
1 resource, 1 type, 1 provider
Command "gc l -t EFS::AccessPoint" executed in 6s, 104 MB

```
