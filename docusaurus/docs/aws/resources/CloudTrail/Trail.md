---
id: CloudTrail
title: CloudTrail
---

Manages a [Cloud Trail](https://console.aws.amazon.com/cloudtrail/home?#/).

## Sample code

```js
exports.createResources = () => [
  {
    type: "Trail",
    group: "CloudTrail",
    name: "my-trail",
    dependencies: () => ({
      s3Bucket: "my-cloudtrail",
      logsGroup: "my-logs-group",
      logsRole: "my-logs-group-role",
      kmsKey: "my-key"
      snsTopic: "my-sns-topic"
    }),
  },
];
```

## Properties

- [CreateTrailCommandInput](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-cloudtrail/interfaces/createtrailcommandinput.html)

## Dependencies

- [CloudWatchLogs LogGroup](../CloudWatchLogs/LogGroup.md)
- [IAM Role](../IAM/Role.md)
- [KMS Key](../KMS/Key.md)
- [S3 Bucket](../S3/Bucket.md)
- [SNS Topic](../SNS/Topic.md)

## Full Examples

- [simple example](https://github.com/grucloud/grucloud/tree/main/examples/aws/CloudTrail/cloudtrail-simple)
- [serverless-patterns s3-eventbridge](https://github.com/grucloud/grucloud/tree/main/examples/aws/serverless-patterns/s3-eventbridge)

## List

The trails can be filtered with the _Trail_ type:

```sh
gc l -t Trail
```

```txt
Listing resources on 1 provider: aws
✓ aws us-east-1
  ✓ Initialising
  ✓ Listing 1/1
┌────────────────────────────────────────────────────────────────────────────────────────┐
│ 1 CloudTrail::Trail from aws                                                           │
├────────────────────────────────────────────────────────────────────────────────────────┤
│ name: CloudTrailForS3ImagePushEvents                                                   │
│ managedByUs: Yes                                                                       │
│ live:                                                                                  │
│   EventSelectors:                                                                      │
│     - DataResources: []                                                                │
│       ExcludeManagementEventSources: []                                                │
│       IncludeManagementEvents: true                                                    │
│       ReadWriteType: All                                                               │
│   HasCustomEventSelectors: false                                                       │
│   HasInsightSelectors: false                                                           │
│   HomeRegion: us-east-1                                                                │
│   IncludeGlobalServiceEvents: true                                                     │
│   IsMultiRegionTrail: true                                                             │
│   IsOrganizationTrail: false                                                           │
│   LogFileValidationEnabled: false                                                      │
│   Name: CloudTrailForS3ImagePushEvents                                                 │
│   S3BucketName: grucloud-s3-event-bridge-logs                                          │
│   TrailARN: arn:aws:cloudtrail:us-east-1:840541460064:trail/CloudTrailForS3ImagePushE… │
│   TagsList:                                                                            │
│     - Key: gc-created-by-provider                                                      │
│       Value: aws                                                                       │
│     - Key: gc-managed-by                                                               │
│       Value: grucloud                                                                  │
│     - Key: gc-project-name                                                             │
│       Value: cloudtrail-simple                                                         │
│     - Key: gc-stage                                                                    │
│       Value: dev                                                                       │
│     - Key: Name                                                                        │
│       Value: CloudTrailForS3ImagePushEvents                                            │
│                                                                                        │
└────────────────────────────────────────────────────────────────────────────────────────┘


List Summary:
Provider: aws
┌───────────────────────────────────────────────────────────────────────────────────────┐
│ aws                                                                                   │
├───────────────────┬───────────────────────────────────────────────────────────────────┤
│ CloudTrail::Trail │ CloudTrailForS3ImagePushEvents                                    │
└───────────────────┴───────────────────────────────────────────────────────────────────┘
1 resource, 1 type, 1 provider
Command "gc l -t Trail" executed in 6s, 109 MB
```
