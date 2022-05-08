---
id: LaunchTemplate
title: Launch Template
---

Manages an EC2 [Launch Template](https://console.aws.amazon.com/ec2/v2/home?#LaunchTemplates:)

## Example Code

```js
exports.createResources = () => [
  {
    type: "LaunchTemplate",
    group: "EC2",
    name: "lt-ec2-micro",
    properties: ({}) => ({
      LaunchTemplateData: {
        InstanceType: "t2.micro",
        UserData:
          "#!/bin/sh\nyum update -y\namazon-linux-extras install docker\nservice docker start\nusermod -a -G docker ec2-user\nchkconfig docker on",
        Image: {
          Description: "Amazon Linux 2 AMI 2.0.20211001.1 x86_64 HVM gp2",
        },
      },
    }),
    dependencies: ({}) => ({
      keyPair: "kp-ecs",
      iamInstanceProfile: "role-ecs",
      securityGroups: ["sg::Vpc::EcsSecurityGroup"],
    }),
  },
];
```

## Full Examples

- [Launch Template simple](https://github.com/grucloud/grucloud/blob/main/examples/aws/EC2/launchTemplate)

- [ELBv2 Load Balancer](https://github.com/grucloud/grucloud/blob/main/examples/aws/ELBv2/load-balancer)

- [EKS simple](https://github.com/grucloud/grucloud/blob/main/examples/aws/EC2/eks-simple)

## Properties

- [CreateLaunchTemplateCommandInput](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-ec2/interfaces/createlaunchtemplatecommandinput.html)

## Dependencies

- [Security Group](./SecurityGroup.md)
- [KeyPair](./KeyPair.md)
- [Image](./Image.md)
- [Instance Profile](../IAM/InstanceProfile.md)

## Used By

- [EKS NodeGroup](../EKS/NodeGroup.md)
- [AutoScalingGroup](../AutoScaling/AutoScalingGroup.md)

## List

```sh
gc l -t LaunchTemplate
```

```txt
Listing resources on 1 provider: aws
✓ aws
  ✓ Initialising
  ✓ Listing 1/1
┌───────────────────────────────────────────────────────────────────────┐
│ 1 EC2::LaunchTemplate from aws                                        │
├───────────────────────────────────────────────────────────────────────┤
│ name: lt-ec2-micro                                                    │
│ managedByUs: Yes                                                      │
│ live:                                                                 │
│   LaunchTemplateId: lt-00694c57ddcaf2863                              │
│   LaunchTemplateName: lt-ec2-micro                                    │
│   VersionNumber: 1                                                    │
│   CreateTime: 2022-05-08T21:31:02.000Z                                │
│   CreatedBy: arn:aws:iam::840541460064:root                           │
│   DefaultVersion: true                                                │
│   LaunchTemplateData:                                                 │
│     EbsOptimized: false                                               │
│     IamInstanceProfile:                                               │
│       Arn: arn:aws:iam::840541460064:instance-profile/role-ecs        │
│     ImageId: ami-02e136e904f3da870                                    │
│     InstanceType: t2.micro                                            │
│     KeyName: kp-ecs                                                   │
│     UserData: #!/bin/sh                                               │
│ yum update -y                                                         │
│ amazon-linux-extras install docker                                    │
│ service docker start                                                  │
│ usermod -a -G docker ec2-user                                         │
│ chkconfig docker on                                                   │
│     SecurityGroupIds:                                                 │
│       - "sg-0cca8f23d8f2676ce"                                        │
│     Image:                                                            │
│       Description: Amazon Linux 2 AMI 2.0.20211001.1 x86_64 HVM gp2   │
│   DefaultVersionNumber: 1                                             │
│   LatestVersionNumber: 1                                              │
│   Tags:                                                               │
│     - Key: gc-created-by-provider                                     │
│       Value: aws                                                      │
│     - Key: gc-managed-by                                              │
│       Value: grucloud                                                 │
│     - Key: gc-project-name                                            │
│       Value: example-grucloud-ec2-launch-template                     │
│     - Key: gc-stage                                                   │
│       Value: dev                                                      │
│     - Key: Name                                                       │
│       Value: lt-ec2-micro                                             │
│                                                                       │
└───────────────────────────────────────────────────────────────────────┘


List Summary:
Provider: aws
┌──────────────────────────────────────────────────────────────────────┐
│ aws                                                                  │
├─────────────────────┬────────────────────────────────────────────────┤
│ EC2::LaunchTemplate │ lt-ec2-micro                                   │
└─────────────────────┴────────────────────────────────────────────────┘
1 resource, 1 type, 1 provider
Command "gc l -t LaunchTemplate" executed in 8s, 173 MB
```
