---
id: AwsGettingStarted
title: Getting Started
---

Let's create a simple infrastructure with one [EC2 instance](https://aws.amazon.com/ec2/) with the [GruCloud AWS provider](https://www.npmjs.com/package/@grucloud/provider-aws).

Ensure the AWS CLI is configured properly.
Visit the [Aws Requirements](./AwsRequirements.md) to retrieve these informations.

```sh
aws configure
```

## Getting the GruCloud Command Line Interface

GruCloud is a written in Javascript running on NodeJs. Check node is present on your system:

```
node --version
```

> The version must be greater than 14

Install the _GrucCloud_ command line utility **gc** with _npm_

```sh
npm i -g @grucloud/core
```

Check the current version of **gc**:

```sh
gc --version
```

## Create a new project

Create a new directory, for instance `ec2-example`:

```sh
mkdir ec2-example
cd ec2-example
```

Let's create a new `package.json` with the `npm init` command.

```
npm init
```

Let's install the AWS provider [@grucloud/provider-aws`](https://www.npmjs.com/package/@grucloud/provider-aws) npm package, as well as the GruCloud core library `@grucloud/core`

```sh
npm install @grucloud/core @grucloud/provider-aws
```

## Configuration

The configuration is a Javascript function located in _config.js_

```js
const pkg = require("./package.json");
module.exports = ({ stage }) => ({
  projectName: pkg.name,
  ec2Instance: {
    name: "web-server",
    properties: () => ({
      InstanceType: "t2.micro",
      ImageId: "ami-00f6a0c18edb19300", // Ubuntu 18.04
    }),
  },
});
```

## iac.js

Create a file called `iac.js` where `createStack` is exported.

```js
// iac.js
const { AwsProvider } = require("@grucloud/provider-aws");

exports.createStack = async ({}) => {
  const provider = AwsProvider({ config: require("./config") });
  const { config } = provider;
  const ec2Instance = await provider.makeEC2({
    name: config.ec2Instance.name,
    properties: config.ec2Instance.properties,
  });

  return {
    provider,
    resources: { ec2Instance },
  };
};
```

## Deploy

We are ready to deploy with `apply` command:

```bash
gc apply
```

```
Querying resources on 1 provider: aws
✓ aws
  ✓ Initialising
  ✓ Listing 6/6
  ✓ Querying
    ✓ EC2 1/1
┌──────────────────────────────────────────────────────────────────────────┐
│ 1 EC2 from aws                                                           │
├────────────┬──────────┬──────────────────────────────────────────────────┤
│ Name       │ Action   │ Data                                             │
├────────────┼──────────┼──────────────────────────────────────────────────┤
│ web-server │ CREATE   │ InstanceType: t2.micro                           │
│            │          │ ImageId: ami-00f6a0c18edb19300                   │
│            │          │ MaxCount: 1                                      │
│            │          │ MinCount: 1                                      │
│            │          │ TagSpecifications:                               │
│            │          │   - ResourceType: instance                       │
│            │          │     Tags:                                        │
│            │          │       - Key: Name                                │
│            │          │         Value: web-server                        │
│            │          │       - Key: ManagedBy                           │
│            │          │         Value: GruCloud                          │
│            │          │       - Key: CreatedByProvider                   │
│            │          │         Value: aws                               │
│            │          │       - Key: stage                               │
│            │          │         Value: dev                               │
│            │          │       - Key: projectName                         │
│            │          │         Value: ec2-simple                        │
│            │          │                                                  │
└────────────┴──────────┴──────────────────────────────────────────────────┘


┌─────────────────────────────────────────────────────────────────────────┐
│ Plan summary for provider aws                                           │
├─────────────────────────────────────────────────────────────────────────┤
│ DEPLOY RESOURCES                                                        │
├────────────────────┬────────────────────────────────────────────────────┤
│ EC2                │ web-server                                         │
└────────────────────┴────────────────────────────────────────────────────┘
? Are you sure to deploy 1 resource, 1 type on 1 provider? › (y/N)
```

At this point, you are given the opportunity to look at the what is going to be deployed.
Type `y` to accept:

```
Deploying resources on 1 provider: aws
✓ aws
  ✓ Initialising
  ✓ Deploying
    ✓ EC2 1/1
1 resource deployed of 1 type and 1 provider
Running OnDeployedGlobal resources on 1 provider: aws
Command "gc a" executed in 1m 29s
```

