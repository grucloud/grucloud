---
id: FlowLogs
title: FLow Logs
---

Provides a [Flow Logs](https://console.aws.amazon.com/vpc/home?#vpcs:)

### FlowLogs attached to a VPC

```js
exports.createResources = () => [
  {
    type: "FlowLogs",
    group: "EC2",
    name: "flowlog::dns_vpc",
    properties: ({}) => ({
      TrafficType: "ALL",
      MaxAggregationInterval: 600,
    }),
    dependencies: ({}) => ({
      vpc: "dns_vpc",
      iamRole: "dev_endpoint_vpc_flow_logs",
      cloudWatchLogGroup: "dns_vpc",
    }),
  },
];
```

### FlowLogs attached to a subnet

```js
exports.createResources = () => [
  {
    type: "FlowLogs",
    group: "EC2",
    name: "fl4vpc",
    properties: ({}) => ({
      TrafficType: "ALL",
      MaxAggregationInterval: 60,
    }),
    dependencies: ({ config }) => ({
      subnet: `project-vpc::project-subnet-public1-${config.region}a`,
      iamRole: "flow-role",
      cloudWatchLogGroup: "flowlog",
    }),
  },
];
```

### FlowLogs attached to a network interface

```js
exports.createResources = () => [
  {
    type: "FlowLogs",
    group: "EC2",
    name: "flowlog-interface",
    properties: ({}) => ({
      TrafficType: "ALL",
      MaxAggregationInterval: 60,
    }),
    dependencies: ({}) => ({
      networkInterface: "eni::machine",
      iamRole: "flow-role",
      cloudWatchLogGroup: "flowlog",
    }),
  },
];
```


### Examples

- [flow log on vpc](https://github.com/grucloud/grucloud/blob/main/examples/aws/EC2/flow-logs/flow-logs-vpc)

- [flow log on subnet](https://github.com/grucloud/grucloud/blob/main/examples/aws/EC2/flow-logs/flow-logs-subnet)

- [flow log on interface](https://github.com/grucloud/grucloud/blob/main/examples/aws/EC2/flow-logs/flow-logs-interface)

- [aws-samples/aws-network-hub-for-terraform](https://github.com/grucloud/grucloud/blob/main/examples/aws/aws-samples/aws-network-hub-for-terraform)

- [hub-and-spoke-with-shared-services-vpc-terraform](https://github.com/grucloud/grucloud/blob/main/examples/aws/aws-samples/hub-and-spoke-with-shared-services-vpc-terraform)

### Properties

- [CreateFlowLogsCommandInput](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-ec2/interfaces/createflowlogscommandinput.html)

### Dependencies

- [Vpc](./Vpc.md)
- [Subnet](./Subnet.md)
- [Network Interface](./NetworkInterface.md)
- [Iam Role](../IAM/Role.md)
- [S3 Bucket](../S3/Bucket.md)
- [CloudWatch LogGroup](../CloudWatchLogs/LogGroup.md)

## Listing

List the flow logs with the _FlowLogs_ filter:

```sh
gc l -t FlowLogs
```

```txt
Listing resources on 1 provider: aws
✓ aws us-east-1
  ✓ Initialising
  ✓ Listing 1/1
┌──────────────────────────────────────────────────────────────────────────────────────────┐
│ 1 EC2::FlowLogs from aws                                                                 │
├──────────────────────────────────────────────────────────────────────────────────────────┤
│ name: fl4vpc                                                                             │
│ managedByUs: Yes                                                                         │
│ live:                                                                                    │
│   CreationTime: 2022-07-13T13:36:47.622Z                                                 │
│   DeliverLogsPermissionArn: arn:aws:iam::840541460064:role/flow-role                     │
│   DeliverLogsStatus: SUCCESS                                                             │
│   FlowLogId: fl-041f441c486dde383                                                        │
│   FlowLogStatus: ACTIVE                                                                  │
│   LogGroupName: flowlog                                                                  │
│   ResourceId: vpc-0e407ff55068ed00e                                                      │
│   TrafficType: ALL                                                                       │
│   LogDestinationType: cloud-watch-logs                                                   │
│   LogFormat: ${version} ${account-id} ${interface-id} ${srcaddr} ${dstaddr} ${srcport} … │
│   Tags:                                                                                  │
│     - Key: gc-created-by-provider                                                        │
│       Value: aws                                                                         │
│     - Key: gc-managed-by                                                                 │
│       Value: grucloud                                                                    │
│     - Key: gc-project-name                                                               │
│       Value: flow-logs-vpc                                                               │
│     - Key: gc-stage                                                                      │
│       Value: dev                                                                         │
│     - Key: Name                                                                          │
│       Value: fl4vpc                                                                      │
│   MaxAggregationInterval: 60                                                             │
│                                                                                          │
└──────────────────────────────────────────────────────────────────────────────────────────┘


List Summary:
Provider: aws
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│ aws                                                                                     │
├───────────────┬─────────────────────────────────────────────────────────────────────────┤
│ EC2::FlowLogs │ fl4vpc                                                                  │
└───────────────┴─────────────────────────────────────────────────────────────────────────┘
1 resource, 1 type, 1 provider
Command "gc l -t FlowLogs" executed in 4s, 111 MB
```
