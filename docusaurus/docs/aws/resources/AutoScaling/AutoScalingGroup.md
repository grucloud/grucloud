---
id: AutoScalingGroup
title: AutoScaling Group
---

Manages an [AWS Auto Scaling group](https://console.aws.amazon.com/ec2autoscaling/home).

## Sample code

Create an AutoScaling Group given 2 subnets and a launch template:

```js
provider.AutoScaling.makeAutoScalingGroup({
  name: "asg",
  properties: ({}) => ({
    MinSize: 1,
    MaxSize: 1,
    DesiredCapacity: 1,
  }),
  dependencies: () => ({
    subnets: ["PubSubnetAz1", "PubSubnetAz2"],
    launchTemplate: "lt-ec2-micro",
  }),
});
```

## Properties

- [create properties](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AutoScaling.html#createAutoScalingGroup-property)

## Dependencies

- [Subnet](../EC2/Subnet.md)
- [Launch Configuration](./LaunchConfiguration.md) or [Launch Template](../EC2/LaunchTemplate.md)

## Used By

- [AutoScalingAttachment](./AutoScalingAttachment.md)

## Full Examples

- [AutoScaling Group example](https://github.com/grucloud/grucloud/tree/main/examples/aws/autoScaling/autoScalingGroup)
- [AutoScalingGroup attached to a load balancer](https://github.com/grucloud/grucloud/tree/main/examples/aws/ELBv2/load-balancer)
- [AutoScaling Group in ECS with Launch Configuration](https://github.com/grucloud/grucloud/tree/main/examples/aws/ecs/ecs-simple)

## List

The auto scaling groups can be filtered with the _AutoScalingGroup_ type:

```sh
gc l -t AutoScalingGroup
```

```txt
Listing resources on 1 provider: aws
✓ aws
  ✓ Initialising
  ✓ Listing 18/18
┌────────────────────────────────────────────────────────────────┐
│ 1 autoscaling::AutoScalingGroup from aws                       │
├────────────────────────────────────────────────────────────────┤
│ name: asg                                                      │
│ managedByUs: Yes                                               │
│ live:                                                          │
│   AutoScalingGroupName: asg                                    │
│   AutoScalingGroupARN: arn:aws:autoscaling:eu-west-2:84054146… │
│   LaunchTemplate:                                              │
│     LaunchTemplateId: lt-0753d0ca24696f478                     │
│     LaunchTemplateName: lt-ec2-micro                           │
│   MinSize: 1                                                   │
│   MaxSize: 1                                                   │
│   DesiredCapacity: 1                                           │
│   DefaultCooldown: 300                                         │
│   AvailabilityZones:                                           │
│     - "eu-west-2a"                                             │
│     - "eu-west-2b"                                             │
│   LoadBalancerNames: []                                        │
│   TargetGroupARNs: []                                          │
│   HealthCheckType: EC2                                         │
│   HealthCheckGracePeriod: 300                                  │
│   Instances:                                                   │
│     - InstanceId: i-02e65188be5a2caa9                          │
│       InstanceType: t2.micro                                   │
│       AvailabilityZone: eu-west-2b                             │
│       LifecycleState: Pending                                  │
│       HealthStatus: Healthy                                    │
│       LaunchTemplate:                                          │
│         LaunchTemplateId: lt-0753d0ca24696f478                 │
│         LaunchTemplateName: lt-ec2-micro                       │
│         Version: 1                                             │
│       ProtectedFromScaleIn: false                              │
│   CreatedTime: 2021-08-27T17:17:37.549Z                        │
│   SuspendedProcesses: []                                       │
│   VPCZoneIdentifier: subnet-0904117fc234a5151,subnet-0e2c4739… │
│   EnabledMetrics: []                                           │
│   Tags:                                                        │
│     - ResourceId: asg                                          │
│       ResourceType: auto-scaling-group                         │
│       Key: gc-created-by-provider                              │
│       Value: aws                                               │
│       PropagateAtLaunch: true                                  │
│     - ResourceId: asg                                          │
│       ResourceType: auto-scaling-group                         │
│       Key: gc-managed-by                                       │
│       Value: grucloud                                          │
│       PropagateAtLaunch: true                                  │
│     - ResourceId: asg                                          │
│       ResourceType: auto-scaling-group                         │
│       Key: gc-project-name                                     │
│       Value: example-grucloud-autoscaling-group                │
│       PropagateAtLaunch: true                                  │
│     - ResourceId: asg                                          │
│       ResourceType: auto-scaling-group                         │
│       Key: gc-stage                                            │
│       Value: dev                                               │
│       PropagateAtLaunch: true                                  │
│     - ResourceId: asg                                          │
│       ResourceType: auto-scaling-group                         │
│       Key: Name                                                │
│       Value: asg                                               │
│       PropagateAtLaunch: true                                  │
│   TerminationPolicies:                                         │
│     - "Default"                                                │
│   NewInstancesProtectedFromScaleIn: false                      │
│   ServiceLinkedRoleARN: arn:aws:iam::840541460064:role/aws-se… │
│                                                                │
└────────────────────────────────────────────────────────────────┘


List Summary:
Provider: aws
┌───────────────────────────────────────────────────────────┐
│ aws                                                       │
├────────────────────────────────┬──────────────────────────┤
│ autoscaling::AutoScalingGroup  │ asg                      │
└────────────────────────────────┴──────────────────────────┘
```

## Links

- [Auto Scaling Group user guide](https://docs.aws.amazon.com/autoscaling/ec2/userguide/AutoScalingGroup.html).
