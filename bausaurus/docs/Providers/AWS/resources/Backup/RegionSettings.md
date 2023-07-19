---
id: RegionSettings
title: RegionSettings
---

Manages a [Backup Region Settings](https://console.aws.amazon.com/backup/home).

## Sample code

```js
exports.createResources = () => [
  {
    type: "RegionSettings",
    group: "Backup",
    properties: ({}) => ({
      ResourceTypeManagementPreference: {
        DynamoDB: true,
        EFS: true,
      },
      ResourceTypeOptInPreference: {
        Aurora: true,
        DocumentDB: true,
        DynamoDB: true,
        EBS: true,
        EC2: true,
        EFS: true,
        FSx: true,
        Neptune: true,
        RDS: true,
        S3: true,
        "Storage Gateway": true,
        VirtualMachine: true,
      },
    }),
  },
];
```

## Properties

- [UpdateRegionSettingsCommandInput](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-backup/interfaces/updateregionsettingscommandinput.html)

## Full Examples

- [backup simple](https://github.com/grucloud/grucloud/tree/main/examples/aws/Backup/backup-simple)

## List

```sh
gc l -t Backup::RegionSettings
```

```txt
Listing resources on 1 provider: aws
✓ aws us-east-1
  ✓ Initialising
  ✓ Listing 1/1
┌───────────────────────────────────────────────────────────────────────────────────┐
│ 1 Backup::RegionSettings from aws                                                 │
├───────────────────────────────────────────────────────────────────────────────────┤
│ name: region                                                                      │
│ managedByUs: Yes                                                                  │
│ live:                                                                             │
│   ResourceTypeManagementPreference:                                               │
│     DynamoDB: true                                                                │
│     EFS: true                                                                     │
│   ResourceTypeOptInPreference:                                                    │
│     Aurora: true                                                                  │
│     DocumentDB: true                                                              │
│     DynamoDB: true                                                                │
│     EBS: true                                                                     │
│     EC2: true                                                                     │
│     EFS: true                                                                     │
│     FSx: true                                                                     │
│     Neptune: true                                                                 │
│     RDS: true                                                                     │
│     S3: true                                                                      │
│     Storage Gateway: true                                                         │
│     VirtualMachine: true                                                          │
│                                                                                   │
└───────────────────────────────────────────────────────────────────────────────────┘


List Summary:
Provider: aws
┌──────────────────────────────────────────────────────────────────────────────────┐
│ aws                                                                              │
├────────────────────────┬─────────────────────────────────────────────────────────┤
│ Backup::RegionSettings │ region                                                  │
└────────────────────────┴─────────────────────────────────────────────────────────┘
1 resource, 1 type, 1 provider
Command "gc l -t Backup::RegionSettings" executed in 3s, 103 MB
```
