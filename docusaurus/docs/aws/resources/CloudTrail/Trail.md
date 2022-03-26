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

- [S3 Bucket](../S3/Bucket.md)
- [CloudWatchLogs LogGroup](../CloudWatchLogs/LogGroup.md)
- [IAM Role](../IAM/Role.md)
- [SNS Topic](../SNS/Topic)
- [KMS Key](../KMS/Key.md)

## Full Examples

- [simple example](https://github.com/grucloud/grucloud/tree/main/examples/aws/CloudTrail/cloudtrail-simple)

## List

The trails can be filtered with the _Trail_ type:

```sh
gc l -t Trail
```

```txt

```
