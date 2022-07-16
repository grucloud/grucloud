---
id: NetworkInterface
title: Network Interface
---

Provides a [Network Interface](https://console.aws.amazon.com/ec2/v2/home?#NIC:).

## Example

```js
exports.createResources = () => [
   {
    type: "NetworkInterface",
    group: "EC2",
    name: "eni::machine",
    readOnly: true,
    properties: ({}) => ({
      Description: "",
    }),
    dependencies: ({}) => ({
      instance: "machine",
    }),
  },
];
```


## Examples

- [flow log on interface](https://github.com/grucloud/grucloud/blob/main/examples/aws/EC2/flow-logs/flow-logs-interface)

## Used By

- [Flow Logs](./FlowLogs.md)

## Listing

List all of the network interfaces with the _NetworkInterface_ filter:

```sh
gc l -t NetworkInterface
```
```txt
Listing resources on 1 provider: aws
✓ aws us-east-1 
  ✓ Initialising
  ✓ Listing 1/1
┌───────────────────────────────────────────────────────────────────────────────┐
│ 1 EC2::NetworkInterface from aws                                              │
├───────────────────────────────────────────────────────────────────────────────┤
│ name: eni-0a2e8a52d774d4d9a                                                   │
│ managedByUs: NO                                                               │
│ live:                                                                         │
│   Attachment:                                                                 │
│     AttachTime: 2022-07-13T13:44:07.000Z                                      │
│     AttachmentId: eni-attach-0bf82d13a487e7e3b                                │
│     DeleteOnTermination: true                                                 │
│     DeviceIndex: 0                                                            │
│     NetworkCardIndex: 0                                                       │
│     InstanceId: i-036f5b7618c50b69b                                           │
│     InstanceOwnerId: 840541460064                                             │
│     Status: attached                                                          │
│   AvailabilityZone: us-east-1a                                                │
│   Description:                                                                │
│   Groups:                                                                     │
│     - GroupName: default                                                      │
│       GroupId: sg-09c85eaa6c8ec06f0                                           │
│   InterfaceType: interface                                                    │
│   Ipv6Addresses: []                                                           │
│   MacAddress: 0a:9f:1a:fd:be:51                                               │
│   NetworkInterfaceId: eni-0a2e8a52d774d4d9a                                   │
│   OwnerId: 840541460064                                                       │
│   PrivateDnsName: ip-10-0-5-47.ec2.internal                                   │
│   PrivateIpAddress: 10.0.5.47                                                 │
│   PrivateIpAddresses:                                                         │
│     -                                                                         │
│       Primary: true                                                           │
│       PrivateDnsName: ip-10-0-5-47.ec2.internal                               │
│       PrivateIpAddress: 10.0.5.47                                             │
│   RequesterManaged: false                                                     │
│   SourceDestCheck: true                                                       │
│   Status: in-use                                                              │
│   SubnetId: subnet-0909dd70b217a9be2                                          │
│   TagSet: []                                                                  │
│   VpcId: vpc-0135cdb6be36937e8                                                │
│                                                                               │
└───────────────────────────────────────────────────────────────────────────────┘


List Summary:
Provider: aws
┌──────────────────────────────────────────────────────────────────────────────┐
│ aws                                                                          │
├───────────────────────┬──────────────────────────────────────────────────────┤
│ EC2::NetworkInterface │ eni-0a2e8a52d774d4d9a                                │
└───────────────────────┴──────────────────────────────────────────────────────┘
1 resource, 1 type, 1 provider
Command "gc l -t NetworkInterface" executed in 4s, 111 MB
```