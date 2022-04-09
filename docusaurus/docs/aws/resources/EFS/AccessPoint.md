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

- [FileSystem](./FileSystem.md)

## List

```sh
gc l -t AccessPoint
```

```txt

```
