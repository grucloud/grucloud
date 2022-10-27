---
id: ReportPlan
title: Report Plan
---

Manages a [Backup Report Plan](https://console.aws.amazon.com/backup/home).

## Sample code

```js
exports.createResources = () => [
  {
    type: "ReportPlan",
    group: "Backup",
    properties: ({ getId }) => ({
      ReportDeliveryChannel: {
        Formats: ["CSV", "JSON"],
        S3BucketName: "gc-backup-reportplan-jobs",
        S3KeyPrefix: "compliance",
      },
      ReportPlanDescription: "",
      ReportPlanName: "control_compliance_report_27_10_2022",
      ReportSetting: {
        FrameworkArns: [
          `${getId({
            type: "Framework",
            group: "Backup",
            name: "myframework",
          })}`,
        ],
        ReportTemplate: "CONTROL_COMPLIANCE_REPORT",
      },
    }),
    dependencies: ({}) => ({
      s3Bucket: "gc-backup-reportplan-jobs",
      frameworks: ["myframework"],
    }),
  },
];
```

## Properties

- [CreateReportPlanCommandInput](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-backup/interfaces/createreportplancommandinput.html)

## Dependencies

- [S3 Bucket](../S3/Bucket.md)

## Used By

## Full Examples

- [backup simple](https://github.com/grucloud/grucloud/tree/main/examples/aws/Backup/backup-simple)

## List

```sh
gc l -t Backup::ReportPlan
```

```txt
Listing resources on 1 provider: aws
✓ aws us-east-1
  ✓ Initialising
  ✓ Listing 1/1
┌────────────────────────────────────────────────────────────────────────┐
│ 2 Backup::ReportPlan from aws                                          │
├────────────────────────────────────────────────────────────────────────┤
│ name: backup_jobs_report_27_10_2022                                    │
│ managedByUs: Yes                                                       │
│ live:                                                                  │
│   CreationTime: 2022-10-27T14:28:40.647Z                               │
│   DeploymentStatus: COMPLETED                                          │
│   ReportDeliveryChannel:                                               │
│     Formats:                                                           │
│       - "CSV"                                                          │
│       - "JSON"                                                         │
│     S3BucketName: gc-backup-reportplan-jobs                            │
│     S3KeyPrefix: jobs-report                                           │
│   ReportPlanArn: arn:aws:backup:us-east-1:840541460064:report-plan:ba… │
│   ReportPlanDescription:                                               │
│   ReportPlanName: backup_jobs_report_27_10_2022                        │
│   ReportSetting:                                                       │
│     FrameworkArns: []                                                  │
│     NumberOfFrameworks: 0                                              │
│     ReportTemplate: BACKUP_JOB_REPORT                                  │
│   Tags:                                                                │
│     Name: backup_jobs_report_27_10_2022                                │
│     gc-created-by-provider: aws                                        │
│     gc-managed-by: grucloud                                            │
│     gc-project-name: backup-simple                                     │
│     gc-stage: dev                                                      │
│     mykey: myvalue                                                     │
│                                                                        │
├────────────────────────────────────────────────────────────────────────┤
│ name: control_compliance_report_27_10_2022                             │
│ managedByUs: Yes                                                       │
│ live:                                                                  │
│   CreationTime: 2022-10-27T14:34:41.886Z                               │
│   DeploymentStatus: COMPLETED                                          │
│   ReportDeliveryChannel:                                               │
│     Formats:                                                           │
│       - "CSV"                                                          │
│       - "JSON"                                                         │
│     S3BucketName: gc-backup-reportplan-jobs                            │
│     S3KeyPrefix: compliance                                            │
│   ReportPlanArn: arn:aws:backup:us-east-1:840541460064:report-plan:co… │
│   ReportPlanDescription:                                               │
│   ReportPlanName: control_compliance_report_27_10_2022                 │
│   ReportSetting:                                                       │
│     FrameworkArns:                                                     │
│       - "arn:aws:backup:us-east-1:840541460064:framework:myframework-… │
│     NumberOfFrameworks: 1                                              │
│     ReportTemplate: CONTROL_COMPLIANCE_REPORT                          │
│   Tags:                                                                │
│     Name: control_compliance_report_27_10_2022                         │
│     gc-created-by-provider: aws                                        │
│     gc-managed-by: grucloud                                            │
│     gc-project-name: backup-simple                                     │
│     gc-stage: dev                                                      │
│                                                                        │
└────────────────────────────────────────────────────────────────────────┘


List Summary:
Provider: aws
┌───────────────────────────────────────────────────────────────────────┐
│ aws                                                                   │
├────────────────────┬──────────────────────────────────────────────────┤
│ Backup::ReportPlan │ backup_jobs_report_27_10_2022                    │
│                    │ control_compliance_report_27_10_2022             │
└────────────────────┴──────────────────────────────────────────────────┘
2 resources, 1 type, 1 provider
Command "gc l -t Backup::ReportPlan" executed in 4s, 105 MB
```
