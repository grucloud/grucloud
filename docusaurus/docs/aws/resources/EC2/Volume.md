---
id: Volume
title: Volume
---

Manages a [EBS Volume](https://console.aws.amazon.com/ec2/v2/home?#Volumes:)

This example will create a volume.

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

- [basic volume example](https://github.com/grucloud/grucloud/blob/main/examples/aws/EC2/volume)
- [instance in a VPC with volume](https://github.com/grucloud/grucloud/blob/main/examples/aws/EC2/Instance/ec2-vpc)

### Properties

- [CreateVolumeCommandInput](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-ec2/interfaces/createvolumecommandinput.html)

### Used By

- [EC2 VolumeAttachment](./VolumeAttachment.md)

### List

```sh
gc l -t EC2:Volume
```

```txt
Listing resources on 1 provider: aws
✓ aws us-east-1
  ✓ Initialising
  ✓ Listing 1/1
┌─────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ 2 EC2::Volume from aws                                                                                  │
├─────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ name: my-volume                                                                                         │
│ managedByUs: Yes                                                                                        │
│ live:                                                                                                   │
│   Attachments:                                                                                          │
│     - AttachTime: 2022-08-05T20:31:22.000Z                                                              │
│       Device: /dev/sdb                                                                                  │
│       InstanceId: i-0c4000df98f503ebe                                                                   │
│       State: attached                                                                                   │
│       VolumeId: vol-075acdf1dab1c78bc                                                                   │
│       DeleteOnTermination: false                                                                        │
│   AvailabilityZone: us-east-1a                                                                          │
│   CreateTime: 2022-08-05T20:30:28.099Z                                                                  │
│   Encrypted: false                                                                                      │
│   Size: 1                                                                                               │
│   SnapshotId:                                                                                           │
│   State: in-use                                                                                         │
│   VolumeId: vol-075acdf1dab1c78bc                                                                       │
│   Iops: 3000                                                                                            │
│   Tags:                                                                                                 │
│     - Key: gc-created-by-provider                                                                       │
│       Value: aws                                                                                        │
│     - Key: gc-managed-by                                                                                │
│       Value: grucloud                                                                                   │
│     - Key: gc-project-name                                                                              │
│       Value: @grucloud/example-aws-volume                                                               │
│     - Key: gc-stage                                                                                     │
│       Value: dev                                                                                        │
│     - Key: Name                                                                                         │
│       Value: my-volume                                                                                  │
│   VolumeType: gp3                                                                                       │
│   MultiAttachEnabled: false                                                                             │
│   Throughput: 125                                                                                       │
│                                                                                                         │
├─────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ name: vol-02a734bb6db125973                                                                             │
│ managedByUs: NO                                                                                         │
│ live:                                                                                                   │
│   Attachments:                                                                                          │
│     - AttachTime: 2022-08-05T20:30:30.000Z                                                              │
│       Device: /dev/xvda                                                                                 │
│       InstanceId: i-0c4000df98f503ebe                                                                   │
│       State: attached                                                                                   │
│       VolumeId: vol-02a734bb6db125973                                                                   │
│       DeleteOnTermination: true                                                                         │
│   AvailabilityZone: us-east-1a                                                                          │
│   CreateTime: 2022-08-05T20:30:30.919Z                                                                  │
│   Encrypted: false                                                                                      │
│   Size: 8                                                                                               │
│   SnapshotId: snap-08cbb15f1c8eb5387                                                                    │
│   State: in-use                                                                                         │
│   VolumeId: vol-02a734bb6db125973                                                                       │
│   Iops: 100                                                                                             │
│   VolumeType: gp2                                                                                       │
│   MultiAttachEnabled: false                                                                             │
│                                                                                                         │
└─────────────────────────────────────────────────────────────────────────────────────────────────────────┘


List Summary:
Provider: aws
┌────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ aws                                                                                                    │
├─────────────┬──────────────────────────────────────────────────────────────────────────────────────────┤
│ EC2::Volume │ my-volume                                                                                │
│             │ vol-02a734bb6db125973                                                                    │
└─────────────┴──────────────────────────────────────────────────────────────────────────────────────────┘
2 resources, 1 type, 1 provider
Command "gc l -t EC2::Volume" executed in 4s, 100 MB
```
