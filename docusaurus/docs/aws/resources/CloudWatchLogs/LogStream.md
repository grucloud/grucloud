---
id: LogStream
title: Log Stream
---

Manages a [Cloud Watch Log Stream](https://console.aws.amazon.com/cloudwatch/home?#logsV2:log-groups).

## Sample code

```js
exports.createResources = () => [
  {
    type: "LogStream",
    group: "CloudWatchLogs",
    properties: ({}) => ({
      logStreamName: "my-log-stream",
    }),
    dependencies: ({}) => ({
      cloudWatchLogGroup: "my-log-group",
    }),
  },
];
```

## Properties

- [CreateLogStreamCommandInput](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-cloudwatch-logs/interfaces/createlogstreamcommandinput.html)

## Full Examples

- [log stream](https://github.com/grucloud/grucloud/tree/main/examples/aws/CloudWatchLogs/log-stream)
- [client-vpn-endpoint](https://github.com/grucloud/grucloud/tree/main/examples/aws/EC2/client-vpn-endpoint)

## Dependencies

- [CloudWatchLogs LogGroup](./LogGroup.md)

## Used By

- [ClientVpnEndpoint](../EC2/ClientVpnEndpoint.md)

## List

The log streams can be filtered with the _LogStream_ type:

```sh
gc l -t CloudWatchLogs::LogStream
```

```txt
Listing resources on 1 provider: aws
✓ aws us-east-1
  ✓ Initialising
  ✓ Listing 2/2
┌──────────────────────────────────────────────────────────────────────────────────────────────┐
│ 1 CloudWatchLogs::LogStream from aws                                                         │
├──────────────────────────────────────────────────────────────────────────────────────────────┤
│ name: my-log-group::my-log-stream                                                            │
│ managedByUs: Yes                                                                             │
│ live:                                                                                        │
│   arn: arn:aws:logs:us-east-1:840541460064:log-group:my-log-group:log-stream:my-log-stream   │
│   creationTime: 1658483852431                                                                │
│   logStreamName: my-log-stream                                                               │
│   storedBytes: 0                                                                             │
│                                                                                              │
└──────────────────────────────────────────────────────────────────────────────────────────────┘


List Summary:
Provider: aws
┌─────────────────────────────────────────────────────────────────────────────────────────────┐
│ aws                                                                                         │
├───────────────────────────┬─────────────────────────────────────────────────────────────────┤
│ CloudWatchLogs::LogStream │ my-log-group::my-log-stream                                     │
└───────────────────────────┴─────────────────────────────────────────────────────────────────┘
1 resource, 1 type, 1 provider
Command "gc l -t CloudWatchLogs::LogStream" executed in 6s, 104 MB
```
