---
id: Volume
title: EBS Volume
---

Manages a [EBS Volume](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ebs-volumes.html)

This examples will create a volume.

```js
exports.createResources = () => [
  {
    type: "Volume",
    group: "EC2",
    name: "volume",
    properties: ({ config }) => ({
      Size: 5,
      VolumeType: "standard",
      AvailabilityZone: `${config.region}a`,
    }),
  },
];
```

### Examples

- [basic example](https://github.com/grucloud/grucloud/blob/main/examples/aws/EC2/volume/resources.js)

### Properties

- [CreateVolumeCommandInput](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-ec2/interfaces/createvolumecommandinput.html)

### Used By

- [EC2 Instance](./Instance.md)