## List

To list the resource that has been deployed, use the `gc list` command:

```
gc list --our
```

```
Listing resources on 1 provider: aws
✓ aws
  ✓ Initialising
  ✓ Listing 6/6
┌──────────────────────────────────────────────────────────────────────────┐
│ 1 EC2 from aws                                                           │
├────────────┬──────────────────────────────────────────────────────┬──────┤
│ Name       │ Data                                                 │ Our  │
├────────────┼──────────────────────────────────────────────────────┼──────┤
│ web-server │ AmiLaunchIndex: 0                                    │ Yes  │
│            │ ImageId: ami-00f6a0c18edb19300                       │      │
│            │ InstanceId: i-094ea36963d8b649b                      │      │
│            │ InstanceType: t2.micro                               │      │
│            │ LaunchTime: 2021-04-15T02:36:09.000Z                 │      │
│            │ Monitoring:                                          │      │
│            │   State: disabled                                    │      │
│            │ Placement:                                           │      │
│            │   AvailabilityZone: eu-west-2a                       │      │
│            │   GroupName:                                         │      │
│            │   Tenancy: default                                   │      │
│            │ PrivateDnsName: ip-172-31-8-176.eu-west-2.compute.i… │      │
│            │ PrivateIpAddress: 172.31.8.176                       │      │
│            │ ProductCodes: []                                     │      │
│            │ PublicDnsName: ec2-35-178-63-237.eu-west-2.compute.… │      │
│            │ PublicIpAddress: 35.178.63.237                       │      │
│            │ State:                                               │      │
│            │   Code: 16                                           │      │
│            │   Name: running                                      │      │
│            │ StateTransitionReason:                               │      │
│            │ SubnetId: subnet-0f6f085fc384bf8ce                   │      │
│            │ VpcId: vpc-bbbafcd3                                  │      │
│            │ Architecture: x86_64                                 │      │
│            │ BlockDeviceMappings:                                 │      │
│            │   - DeviceName: /dev/sda1                            │      │
│            │     Ebs:                                             │      │
│            │       AttachTime: 2021-04-15T02:36:10.000Z           │      │
│            │       DeleteOnTermination: true                      │      │
│            │       Status: attached                               │      │
│            │       VolumeId: vol-0b16e59c9d0e50349                │      │
│            │ ClientToken: 7f9b32cf-ca3d-4657-b431-ad87204e857e    │      │
│            │ EbsOptimized: false                                  │      │
│            │ EnaSupport: true                                     │      │
│            │ Hypervisor: xen                                      │      │
│            │ ElasticGpuAssociations: []                           │      │
│            │ ElasticInferenceAcceleratorAssociations: []          │      │
│            │ NetworkInterfaces:                                   │      │
│            │   - Association:                                     │      │
│            │       IpOwnerId: amazon                              │      │
│            │       PublicDnsName: ec2-35-178-63-237.eu-west-2.co… │      │
│            │       PublicIp: 35.178.63.237                        │      │
│            │     Attachment:                                      │      │
│            │       AttachTime: 2021-04-15T02:36:09.000Z           │      │
│            │       AttachmentId: eni-attach-0da7cd7b764a97a37     │      │
│            │       DeleteOnTermination: true                      │      │
│            │       DeviceIndex: 0                                 │      │
│            │       Status: attached                               │      │
│            │     Description:                                     │      │
│            │     Groups:                                          │      │
│            │       - GroupName: default                           │      │
│            │         GroupId: sg-f4139a96                         │      │
│            │     Ipv6Addresses: []                                │      │
│            │     MacAddress: 06:5d:b6:ea:0b:b2                    │      │
│            │     NetworkInterfaceId: eni-05813eeec4cd3a498        │      │
│            │     OwnerId: 840541460064                            │      │
│            │     PrivateDnsName: ip-172-31-8-176.eu-west-2.compu… │      │
│            │     PrivateIpAddress: 172.31.8.176                   │      │
│            │     PrivateIpAddresses:                              │      │
│            │       - Association:                                 │      │
│            │           IpOwnerId: amazon                          │      │
│            │           PublicDnsName: ec2-35-178-63-237.eu-west-… │      │
│            │           PublicIp: 35.178.63.237                    │      │
│            │         Primary: true                                │      │
│            │         PrivateDnsName: ip-172-31-8-176.eu-west-2.c… │      │
│            │         PrivateIpAddress: 172.31.8.176               │      │
│            │     SourceDestCheck: true                            │      │
│            │     Status: in-use                                   │      │
│            │     SubnetId: subnet-0f6f085fc384bf8ce               │      │
│            │     VpcId: vpc-bbbafcd3                              │      │
│            │     InterfaceType: interface                         │      │
│            │ RootDeviceName: /dev/sda1                            │      │
│            │ RootDeviceType: ebs                                  │      │
│            │ SecurityGroups:                                      │      │
│            │   - GroupName: default                               │      │
│            │     GroupId: sg-f4139a96                             │      │
│            │ SourceDestCheck: true                                │      │
│            │ Tags:                                                │      │
│            │   - Key: Name                                        │      │
│            │     Value: web-server                                │      │
│            │   - Key: stage                                       │      │
│            │     Value: dev                                       │      │
│            │   - Key: projectName                                 │      │
│            │     Value: ec2-simple                                │      │
│            │   - Key: CreatedByProvider                           │      │
│            │     Value: aws                                       │      │
│            │   - Key: ManagedBy                                   │      │
│            │     Value: GruCloud                                  │      │
│            │ VirtualizationType: hvm                              │      │
│            │ CpuOptions:                                          │      │
│            │   CoreCount: 1                                       │      │
│            │   ThreadsPerCore: 1                                  │      │
│            │ CapacityReservationSpecification:                    │      │
│            │   CapacityReservationPreference: open                │      │
│            │ HibernationOptions:                                  │      │
│            │   Configured: false                                  │      │
│            │ Licenses: []                                         │      │
│            │ MetadataOptions:                                     │      │
│            │   State: applied                                     │      │
│            │   HttpTokens: optional                               │      │
│            │   HttpPutResponseHopLimit: 1                         │      │
│            │   HttpEndpoint: enabled                              │      │
│            │ EnclaveOptions:                                      │      │
│            │   Enabled: false                                     │      │
│            │                                                      │      │
└────────────┴──────────────────────────────────────────────────────┴──────┘


List Summary:
Provider: aws
┌─────────────────────────────────────────────────────────────────────────┐
│ aws                                                                     │
├────────────────────┬────────────────────────────────────────────────────┤
│ EC2                │ web-server                                         │
└────────────────────┴────────────────────────────────────────────────────┘
1 resource, 1 type, 1 provider
Command "gc list --our" executed in 6s

```

