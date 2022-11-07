---
id: BackupVault
title: BackupVault
---

Manages a [Backup Vault](https://console.aws.amazon.com/backup/home).

## Sample code

```js
exports.createResources = () => [];
```

## Properties

- [CreateBackupVaultCommandInput](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-backup/interfaces/createbackupvaultcommandinput.html)

## Dependencies

## Used By

- [Backup Vault Notification](./BackupVaultNotification.md)
- [Backup Vault Lock Configuration](./BackupVaultLockConfiguration.md)
- [Backup Vault Policy ](./BackupVaultPolicy.md)

## Full Examples

- [backup simple](https://github.com/grucloud/grucloud/tree/main/examples/aws/Backup/backup-simple)

## List

```sh
gc l -t Backup::BackupVault
```

```txt
Listing resources on 1 provider: aws
✓ aws us-east-1
  ✓ Initialising
  ✓ Listing 1/1
┌──────────────────────────────────────────────────────────────────────┐
│ 2 Backup::BackupVault from aws                                       │
├──────────────────────────────────────────────────────────────────────┤
│ name: Default                                                        │
│ managedByUs: NO                                                      │
│ live:                                                                │
│   BackupVaultArn: arn:aws:backup:us-east-1:840541460064:backup-vaul… │
│   BackupVaultName: Default                                           │
│   CreationDate: 2022-10-26T17:23:34.422Z                             │
│   CreatorRequestId: e522a998-5b78-4f0f-819d-84adac80a196             │
│   EncryptionKeyArn: arn:aws:kms:us-east-1:840541460064:key/484c689a… │
│   Locked: false                                                      │
│   NumberOfRecoveryPoints: 0                                          │
│   Tags:                                                              │
│                                                                      │
├──────────────────────────────────────────────────────────────────────┤
│ name: my-vault                                                       │
│ managedByUs: Yes                                                     │
│ live:                                                                │
│   BackupVaultArn: arn:aws:backup:us-east-1:840541460064:backup-vaul… │
│   BackupVaultName: my-vault                                          │
│   CreationDate: 2022-10-26T21:11:42.420Z                             │
│   EncryptionKeyArn: arn:aws:kms:us-east-1:840541460064:key/484c689a… │
│   Locked: true                                                       │
│   MaxRetentionDays: 2                                                │
│   MinRetentionDays: 1                                                │
│   NumberOfRecoveryPoints: 0                                          │
│   Tags:                                                              │
│     Name: my-vault                                                   │
│     gc-created-by-provider: aws                                      │
│     gc-managed-by: grucloud                                          │
│     gc-project-name: backup-simple                                   │
│     gc-stage: dev                                                    │
│     mykey: myvalue                                                   │
│                                                                      │
└──────────────────────────────────────────────────────────────────────┘


List Summary:
Provider: aws
┌─────────────────────────────────────────────────────────────────────┐
│ aws                                                                 │
├─────────────────────┬───────────────────────────────────────────────┤
│ Backup::BackupVault │ Default                                       │
│                     │ my-vault                                      │
└─────────────────────┴───────────────────────────────────────────────┘
2 resources, 1 type, 1 provider
Command "gc l -t Backup::BackupVault" executed in 5s, 105 MB
```
