---
id: LaunchConfiguration
title: Launch Configuration
---

Manages an [Launch Configuration](https://console.aws.amazon.com/ec2/v2/home?#LaunchConfigurations).

## Example

```js
provider.AutoScaling.makeLaunchConfiguration({
  name: "EC2ContainerService-cluster-EcsInstanceLc",
  properties: ({ config }) => ({
    InstanceType: "t2.micro",
    ImageId: "ami-02e136e904f3da870",
    UserData:
      "IyEvYmluL2Jhc2gKZWNobyBFQ1NfQ0xVU1RFUj1jbHVzdGVyID4+IC9ldGMvZWNzL2Vjcy5jb25maWc7ZWNobyBFQ1NfQkFDS0VORF9IT1NUPSA+PiAvZXRjL2Vjcy9lY3MuY29uZmlnOw==",
    InstanceMonitoring: {
      Enabled: true,
    },
    BlockDeviceMappings: [
      {
        DeviceName: "/dev/xvda",
        Ebs: {
          VolumeSize: 30,
          VolumeType: "gp2",
        },
      },
    ],
    EbsOptimized: false,
  }),
  dependencies: ({ resources }) => ({
    instanceProfile: resources.IAM.InstanceProfile["ecsInstanceRole"],
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

```

## Dependencies

- [InstanceProfile](../IAM/IamInstanceProfile.md)
- [KeyPair](../EC2/KeyPair.md)
- [Image](../EC2/Image.md)
- [SecurityGroup](../EC2/SecurityGroup.md)

## Used By

- [AutoScaling Group](./AutoScalingGroup.md)

## Example

- [Simple ECS](https://github.com/grucloud/grucloud/tree/main/examples/aws/ecs/ecs-simple)
