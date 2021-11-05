---
id: Volume
title: EBS Volume
---

Manages a [EBS Volume](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ebs-volumes.html)

This will create a volume and attached it to the EC2 instance.

```js
const Device = "/dev/sdf";
const deviceMounted = "/dev/xvdf";
const mountPoint = "/data";
const AvailabilityZone = "us-east-1a";

const volume = provider.EC2.makeVolume({
  name: "volume",
  properties: () => ({
    Size: 5,
    VolumeType: "standard",
    Device,
    AvailabilityZone,
  }),
});

const server = provider.EC2.makeInstance({
  name: "server",
  dependencies: () => ({ volumes: [volume] }),
  properties: () => ({
    UserData: volume.spec.setupEbsVolume({ deviceMounted, mountPoint }),
    Placement: { AvailabilityZone },
  }),
});
```

### Examples

- [basic example](https://github.com/grucloud/grucloud/blob/main/examples/aws/ec2/volume/iac.js)

### Properties

- [all properties](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#createVolume-property)

### Used By

- [EC2 Instance](./EC2)
