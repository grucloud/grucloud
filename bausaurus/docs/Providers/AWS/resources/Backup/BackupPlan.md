---
id: BackupPlan
title: BackupPlan
---

Manages a [Backup Plan](https://console.aws.amazon.com/backup/home).

## Sample code

```js
exports.createResources = () => [
  {
    type: "BackupPlan",
    group: "Backup",
    properties: ({}) => ({
      BackupPlanName: "my-backup-plan",
      Rules: [
        {
          CompletionWindowMinutes: 10080,
          Lifecycle: {
            DeleteAfterDays: 35,
          },
          RuleName: "DailyBackups",
          ScheduleExpression: "cron(0 5 ? * * *)",
          StartWindowMinutes: 480,
          TargetBackupVaultName: "Default",
        },
        {
          CompletionWindowMinutes: 10080,
          EnableContinuousBackup: false,
          RuleName: "rule-daily",
          ScheduleExpression: "cron(0 5 ? * * *)",
          StartWindowMinutes: 480,
          TargetBackupVaultName: "my-vault",
        },
      ],
      Tags: {
        mykey: "myvalue",
      },
    }),
    dependencies: ({}) => ({
      backupVaults: ["my-vault"],
    }),
  },
];
```

## Properties

- [CreateBackupPlanCommandInput](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-backup/interfaces/createbackupplancommandinput.html)

## Dependencies

- [Backup Vault](./BackupVault.md)

## Used By

- [Backup Selection](./BackupSelection.md)

## Full Examples

- [backup simple](https://github.com/grucloud/grucloud/tree/main/examples/aws/Backup/backup-simple)

## List

```sh
gc l -t Backup::BackupPlan
```

```txt
Listing resources on 1 provider: aws
✓ aws us-east-1
  ✓ Initialising
  ✓ Listing 1/1
┌──────────────────────────────────────────────────────────────────────┐
│ 1 Backup::BackupPlan from aws                                        │
├──────────────────────────────────────────────────────────────────────┤
│ name: my-backup-plan                                                 │
│ managedByUs: Yes                                                     │
│ live:                                                                │
│   BackupPlanName: my-backup-plan                                     │
│   Rules:                                                             │
│     - CompletionWindowMinutes: 10080                                 │
│       Lifecycle:                                                     │
│         DeleteAfterDays: 35                                          │
│       RuleId: 2bf1c6af-b6fe-408c-850e-89c7d5c128e9                   │
│       RuleName: DailyBackups                                         │
│       ScheduleExpression: cron(0 5 ? * * *)                          │
│       StartWindowMinutes: 480                                        │
│       TargetBackupVaultName: Default                                 │
│     - CompletionWindowMinutes: 10080                                 │
│       EnableContinuousBackup: false                                  │
│       RuleId: 7728bac1-6495-4a9e-902c-afae23d2a6e3                   │
│       RuleName: rule-daily                                           │
│       ScheduleExpression: cron(0 5 ? * * *)                          │
│       StartWindowMinutes: 480                                        │
│       TargetBackupVaultName: my-vault                                │
│   BackupPlanArn: arn:aws:backup:us-east-1:840541460064:backup-plan:… │
│   BackupPlanId: 72351b1b-e469-4c39-b0c5-b1a04e873371                 │
│   CreationDate: 2022-10-26T21:11:45.293Z                             │
│   VersionId: NTRiY2U1MTYtZDBiNS00ZDZiLTkyZWUtZTQ0Yjc5YmY4NTg0        │
│   Tags:                                                              │
│     Name: my-backup-plan                                             │
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
├────────────────────┬────────────────────────────────────────────────┤
│ Backup::BackupPlan │ my-backup-plan                                 │
└────────────────────┴────────────────────────────────────────────────┘
1 resource, 1 type, 1 provider
Command "gc l -t Backup::BackupPlan" executed in 4s, 103 MB
```
