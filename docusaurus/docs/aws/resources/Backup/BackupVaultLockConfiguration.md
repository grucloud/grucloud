---
id: BackupVaultLockConfiguration
title: Backup Vault Lock Configuration
---

Manages a [Backup Vault Lock Configuration](https://console.aws.amazon.com/backup/home).

## Sample code

```js
exports.createResources = () => [
  {
    type: "BackupVaultLockConfiguration",
    Client: BackupBackupVaultLockConfiguration,
    propertiesDefault: {},
    omitProperties: ["BackupVaultName"],
    inferName: get("dependenciesSpec.backupVault"),
    dependencies: {
      backupVault: {
        type: "BackupVault",
        group: GROUP,
        parent: true,
        dependencyId: ({ lives, config }) => pipe([get("BackupVaultName")]),
      },
    },
  },
];
```

## Properties

- [PutBackupVaultLockConfigurationCommandInput](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-backup/interfaces/putbackupvaultlockconfigurationcommandinput.html)

## Dependencies

- [Backup Vault](./BackupVault.md)

## Full Examples

- [backup simple](https://github.com/grucloud/grucloud/tree/main/examples/aws/Backup/backup-simple)

## List

```sh
gc l -t Backup::BackupVaultLockConfiguration
```

```txt
Listing resources on 1 provider: aws
✓ aws us-east-1
  ✓ Initialising
  ✓ Listing 2/2
┌──────────────────────────────────────────────────────────────────────┐
│ 1 Backup::BackupVaultLockConfiguration from aws                      │
├──────────────────────────────────────────────────────────────────────┤
│ name: my-vault                                                       │
│ managedByUs: Yes                                                     │
│ live:                                                                │
│   BackupVaultName: my-vault                                          │
│   MinRetentionDays: 1                                                │
│   MaxRetentionDays: 2                                                │
│                                                                      │
└──────────────────────────────────────────────────────────────────────┘


List Summary:
Provider: aws
┌─────────────────────────────────────────────────────────────────────┐
│ aws                                                                 │
├──────────────────────────────────────┬──────────────────────────────┤
│ Backup::BackupVaultLockConfiguration │ my-vault                     │
└──────────────────────────────────────┴──────────────────────────────┘
1 resource, 1 type, 1 provider
Command "gc l -t Backup::BackupVaultLockConfiguration" executed in 4s, 94 MB

```
