---
id: LogGroup
title: Log Group
---

Manages a [Cloud Watch Log Group](https://console.aws.amazon.com/cloudwatch/home?#logsV2:log-groups).

## Sample code

```js
exports.createResources = () => [
  {
    type: "LogGroup",
    group: "CloudWatchLogs",
    name: "loggroupwithkmskey",
    properties: ({}) => ({
      retentionInDays: 1,
    }),
    dependencies: ({}) => ({
      kmsKey: "kms-key-aws-hub-and-spoke-demo-test",
    }),
  },
];
```

## Properties

- [CreateLogGroupCommandInput](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-cloudwatch-logs/interfaces/createloggroupcommandinput.html)

## Full Examples

- [logGroup](https://github.com/grucloud/grucloud/tree/main/examples/aws/CloudWatchLogs/logs)
- [logGroup with KMS key](https://github.com/grucloud/grucloud/tree/main/examples/aws/CloudWatchLogs/loggroup-key)
- [hub-and-spoke-with-inspection-vpc](https://github.com/grucloud/grucloud/blob/main/examples/aws/EC2/hub-and-spoke-with-inspection-vpc)

## Dependencies

- [KMS Key](../KMS/Key.md)

## Used By

- [EC2 Client Vpn Endpoint](../EC2/ClientVpnEndpoint.md)
- [ECS Cluster](../ECS/Cluster.md)
- [ElastiCache Cluster](../ElastiCache/Cluster.md)
- [Log Stream](./LogStream.md)
- [Network Firewall Logging Configuration](../NetworkFirewall/LoggingConfiguration.md)

## List

The log groups can be filtered with the _LogGroup_ type:

```sh
gc l -t LogGroup
```

```txt
Listing resources on 1 provider: aws
✓ aws
  ✓ Initialising
  ✓ Listing 1/1
┌─────────────────────────────────────────────────────────────────────┐
│ 9 CloudWatchLogs::LogGroup from aws                                 │
├─────────────────────────────────────────────────────────────────────┤
│ name: /aws/ecs/containerinsights/cluster/performance                │
│ managedByUs: NO                                                     │
│ live:                                                               │
│   logGroupName: /aws/ecs/containerinsights/cluster/performance      │
│   creationTime: 1629683668515                                       │
│   retentionInDays: 1                                                │
│   metricFilterCount: 0                                              │
│   arn: arn:aws:logs:eu-west-2:840541460064:log-group:/aws/ecs/cont… │
│   storedBytes: 0                                                    │
│                                                                     │
├─────────────────────────────────────────────────────────────────────┤
│ name: my-loggroup                                                   │
│ managedByUs: NO                                                     │
│ live:                                                               │
│   logGroupName: my-loggroup                                         │
│   creationTime: 1632310599029                                       │
│   metricFilterCount: 0                                              │
│   arn: arn:aws:logs:eu-west-2:840541460064:log-group:my-loggroup:*  │
│   storedBytes: 0                                                    │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘


List Summary:
Provider: aws
┌────────────────────────────────────────────────────────────────────┐
│ aws                                                                │
├──────────────────────────┬─────────────────────────────────────────┤
│ CloudWatchLogs::LogGroup │ /aws/ecs/containerinsights/cluster/per… │
│                          │ my-loggroup                             │
└──────────────────────────┴─────────────────────────────────────────┘
2 resources, 1 type, 1 provider
Command "gc l -t LogGroup" executed in 2s
```
