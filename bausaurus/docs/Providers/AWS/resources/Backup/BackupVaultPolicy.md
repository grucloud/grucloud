---
id: BackupVaultPolicy
title: Backup Vault Policy
---

Manages a [Backup Vault Policy](https://console.aws.amazon.com/backup/home).

## Sample code

```js
exports.createResources = () => [
  {
    type: "BackupVaultPolicy",
    group: "Backup",
    properties: ({ config }) => ({
      Policy: {
        Version: "2012-10-17",
        Statement: [
          {
            Effect: "Allow",
            Principal: {
              AWS: `arn:aws:iam::${config.accountId()}:root`,
            },
            Action: "backup:CopyIntoBackupVault",
            Resource: "*",
          },
        ],
      },
    }),
    dependencies: ({}) => ({
      backupVault: "my-vault",
    }),
  },
];
```

## Properties

- [PutBackupVaultPolicysCommandInput](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-backup/interfaces/putbackupvaultnotificationscommandinput.html)

## Dependencies

- [Backup Vault](./BackupVault.md)

## Used By

## Full Examples

- [backup simple](https://github.com/grucloud/grucloud/tree/main/examples/aws/Backup/backup-simple)

## List

```sh
gc l -t Backup::BackupVaultPolicy
```

```txt
Listing resources on 1 provider: aws
✓ aws us-east-1
  ✓ Initialising
  ✓ Listing 2/2
┌──────────────────────────────────────────────────────────────────────┐
│ 1 Backup::BackupVaultPolicy from aws                                 │
├──────────────────────────────────────────────────────────────────────┤
│ name: my-vault                                                       │
│ managedByUs: Yes                                                     │
│ live:                                                                │
│   BackupVaultArn: arn:aws:backup:us-east-1:840541460064:backup-vaul… │
│   BackupVaultName: my-vault                                          │
│   Policy:                                                            │
│     Version: 2012-10-17                                              │
│     Statement:                                                       │
│       - Effect: Allow                                                │
│         Principal:                                                   │
│           AWS: arn:aws:iam::840541460064:root                        │
│         Action: backup:CopyIntoBackupVault                           │
│         Resource: *                                                  │
│                                                                      │
└──────────────────────────────────────────────────────────────────────┘


List Summary:
Provider: aws
┌─────────────────────────────────────────────────────────────────────┐
│ aws                                                                 │
├───────────────────────────┬─────────────────────────────────────────┤
│ Backup::BackupVaultPolicy │ my-vault                                │
└───────────────────────────┴─────────────────────────────────────────┘
1 resource, 1 type, 1 provider
Command "gc l -t Backup::BackupVaultPolicy" executed in 4s, 96 MB
```
