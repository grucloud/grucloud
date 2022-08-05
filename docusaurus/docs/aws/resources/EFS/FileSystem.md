---
id: FileSystem
title: File System
---

Provides an [EFS File System](https://console.aws.amazon.com/efs/home).

## Examples

```js
exports.createResources = () => [
  {
    type: "FileSystem",
    group: "EFS",
    name: "fs-0aaaf7b0715648e5b",
    properties: ({}) => ({
      Encrypted: false,
      PerformanceMode: "generalPurpose",
      ThroughputMode: "bursting",
    }),
  },
];
```

## Source Code Examples

- [efs simple](https://github.com/grucloud/grucloud/tree/main/examples/aws/EFS/efs-simple)

## Properties

- [CreateFileSystemCommandInput](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-efs/interfaces/createfilesystemcommandinput.html)

## Used By

- [EFS AccessPoint](./AccessPoint.md)
- [EFS MountTarget](./MountTarget.md)

## List

```sh
gc l -t FileSystem
```

```txt
Listing resources on 1 provider: aws
✓ aws
  ✓ Initialising
  ✓ Listing 1/1
┌──────────────────────────────────────────────────────────────────────────────┐
│ 1 EFS::FileSystem from aws                                                   │
├──────────────────────────────────────────────────────────────────────────────┤
│ name: fs-0aaaf7b0715648e5b                                                   │
│ managedByUs: Yes                                                             │
│ live:                                                                        │
│   CreationTime: 2022-04-09T16:05:36.000Z                                     │
│   CreationToken: fc87728f-8134-4111-85b4-576bb062db24                        │
│   Encrypted: false                                                           │
│   FileSystemArn: arn:aws:elasticfilesystem:us-east-1:840541460064:file-syst… │
│   FileSystemId: fs-0437bd05497b7a628                                         │
│   LifeCycleState: available                                                  │
│   Name: fs-0aaaf7b0715648e5b                                                 │
│   NumberOfMountTargets: 2                                                    │
│   OwnerId: 840541460064                                                      │
│   PerformanceMode: generalPurpose                                            │
│   SizeInBytes:                                                               │
│     Value: 6144                                                              │
│     ValueInIA: 0                                                             │
│     ValueInStandard: 6144                                                    │
│   Tags:                                                                      │
│     - Key: gc-created-by-provider                                            │
│       Value: aws                                                             │
│     - Key: gc-managed-by                                                     │
│       Value: grucloud                                                        │
│     - Key: gc-project-name                                                   │
│       Value: efs-simple                                                      │
│     - Key: gc-stage                                                          │
│       Value: dev                                                             │
│     - Key: Name                                                              │
│       Value: fs-0aaaf7b0715648e5b                                            │
│   ThroughputMode: bursting                                                   │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘


List Summary:
Provider: aws
┌─────────────────────────────────────────────────────────────────────────────┐
│ aws                                                                         │
├─────────────────┬───────────────────────────────────────────────────────────┤
│ EFS::FileSystem │ fs-0aaaf7b0715648e5b                                      │
└─────────────────┴───────────────────────────────────────────────────────────┘
1 resource, 1 type, 1 provider
Command "gc l -t FileSystem" executed in 6s, 179 MB
```
