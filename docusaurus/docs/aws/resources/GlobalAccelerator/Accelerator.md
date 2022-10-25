---
id: Accelerator
title: Accelerator
---

Manages a [GlobalAccelerator Accelerator](https://us-west-2.console.aws.amazon.com/globalaccelerator/home).

## Sample code

```js
exports.createResources = () => [
  {
    type: "Accelerator",
    group: "GlobalAccelerator",
    properties: ({}) => ({
      AcceleratorAttributes: {
        FlowLogsEnabled: false,
      },
      IpAddressType: "IPV4",
      Name: "my-accelerator",
    }),
  },
];
```

## Properties

- [CreateAcceleratorCommandInput](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-global-accelerator/interfaces/createacceleratorcommandinput.html)

## Dependencies

- [S3 Bucket](../S3/Bucket.md)

## Used By

- [GlobalAccelerator Listener](./Listener.md)

## Full Examples

- [global-accelerator load balancer](https://github.com/grucloud/grucloud/tree/main/examples/aws/GlobalAccelerator/global-accelerator-loadbalancer)
- [global-accelerator ip address](https://github.com/grucloud/grucloud/tree/main/examples/aws/GlobalAccelerator/global-accelerator-ip-address)
- [global-accelerator ec2 instance](https://github.com/grucloud/grucloud/tree/main/examples/aws/GlobalAccelerator/global-accelerator-ec2-instance)

## List

```sh
gc l -t GlobalAccelerator::Accelerator
```

```txt
Listing resources on 1 provider: aws
✓ aws us-east-1
  ✓ Initialising
  ✓ Listing 1/1
┌─────────────────────────────────────────────────────────────────────────────────┐
│ 1 GlobalAccelerator::Accelerator from aws                                       │
├─────────────────────────────────────────────────────────────────────────────────┤
│ name: my-accelerator                                                            │
│ managedByUs: Yes                                                                │
│ live:                                                                           │
│   AcceleratorAttributes:                                                        │
│     FlowLogsEnabled: false                                                      │
│   AcceleratorArn: arn:aws:globalaccelerator::840541460064:accelerator/b5bca006… │
│   CreatedTime: 2022-10-24T20:59:55.000Z                                         │
│   DnsName: a9fcda254ab159353.awsglobalaccelerator.com                           │
│   Enabled: true                                                                 │
│   IpAddressType: IPV4                                                           │
│   IpSets:                                                                       │
│     - IpAddresses:                                                              │
│         - "75.2.88.204"                                                         │
│         - "99.83.128.136"                                                       │
│       IpFamily: IPv4                                                            │
│   LastModifiedTime: 2022-10-24T21:00:51.000Z                                    │
│   Name: my-accelerator                                                          │
│   Status: DEPLOYED                                                              │
│   Tags:                                                                         │
│     - Key: gc-created-by-provider                                               │
│       Value: aws                                                                │
│     - Key: gc-managed-by                                                        │
│       Value: grucloud                                                           │
│     - Key: gc-project-name                                                      │
│       Value: global-accelerator-simple                                          │
│     - Key: gc-stage                                                             │
│       Value: dev                                                                │
│     - Key: Name                                                                 │
│       Value: my-accelerator                                                     │
│                                                                                 │
└─────────────────────────────────────────────────────────────────────────────────┘


List Summary:
Provider: aws
┌────────────────────────────────────────────────────────────────────────────────┐
│ aws                                                                            │
├────────────────────────────────┬───────────────────────────────────────────────┤
│ GlobalAccelerator::Accelerator │ my-accelerator                                │
└────────────────────────────────┴───────────────────────────────────────────────┘
1 resource, 1 type, 1 provider
Command "gc l -t GlobalAccelerator::Accelerator" executed in 5s, 102 MB
```
