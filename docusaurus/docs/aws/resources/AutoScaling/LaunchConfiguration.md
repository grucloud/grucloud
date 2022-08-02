---
id: LaunchConfiguration
title: Launch Configuration
---

Manages an [Launch Configuration](https://console.aws.amazon.com/ec2/v2/home?#LaunchConfigurations).

## Example

```js
exports.createResources = () => [
  {
    type: "LaunchConfiguration",
    group: "AutoScaling",
    properties: ({}) => ({
      LaunchConfigurationName:
        "amazon-ecs-cli-setup-my-cluster-EcsInstanceLc-S7O7EVIS98IV",
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
    dependencies: () => ({
      instanceProfile:
        "amazon-ecs-cli-setup-my-cluster-EcsInstanceProfile-ESJBS99JRKVK",
      securityGroups: ["EcsSecurityGroup"],
    }),
  },
  {
    type: "SecurityGroup",
    group: "EC2",
    name: "EcsSecurityGroup",
    properties: ({}) => ({
      Description: "ECS Allowed Ports",
      Tags: [
        {
          Key: "my-tag",
          Value: "my-value",
        },
      ],
    }),
    dependencies: () => ({
      vpc: "Vpc",
    }),
  },
  {
    type: "Role",
    group: "IAM",
    name: "amazon-ecs-cli-setup-my-cluster-EcsInstanceRole-14B4COKG08FT6",
    properties: ({}) => ({
      Path: "/",
      AssumeRolePolicyDocument: {
        Version: "2012-10-17",
        Statement: [
          {
            Effect: "Allow",
            Principal: {
              Service: "ec2.amazonaws.com",
            },
            Action: "sts:AssumeRole",
          },
        ],
      },
      Tags: [
        {
          Key: "my-tag",
          Value: "my-value",
        },
      ],
    }),
    dependencies: () => ({
      policies: ["AmazonEC2ContainerServiceforEC2Role"],
    }),
  },
  {
    type: "Policy",
    group: "IAM",
    name: "AmazonEC2ContainerServiceforEC2Role",
    readOnly: true,
    properties: ({}) => ({
      Arn: "arn:aws:iam::aws:policy/service-role/AmazonEC2ContainerServiceforEC2Role",
    }),
  },
  {
    type: "InstanceProfile",
    group: "IAM",
    name: "amazon-ecs-cli-setup-my-cluster-EcsInstanceProfile-ESJBS99JRKVK",
    dependencies: () => ({
      roles: ["amazon-ecs-cli-setup-my-cluster-EcsInstanceRole-14B4COKG08FT6"],
    }),
  },
];
```

## Properties

- [CreateLaunchConfigurationCommandInput](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-auto-scaling/interfaces/createlaunchconfigurationcommandinput.html)

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

- [Simple ECS](https://github.com/grucloud/grucloud/tree/main/examples/aws/ECS/ecs-simple)
