---
id: VolumeAttachment
title: Volume Attachment
---

Provides an [Volume Attachment](https://console.aws.amazon.com/ec2/v2/home?#Volumes:)

This resource associates a volume to an EC2 instance.

```js
exports.createResources = () => [
  {
    type: "VolumeAttachment",
    group: "EC2",
    properties: ({}) => ({
      Device: "/dev/sdf",
      DeleteOnTermination: false,
    }),
    dependencies: ({}) => ({
      volume: "volume",
      instance: "web-server-ec2-vpc",
    }),
  },
];
```

### Examples

- [instance with volume](https://github.com/grucloud/grucloud/blob/main/examples/aws/EC2/volume)
- [instance in a VPC with volume](https://github.com/grucloud/grucloud/blob/main/examples/aws/EC2/ec2-vpc)

### Depenencies

- [EC2 Instance](./Instance.md)
- [EC2 Volume](./Volume.md)

## Listing

List the volume attachments with the _EC2::VolumeAttachment_ filter:

```sh
gc l -t EC2::VolumeAttachment
```

```txt
Listing resources on 1 provider: aws
✓ aws
  ✓ Initialising
  ✓ Listing 3/3
┌─────────────────────────────────────────────────────────────────────────┐
│ 1 EC2::VolumeAttachment from aws                                        │
├─────────────────────────────────────────────────────────────────────────┤
│ name: vol-attachment::volume-test-volume::server-4-test-volume          │
│ managedByUs: Yes                                                        │
│ live:                                                                   │
│   AttachTime: 2022-05-05T08:44:21.000Z                                  │
│   Device: /dev/sdf                                                      │
│   InstanceId: i-0f8f83b20feef2353                                       │
│   State: attached                                                       │
│   VolumeId: vol-08817c514528ac65f                                       │
│   DeleteOnTermination: false                                            │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘


List Summary:
Provider: aws
┌────────────────────────────────────────────────────────────────────────┐
│ aws                                                                    │
├───────────────────────┬────────────────────────────────────────────────┤
│ EC2::VolumeAttachment │ vol-attachment::volume-test-volume::server-4-… │
└───────────────────────┴────────────────────────────────────────────────┘
1 resource, 1 type, 1 provider
Command "gc l -t EC2::VolumeAttachment" executed in 6s, 167 MB
```
