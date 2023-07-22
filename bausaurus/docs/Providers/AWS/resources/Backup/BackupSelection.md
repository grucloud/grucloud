---
id: BackupSelection
title: Backup Selection
---

Manages a [Backup Selection](https://console.aws.amazon.com/backup/home).

## Sample code

```js
exports.createResources = () => [
  {
    type: "BackupSelection",
    group: "Backup",
    properties: ({}) => ({
      Resources: ["arn:aws:ec2:*:*:instance/*"],
      SelectionName: "ec2",
    }),
    dependencies: ({}) => ({
      backupPlan: "my-backup-plan",
      iamRole: "AWSBackupDefaultServiceRole",
    }),
  },
];
```

## Properties

- [CreateBackupSelectionCommandInput](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-backup/interfaces/createbackupselectioncommandinput.html)

## Dependencies

- [Backup Plan](./BackupPlan.md)

## Used By

## Full Examples

- [backup simple](https://github.com/grucloud/grucloud/tree/main/examples/aws/Backup/backup-simple)

## List

```sh
gc l -t Backup::BackupSelection
```

```txt
Listing resources on 1 provider: aws
✓ aws us-east-1
  ✓ Initialising
  ✓ Listing 7/7
┌──────────────────────────────────────────────────────────────────────┐
│ 1 Backup::BackupSelection from aws                                   │
├──────────────────────────────────────────────────────────────────────┤
│ name: ec2                                                            │
│ managedByUs: Yes                                                     │
│ live:                                                                │
│   IamRoleArn: arn:aws:iam::840541460064:role/service-role/AWSBackup… │
│   Resources:                                                         │
│     - "arn:aws:ec2:*:*:instance/*"                                   │
│   SelectionName: ec2                                                 │
│   BackupPlanId: 72351b1b-e469-4c39-b0c5-b1a04e873371                 │
│   CreationDate: 2022-10-26T21:11:48.063Z                             │
│   SelectionId: 3d187c13-5d7c-4c63-890d-a45b7cca9410                  │
│                                                                      │
└──────────────────────────────────────────────────────────────────────┘


List Summary:
Provider: aws
┌─────────────────────────────────────────────────────────────────────┐
│ aws                                                                 │
├─────────────────────────┬───────────────────────────────────────────┤
│ Backup::BackupSelection │ ec2                                       │
└─────────────────────────┴───────────────────────────────────────────┘
1 resource, 1 type, 1 provider
Command "gc l -t Backup::BackupSelection" executed in 6s, 99 MB
```
