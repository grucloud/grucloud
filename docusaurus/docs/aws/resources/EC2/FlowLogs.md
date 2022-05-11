---
id: FlowLogs
title: FLow Logs
---

Provides a [Flow Logs](https://console.aws.amazon.com/vpc/home?#vpcs:)

```js
exports.createResources = () => [];
```

### Examples

- [flow log on vpc](https://github.com/grucloud/grucloud/blob/main/examples/aws/EC2/flow-logs/flow-logs-vpc)

- [flow log on subnet](https://github.com/grucloud/grucloud/blob/main/examples/aws/EC2/flow-logs/flow-logs-subnet)

- [flow log on interface](https://github.com/grucloud/grucloud/blob/main/examples/aws/EC2/flow-logs/flow-logs-interface)

### Properties

- [CreateFlowLogsCommandInput](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-ec2/interfaces/createflowlogscommandinput.html)

### Dependencies

- [Vpc](./Vpc.md)
- [Subnet](./Subnet.md)
- [Network Interface](./NetworkInterface.md)
- [Iam Role](../IAM/Role.md)
- [S3 Bucket](../S3/Bucket.md)
- [CloudWatchLogs](../CloudWatchLogs/LogGroup.md)

## Listing

List the flow logs with the _FlowLogs_ filter:

```sh
gc l -t FlowLogs
```

```txt

```
