---
id: LaunchConfiguration
title: Launch Configuration
---

Manages an [Launch Configuration](https://console.aws.amazon.com/ec2/v2/home?#LaunchConfigurations).

## Example

```js
provider.AutoScaling.makeLaunchConfiguration({
  name: "amazon-ecs-cli-setup-my-cluster-EcsInstanceLc-S7O7EVIS98IV",
  properties: ({ config }) => ({
    InstanceType: "t2.small",
    ImageId: "ami-0e43fd2a4ef14f476",
    UserData:
      'Content-Type: multipart/mixed; boundary="1f15191e3fe7ebb2094282e32ea108217183e16f27f6e8aa0b886ee04ec3"\nMIME-Version: 1.0\n\n--1f15191e3fe7ebb2094282e32ea108217183e16f27f6e8aa0b886ee04ec3\nContent-Type: text/text/x-shellscript; charset="utf-8"\nMime-Version: 1.0\n\n\n#!/bin/bash\necho ECS_CLUSTER=my-cluster >> /etc/ecs/ecs.config\necho \'ECS_CONTAINER_INSTANCE_TAGS={"my-tag":"my-value"}\' >> /etc/ecs/ecs.config\n--1f15191e3fe7ebb2094282e32ea108217183e16f27f6e8aa0b886ee04ec3--',
    InstanceMonitoring: {
      Enabled: true,
    },
    BlockDeviceMappings: [],
    EbsOptimized: false,
    AssociatePublicIpAddress: true,
  }),
  dependencies: ({ resources }) => ({
    instanceProfile:
      resources.IAM.InstanceProfile[
        "amazon-ecs-cli-setup-my-cluster-EcsInstanceProfile-ESJBS99JRKVK"
      ],
    securityGroups: [resources.EC2.SecurityGroup["EcsSecurityGroup"]],
  }),
});
```

## List

The Launch Configuration can be filtered with the _LaunchConfiguration_ type:

```sh
gc list --types LaunchConfiguration
```

```txt
Listing resources on 1 provider: aws
✓ aws
  ✓ Initialising
  ✓ Listing 9/9
┌────────────────────────────────────────────────────────────────────────────────┐
│ 1 AutoScaling::LaunchConfiguration from aws                                    │
├────────────────────────────────────────────────────────────────────────────────┤
│ name: amazon-ecs-cli-setup-my-cluster-EcsInstanceLc-S7O7EVIS98IV               │
│ managedByUs: Yes                                                               │
│ live:                                                                          │
│   LaunchConfigurationName: amazon-ecs-cli-setup-my-cluster-EcsInstanceLc-S7O7… │
│   LaunchConfigurationARN: arn:aws:autoscaling:us-east-1:840541460064:launchCo… │
│   ImageId: ami-0e43fd2a4ef14f476                                               │
│   KeyName:                                                                     │
│   SecurityGroups:                                                              │
│     - "sg-03502c1a2fb9d142d"                                                   │
│   ClassicLinkVPCSecurityGroups: []                                             │
│   UserData: Q29udGVudC1UeXBlOiBtdWx0aXBhcnQvbWl4ZWQ7IGJvdW5kYXJ5PSIxZjE1MTkxZ… │
│   InstanceType: t2.small                                                       │
│   KernelId:                                                                    │
│   RamdiskId:                                                                   │
│   BlockDeviceMappings: []                                                      │
│   InstanceMonitoring:                                                          │
│     Enabled: true                                                              │
│   IamInstanceProfile: amazon-ecs-cli-setup-my-cluster-EcsInstanceProfile-ESJB… │
│   CreatedTime: 2021-10-31T20:17:49.588Z                                        │
│   EbsOptimized: false                                                          │
│   AssociatePublicIpAddress: true                                               │
│                                                                                │
└────────────────────────────────────────────────────────────────────────────────┘


List Summary:
Provider: aws
┌───────────────────────────────────────────────────────────────────────────────┐
│ aws                                                                           │
├──────────────────────────────────┬────────────────────────────────────────────┤
│ AutoScaling::LaunchConfiguration │ amazon-ecs-cli-setup-my-cluster-EcsInstan… │
└──────────────────────────────────┴────────────────────────────────────────────┘
1 resource, 1 type, 1 provider
Command "gc l -t LaunchConfiguration" executed in 7s
```

## Dependencies

- [InstanceProfile](../IAM/InstanceProfile.md)
- [KeyPair](../EC2/KeyPair.md)
- [Image](../EC2/Image.md)
- [SecurityGroup](../EC2/SecurityGroup.md)

## Used By

- [AutoScaling Group](./AutoScalingGroup.md)

## Example

- [Simple ECS](https://github.com/grucloud/grucloud/tree/main/examples/aws/ecs/ecs-simple)
