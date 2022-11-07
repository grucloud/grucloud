---
id: GlobalSettings
title: GlobalSettings
---

Manages a [Backup Global Settings](https://console.aws.amazon.com/backup/home).

## Sample code

```js
exports.createResources = () => [
  {
    type: "GlobalSettings",
    group: "Backup",
    properties: ({}) => ({
      isCrossAccountBackupEnabled: "true",
    }),
  },
];
```

## Properties

- [UpdateGlobalSettingsCommandInput](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-backup/interfaces/updateglobalsettingscommandinput.html)

## Full Examples

- [backup simple](https://github.com/grucloud/grucloud/tree/main/examples/aws/Backup/backup-simple)

## List

```sh
gc l -t Backup::GlobalSettings
```

```txt
Listing resources on 1 provider: aws
✓ aws us-east-1
  ✓ Initialising
  ✓ Listing 1/1
┌──────────────────────────────────────────────────────────────────────────┐
│ 1 Backup::GlobalSettings from aws                                        │
├──────────────────────────────────────────────────────────────────────────┤
│ name: global                                                             │
│ managedByUs: Yes                                                         │
│ live:                                                                    │
│   isCrossAccountBackupEnabled: false                                     │
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘


List Summary:
Provider: aws
┌─────────────────────────────────────────────────────────────────────────┐
│ aws                                                                     │
├────────────────────────┬────────────────────────────────────────────────┤
│ Backup::GlobalSettings │ global                                         │
└────────────────────────┴────────────────────────────────────────────────┘
1 resource, 1 type, 1 provider
Command "gc l -t Backup::GlobalSettings" executed in 3s, 103 MB
```
