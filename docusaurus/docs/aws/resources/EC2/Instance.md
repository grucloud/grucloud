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
- [EC2 based launch template](https://github.com/grucloud/grucloud/blob/main/examples/aws/EC2/launchTemplate)
- [EC2 based launch template](https://github.com/grucloud/grucloud/blob/main/examples/aws/EC2/launchTemplate-sg)

### Properties

- [RunInstancesCommandInput list](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-ec2/interfaces/runinstancescommandinput.html)

### Dependencies

- [Security Group](./SecurityGroup.md)
- [Subnet](./Subnet.md)
- [Key Pair](./KeyPair.md)
- [Image](./Image.md)
- [Launch Template](./LaunchTemplate.md)
- [Placement Group](./PlacementGroup.md)
- [Iam Instance Profile](../IAM/InstanceProfile.md)

### Used By

- [Elastic IpAddress Association](./ElasticIpAddressAssociation.md)
- [Volume Attachment](./VolumeAttachment.md)
- [CloudWatch Metric Alarm](../CloudWatch/MetricAlarm.md)

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
┌───────────────────────────────────────────────────────────────────────┐
│ 1 EC2::Instance from aws                                              │
├───────────────────────────────────────────────────────────────────────┤
│ name: web-server-ec2-vpc                                              │
│ managedByUs: Yes                                                      │
│ live:                                                                 │
│   AmiLaunchIndex: 0                                                   │
│   ImageId: ami-02e136e904f3da870                                      │
│   InstanceId: i-0f236430dd1c15b07                                     │
│   InstanceType: t2.micro                                              │
│   KeyName: kp-ec2-vpc                                                 │
│   LaunchTime: 2022-05-08T21:32:53.000Z                                │
│   Monitoring:                                                         │
│     State: disabled                                                   │
│   Placement:                                                          │
│     AvailabilityZone: us-east-1a                                      │
│     GroupName:                                                        │
│     Tenancy: default                                                  │
│   PrivateDnsName: ip-10-1-0-85.ec2.internal                           │
│   PrivateIpAddress: 10.1.0.85                                         │
│   ProductCodes: []                                                    │
│   PublicDnsName:                                                      │
│   PublicIpAddress: 54.86.208.126                                      │
│   State:                                                              │
│     Code: 16                                                          │
│     Name: running                                                     │
│   StateTransitionReason:                                              │
│   SubnetId: subnet-034c959cf24d3e1c3                                  │
│   VpcId: vpc-00ae007b28e4442da                                        │
│   Architecture: x86_64                                                │
│   BlockDeviceMappings:                                                │
│     - DeviceName: /dev/xvda                                           │
│       Ebs:                                                            │
│         AttachTime: 2022-05-08T21:32:54.000Z                          │
│         DeleteOnTermination: true                                     │
│         Status: attached                                              │
│         VolumeId: vol-08354bd10768baf85                               │
│     - DeviceName: /dev/sdf                                            │
│       Ebs:                                                            │
│         AttachTime: 2022-05-08T21:33:36.000Z                          │
│         DeleteOnTermination: false                                    │
│         Status: attached                                              │
│         VolumeId: vol-0ee2c386eb698a709                               │
│   ClientToken: b16ad466-702f-49ce-97a0-75ddd50c7356                   │
│   EbsOptimized: false                                                 │
│   EnaSupport: true                                                    │
│   Hypervisor: xen                                                     │
│   NetworkInterfaces:                                                  │
│     - Association:                                                    │
│         IpOwnerId: 840541460064                                       │
│         PublicDnsName:                                                │
│         PublicIp: 54.86.208.126                                       │
│       Attachment:                                                     │
│         AttachTime: 2022-05-08T21:32:53.000Z                          │
│         AttachmentId: eni-attach-0c325297c93dde25f                    │
│         DeleteOnTermination: true                                     │
│         DeviceIndex: 0                                                │
│         Status: attached                                              │
│         NetworkCardIndex: 0                                           │
│       Description:                                                    │
│       Groups:                                                         │
│         - GroupName: security-group                                   │
│           GroupId: sg-06ff67cc5474ec7c7                               │
│       Ipv6Addresses: []                                               │
│       MacAddress: 0a:a8:bd:fa:21:55                                   │
│       NetworkInterfaceId: eni-09f268c1e60b38336                       │
│       OwnerId: 840541460064                                           │
│       PrivateIpAddress: 10.1.0.85                                     │
│       PrivateIpAddresses:                                             │
│         - Association:                                                │
│             IpOwnerId: 840541460064                                   │
│             PublicDnsName:                                            │
│             PublicIp: 54.86.208.126                                   │
│           Primary: true                                               │
│           PrivateIpAddress: 10.1.0.85                                 │
│       SourceDestCheck: true                                           │
│       Status: in-use                                                  │
│       SubnetId: subnet-034c959cf24d3e1c3                              │
│       VpcId: vpc-00ae007b28e4442da                                    │
│       InterfaceType: interface                                        │
│   RootDeviceName: /dev/xvda                                           │
│   RootDeviceType: ebs                                                 │
│   SecurityGroups:                                                     │
│     - GroupName: security-group                                       │
│       GroupId: sg-06ff67cc5474ec7c7                                   │
│   SourceDestCheck: true                                               │
│   Tags:                                                               │
│     - Key: gc-created-by-provider                                     │
│       Value: aws                                                      │
│     - Key: gc-managed-by                                              │
│       Value: grucloud                                                 │
│     - Key: gc-project-name                                            │
│       Value: @grucloud/example-aws-ec2-vpc                            │
│     - Key: gc-stage                                                   │
│       Value: dev                                                      │
│     - Key: Name                                                       │
│       Value: web-server-ec2-vpc                                       │
│   VirtualizationType: hvm                                             │
│   CpuOptions:                                                         │
│     CoreCount: 1                                                      │
│     ThreadsPerCore: 1                                                 │
│   CapacityReservationSpecification:                                   │
│     CapacityReservationPreference: open                               │
│   HibernationOptions:                                                 │
│     Configured: false                                                 │
│   MetadataOptions:                                                    │
│     State: applied                                                    │
│     HttpTokens: optional                                              │
│     HttpPutResponseHopLimit: 1                                        │
│     HttpEndpoint: enabled                                             │
│     HttpProtocolIpv6: disabled                                        │
│     InstanceMetadataTags: disabled                                    │
│   EnclaveOptions:                                                     │
│     Enabled: false                                                    │
│   PlatformDetails: Linux/UNIX                                         │
│   UsageOperation: RunInstances                                        │
│   UsageOperationUpdateTime: 2022-05-08T21:32:53.000Z                  │
│   PrivateDnsNameOptions:                                              │
│     HostnameType: ip-name                                             │
│     EnableResourceNameDnsARecord: false                               │
│     EnableResourceNameDnsAAAARecord: false                            │
│   MaintenanceOptions:                                                 │
│     AutoRecovery: default                                             │
│   Image:                                                              │
│     Description: Amazon Linux 2 AMI 2.0.20211001.1 x86_64 HVM gp2     │
│   UserData: #!/bin/bash                                               │
│ echo "Mounting /dev/xvdf"                                             │
│ while ! ls /dev/xvdf > /dev/null                                      │
│ do                                                                    │
│   sleep 1                                                             │
│ done                                                                  │
│ if [ `file -s /dev/xvdf | cut -d ' ' -f 2` = 'data' ]                 │
│ then                                                                  │
│   echo "Formatting /dev/xvdf"                                         │
│   mkfs.xfs /dev/xvdf                                                  │
│ fi                                                                    │
│ mkdir -p /data                                                        │
│ mount /dev/xvdf /data                                                 │
│ echo /dev/xvdf /data defaults,nofail 0 2 >> /etc/fstab                │
│                                                                       │
│                                                                       │
└───────────────────────────────────────────────────────────────────────┘


List Summary:
Provider: aws
┌──────────────────────────────────────────────────────────────────────┐
│ aws                                                                  │
├───────────────┬──────────────────────────────────────────────────────┤
│ EC2::Instance │ web-server-ec2-vpc                                   │
└───────────────┴──────────────────────────────────────────────────────┘
1 resource, 1 type, 1 provider
Command "gc l -t Instance" executed in 5s, 182 MB
```
