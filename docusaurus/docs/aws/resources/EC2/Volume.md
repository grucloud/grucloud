---
id: Volume
title: EBS Volume
---

Manages a [EBS Volume](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ebs-volumes.html)

This will create a volume and attached it to the EC2 instance.

```js
const volume = await provider.makeVolume({
  name: "volume",
  properties: () => ({
    Size: 5,
    VolumeType: "standard",
    Device: "/dev/sdf",
  }),
});

const server = await provider.makeEC2({
  name: "server",
  properties: () => ({}),
  dependencies: { volumes: [volume] },
});
```

### Examples

- [basic example](https://github.com/grucloud/grucloud/blob/main/examples/aws/volume/iac.js)

### Properties

- [all properties](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#createVolume-property)

### Used By

- [EC2 Instance](./EC2)
