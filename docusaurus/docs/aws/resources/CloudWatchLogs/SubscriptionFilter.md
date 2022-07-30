---
id: SubscriptionFilter
title: Subscription Filter
---

Manages a [Cloud Watch Subscription Filter](https://console.aws.amazon.com/cloudwatch/home?#logsV2:log-groups).

## Sample code

### Lambda function as a destination

```js
exports.createResources = () => [
  {
    type: "SubscriptionFilter",
    group: "CloudWatchLogs",
    properties: ({}) => ({
      distribution: "ByLogStream",
      filterName: "my-filter",
      filterPattern: '[timestamp=*Z, request_id="*-*", event]',
    }),
    dependencies: ({}) => ({
      cloudWatchLogGroup: "my-log-group",
      lambdaFunction: "receive-cloudwatch-log-group",
    }),
  },
];
```

## Properties

- [PutSubscriptionFilterRequest](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-cloudwatch-logs/modules/putsubscriptionfilterrequest.html)

## Full Examples

- [subscription filter](https://github.com/grucloud/grucloud/tree/main/examples/aws/CloudWatchLogs/subscription-filter)

## Dependencies

- [CloudWatchLogs LogGroup](./LogGroup.md)
- [Kinesis Stream](../Kinesis/Stream.md)
- [Firehose DeliveryStream](../Firehose/DeliveryStream.md)
- [Lambda Function](../Lambda/Function.md)
- [IAM Role](../IAM/Role.md)

## List

The subscription filters can be filtered with the _SubscriptionFilter_ type:

```sh
gc l -t CloudWatchLogs::SubscriptionFilter
```

```txt
Listing resources on 1 provider: aws
✓ aws us-east-1
  ✓ Initialising
  ✓ Listing 2/2
┌───────────────────────────────────────────────────────────────────────────────────────────┐
│ 1 CloudWatchLogs::SubscriptionFilter from aws                                             │
├───────────────────────────────────────────────────────────────────────────────────────────┤
│ name: my-log-group::my-filter                                                             │
│ managedByUs: Yes                                                                          │
│ live:                                                                                     │
│   creationTime: 1658497631294                                                             │
│   destinationArn: arn:aws:lambda:us-east-1:840541460064:function:receive-cloudwatch-log-… │
│   distribution: ByLogStream                                                               │
│   filterName: my-filter                                                                   │
│   filterPattern: [timestamp=*Z, request_id="*-*", event]                                  │
│   logGroupName: my-log-group                                                              │
│                                                                                           │
└───────────────────────────────────────────────────────────────────────────────────────────┘


List Summary:
Provider: aws
┌──────────────────────────────────────────────────────────────────────────────────────────┐
│ aws                                                                                      │
├────────────────────────────────────┬─────────────────────────────────────────────────────┤
│ CloudWatchLogs::SubscriptionFilter │ my-log-group::my-filter                             │
└────────────────────────────────────┴─────────────────────────────────────────────────────┘
1 resource, 1 type, 1 provider
Command "gc l -t CloudWatchLogs::SubscriptionFilter" executed in 5s, 109 MB
```
