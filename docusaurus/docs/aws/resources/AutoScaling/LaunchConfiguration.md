---
id: LaunchConfiguration
title: Launch Configuration
---

Manages an [Launch Configuration](https://console.aws.amazon.com/ec2/v2/home?region=eu-west-2#LaunchConfigurations).

## Example

```js
provider.autoscaling.makeLaunchConfiguration({
  name: "launchConfigurationEcs",
  properties: ({ config }) => ({
    InstanceType: "t2.micro",
    ImageId: "ami-02fee912d20d2f3cd",
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
    instanceProfile: resources.IAM.InstanceProfile.ecsInstanceRole,
    securityGroups: [resources.EC2.SecurityGroup.ecsSecurityGroup],
  }),
});
```

## List

The Launch Configuration can be filtered with the _LaunchConfiguration_ type:

```sh
gc list --types AutoScalingGroup
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
