---
id: Framework
title: Framework
---

Manages a [Backup Framework](https://console.aws.amazon.com/backup/home).

## Sample code

```js
exports.createResources = () => [
  {
    type: "Framework",
    group: "Backup",
    properties: ({}) => ({
      FrameworkControls: [
        {
          ControlInputParameters: [
            {
              ParameterName: "requiredRetentionDays",
              ParameterValue: "35",
            },
          ],
          ControlName: "BACKUP_RECOVERY_POINT_MINIMUM_RETENTION_CHECK",
          ControlScope: {},
        },
        {
          ControlInputParameters: [
            {
              ParameterName: "recoveryPointAgeValue",
              ParameterValue: "1",
            },
            {
              ParameterName: "recoveryPointAgeUnit",
              ParameterValue: "days",
            },
          ],
          ControlName: "BACKUP_LAST_RECOVERY_POINT_CREATED",
          ControlScope: {
            ComplianceResourceTypes: [
              "RDS",
              "S3",
              "Aurora",
              "EFS",
              "EC2",
              "Storage Gateway",
              "EBS",
              "DynamoDB",
              "FSx",
              "VirtualMachine",
            ],
          },
        },
        {
          ControlInputParameters: [
            {
              ParameterName: "maxRetentionDays",
              ParameterValue: "36500",
            },
            {
              ParameterName: "minRetentionDays",
              ParameterValue: "1",
            },
          ],
          ControlName: "BACKUP_RESOURCES_PROTECTED_BY_BACKUP_VAULT_LOCK",
          ControlScope: {
            ComplianceResourceTypes: [
              "RDS",
              "S3",
              "Aurora",
              "EFS",
              "EC2",
              "Storage Gateway",
              "EBS",
              "DynamoDB",
              "FSx",
              "VirtualMachine",
            ],
          },
        },
        {
          ControlInputParameters: [],
          ControlName: "BACKUP_RECOVERY_POINT_ENCRYPTED",
          ControlScope: {},
        },
        {
          ControlInputParameters: [],
          ControlName: "BACKUP_RESOURCES_PROTECTED_BY_BACKUP_PLAN",
          ControlScope: {
            ComplianceResourceTypes: [
              "RDS",
              "S3",
              "Aurora",
              "EFS",
              "EC2",
              "Storage Gateway",
              "EBS",
              "DynamoDB",
              "FSx",
              "VirtualMachine",
            ],
          },
        },
        {
          ControlInputParameters: [],
          ControlName: "BACKUP_RESOURCES_PROTECTED_BY_CROSS_ACCOUNT",
          ControlScope: {
            ComplianceResourceTypes: [
              "RDS",
              "S3",
              "Aurora",
              "EFS",
              "EC2",
              "Storage Gateway",
              "EBS",
              "DynamoDB",
              "FSx",
              "VirtualMachine",
            ],
          },
        },
        {
          ControlInputParameters: [],
          ControlName: "BACKUP_RECOVERY_POINT_MANUAL_DELETION_DISABLED",
          ControlScope: {},
        },
        {
          ControlInputParameters: [
            {
              ParameterName: "requiredFrequencyUnit",
              ParameterValue: "days",
            },
            {
              ParameterName: "requiredRetentionDays",
              ParameterValue: "35",
            },
            {
              ParameterName: "requiredFrequencyValue",
              ParameterValue: "1",
            },
          ],
          ControlName: "BACKUP_PLAN_MIN_FREQUENCY_AND_MIN_RETENTION_CHECK",
          ControlScope: {},
        },
        {
          ControlInputParameters: [],
          ControlName: "BACKUP_RESOURCES_PROTECTED_BY_CROSS_REGION",
          ControlScope: {
            ComplianceResourceTypes: [
              "RDS",
              "S3",
              "Aurora",
              "EFS",
              "EC2",
              "Storage Gateway",
              "EBS",
              "DynamoDB",
              "FSx",
              "VirtualMachine",
            ],
          },
        },
      ],
      FrameworkDescription: "",
      FrameworkName: "myframework",
    }),
  },
];
```

## Properties

- [CreateFrameworkCommandInput](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-backup/interfaces/createframeworkcommandinput.html)

## Dependencies

## Used By

- [Backup Selection](./Selection.md)

## Full Examples

- [backup simple](https://github.com/grucloud/grucloud/tree/main/examples/aws/Backup/backup-simple)

## List

```sh
gc l -t Backup::Framework
```

```txt
Listing resources on 1 provider: aws
✓ aws us-east-1
  ✓ Initialising
  ✓ Listing 1/1
┌──────────────────────────────────────────────────────────────────────┐
│ 1 Backup::Framework from aws                                         │
├──────────────────────────────────────────────────────────────────────┤
│ name: myframework                                                    │
│ managedByUs: Yes                                                     │
│ live:                                                                │
│   CreationTime: 2022-10-26T21:41:07.454Z                             │
│   DeploymentStatus: FAILED                                           │
│   FrameworkArn: arn:aws:backup:us-east-1:840541460064:framework:myf… │
│   FrameworkControls:                                                 │
│     - ControlInputParameters:                                        │
│         - ParameterName: requiredRetentionDays                       │
│           ParameterValue: 35                                         │
│       ControlName: BACKUP_RECOVERY_POINT_MINIMUM_RETENTION_CHECK     │
│       ControlScope:                                                  │
│     - ControlInputParameters:                                        │
│         - ParameterName: recoveryPointAgeValue                       │
│           ParameterValue: 1                                          │
│         - ParameterName: recoveryPointAgeUnit                        │
│           ParameterValue: days                                       │
│       ControlName: BACKUP_LAST_RECOVERY_POINT_CREATED                │
│       ControlScope:                                                  │
│         ComplianceResourceTypes:                                     │
│           - "RDS"                                                    │
│           - "S3"                                                     │
│           - "Aurora"                                                 │
│           - "EFS"                                                    │
│           - "EC2"                                                    │
│           - "Storage Gateway"                                        │
│           - "EBS"                                                    │
│           - "DynamoDB"                                               │
│           - "FSx"                                                    │
│           - "VirtualMachine"                                         │
│     - ControlInputParameters:                                        │
│         - ParameterName: maxRetentionDays                            │
│           ParameterValue: 36500                                      │
│         - ParameterName: minRetentionDays                            │
│           ParameterValue: 1                                          │
│       ControlName: BACKUP_RESOURCES_PROTECTED_BY_BACKUP_VAULT_LOCK   │
│       ControlScope:                                                  │
│         ComplianceResourceTypes:                                     │
│           - "RDS"                                                    │
│           - "S3"                                                     │
│           - "Aurora"                                                 │
│           - "EFS"                                                    │
│           - "EC2"                                                    │
│           - "Storage Gateway"                                        │
│           - "EBS"                                                    │
│           - "DynamoDB"                                               │
│           - "FSx"                                                    │
│           - "VirtualMachine"                                         │
│     - ControlInputParameters: []                                     │
│       ControlName: BACKUP_RECOVERY_POINT_ENCRYPTED                   │
│       ControlScope:                                                  │
│     - ControlInputParameters: []                                     │
│       ControlName: BACKUP_RESOURCES_PROTECTED_BY_BACKUP_PLAN         │
│       ControlScope:                                                  │
│         ComplianceResourceTypes:                                     │
│           - "RDS"                                                    │
│           - "S3"                                                     │
│           - "Aurora"                                                 │
│           - "EFS"                                                    │
│           - "EC2"                                                    │
│           - "Storage Gateway"                                        │
│           - "EBS"                                                    │
│           - "DynamoDB"                                               │
│           - "FSx"                                                    │
│           - "VirtualMachine"                                         │
│     - ControlInputParameters: []                                     │
│       ControlName: BACKUP_RESOURCES_PROTECTED_BY_CROSS_ACCOUNT       │
│       ControlScope:                                                  │
│         ComplianceResourceTypes:                                     │
│           - "RDS"                                                    │
│           - "S3"                                                     │
│           - "Aurora"                                                 │
│           - "EFS"                                                    │
│           - "EC2"                                                    │
│           - "Storage Gateway"                                        │
│           - "EBS"                                                    │
│           - "DynamoDB"                                               │
│           - "FSx"                                                    │
│           - "VirtualMachine"                                         │
│     - ControlInputParameters: []                                     │
│       ControlName: BACKUP_RECOVERY_POINT_MANUAL_DELETION_DISABLED    │
│       ControlScope:                                                  │
│     - ControlInputParameters:                                        │
│         - ParameterName: requiredFrequencyUnit                       │
│           ParameterValue: days                                       │
│         - ParameterName: requiredRetentionDays                       │
│           ParameterValue: 35                                         │
│         - ParameterName: requiredFrequencyValue                      │
│           ParameterValue: 1                                          │
│       ControlName: BACKUP_PLAN_MIN_FREQUENCY_AND_MIN_RETENTION_CHECK │
│       ControlScope:                                                  │
│     - ControlInputParameters: []                                     │
│       ControlName: BACKUP_RESOURCES_PROTECTED_BY_CROSS_REGION        │
│       ControlScope:                                                  │
│         ComplianceResourceTypes:                                     │
│           - "RDS"                                                    │
│           - "S3"                                                     │
│           - "Aurora"                                                 │
│           - "EFS"                                                    │
│           - "EC2"                                                    │
│           - "Storage Gateway"                                        │
│           - "EBS"                                                    │
│           - "DynamoDB"                                               │
│           - "FSx"                                                    │
│           - "VirtualMachine"                                         │
│   FrameworkDescription:                                              │
│   FrameworkName: myframework                                         │
│   FrameworkStatus: INACTIVE                                          │
│   NumberOfControls: 9                                                │
│   Tags:                                                              │
│     Name: myframework                                                │
│     gc-created-by-provider: aws                                      │
│     gc-managed-by: grucloud                                          │
│     gc-project-name: backup-simple                                   │
│     gc-stage: dev                                                    │
│                                                                      │
└──────────────────────────────────────────────────────────────────────┘


List Summary:
Provider: aws
┌─────────────────────────────────────────────────────────────────────┐
│ aws                                                                 │
├───────────────────┬─────────────────────────────────────────────────┤
│ Backup::Framework │ myframework                                     │
└───────────────────┴─────────────────────────────────────────────────┘
1 resource, 1 type, 1 provider
Command "gc l -t Backup::Framework" executed in 3s, 104 MB
```
