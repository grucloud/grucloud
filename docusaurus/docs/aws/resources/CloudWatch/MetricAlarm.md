---
id: MetricAlarm
title: Metric Alarm
---

Manages an [Cloud Watch Metric Alarm](https://console.aws.amazon.com/cloudwatch/home?#alarmsV2:alarm).

## Sample code

```js
exports.createResources = () => [
  {
    type: "MetricAlarm",
    group: "CloudWatch",
    properties: ({ config, getId }) => ({
      AlarmName: "alarm-stop-ec2",
      AlarmActions: [
        `arn:aws:swf:${
          config.region
        }:${config.accountId()}:action/actions/AWS_EC2.InstanceId.Reboot/1.0`,
        `arn:aws:sns:${
          config.region
        }:${config.accountId()}:Default_CloudWatch_Alarms_Topic`,
      ],
      MetricName: "CPUUtilization",
      Namespace: "AWS/EC2",
      Statistic: "Average",
      Dimensions: [
        {
          Name: "InstanceId",
          Value: `${getId({
            type: "Instance",
            group: "EC2",
            name: "ec2-for-alarm",
          })}`,
        },
      ],
      Period: 300,
      EvaluationPeriods: 1,
      DatapointsToAlarm: 1,
      Threshold: 5,
      ComparisonOperator: "LessThanOrEqualToThreshold",
      TreatMissingData: "missing",
    }),
    dependencies: ({}) => ({
      snsTopic: "Default_CloudWatch_Alarms_Topic",
      ec2Instance: "ec2-for-alarm",
    }),
  },
];
```

## Properties

- [PutMetricMetricAlarmCommandInput](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-cloudwatch/interfaces/putmetricalarmcommandinput.html)

## Full Examples

- [alarm-stop-ec2](https://github.com/grucloud/grucloud/tree/main/examples/aws/CloudWatch/alarm-stop-ec2)
- [graphql-alarm](https://github.com/grucloud/grucloud/tree/main/examples/aws/AppSync/graphql-alarm)

## Dependencies

- [SNS Topic](../SNS/Topic.md)
- [AppSync Graphql](../AppSync/GraphqlApi.md)
- [Certificate](../ACM/Certificate.md)
- [EC2 Instance](../EC2/Instance.md)
- [Route53 Health Check](../Route53/HealthCheck.md)

## Used By

- [Route53 Health Check](../Route53/HealthCheck.md)

## List

The alarms can be filtered with the _CloudWatch::MetricAlarm_ type:

```sh
gc l -t CloudWatch::MetricAlarm
```

```txt
Listing resources on 1 provider: aws
✓ aws us-east-1
  ✓ Initialising
  ✓ Listing 1/1
┌───────────────────────────────────────────────────────────────────────┐
│ 1 CloudWatch::MetricAlarm from aws                                    │
├───────────────────────────────────────────────────────────────────────┤
│ name: alarm-stop-ec2                                                  │
│ managedByUs: Yes                                                      │
│ live:                                                                 │
│   AlarmName: alarm-stop-ec2                                           │
│   AlarmArn: arn:aws:cloudwatch:us-east-1:840541460064:alarm:alarm-st… │
│   AlarmConfigurationUpdatedTimestamp: 2022-07-05T08:44:04.405Z        │
│   ActionsEnabled: true                                                │
│   OKActions: []                                                       │
│   AlarmActions:                                                       │
│     - "arn:aws:swf:us-east-1:840541460064:action/actions/AWS_EC2.Ins… │
│     - "arn:aws:sns:us-east-1:840541460064:Default_CloudWatch_Alarms_… │
│   InsufficientDataActions: []                                         │
│   StateValue: INSUFFICIENT_DATA                                       │
│   StateReason: Unchecked: Initial alarm creation                      │
│   StateUpdatedTimestamp: 2022-07-05T08:43:25.699Z                     │
│   MetricName: CPUUtilization                                          │
│   Namespace: AWS/EC2                                                  │
│   Statistic: Average                                                  │
│   Dimensions:                                                         │
│     - Name: InstanceId                                                │
│       Value: i-0888ad1949ef52e16                                      │
│   Period: 300                                                         │
│   EvaluationPeriods: 1                                                │
│   DatapointsToAlarm: 1                                                │
│   Threshold: 5                                                        │
│   ComparisonOperator: LessThanOrEqualToThreshold                      │
│   TreatMissingData: missing                                           │
│                                                                       │
└───────────────────────────────────────────────────────────────────────┘


List Summary:
Provider: aws
┌──────────────────────────────────────────────────────────────────────┐
│ aws                                                                  │
├─────────────────────────┬────────────────────────────────────────────┤
│ CloudWatch::MetricAlarm │ alarm-stop-ec2                             │
└─────────────────────────┴────────────────────────────────────────────┘
1 resource, 1 type, 1 provider
Command "gc l -t CloudWatch::MetricAlarm" executed in 11s, 112 MB
```
