---
id: Listener
title: Listener
---

Manages a [GlobalAccelerator Listener](https://us-west-2.console.aws.amazon.com/globalaccelerator/home).

## Sample code

```js
exports.createResources = () => [
  {
    type: "Listener",
    group: "GlobalAccelerator",
    properties: ({}) => ({
      PortRanges: [
        {
          FromPort: 443,
          ToPort: 443,
        },
      ],
      Protocol: "TCP",
      AcceleratorName: "my-accelerator",
    }),
    dependencies: ({}) => ({
      accelerator: "my-accelerator",
    }),
  },
];
```

## Properties

- [CreateListenerCommandInput](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-global-accelerator/interfaces/createendpointgroupcommandinput.html)

## Dependencies

- [GlobalAccelerator Accelerator](./Accelerator.md)

## Used By

- [GlobalAccelerator EndpointGroup](./EndpointGroup.md)

## Full Examples

- [global-accelerator load balancer](https://github.com/grucloud/grucloud/tree/main/examples/aws/GlobalAccelerator/global-accelerator-loadbalancer)
- [global-accelerator ip address](https://github.com/grucloud/grucloud/tree/main/examples/aws/GlobalAccelerator/global-accelerator-ip-address)
- [global-accelerator ec2 instance](https://github.com/grucloud/grucloud/tree/main/examples/aws/GlobalAccelerator/global-accelerator-ec2-instance)

## List

```sh
gc l -t GlobalAccelerator::Listener
```

```txt
Listing resources on 1 provider: aws
✓ aws us-east-1
  ✓ Initialising
  ✓ Listing 2/2
┌─────────────────────────────────────────────────────────────────────────────────┐
│ 1 GlobalAccelerator::Listener from aws                                          │
├─────────────────────────────────────────────────────────────────────────────────┤
│ name: my-accelerator::TCP::443::443                                             │
│ managedByUs: Yes                                                                │
│ live:                                                                           │
│   ClientAffinity: NONE                                                          │
│   ListenerArn: arn:aws:globalaccelerator::840541460064:accelerator/b5bca006-80… │
│   PortRanges:                                                                   │
│     - FromPort: 443                                                             │
│       ToPort: 443                                                               │
│   Protocol: TCP                                                                 │
│   AcceleratorArn: arn:aws:globalaccelerator::840541460064:accelerator/b5bca006… │
│   AcceleratorName: my-accelerator                                               │
│                                                                                 │
└─────────────────────────────────────────────────────────────────────────────────┘


List Summary:
Provider: aws
┌────────────────────────────────────────────────────────────────────────────────┐
│ aws                                                                            │
├─────────────────────────────┬──────────────────────────────────────────────────┤
│ GlobalAccelerator::Listener │ my-accelerator::TCP::443::443                    │
└─────────────────────────────┴──────────────────────────────────────────────────┘
1 resource, 1 type, 1 provider
Command "gc l -t GlobalAccelerator::Listener" executed in 5s, 104 MB
```
