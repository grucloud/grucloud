---
id: InstanceProfile
title: Instance Profile
---

Provides an Iam Instance Profile.

The following example create an instance profile, a role attached to this instance profile, and create an ec2 instance under this profile:

```js
exports.createResources = () => [
  {
    type: "Instance",
    group: "EC2",
    name: "web-iam",
    properties: ({ config }) => ({
      InstanceType: "t2.micro",
      ImageId: "ami-02e136e904f3da870",
      Placement: {
        AvailabilityZone: `${config.region}d`,
      },
    }),
    dependencies: () => ({
      iamInstanceProfile: "my-profile",
    }),
  },
  {
    type: "Role",
    group: "IAM",
    name: "role-allow-assume-role",
    properties: ({}) => ({
      Path: "/",
      AssumeRolePolicyDocument: {
        Version: "2012-10-17",
        Statement: [
          {
            Sid: "",
            Effect: "Allow",
            Principal: {
              Service: "ec2.amazonaws.com",
            },
            Action: "sts:AssumeRole",
          },
        ],
      },
    }),
    dependencies: () => ({
      policies: ["AmazonEKSWorkerNodePolicy", "myPolicy-to-role"],
    }),
  },
  {
    type: "InstanceProfile",
    group: "IAM",
    name: "my-profile",
    dependencies: () => ({
      roles: ["role-allow-assume-role"],
    }),
  },
];
```

### Examples

- [simple example](https://github.com/grucloud/grucloud/blob/main/examples/aws/IAM/iam)
- [AutoScaling autoscaling](https://github.com/grucloud/grucloud/blob/main/examples/aws/AutoScaling/autoScalingGroup)
- [EC2 launchTemplate](https://github.com/grucloud/grucloud/blob/main/examples/aws/EC2/launchTemplate)
- [ECS ecs-simple](https://github.com/grucloud/grucloud/blob/main/examples/aws/ECS/ecs-simple)

### Properties

- [CreateInstanceProfileCommandInput](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-iam/interfaces/createinstanceprofilecommandinput.html)

### Dependencies

- [Iam Role](./Role.md)

### Used By

- [EC2 Instance](../EC2/Instance.md)
- [LaunchTemplate](../EC2/LaunchTemplate.md)

### List

```sh
gc l -t IAM::InstanceProfile
```

```txt
Listing resources on 1 provider: aws
✓ aws us-east-1
  ✓ Initialising
  ✓ Listing 1/1
┌───────────────────────────────────────────────────────────────────────────┐
│ 1 IAM::InstanceProfile from aws                                           │
├───────────────────────────────────────────────────────────────────────────┤
│ name: my-profile                                                          │
│ managedByUs: Yes                                                          │
│ live:                                                                     │
│   Path: /                                                                 │
│   InstanceProfileName: my-profile                                         │
│   InstanceProfileId: AIPA4HNBM2ZQAMVDBBTM6                                │
│   Arn: arn:aws:iam::840541460064:instance-profile/my-profile              │
│   CreateDate: 2022-08-05T21:59:31.000Z                                    │
│   Roles:                                                                  │
│     - Path: /                                                             │
│       RoleName: role-allow-assume-role                                    │
│       RoleId: AROA4HNBM2ZQH7AP3SMUU                                       │
│       Arn: arn:aws:iam::840541460064:role/role-allow-assume-role          │
│       CreateDate: 2022-08-05T21:59:29.000Z                                │
│       AssumeRolePolicyDocument: %7B%22Version%22%3A%222012-10-17%22%2C%2… │
│   Tags:                                                                   │
│     - Key: gc-created-by-provider                                         │
│       Value: aws                                                          │
│     - Key: gc-managed-by                                                  │
│       Value: grucloud                                                     │
│     - Key: gc-project-name                                                │
│       Value: @grucloud/example-aws-iam                                    │
│     - Key: gc-stage                                                       │
│       Value: dev                                                          │
│     - Key: Name                                                           │
│       Value: my-profile                                                   │
│                                                                           │
└───────────────────────────────────────────────────────────────────────────┘


List Summary:
Provider: aws
┌──────────────────────────────────────────────────────────────────────────┐
│ aws                                                                      │
├──────────────────────┬───────────────────────────────────────────────────┤
│ IAM::InstanceProfile │ my-profile                                        │
└──────────────────────┴───────────────────────────────────────────────────┘
1 resource, 1 type, 1 provider
Command "gc l -t IAM::InstanceProfile" executed in 4s, 100 MB
```

### AWS CLI

List all iam instances profile

```
aws iam list-instance-profiles

```

Delete an instance profile

```
aws iam delete-instance-profile --instance-profile-name ExampleInstanceProfile
```
