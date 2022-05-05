---
id: EC2
title: Instance
---

Manages an EC2 instance resource, a.k.a virtual machine.

```js
exports.createResources = () => [
  {
    type: "Instance",
    group: "EC2",
    name: "web-server-ec2-vpc",
    properties: ({ config }) => ({
      InstanceType: "t2.micro",
      ImageId: "ami-02e136e904f3da870",
      UserData:
        "#!/bin/bash\necho \"Mounting /dev/xvdf\"\nwhile ! ls /dev/xvdf > /dev/null\ndo \n  sleep 1\ndone\nif [ `file -s /dev/xvdf | cut -d ' ' -f 2` = 'data' ]\nthen\n  echo \"Formatting /dev/xvdf\"\n  mkfs.xfs /dev/xvdf\nfi\nmkdir -p /data\nmount /dev/xvdf /data\necho /dev/xvdf /data defaults,nofail 0 2 >> /etc/fstab\n",
      Placement: {
        AvailabilityZone: `${config.region}a`,
      },
    }),
    dependencies: () => ({
      subnet: "subnet",
      keyPair: "kp-ec2-vpc",
      eip: "myip",
      securityGroups: ["security-group"],
      volumes: ["volume"],
    }),
  },
];
```

### Examples

- [one ec2](https://github.com/grucloud/grucloud/blob/main/examples/aws/EC2/ec2-simple/)
- [ec2 with elastic ip address, key pair](https://github.com/grucloud/grucloud/blob/main/examples/aws/EC2/ec2)
- [attached an EBS volume](https://github.com/grucloud/grucloud/blob/main/examples/aws/EC2/volume)
- [example with IAM](https://github.com/grucloud/grucloud/blob/main/examples/aws/IAM/iam)
- [full example](https://github.com/grucloud/grucloud/blob/main/examples/aws/EC2/ec2-vpc)

### Properties

- [RunInstancesCommandInput list](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-ec2/interfaces/runinstancescommandinput.html)

### Dependencies

- [SecurityGroup](./SecurityGroup.md)
- [Subnet](./Subnet.md)
- [KeyPair](./KeyPair.md)
- [Image](./Image.md)
- [IamInstanceProfile](../IAM/InstanceProfile.md)

### Used By

- [ElasticIpAddressAssociation](./ElasticIpAddressAssociation.md)
- [VolumeAttachment](./VolumeAttachment.md)

### Update

There are 2 kind of update depending on the attribute to modify:

- `Stop and Start`: The instance is stopped, the attribute is changed, the instance is started.
- `Destroy and Create`: The instance is destroyed and created with the new attributes.

| Attribute    |         Description         |      Update Kind |
| ------------ | :-------------------------: | ---------------: |
| ImageId      | The Amazon Managed Image Id | Destroy & Create |
| InstanceType |      The Instance Type      |     Stop & Start |

### List

Lsit all the ec2 instances with the _Instance_ type:

```sh
gc list -t Instance
```

```txt
Listing resources on 1 provider: aws
✓ aws
  ✓ Initialising
  ✓ Listing 2/2
┌─────────────────────────────────────────────────────────────────────────┐
│ 1 EC2::Instance from aws                                                │
├─────────────────────────────────────────────────────────────────────────┤
│ name: web-server-ec2-example                                            │
│ managedByUs: Yes                                                        │
│ live:                                                                   │
│   AmiLaunchIndex: 0                                                     │
│   ImageId: ami-02e136e904f3da870                                        │
│   InstanceId: i-079dbd606096303f2                                       │
│   InstanceType: t2.micro                                                │
│   KeyName: kp-ec2-example                                               │
│   LaunchTime: 2022-05-05T06:39:02.000Z                                  │
│   Monitoring:                                                           │
│     State: disabled                                                     │
│   Placement:                                                            │
│     AvailabilityZone: us-east-1d                                        │
│     GroupName:                                                          │
│     Tenancy: default                                                    │
│   PrivateDnsName: ip-172-31-92-153.ec2.internal                         │
│   PrivateIpAddress: 172.31.92.153                                       │
│   ProductCodes: []                                                      │
│   PublicDnsName: ec2-3-228-154-164.compute-1.amazonaws.com              │
│   PublicIpAddress: 3.228.154.164                                        │
│   State:                                                                │
│     Code: 16                                                            │
│     Name: running                                                       │
│   StateTransitionReason:                                                │
│   SubnetId: subnet-41e85860                                             │
│   VpcId: vpc-faff3987                                                   │
│   Architecture: x86_64                                                  │
│   BlockDeviceMappings:                                                  │
│     - DeviceName: /dev/xvda                                             │
│       Ebs:                                                              │
│         AttachTime: 2022-05-05T06:39:03.000Z                            │
│         DeleteOnTermination: true                                       │
│         Status: attached                                                │
│         VolumeId: vol-09c564b54699cc112                                 │
│   ClientToken: 671d8966-8721-42a3-9acd-ce8d067eb202                     │
│   EbsOptimized: false                                                   │
│   EnaSupport: true                                                      │
│   Hypervisor: xen                                                       │
│   NetworkInterfaces:                                                    │
│     - Association:                                                      │
│         IpOwnerId: 840541460064                                         │
│         PublicDnsName: ec2-3-228-154-164.compute-1.amazonaws.com        │
│         PublicIp: 3.228.154.164                                         │
│       Attachment:                                                       │
│         AttachTime: 2022-05-05T06:39:02.000Z                            │
│         AttachmentId: eni-attach-0d61a289d8142bc17                      │
│         DeleteOnTermination: true                                       │
│         DeviceIndex: 0                                                  │
│         Status: attached                                                │
│         NetworkCardIndex: 0                                             │
│       Description:                                                      │
│       Groups:                                                           │
│         - GroupName: default                                            │
│           GroupId: sg-4e82a670                                          │
│       Ipv6Addresses: []                                                 │
│       MacAddress: 12:26:63:a1:3e:81                                     │
│       NetworkInterfaceId: eni-092b69907be24f463                         │
│       OwnerId: 840541460064                                             │
│       PrivateDnsName: ip-172-31-92-153.ec2.internal                     │
│       PrivateIpAddress: 172.31.92.153                                   │
│       PrivateIpAddresses:                                               │
│         - Association:                                                  │
│             IpOwnerId: 840541460064                                     │
│             PublicDnsName: ec2-3-228-154-164.compute-1.amazonaws.com    │
│             PublicIp: 3.228.154.164                                     │
│           Primary: true                                                 │
│           PrivateDnsName: ip-172-31-92-153.ec2.internal                 │
│           PrivateIpAddress: 172.31.92.153                               │
│       SourceDestCheck: true                                             │
│       Status: in-use                                                    │
│       SubnetId: subnet-41e85860                                         │
│       VpcId: vpc-faff3987                                               │
│       InterfaceType: interface                                          │
│   RootDeviceName: /dev/xvda                                             │
│   RootDeviceType: ebs                                                   │
│   SecurityGroups:                                                       │
│     - GroupName: default                                                │
│       GroupId: sg-4e82a670                                              │
│   SourceDestCheck: true                                                 │
│   Tags:                                                                 │
│     - Key: gc-created-by-provider                                       │
│       Value: aws                                                        │
│     - Key: gc-managed-by                                                │
│       Value: grucloud                                                   │
│     - Key: gc-project-name                                              │
│       Value: @grucloud/example-aws-ec2                                  │
│     - Key: gc-stage                                                     │
│       Value: dev                                                        │
│     - Key: Name                                                         │
│       Value: web-server-ec2-example                                     │
│   VirtualizationType: hvm                                               │
│   CpuOptions:                                                           │
│     CoreCount: 1                                                        │
│     ThreadsPerCore: 1                                                   │
│   CapacityReservationSpecification:                                     │
│     CapacityReservationPreference: open                                 │
│   HibernationOptions:                                                   │
│     Configured: false                                                   │
│   MetadataOptions:                                                      │
│     State: applied                                                      │
│     HttpTokens: optional                                                │
│     HttpPutResponseHopLimit: 1                                          │
│     HttpEndpoint: enabled                                               │
│     HttpProtocolIpv6: disabled                                          │
│     InstanceMetadataTags: disabled                                      │
│   EnclaveOptions:                                                       │
│     Enabled: false                                                      │
│   PlatformDetails: Linux/UNIX                                           │
│   UsageOperation: RunInstances                                          │
│   UsageOperationUpdateTime: 2022-05-05T06:39:02.000Z                    │
│   PrivateDnsNameOptions:                                                │
│     HostnameType: ip-name                                               │
│     EnableResourceNameDnsARecord: false                                 │
│     EnableResourceNameDnsAAAARecord: false                              │
│   MaintenanceOptions:                                                   │
│     AutoRecovery: default                                               │
│   Image:                                                                │
│     Description: Amazon Linux 2 AMI 2.0.20211001.1 x86_64 HVM gp2       │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘


List Summary:
Provider: aws
┌────────────────────────────────────────────────────────────────────────┐
│ aws                                                                    │
├───────────────┬────────────────────────────────────────────────────────┤
│ EC2::Instance │ web-server-ec2-example                                 │
└───────────────┴────────────────────────────────────────────────────────┘
1 resource, 1 type, 1 provider
Command "gc list -t Instance" executed in 10s, 157 MB
```
