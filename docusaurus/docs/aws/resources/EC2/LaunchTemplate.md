---
id: LaunchTemplate
title: Launch Template
---

Manages an EC2 [Launch Template](https://console.aws.amazon.com/ec2/v2/home?region=eu-west-2#LaunchTemplates:)

## Example Code

```js
provider.EC2.makeLaunchTemplate({
  name: "lt-ecs",
  properties: ({ config }) => ({
    LaunchTemplateData: {
      BlockDeviceMappings: [
        {
          DeviceName: "/dev/xvda",
          Ebs: {
            DeleteOnTermination: true,
            VolumeSize: 20,
            VolumeType: "gp2",
          },
        },
      ],
      ImageId: "ami-0e6732e69988617b8",
      InstanceType: "t2.medium",
      MetadataOptions: {
        HttpPutResponseHopLimit: 2,
      },
    },
    Tags: [
      {
        Key: "eks:cluster-name",
        Value: "cluster",
      },
      {
        Key: "eks:nodegroup-name",
        Value: "node-group-private-cluster",
      },
    ],
  }),
  dependencies: ({ resources }) => ({
    keyPair: resources.EC2.KeyPair.kpEcs,
    iamInstanceProfile: resources.IAM.InstanceProfile.roleEcs,
    securityGroups: [resources.EC2.SecurityGroup.ecsSecurityGroup],
  }),
});
```

## Full Examples

## Properties

- [properties list](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#runInstances-property)

## Dependencies

- [Security Group](./SecurityGroup)
- [KeyPair](./KeyPair)
- [Image](./Image)
- [Instance Profile](../IAM/IamInstanceProfile)

## List

```sh
gc l -t LaunchTemplate
```

```txt
Listing resources on 1 provider: aws
✓ aws
  ✓ Initialising
  ✓ Listing 14/14
┌────────────────────────────────────────────────────────────────────────────────┐
│ 1 ec2::LaunchTemplate from aws                                                 │
├────────────────────────────────────────────────────────────────────────────────┤
│ name: lt-ec2-micro                                                             │
│ managedByUs: Yes                                                               │
│ live:                                                                          │
│   LaunchTemplateId: lt-0706115759aa5b522                                       │
│   LaunchTemplateName: lt-ec2-micro                                             │
│   VersionNumber: 1                                                             │
│   CreateTime: 2021-08-26T04:39:58.000Z                                         │
│   CreatedBy: arn:aws:iam::840541460064:root                                    │
│   DefaultVersion: true                                                         │
│   LaunchTemplateData:                                                          │
│     EbsOptimized: false                                                        │
│     IamInstanceProfile:                                                        │
│       Arn: arn:aws:iam::840541460064:instance-profile/role-ecs                 │
│     BlockDeviceMappings: []                                                    │
│     NetworkInterfaces:                                                         │
│       - AssociatePublicIpAddress: true                                         │
│         DeviceIndex: 0                                                         │
│         Groups:                                                                │
│           - "sg-04c8e2a5c5cdd7f92"                                             │
│         Ipv6Addresses: []                                                      │
│         PrivateIpAddresses: []                                                 │
│         Ipv4Prefixes: []                                                       │
│         Ipv6Prefixes: []                                                       │
│     ImageId: ami-0d26eb3972b7f8c96                                             │
│     InstanceType: t2.micro                                                     │
│     KeyName: kp-ecs                                                            │
│     ElasticGpuSpecifications: []                                               │
│     ElasticInferenceAccelerators: []                                           │
│     SecurityGroupIds: []                                                       │
│     SecurityGroups: []                                                         │
│     LicenseSpecifications: []                                                  │
│   DefaultVersionNumber: 1                                                      │
│   LatestVersionNumber: 1                                                       │
│   Tags:                                                                        │
│     - Key: gc-created-by-provider                                              │
│       Value: aws                                                               │
│     - Key: gc-managed-by                                                       │
│       Value: grucloud                                                          │
│     - Key: gc-project-name                                                     │
│       Value: example-grucloud-ec2-launch-template                              │
│     - Key: gc-stage                                                            │
│       Value: dev                                                               │
│     - Key: Name                                                                │
│       Value: lt-ec2-micro                                                      │
│                                                                                │
└────────────────────────────────────────────────────────────────────────────────┘


List Summary:
Provider: aws
┌───────────────────────────────────────────────────────────────────────────┐
│ aws                                                                       │
├────────────────────────────────┬──────────────────────────────────────────┤
│ ec2::LaunchTemplate            │ lt-ec2-micro                             │
└────────────────────────────────┴──────────────────────────────────────────┘
1 resource, 1 type, 1 provider
```