Note that tags has been added to the EC2 Instance, it gives GruCloud a way to identify the resources under its control. Unlike other instructure as code tool such as Terraform and Pulumi, GruCloud does not need a _state_ file. Hence removing a lot a complexity and issues.

## Destroy

Time to destroy the resources allocated and therefore saves a lot of £$€.

```bash
gc destroy
```

```
Find Deletable resources on 1 provider: aws
✓ aws
  ✓ Initialising
  ✓ Listing 6/6
? Are you sure to destroy 1 resource, 1 type on 1 provider? › (y/N)

```

Once again, you are given the opportunity to look at what is going to be destroyed.
Type 'y' to confirm the destruction:

```
Destroying resources on 1 provider: aws
✓ aws
  ✓ Initialising
  ✓ Destroying
    ✓ EC2 1/1
1 resource destroyed, 1 type on 1 provider
Running OnDestroyedGlobal resources on 1 provider: aws
Command "gc destroy" executed in 1m 29s
```

Let's run the `gc list` command with the `E2` filter to verify the EC2 is gone:

```
gc l -t EC2
```

```
Listing resources on 1 provider: aws
✓ aws
  ✓ Initialising
  ✓ Listing 6/6
List Summary:
Provider: aws
┌─────────────────────────────────────────────────────────────────────────┐
│ aws                                                                     │
└─────────────────────────────────────────────────────────────────────────┘
0 resources, 0 types, 1 provider
Command "gc list -t EC2" executed in 3s
```

This example demonstrates how to code a very basic infrastructure with one EC2 instance, and how can we use the `gc apply`, `gc list`, `gc destroy` and `gc graph` to manage the instrastructure.

It paves the way for more [AWS examples](https://www.grucloud.com/docs/aws/AwsExamples)
